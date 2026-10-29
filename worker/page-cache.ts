/**
 * Public page cache — keeps rendering off the request path so the Workers Free plan's 10 ms CPU limit
 * (error 1102, "Worker exceeded resource limits") is not hit on normal page views.
 *
 * Mechanism: Cloudflare Workers Cache (https://developers.cloudflare.com/workers/cache/).
 * - worker/index.ts's default entrypoint (cache disabled) is a thin gateway. Public GET/HEAD requests go
 *   through a loopback (`ctx.exports.CachedPages.fetch`) to the `CachedPages` entrypoint, which has
 *   `cache.enabled` in wrangler.jsonc. On a HIT `CachedPages` does not run at all (no CPU); on a MISS it
 *   renders with vinext and the response is stored in Cloudflare's tiered cache (global, no KV quotas).
 * - Cache key = path + the query params pages read (page, category, uid). Tracking params (utm_*, fbclid…)
 *   are dropped. Entries are per Worker version, so each deploy starts empty → run scripts/warm-cache.mjs.
 * - Freshness: admin saves / publish / unpublish / delete and Trina ingest call refreshPublicPages(), which
 *   invalidates every cached page (tag "pages") and re-requests the changed URLs in the background.
 *   Entries also go stale after 1 h; the background revalidation answers 304 (no render) while the posts
 *   table is unchanged (ETag below), so a manual D1 edit shows up within ~1 h without any purge.
 * - Client-side RSC navigations/prefetches to public pages get a 204, which makes the vinext router do a
 *   normal page load (served from this cache) instead of rendering an RSC payload per click/prefetch.
 */
import { exports as workerExports } from "cloudflare:workers";
import { headers } from "next/headers";

export const PAGE_TAG = "pages";

/**
 * Query params that change what a public page renders, with the values worth caching. Everything else
 * (utm_*, fbclid, mod=document…) is left out of the key. A param with an unexpected value sends the
 * request straight to vinext (uncached), so random values can't fill the cache with forced renders.
 */
const KEY_PARAMS: { name: string; path: RegExp; value: RegExp }[] = [
  { name: "page", path: /^\/(?:blog|notices|news)\/$/, value: /^[1-9]\d{0,3}$/ },
  // keys and the Korean labels old links used (lib/post-categories.ts toCategory)
  { name: "category", path: /^\/blog\/$/, value: /^(?:column|guide|notice|news|칼럼|가이드|공지|공지사항|뉴스|언론동향|언론보도)$/ },
  // old board links: /nst-notice/?mod=document&uid=N → /notices/?mod=document&uid=N → /notices/<slug>/
  { name: "uid", path: /^\/(?:notices|nst-notice)\/$/, value: /^\d{1,10}$/ },
];

/** Requests are rendered with these headers only: cookies or a bot's User-Agent must not shape a shared entry. */
const RENDER_HEADERS = { accept: "text/html,application/xhtml+xml,*/*;q=0.8", "user-agent": "Mozilla/5.0 (compatible; knst-page-cache/1.0)" };

/** Stored responses: fresh 1 h, then served stale while one background render refreshes them. */
const CACHE_LONG = "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400";
/** Short-lived: not-found pages and temporary redirects (cheap to keep, protects against bot scans). */
const CACHE_SHORT = "public, max-age=300, stale-if-error=3600";
/** What browsers get for HTML/XML from the cache: always revalidate with the edge (fast, cached). */
const BROWSER_CACHE = "public, max-age=0, must-revalidate";

export type Route = { kind: "cache"; key: string } | { kind: "rsc-mpa" } | { kind: "direct" };

const DIRECT: Route = { kind: "direct" };
const RSC_MPA: Route = { kind: "rsc-mpa" };

