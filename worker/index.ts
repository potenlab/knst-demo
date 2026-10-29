/**
 * Worker entry (wrangler.jsonc "main"). Wraps vinext's App Router handler with the public page cache —
 * see worker/page-cache.ts for the why and how.
 *
 *   default      gateway, Workers Cache OFF: admin/API/media/POST go straight to vinext; public pages
 *                are fetched through the CachedPages entrypoint (loopback) with a normalized cache key.
 *   CachedPages  Workers Cache ON (wrangler.jsonc "exports"): renders on a MISS, does not run on a HIT.
 *                Its `refresh` RPC method invalidates the cache (purge/invalidate are scoped to the
 *                entrypoint that calls them, so it has to run here).
 */
import { WorkerEntrypoint } from "cloudflare:workers";
import vinext from "vinext/server/app-router-entry";
import {
  PAGE_TAG,
  cachedPagesStub,
  classify,
  contentEtag,
  forBrowser,
  forCache,
  matchesEtag,
  notModified,
  renderRequest,
  rscMpaResponse,
  type RefreshResult,
} from "./page-cache";

type Env = Cloudflare.Env;
type VinextCtx = Parameters<typeof vinext.fetch>[2];

/**
 * "invalidate" keeps entries but marks them stale: the next request revalidates inline (304 without a
 * render if `posts` is unchanged; if the render dies, stale-if-error serves the old copy).
 * "purge" deletes them: the next visitor waits for a render with nothing to fall back on.
 */
const REFRESH_MODE: "invalidate" | "purge" = "invalidate";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * One retry when the render dies (a CPU-limit kill shows up as a thrown error or a 503; each loopback
 * call is its own invocation). Other 5xx (a real render bug) are not retried.
 */
async function viaCache(pages: NonNullable<ReturnType<typeof cachedPagesStub>>, request: Request, key: string) {
  const forwarded = renderRequest(request, key);
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await pages.fetch(forwarded, { cf: { cacheKey: key } });
      if (res.status !== 503 || attempt === 2) return forBrowser(request, res, attempt);
      lastError = "HTTP 503";
      await res.body?.cancel();
    } catch (e) {
      lastError = e;
    }
  }
  console.error("[page-cache] render failed", key, lastError instanceof Error ? lastError.message : String(lastError));
  return new Response("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", {
    status: 503,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "retry-after": "5" },
  });
}

/** Re-request changed URLs so their (stale or purged) entries are re-rendered before visitors ask. */
async function warm(exportsLike: unknown, paths: string[], origin: string) {
  const self = cachedPagesStub(exportsLike);
  if (!self) return;
  await sleep(2000); // let the invalidation propagate first
  for (const path of paths) {
    const request = new Request(new URL(path, origin));
    const route = classify(request);
    if (route.kind !== "cache") continue;
    try {
      const res = await self.fetch(renderRequest(request, route.key), { cf: { cacheKey: route.key } });
      await res.arrayBuffer();
    } catch {
      // best effort: the next visitor triggers the refresh instead
    }
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const route = classify(request);
    if (route.kind === "rsc-mpa") return rscMpaResponse();
    if (route.kind === "cache") {
      const pages = cachedPagesStub(ctx.exports);
      if (pages) return viaCache(pages, request, route.key);
    }
    return vinext.fetch(request, env, ctx as unknown as VinextCtx);
  },
} satisfies ExportedHandler<Env>;

export class CachedPages extends WorkerEntrypoint<Env> {
  async fetch(request: Request): Promise<Response> {
    const etag = await contentEtag(this.env as unknown as Parameters<typeof contentEtag>[0]);
    if (etag && matchesEtag(request, etag)) return notModified(etag); // nothing changed: no render
    return forCache(await vinext.fetch(request, this.env, this.ctx as unknown as VinextCtx), etag);
  }

  /** RPC (bypasses the cache). Called by refreshPublicPages() after content changes. */
  async refresh(paths: string[], origin: string): Promise<RefreshResult> {
    const cache = this.ctx.cache;
    if (!cache) return { ok: false, mode: "no-cache-context" };
    const run = () =>
      (REFRESH_MODE === "purge" ? cache.purge({ tags: [PAGE_TAG] }) : cache.invalidate({ tags: [PAGE_TAG] })).catch((e: unknown) => ({
        success: false,
        errors: [e instanceof Error ? e.message : String(e)],
      }));
    const first = await run();
    if (first.success) {
      this.ctx.waitUntil(warm(this.ctx.exports, paths, origin));
      return { ok: true, mode: REFRESH_MODE };
    }
    // Workers Cache uses the Free-tier purge rate limits: retry in the background before giving up.
    this.ctx.waitUntil(
      (async () => {
        for (const wait of [5_000, 10_000]) { // waitUntil work is cut off 30 s after the response
          await sleep(wait);
          if ((await run()).success) return warm(this.ctx.exports, paths, origin);
        }
        console.error("[page-cache] invalidation failed after retries");
      })(),
    );
    return { ok: false, mode: REFRESH_MODE, errors: first.errors };
  }
}
