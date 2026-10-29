import { isTrinaRequest, parseIngestBody, upsertTrinaPost } from "@/lib/trina-ingest";
import { refreshPublicPages } from "@/worker/page-cache";

/**
 * Trina auto-publish receiver — see lib/trina-ingest.ts for the contract.
 *
 *   POST  Authorization: Bearer <TRINA_INGEST_SECRET>
 *         { title, content, slug, status, excerpt, cover_image_url, tags }
 *     200 { ok:true, post:{ slug, url }, created }
 *     400 { ok:false, error }   invalid_json | unsupported_status | invalid_slug | invalid_title | invalid_content | body_too_large
 *     401 { ok:false, error:"unauthorized" }
 *     409 { ok:false, error:"slug_taken" }   the slug belongs to a post written in the admin
 *     503 { ok:false, error:"storage_unavailable" }   database error — Trina retries on its next run
 */
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1_000_000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });

export async function POST(request: Request) {
  if (!(await isTrinaRequest(request))) return json({ ok: false, error: "unauthorized" }, 401);

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json({ ok: false, error: "body_too_large" }, 400);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ ok: false, error: "body_too_large" }, 400);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = parseIngestBody(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);

  let result: Awaited<ReturnType<typeof upsertTrinaPost>>;
  try {
    result = await upsertTrinaPost(parsed.input);
  } catch (err) {
    // A database hiccup: tell Trina to retry (it keeps the draft queued) with JSON, not an HTML 500.
    console.error("[ingest] upsert failed", parsed.input.slug, err);
    return json({ ok: false, error: "storage_unavailable" }, 503);
  }
  if (!result.ok) return json({ ok: false, error: result.reason }, 409);

  // trailingSlash is on: the canonical post address ends with "/".
  const path = `/blog/${parsed.input.slug}/`;
  await refreshPublicPages([path]); // public page cache (worker/page-cache.ts)
  return json({ ok: true, created: result.created, post: { slug: parsed.input.slug, url: new URL(path, request.url).toString() } });
}

export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