/** Which way a request goes: through the page cache, straight to vinext, or an RSC request answered with 204. */
export function classify(request: Request): Route {
  if (request.method !== "GET" && request.method !== "HEAD") return DIRECT;
  const url = new URL(request.url);
  const path = url.pathname;
  // admin, API, uploaded media, framework internals: always dynamic
  if (/^\/(?:admin|api|media|cdn-cgi)(?:\/|$)/.test(path) || path.startsWith("/_") || path.startsWith("//")) return DIRECT;
  if (request.headers.get("rsc") === "1" || path.endsWith(".rsc")) return RSC_MPA;
  if (request.headers.has("next-action") || request.headers.has("authorization")) return DIRECT;
  if (url.searchParams.has("_rsc")) return DIRECT;

  const keep: string[] = [];
  for (const { name, path: on, value } of KEY_PARAMS) {
    const values = url.searchParams.getAll(name);
    if (values.length === 0) continue;
    if (!on.test(path)) continue; // the page ignores it
    if (values.length > 1 || !value.test(values[0])) return DIRECT;
    keep.push(`${name}=${encodeURIComponent(values[0])}`);
  }
  return { kind: "cache", key: keep.length ? `${path}?${keep.join("&")}` : path };
}

/**
 * The request CachedPages renders for a cache key: exactly the key's path and query (so a stored
 * redirect never carries another visitor's query string), GET (a HEAD is answered from the GET entry),
 * fixed headers (no cookies, conditionals or User-Agent), `www.` folded into the apex host.
 */
export function renderRequest(request: Request, key: string): Request {
  const url = new URL(key, request.url);
  url.hostname = url.hostname.replace(/^www\./, "");
  return new Request(url, { method: "GET", headers: RENDER_HEADERS, redirect: "manual" });
}

/**
 * Answer for an RSC request to a public page. vinext's router treats a non-RSC response as
 * "invalid payload" and falls back to a full page load (prefetches are silently dropped).
 */
export function rscMpaResponse(): Response {
  return new Response(null, { status: 204, headers: { "cache-control": "no-store", "x-page-cache": "RSC-MPA" } });
}

/** Inside CachedPages: decide what the Workers Cache may store. `etag` goes on stored 200s. */
export function forCache(res: Response, etag: string | null = null): Response {
  const status = res.status;
  const type = res.headers.get("content-type") ?? "";
  let cacheControl = "no-store";
  if (!res.headers.has("set-cookie") && !type.startsWith("text/x-component")) {
    if (status === 200 || status === 301 || status === 308) cacheControl = CACHE_LONG;
    else if (status === 302 || status === 303 || status === 307 || status === 404 || status === 410) cacheControl = CACHE_SHORT;
  }
  const out = new Response(res.body, res);
  out.headers.set("cache-control", cacheControl);
  out.headers.set("x-page-rendered", new Date().toISOString()); // stored with the entry: shows its age
  // vinext varies on RSC router headers; RSC requests never reach this entrypoint, so one entry per key
  out.headers.delete("vary");
  if (cacheControl !== "no-store") out.headers.set("cache-tag", PAGE_TAG);
  if (etag && status === 200 && cacheControl === CACHE_LONG) out.headers.set("etag", etag);
  else out.headers.delete("etag");
  return out;
}

/*
 * Revalidation without re-rendering. When an entry goes stale (after 1 h, or after refreshPublicPages()
 * invalidates it) the cache asks CachedPages again with If-None-Match. The ETag is
 * <Worker version>-<fingerprint of the posts table>, so if nothing in `posts` changed the answer is a
 * cheap 304 (one D1 query) instead of a full render.
 */

const FINGERPRINT_SQL =
  "SELECT COUNT(*) AS n, IFNULL(MAX(id), 0) AS i, IFNULL(MAX(updated_at), '') AS u, " +
  "IFNULL(SUM(LENGTH(slug) + LENGTH(title) + LENGTH(status) + LENGTH(IFNULL(category, '')) + LENGTH(IFNULL(excerpt, '')) + " +
  "LENGTH(IFNULL(cover_image, '')) + LENGTH(IFNULL(content_html, '')) + LENGTH(IFNULL(content_md, '')) + LENGTH(IFNULL(published_at, ''))), 0) AS l " +
  "FROM posts";

