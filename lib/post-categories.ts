/**
 * Fixed post categories (the `posts.category` column, migrations/0006_post_categories.sql).
 * Client-safe: no `cloudflare:workers` import, so the admin editor bundles it too.
 *
 *   column · guide  → the blog (/blog/<slug>/, tabs 칼럼 / 가이드)
 *   notice          → 공지사항 (/notices/<slug>/)
 *   news            → 언론동향 (/news/<slug>/)
 */
export const POST_CATEGORIES = ["column", "guide", "notice", "news"] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const DEFAULT_CATEGORY: PostCategory = "column";

/** Categories listed on /blog/ (and in the home page's latest posts). */
export const BLOG_CATEGORIES = ["column", "guide"] as const satisfies readonly PostCategory[];

export const CATEGORY_LABEL: Record<PostCategory, string> = {
  column: "칼럼",
  guide: "가이드",
  notice: "공지사항",
  news: "언론동향",
};

/** Public section each category lives under (trailingSlash: true). */
export const CATEGORY_SECTION: Record<PostCategory, string> = {
  column: "/blog/",
  guide: "/blog/",
  notice: "/notices/",
  news: "/news/",
};

export const isPostCategory = (v: unknown): v is PostCategory =>
  typeof v === "string" && (POST_CATEGORIES as readonly string[]).includes(v);

export const isBlogCategory = (v: unknown): v is (typeof BLOG_CATEGORIES)[number] =>
  typeof v === "string" && (BLOG_CATEGORIES as readonly string[]).includes(v);

/** Key or Korean label (incl. the pre-0006 free-text values such as '칼럼') → key. */
export function toCategory(v: string | null | undefined): PostCategory | undefined {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  if (isPostCategory(s)) return s;
  const alias: Record<string, PostCategory> = {
    칼럼: "column",
    가이드: "guide",
    공지: "notice",
    공지사항: "notice",
    뉴스: "news",
    언론동향: "news",
    언론보도: "news",
  };
  return alias[s];
}

export const categoryLabel = (c: string) => (isPostCategory(c) ? CATEGORY_LABEL[c] : c);

/** Site-relative URL of a post. Slugs may contain Hangul, so the segment is percent-encoded. */
export const postPathFor = (category: string, slug: string) =>
  `${isPostCategory(category) ? CATEGORY_SECTION[category] : CATEGORY_SECTION.column}${encodeURIComponent(slug)}/`;
