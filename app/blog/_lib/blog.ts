import { BLOG_CATEGORIES, CATEGORY_LABEL, postPathFor, type PostCategory } from "@/lib/post-categories";
import { htmlToText, sanitizePostHtml } from "@/lib/sanitize";
import { SITE } from "@/lib/site";

/**
 * Shared constants + helpers for the public posts: the blog (app/blog/**), 공지사항 (app/notices/**),
 * 언론동향 (app/news/**), BlogCard, LatestPosts, sitemap, RSS.
 */

export const BLOG_PATH = "/blog/";
export const RSS_PATH = "/blog/rss.xml";
export const PAGE_SIZE = 12;

export const BLOG_TITLE = "블로그 · 새집증후군 칼럼·가이드";
export const BLOG_DESCRIPTION =
  "새집증후군의 원인과 포름알데히드·VOCs, NST공법 3단계 시공, 업체를 고르는 기준까지. 엔에스티가 직접 쓴 새집증후군 칼럼과 실내공기질 가이드를 모았습니다.";

/**
 * Pages set `alternates` themselves, which replaces the layout's — so every blog page passes this too.
 * String form only: vinext's metadata shim renders `types` values as plain hrefs (no `{ url, title }[]`).
 */
export const RSS_ALTERNATE = { "application/rss+xml": RSS_PATH };

/** Same @ids as components/JsonLd.tsx, so blog structured data joins the home page graph. */
export const LD_ID = {
  org: `${SITE.url}/#organization`,
  site: `${SITE.url}/#website`,
  blog: `${SITE.url}${BLOG_PATH}#blog`,
};

/** Minimal Organization node repeated on blog pages so `{ "@id": LD_ID.org }` resolves on the page itself. */
export const LD_ORG = {
  "@type": ["Organization", "HomeAndConstructionBusiness"],
  "@id": LD_ID.org,
  name: SITE.name,
  alternateName: [SITE.nameEn, SITE.brand],
  url: SITE.url,
  logo: { "@type": "ImageObject", url: `${SITE.url}/img/logo-color.webp`, width: 500, height: 336 },
};

export const LD_SITE = {
  "@type": "WebSite",
  "@id": LD_ID.site,
  url: SITE.url,
  name: SITE.shortTitle,
  inLanguage: "ko-KR",
  publisher: { "@id": LD_ID.org },
};

export const DEFAULT_OG_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "엔에스티 NST공법" };

/** Site-relative path of a blog post. Slugs may contain Hangul, so the segment is percent-encoded. */
export const postPath = (slug: string) => `${BLOG_PATH}${encodeURIComponent(slug)}/`;
export const postUrl = (slug: string) => `${SITE.url}${postPath(slug)}`;
/** Any category: /blog/, /notices/ or /news/. */
export const postUrlFor = (category: string, slug: string) => `${SITE.url}${postPathFor(category, slug)}`;

/** /blog/ list, optionally one tab (column | guide). */
export const categoryPath = (category?: (typeof BLOG_CATEGORIES)[number], page = 1) => {
  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `${BLOG_PATH}?${s}` : BLOG_PATH;
};

/* ---------- sections (blog · 공지사항 · 언론동향) ---------- */

export type SectionKey = "blog" | "notices" | "news";

export type Section = {
  key: SectionKey;
  /** Breadcrumb / nav label. */
  label: string;
  path: string;
  categories: readonly PostCategory[];
  /** schema.org type of one post in this section. */
  ldType: "BlogPosting" | "NewsArticle";
  /** List page <title> and meta description. */
  title: string;
  description: string;
  backLabel: string;
  relatedTitle: string;
};