function fnv1a(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

type EtagEnv = { DB?: D1Database; CF_VERSION_METADATA?: { id?: string } };

/** Current ETag for every public page, or null when it can't be computed (then no 304s are given). */
export async function contentEtag(env: EtagEnv): Promise<string | null> {
  const version = env.CF_VERSION_METADATA?.id;
  if (!env.DB || !version) return null;
  try {
    const row = await env.DB.prepare(FINGERPRINT_SQL).first<Record<string, string | number>>();
    if (!row) return null;
    return `W/"${version.slice(0, 8)}-${fnv1a(`${row.n}|${row.i}|${row.u}|${row.l}`)}"`;
  } catch {
    return null;
  }
}

const bareTag = (t: string) => t.trim().replace(/^W\//, "");

export function matchesEtag(request: Request, etag: string) {
  const header = request.headers.get("if-none-match");
  return !!header && header.split(",").some((t) => bareTag(t) === bareTag(etag));
}

/** 304 for the cache's conditional revalidation; refreshes the stored entry's freshness headers. */
export function notModified(etag: string): Response {
  return new Response(null, {
    status: 304,
    headers: { etag, "cache-control": CACHE_LONG, "cache-tag": PAGE_TAG, "x-page-validated": new Date().toISOString() },
  });
}

/**
 * In the gateway: what the browser gets for a response that came through the cache. Browser
 * conditionals (If-None-Match) are answered here, never forwarded into the shared render.
 */
export function forBrowser(request: Request, res: Response, attempts = 1): Response {
  const cacheStatus = res.headers.get("cf-cache-status") ?? "NONE";
  const etag = res.headers.get("etag");
  if (res.status === 200 && etag && matchesEtag(request, etag)) {
    res.body?.cancel().catch(() => {});
    return new Response(null, { status: 304, headers: { etag, "cache-control": BROWSER_CACHE, "x-page-cache": cacheStatus } });
  }
  const head = request.method === "HEAD";
  if (head) res.body?.cancel().catch(() => {});
  const out = new Response(head ? null : res.body, res);
  out.headers.set("x-page-cache", cacheStatus);
  if (attempts > 1) out.headers.set("x-page-cache-attempts", String(attempts));
  out.headers.delete("cache-tag");
  out.headers.set("cache-control", res.status >= 500 ? "no-store" : BROWSER_CACHE);
  return out;
}

type CachedPagesStub = {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
  refresh(paths: string[], origin: string): Promise<RefreshResult>;
};

export type RefreshResult = { ok: boolean; mode?: string; errors?: unknown };

export function cachedPagesStub(exportsLike: unknown): CachedPagesStub | null {
  const stub = (exportsLike as { CachedPages?: CachedPagesStub } | undefined)?.CachedPages;
  return stub && typeof stub.fetch === "function" ? stub : null;
}

/** Lists, feeds and the home page show post titles, so they are re-warmed after every change. */
const SHARED_PATHS = ["/", "/blog/", "/notices/", "/news/", "/sitemap.xml", "/blog/rss.xml"];

/**
 * Call after any change to published content (admin actions, Trina ingest). Invalidates every cached
 * public page and re-requests `postPaths` plus the shared lists in the background. Never throws.
 */
export async function refreshPublicPages(postPaths: string[] = []): Promise<void> {
  try {
    const pages = cachedPagesStub(workerExports);
    if (!pages) return; // dev server / cache not configured
    let origin = "https://knst.co.kr";
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") ?? h.get("host");
      if (host) origin = `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
    } catch {
      // outside a request scope: keep the default origin (the cache key ignores the host)
    }
    const result = await pages.refresh([...new Set([...SHARED_PATHS, ...postPaths])], origin);
    if (!result.ok) console.error("[page-cache] refresh failed", JSON.stringify(result));
  } catch (e) {
    console.error("[page-cache] refresh error", e instanceof Error ? e.message : String(e));
  }
}
