import { env } from "cloudflare:workers";
import { DEFAULT_CATEGORY, toCategory, type PostCategory } from "@/lib/post-categories";

export type { PostCategory };
export type PostStatus = "draft" | "published";

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  content_html: string;
  cover_image: string | null;
  /** 'column' | 'guide' | 'notice' | 'news' (CHECK constraint since 0006). */
  category: PostCategory;
  status: PostStatus;
  source_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PostInput = {
  slug: string;
  title: string;
  excerpt?: string;
  content_md?: string;
  content_html?: string;
  cover_image?: string | null;
  category?: PostCategory;
  status?: PostStatus;
  source_url?: string | null;
};

const db = () => env.DB;
const now = () => new Date().toISOString();

const LIST_COLS = "id, slug, title, excerpt, cover_image, category, status, source_url, published_at, created_at, updated_at";

/**
 * Card fallbacks, cut in SQL so list queries never ship whole bodies:
 * - lead_img:  the first `<img …>` tag of content_html (≤700 chars) — card cover when cover_image is empty
 * - lead_html: the opening of the body (HTML, or legacy markdown) — card excerpt when excerpt is empty
 */
const CARD_LEAD_COLS = `
  CASE WHEN instr(content_html,'<img') > 0 THEN substr(content_html, instr(content_html,'<img'), 700) END AS lead_img,
  CASE WHEN excerpt = '' THEN substr(CASE WHEN content_html <> '' THEN content_html ELSE content_md END, 1, 1500) ELSE '' END AS lead_html,
  CASE WHEN content_html <> '' THEN 'html' ELSE 'md' END AS lead_format`;

export type CardLead = { lead_img: string | null; lead_html: string; lead_format: "html" | "md" };
export type PublishedListRow = Omit<Post, "content_md" | "content_html"> & CardLead;

/** `AND category IN (…)` for one category or a set (empty/undefined = every category). */
function categoryFilter(category?: PostCategory | readonly PostCategory[]) {
  const list = category == null ? [] : typeof category === "string" ? [category] : [...category];
  return list.length ? { sql: ` AND category IN (${list.map(() => "?").join(",")})`, binds: list } : { sql: "", binds: [] as string[] };
}

/** Public: published posts, newest first. Bodies are not included — only the CardLead snippets. */
export async function listPublished(opts: { limit?: number; offset?: number; category?: PostCategory | readonly PostCategory[] } = {}) {
  const { limit = 12, offset = 0, category } = opts;
  const f = categoryFilter(category);
  const { results } = await db()
    .prepare(
      `SELECT ${LIST_COLS}, ${CARD_LEAD_COLS} FROM posts WHERE status='published'${f.sql} ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?`,
    )
    .bind(...f.binds, limit, offset)
    .all<PublishedListRow>();
  return results;
}