export const SECTIONS: Record<SectionKey, Section> = {
  blog: {
    key: "blog",
    label: "블로그",
    path: BLOG_PATH,
    categories: BLOG_CATEGORIES,
    ldType: "BlogPosting",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    backLabel: "블로그 목록",
    relatedTitle: "다른 글 더 읽기",
  },
  notices: {
    key: "notices",
    label: CATEGORY_LABEL.notice,
    path: "/notices/",
    categories: ["notice"],
    ldType: "BlogPosting",
    title: "공지사항",
    description: "엔에스티 공지사항. NST공법 신규 사업자 모집, 공식 시공업체 알림, 입주시장 전문업체와의 계약 소식을 알려 드립니다.",
    backLabel: "공지사항 목록",
    relatedTitle: "다른 공지사항",
  },
  news: {
    key: "news",
    label: CATEGORY_LABEL.news,
    path: "/news/",
    categories: ["news"],
    ldType: "NewsArticle",
    title: "언론동향",
    description: "엔에스티와 NST공법을 다룬 기사 모음. 2025 대한민국환경대상 환경제품 부문 본상 수상, ‘하이앤드 듀얼’ 신제품 3종 출시, 전국 신규사업자 모집 소식과 원문 기사 링크.",
    backLabel: "언론동향 목록",
    relatedTitle: "다른 기사",
  },
};

export const sectionOf = (category: PostCategory): Section =>
  category === "notice" ? SECTIONS.notices : category === "news" ? SECTIONS.news : SECTIONS.blog;

/** `/notices/?page=2` style list URLs for the two boards. */
export const boardPath = (section: Section, page = 1) => (page > 1 ? `${section.path}?page=${page}` : section.path);

/** Host of an external source URL, without "www." ("kbsm.net"). */
export function hostOf(url: string | null | undefined) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** `?page=N` → N (1 when missing/invalid). */
export function pageParam(v: string | string[] | undefined) {
  const n = Number((Array.isArray(v) ? v[0] : v) ?? "1");
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Absolute URL for a cover image stored as a site path or a full URL. */
export const absUrl = (src: string) => (/^https?:\/\//.test(src) ? src : `${SITE.url}${src.startsWith("/") ? "" : "/"}${src}`);

/**
 * "2026년 5월 26일" in Korea time. Done by hand (UTC+9, no DST) instead of Intl so server output
 * never depends on the runtime's ICU data.
 */
export function formatDate(iso: string | null | undefined) {
  const d = kst(iso);
  return d ? `${d.getUTCFullYear()}년 ${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일` : "";
}

/** "2026.05.26" — compact form for cards. */
export function formatDateShort(iso: string | null | undefined) {
  const d = kst(iso);
  if (!d) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}`;
}

function kst(iso: string | null | undefined) {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : new Date(t + 9 * 3600 * 1000);
}

/** True when two ISO dates fall on different days in Korea. */
export const differentDay = (a: string | null, b: string | null) => !!a && !!b && formatDateShort(a) !== formatDateShort(b);

/* ---------- post body helpers (HTML first, legacy markdown fallback) ---------- */

/** Plain text of a post body: HTML via htmlToText, markdown with its syntax stripped. */
export function bodyText(html: string | null | undefined, markdown?: string | null) {
  if (html?.trim()) return htmlToText(html);
  return (markdown ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
    .replace(/[*_`~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cut at a word boundary near `max` chars and add an ellipsis. */
export function truncateText(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.·…:;!?-]+$/, "")}…`;
}

/** Korean reading speed ≈ 500 chars/min (whitespace excluded). Never less than 1 minute. */
export const readingMinutes = (text: string) => Math.max(1, Math.round(text.replace(/\s+/g, "").length / 500));

/** src of the first <img> in post HTML, after sanitizing (so only /media/<id> or https URLs). */
export function firstImageSrc(html: string | null | undefined) {
  if (!html || !/<img\b/i.test(html)) return null;
  return /<img\b[^>]*\bsrc="([^"]+)"/i.exec(sanitizePostHtml(html))?.[1]?.replace(/&amp;/g, "&") ?? null;
}

/** Every image src in post HTML (sanitized), de-duplicated, in order. */
export function allImageSrcs(html: string | null | undefined) {
  if (!html || !/<img\b/i.test(html)) return [];
  const out = new Set<string>();
  for (const m of sanitizePostHtml(html).matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) out.add(m[1].replace(/&amp;/g, "&"));
  return [...out];
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
