import { env } from "cloudflare:workers";
import type { PostCategory } from "@/lib/post-categories";
import { sanitizePostHtml } from "@/lib/sanitize";

/**
 * Trina auto-publish → this site's blog.
 *
 * Trina (trina.app) writes blog drafts for the brand and, once a draft is due, POSTs it here:
 *
 *   POST /api/blog/ingest
 *   Authorization: Bearer <TRINA_INGEST_SECRET>
 *   { title, content (HTML), slug, status: "published", excerpt, cover_image_url, tags }
 *
 * and expects `{ ok: true, post: { slug } }` back with the SAME slug — Trina records
 * `<site>/blog/<slug>` as the live URL and measures it in Search Console, so the slug is
 * never changed here. Re-sending the same slug updates that post (upsert), which is what
 * makes Trina's retries safe.
 *
 * Posts created here are tagged origin='trina'. A slug already used by a post written in
 * the admin is refused (409) instead of overwritten.
 */

export const TRINA_CATEGORY: PostCategory = "column";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX = { slug: 120, title: 200, excerpt: 500, html: 400_000, url: 2048 } as const;

export type IngestInput = {
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  coverImage: string | null;
};

export type ParseResult = { ok: true; input: IngestInput } | { ok: false; error: string };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validate Trina's payload. Everything that gets stored is checked or sanitized here. */
export function parseIngestBody(body: unknown): ParseResult {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid_json" };
  const b = body as Record<string, unknown>;

  const status = str(b.status) || "published";
  if (status !== "published") return { ok: false, error: "unsupported_status" };

  const slug = str(b.slug);
  if (!slug || slug.length > MAX.slug || !SLUG_RE.test(slug)) return { ok: false, error: "invalid_slug" };

  const title = str(b.title);
  if (!title || title.length > MAX.title) return { ok: false, error: "invalid_title" };

  const rawHtml = typeof b.content === "string" ? b.content : "";
  if (!rawHtml.trim() || rawHtml.length > MAX.html) return { ok: false, error: "invalid_content" };
  const html = sanitizePostHtml(rawHtml).trim();
  if (!html) return { ok: false, error: "invalid_content" };

  const excerpt = str(b.excerpt).slice(0, MAX.excerpt);

  const cover = str(b.cover_image_url);
  const coverImage = cover && cover.length <= MAX.url && /^https:\/\/[^\s"'<>]+$/i.test(cover) ? cover : null;

  return { ok: true, input: { slug, title, html, excerpt, coverImage } };
}

/** Is `Authorization: Bearer <token>` the configured secret? Compares SHA-256 digests in constant time. */
export async function isTrinaRequest(request: Request): Promise<boolean> {
  const secret = (env as unknown as { TRINA_INGEST_SECRET?: string }).TRINA_INGEST_SECRET?.trim();
  if (!secret) return false;
  const [scheme, token] = (request.headers.get("authorization") ?? "").trim().split(/\s+/);
  if (scheme?.toLowerCase() !== "bearer" || !token) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(token)),
    crypto.subtle.digest("SHA-256", enc.encode(secret)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export type UpsertResult = { ok: true; created: boolean } | { ok: false; reason: "slug_taken" };

/**
 * Insert, or update the post Trina created earlier under this slug — one atomic statement, so two
 * identical pushes at once cannot collide on the UNIQUE slug.
 *
 * On a re-push (Trina retries, and refreshes a live post by re-sending its slug):
 *   - text is replaced — Trina owns the wording of the posts it wrote;
 *   - the admin's choices are kept: a post set back to draft stays draft, and a push without a
 *     cover keeps the cover that is there;
 *   - a row the admin wrote (origin NULL) is never touched → `slug_taken`.
 */
export async function upsertTrinaPost(input: IngestInput): Promise<UpsertResult> {
  const db = env.DB;
  const now = new Date().toISOString();
  // Informational only (the `created` flag in the response); the upsert below decides.
  const before = await db.prepare("SELECT 1 AS hit FROM posts WHERE slug=?1").bind(input.slug).first<{ hit: number }>();

  const res = await db
    .prepare(
      `INSERT INTO posts (slug,title,excerpt,content_md,content_html,cover_image,category,status,source_url,published_at,created_at,updated_at,origin)
       VALUES (?1,?2,?3,'',?4,?5,?6,'published',NULL,?7,?7,?7,'trina')
       ON CONFLICT(slug) DO UPDATE SET
         title=excluded.title,
         excerpt=excluded.excerpt,
         content_html=excluded.content_html,
         cover_image=COALESCE(excluded.cover_image, posts.cover_image),
         published_at=CASE WHEN posts.status='published' THEN COALESCE(posts.published_at, excluded.published_at) ELSE posts.published_at END,
         updated_at=excluded.updated_at
       WHERE posts.origin='trina'`,
    )
    .bind(input.slug, input.title, input.excerpt, input.html, input.coverImage, TRINA_CATEGORY, now)
    .run();

  if ((res.meta.changes ?? 0) === 0) return { ok: false, reason: "slug_taken" };
  return { ok: true, created: !before };
}