export async function countPublished(category?: PostCategory | readonly PostCategory[]) {
  const f = categoryFilter(category);
  const row = await db()
    .prepare(`SELECT COUNT(*) AS n FROM posts WHERE status='published'${f.sql}`)
    .bind(...f.binds)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/** Published-post count per category. */
export async function listCategories() {
  const { results } = await db()
    .prepare("SELECT category, COUNT(*) AS n FROM posts WHERE status='published' GROUP BY category ORDER BY n DESC")
    .all<{ category: PostCategory; n: number }>();
  return results;
}

export async function getPublishedBySlug(slug: string) {
  return db().prepare("SELECT * FROM posts WHERE slug=?1 AND status='published'").bind(slug).first<Post>();
}

/** Admin: every post incl. drafts. */
export async function listAll() {
  const { results } = await db()
    .prepare(`SELECT ${LIST_COLS} FROM posts ORDER BY updated_at DESC, id DESC`)
    .all<Omit<Post, "content_md">>();
  return results;
}

export async function getById(id: number) {
  return db().prepare("SELECT * FROM posts WHERE id=?1").bind(id).first<Post>();
}

export async function slugExists(slug: string, exceptId?: number) {
  const row = await db()
    .prepare("SELECT id FROM posts WHERE slug=?1 AND id<>?2")
    .bind(slug, exceptId ?? -1)
    .first<{ id: number }>();
  return !!row;
}

export async function createPost(input: PostInput) {
  const status = input.status ?? "draft";
  const t = now();
  const res = await db()
    .prepare(
      `INSERT INTO posts (slug,title,excerpt,content_md,content_html,cover_image,category,status,source_url,published_at,created_at,updated_at)
       VALUES (?1,?2,?3,?4,?11,?5,?6,?7,?8,?9,?10,?10)`,
    )
    .bind(
      input.slug,
      input.title,
      input.excerpt ?? "",
      input.content_md ?? "",
      input.cover_image ?? null,
      toCategory(input.category) ?? DEFAULT_CATEGORY,
      status,
      input.source_url ?? null,
      status === "published" ? t : null,
      t,
      input.content_html ?? "",
    )
    .run();
  return Number(res.meta.last_row_id);
}

export async function updatePost(id: number, input: PostInput) {
  const prev = await getById(id);
  if (!prev) return false;
  const status = input.status ?? prev.status;
  const t = now();
  // keep the original publish date; set it the first time a post goes live; clear when back to draft
  const publishedAt = status === "published" ? prev.published_at ?? t : null;
  await db()
    .prepare(
      `UPDATE posts SET slug=?1,title=?2,excerpt=?3,content_md=?4,content_html=?12,cover_image=?5,category=?6,status=?7,source_url=?8,published_at=?9,updated_at=?10 WHERE id=?11`,
    )
    .bind(
      input.slug,
      input.title,
      input.excerpt ?? "",
      input.content_md ?? "",
      input.cover_image ?? null,
      toCategory(input.category) ?? toCategory(prev.category) ?? DEFAULT_CATEGORY,
      status,
      input.source_url ?? null,
      publishedAt,
      t,
      id,
      input.content_html ?? prev.content_html ?? "",
    )
    .run();
  return true;
}

export async function setStatus(id: number, status: PostStatus) {
  const prev = await getById(id);
  if (!prev) return false;
  const t = now();
  await db()
    .prepare("UPDATE posts SET status=?1, published_at=?2, updated_at=?3 WHERE id=?4")
    .bind(status, status === "published" ? prev.published_at ?? t : null, t, id)
    .run();
  return true;
}

export async function deletePost(id: number) {
  await db().prepare("DELETE FROM posts WHERE id=?1").bind(id).run();
}

/** URL-safe slug that keeps Hangul. */
export function slugify(input: string) {
  return input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ---------- media (images stored in D1) ----------
export interface MediaRow {
  id: string;
  filename: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

export const MEDIA_MAX_BYTES = 1_500_000;
export const MEDIA_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

export async function saveMedia(m: { filename: string; mime: string; data: ArrayBuffer; width?: number | null; height?: number | null }) {
  const id = `${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}.${m.mime === "image/jpeg" ? "jpg" : m.mime.split("/")[1]}`;
  await db()
    .prepare("INSERT INTO media (id,filename,mime,size,width,height,data) VALUES (?1,?2,?3,?4,?5,?6,?7)")
    .bind(id, m.filename.slice(0, 120), m.mime, m.data.byteLength, m.width ?? null, m.height ?? null, m.data)
    .run();
  return id;
}

export async function getMedia(id: string) {
  return db().prepare("SELECT id,mime,size,data FROM media WHERE id=?1").bind(id).first<{ id: string; mime: string; size: number; data: ArrayBuffer }>();
}

export async function listMedia(limit = 60) {
  const { results } = await db()
    .prepare("SELECT id,filename,mime,size,width,height,created_at FROM media ORDER BY created_at DESC LIMIT ?1")
    .bind(limit)
    .all<MediaRow>();
  return results;
}

/** True when a row was actually deleted. */
export async function deleteMedia(id: string) {
  const res = await db().prepare("DELETE FROM media WHERE id=?1").bind(id).run();
  return (res.meta.changes ?? 0) > 0;
}

/** Metadata only (no BLOB) — for cheap existence checks such as conditional GETs. */
export async function getMediaMeta(id: string) {
  return db().prepare("SELECT id,mime,size FROM media WHERE id=?1").bind(id).first<{ id: string; mime: string; size: number }>();
}

/** Posts (any status) whose body or cover references /media/<id>. */
export async function mediaUsage(id: string) {
  const ref = `/media/${id}`;
  const { results } = await db()
    .prepare("SELECT id, slug, title, status FROM posts WHERE cover_image=?1 OR instr(content_html, ?1) > 0 ORDER BY updated_at DESC LIMIT 20")
    .bind(ref)
    .all<{ id: number; slug: string; title: string; status: PostStatus }>();
  return results;
}

/** Sitemap rows: published posts with the fields needed for the URL (category) and <image:image> (cover + body images). */
export async function listSitemapRows(limit = 5000) {
  const { results } = await db()
    .prepare("SELECT slug, category, cover_image, content_html, updated_at FROM posts WHERE status='published' ORDER BY published_at DESC, id DESC LIMIT ?1")
    .bind(limit)
    .all<Pick<Post, "slug" | "category" | "cover_image" | "content_html" | "updated_at">>();
  return results;
}
