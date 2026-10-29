/**
 * Post field rules shared by the admin editor (client, instant feedback) and the
 * server actions (authoritative). Pure module — no server-only imports, so it is
 * safe to bundle for the browser (lib/sanitize is plain JS).
 */

import { DEFAULT_CATEGORY, toCategory } from "@/lib/post-categories";
import { htmlToText } from "@/lib/sanitize";

export { DEFAULT_CATEGORY };

export const LIMITS = {
  title: 120,
  slug: 80,
  excerpt: 300,
  excerptSeo: 160,
  category: 30,
  url: 500,
  /** Body HTML, counted after sanitizing. */
  content: 200_000,
  /** Excerpt suggestions are cut around this length. */
  excerptSuggest: 150,
} as const;

export type PostFields = {
  title: string;
  slug: string;
  excerpt: string;
  /** A PostCategory key ('column' | 'guide' | 'notice' | 'news'); the editor offers only those. */
  category: string;
  cover_image: string;
  source_url: string;
  /** Post body as HTML (sanitized on save). */
  content_html: string;
};

export type FieldName = keyof PostFields;
export type FieldErrors = Partial<Record<FieldName, string>>;

/** DOM order of the editor fields (focus goes to the first invalid one). */
export const FIELD_ORDER: FieldName[] = ["title", "content_html", "slug", "excerpt", "category", "source_url", "cover_image"];

/**
 * Client-safe copy of `slugify` from lib/db.ts (that module imports
 * `cloudflare:workers`, so it cannot be bundled for the browser).
 * Keep the two in sync (the server action fills an empty slug with lib/db's version first).
 */
export function slugifyClient(input: string) {
  return input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITS.slug);
}

const SLUG_RE = /^[\p{L}\p{N}-]+$/u;
const HAS_WORD_RE = /[\p{L}\p{N}]/u;

export function normalizeSlug(input: string) {
  return input.normalize("NFKC").trim().toLowerCase();
}

export function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Root-relative path on this site, e.g. `/img/hero.webp` (not protocol-relative `//host`). */
export function isSitePath(value: string) {
  return /^\/(?!\/)[^\s\\]*$/.test(value);
}

const n = (v: number) => v.toLocaleString("ko-KR");

export function slugError(slug: string): string | undefined {
  if (!slug) return "주소를 입력해 주세요. 제목을 먼저 쓰면 자동으로 채워집니다.";
  if (slug.length > LIMITS.slug) return `주소는 ${LIMITS.slug}자 이내로 줄여 주세요. (지금 ${n(slug.length)}자)`;
  if (!SLUG_RE.test(slug) || !HAS_WORD_RE.test(slug))
    return "주소에는 한글·영문·숫자와 하이픈(-)만 쓸 수 있습니다. 띄어쓰기나 기호는 하이픈(-)으로 바꿔 주세요.";
  return undefined;
}

