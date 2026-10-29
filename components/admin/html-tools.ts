/**
 * Browser-only helpers for the HTML body editor (use the DOM; never import from server code).
 */

const BLOCK_CLOSE = /(<\/(?:p|h[1-6]|li|ul|ol|blockquote|table|thead|tbody|tfoot|tr|figure|figcaption|pre|div)>|<(?:hr|br)\s*\/?>(?=<(?:p|h[1-6]|ul|ol|blockquote|table|figure|pre|div|img|hr)\b))/gi;
const BLOCK_OPEN = /(<(?:ul|ol|table|thead|tbody|tfoot|tr|blockquote)\b[^>]*>)(?=<)/gi;
const IMG_BLOCK = /(<img\b[^>]*>)(?=<(?:p|h[1-6]|ul|ol|blockquote|table|figure|pre|div|img|hr)\b)/gi;

/** One block per line, so the source view is readable. Only adds whitespace between tags. */
export function prettyHtml(html: string) {
  if (!html) return "";
  return html.replace(BLOCK_CLOSE, "$1\n").replace(BLOCK_OPEN, "$1\n").replace(IMG_BLOCK, "$1\n").replace(/\n{2,}/g, "\n").trim();
}

/** Whitespace between tags doesn't change a post — ignore it when deciding "unsaved changes". */
export function normHtml(html: string) {
  return html.replace(/>\s+</g, "><").trim();
}

/** Things the editor itself adds that the sanitizer drops on purpose (not worth reporting). */
const NOISE = new Set([
  "colgroup", "col", "col[style]", "table[style]", "th[style]", "td[style]", "th[colwidth]", "td[colwidth]",
  "a[class]", "img[class]", "p[class]", "code[class]", "pre[class]", "ol[type]", "img[loading]", "img[decoding]",
]);

/** Same element under another name (the visual editor writes <strong> for <b>, …) — not a loss. */
const ALIAS: Record<string, string> = { b: "strong", i: "em", del: "s", strike: "s" };

const LABEL_TAG: Record<string, string> = {
  script: "스크립트",
  style: "스타일 블록",
  iframe: "외부 삽입(iframe)",
  form: "입력 양식",
  input: "입력칸",
  button: "버튼",
  svg: "SVG",
  object: "외부 삽입(object)",
  embed: "외부 삽입(embed)",
  video: "동영상",
  audio: "오디오",
};

function census(html: string) {
  const counts = new Map<string, number>();
  const tpl = document.createElement("template"); // inert: nothing loads or runs
  tpl.innerHTML = html;
  const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1);
  tpl.content.querySelectorAll("*").forEach((el) => {
    const raw = el.tagName.toLowerCase();
    const tag = ALIAS[raw] ?? raw;
    // a link without a destination is plain text everywhere (editor, sanitizer, public page)
    if (tag === "a" && !(el.getAttribute("href") ?? "").trim()) return;
    bump(tag);
    for (const a of Array.from(el.attributes)) {
      const name = a.name.toLowerCase();
      // an emptied style/href/src (the sanitizer blanks unsafe values) counts as removed
      if ((name === "style" || name === "href" || name === "src") && !a.value.trim()) continue;
      bump(`${tag}[${name}]`);
    }
  });
  return counts;
}

/**
 * Human-readable list of tags/attributes present in `before` but (partly) gone in `after`,
 * e.g. ["<script> 스크립트 1개", "<img>의 onerror 속성 1개"].
 */
export function removedParts(before: string, after: string): string[] {
  if (typeof document === "undefined" || before === after) return [];
  const a = census(before);
  const b = census(after);
  const out: string[] = [];
  for (const [key, count] of a) {
    if (NOISE.has(key)) continue;
    const lost = count - (b.get(key) ?? 0);
    if (lost <= 0) continue;
    const m = /^([a-z0-9-]+)(?:\[(.+)\])?$/.exec(key);
    if (!m) continue;
    const [, tag, attr] = m;
    if (attr) {
      // an attribute that vanished because its whole tag was dropped is already reported via the tag
      if ((a.get(tag) ?? 0) - (b.get(tag) ?? 0) >= lost) continue;
      const why = attr === "href" || attr === "src" ? "(허용되지 않는 주소)" : "";
      out.push(`<${tag}>의 ${attr} 속성${why} ${lost}개`);
    } else {
      out.push(`<${tag}>${LABEL_TAG[tag] ? ` ${LABEL_TAG[tag]}` : ""} ${lost}개`);
    }
  }
  return out;
}

/** Plain text length of an HTML string (what a reader actually reads). */
export function textLength(html: string) {
  if (!html) return 0;
  if (typeof document === "undefined") {
    // server render: no DOM, so strip tags with a regex (the browser recomputes it exactly after hydration)
    return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
  }
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  return (tpl.content.textContent ?? "").replace(/\s+/g, " ").trim().length;
}

/** "https://", "/path", "#id", "mailto:", "tel:" are kept; a bare domain gets https://. Null when unusable. */
export function normalizeHref(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (/^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*|mailto:[^\s]+|tel:[+\d\-() ]+)$/i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/[^\s]*)?$/i.test(v)) return `https://${v}`;
  return null;
}

export const isExternalHref = (href: string) => /^https?:\/\//i.test(href);