/** Trim + validate. `publishing` adds the rules that only matter for a public post. */
export function validatePost(raw: PostFields, opts: { publishing: boolean }) {
  const values: PostFields = {
    title: raw.title.trim(),
    slug: normalizeSlug(raw.slug),
    excerpt: raw.excerpt.trim(),
    category: raw.category.trim() ? (toCategory(raw.category) ?? raw.category.trim()) : DEFAULT_CATEGORY,
    cover_image: raw.cover_image.trim(),
    source_url: raw.source_url.trim(),
    content_html: raw.content_html.replace(/\r\n/g, "\n").trim(),
  };
  if (!values.slug && values.title) values.slug = slugifyClient(values.title);

  const errors: FieldErrors = {};

  if (!values.title) errors.title = "제목을 입력해 주세요.";
  else if (values.title.length > LIMITS.title)
    errors.title = `제목은 ${LIMITS.title}자 이내로 줄여 주세요. (지금 ${n(values.title.length)}자)`;

  const se = values.title || raw.slug.trim() ? slugError(values.slug) : undefined;
  if (se) errors.slug = se;

  if (values.excerpt.length > LIMITS.excerpt)
    errors.excerpt = `요약은 ${LIMITS.excerpt}자 이내로 줄여 주세요. (지금 ${n(values.excerpt.length)}자)`;

  if (!toCategory(values.category)) errors.category = "분류를 목록에서 골라 주세요. (칼럼 · 가이드 · 공지사항 · 언론동향)";

  if (values.cover_image) {
    if (values.cover_image.length > LIMITS.url) errors.cover_image = `이미지 주소가 너무 깁니다. ${LIMITS.url}자 이내로 넣어 주세요.`;
    else if (!isHttpUrl(values.cover_image) && !isSitePath(values.cover_image))
      errors.cover_image = "이미지 주소는 https:// 로 시작하는 전체 주소나 /img/… 같은 사이트 내부 경로로 넣어 주세요.";
  }

  if (values.source_url) {
    if (values.source_url.length > LIMITS.url) errors.source_url = `링크가 너무 깁니다. ${LIMITS.url}자 이내로 넣어 주세요.`;
    else if (!isHttpUrl(values.source_url)) errors.source_url = "원문 링크는 https:// 로 시작하는 전체 주소로 넣어 주세요.";
  }

  if (values.content_html.length > LIMITS.content)
    errors.content_html = `본문이 너무 깁니다. HTML 기준 ${n(LIMITS.content)}자 이내여야 합니다. (지금 ${n(values.content_html.length)}자) 글을 둘로 나눠 올려 주세요.`;
  else if (opts.publishing && !hasBody(values.content_html))
    errors.content_html = "발행하려면 본문을 입력해 주세요. 초안은 본문 없이도 임시저장할 수 있습니다.";
  else if (opts.publishing) {
    const missing = countMissingAlt(values.content_html);
    if (missing)
      errors.content_html = `설명(대체 텍스트)이 없는 이미지가 ${missing}개 있습니다. 빨간 점선으로 표시된 이미지를 눌러 설명을 적거나 ‘장식용 이미지’로 표시한 뒤 발행해 주세요.`;
  }

  return { values, errors };
}

export function firstError(errors: FieldErrors): FieldName | undefined {
  return FIELD_ORDER.find((f) => errors[f]);
}

/** Save intents sent by the editor's submit buttons. */
export type SaveIntent = "draft" | "publish" | "update" | "unpublish";

export const SAVE_MESSAGES: Record<SaveIntent, string> = {
  draft: "임시저장되었습니다. 사이트에는 아직 보이지 않습니다.",
  publish: "발행되었습니다. 이제 블로그에서 누구나 볼 수 있습니다.",
  update: "저장되었습니다. 공개된 글에 바로 반영됩니다.",
  unpublish: "발행이 취소되었습니다. 글은 초안으로 남고 사이트에서는 내려갔습니다.",
};

/* ───────────────────────── body HTML helpers (regex only — run on server and client) ───────────────────────── */

/** True when the body has visible text or at least one image. */
export function hasBody(html: string) {
  return /<img\b/i.test(html) || htmlToText(html).length > 0;
}

const IMG_TAG_RE = /<img\b[^>]*>/gi;
const HAS_ALT_RE = /\salt(?=[\s=>/]|$)/i;

/**
 * Images with no `alt` attribute at all. `alt=""` (or a bare `alt`) is an explicit
 * "decorative image" choice and does not count as missing.
 */
export function countMissingAlt(html: string) {
  let missing = 0;
  for (const tag of html.match(IMG_TAG_RE) ?? []) if (!HAS_ALT_RE.test(tag.replace(/\s*\/?>$/, " >"))) missing++;
  return missing;
}

/**
 * Excerpt suggestion: the opening of the body text (headings, tables and captions skipped),
 * cut at a sentence end near `LIMITS.excerptSuggest` characters, otherwise at a word break + "…".
 */
export function suggestExcerpt(html: string, max: number = LIMITS.excerptSuggest) {
  const prose = html
    .replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi, " ")
    .replace(/<table\b[\s\S]*?<\/table>/gi, " ")
    .replace(/<figcaption\b[\s\S]*?<\/figcaption>/gi, " ")
    .replace(/<\/(p|li|blockquote|div)>/gi, "$& ");
  const text = htmlToText(prose) || htmlToText(html);
  if (text.length <= max) return text;
  const head = text.slice(0, max + 1);
  const ends = [...head.matchAll(/[.!?。！？](?=\s|$)|다\.(?=\s|$)/g)];
  const lastEnd = ends.length ? ends[ends.length - 1] : null;
  if (lastEnd && lastEnd.index! + lastEnd[0].length >= max * 0.45) return head.slice(0, lastEnd.index! + lastEnd[0].length).trim();
  const space = head.lastIndexOf(" ");
  return `${(space > max * 0.6 ? head.slice(0, space) : head.slice(0, max)).replace(/[\s,·:;(\[-]+$/, "")}…`;
}
