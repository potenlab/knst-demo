import xssDefault from "xss";
import type { IFilterXSSOptions } from "xss";

// xss is CommonJS: take everything off the default export so it works in Node, Vite and workerd alike.
const { FilterXSS, safeAttrValue: defaultSafeAttrValue } = xssDefault as unknown as typeof import("xss");

/**
 * Post HTML sanitizer. Run on SAVE (admin) and again on RENDER (public) — defence in depth.
 * Allow-list only: no script/style/iframe/forms/event handlers, no javascript: URLs.
 * Images may only come from our own /media/<id> route, the archived old-site images under
 * /old/<name>.<ext> (static files in public/old, see scripts/import-old-site.mjs) or https URLs.
 */
const whiteList: IFilterXSSOptions["whiteList"] = {
  p: ["style"], br: [], hr: [],
  h2: ["id"], h3: ["id"], h4: ["id"],
  strong: [], b: [], em: [], i: [], u: [], s: [], del: [], mark: [], sub: [], sup: [], small: [],
  a: ["href", "title", "target", "rel"],
  ul: [], ol: ["start"], li: [],
  blockquote: [], code: [], pre: [],
  figure: [], figcaption: [],
  img: ["src", "alt", "title", "width", "height", "loading"],
  table: [], thead: [], tbody: [], tfoot: [], tr: [], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"],
  div: [], span: [],
};

/** One flat file in public/old: no sub-paths, no dot segments, raster extensions only. */
const OLD_IMAGE = /^\/old\/[a-z0-9][a-z0-9-]*\.(?:webp|png|jpe?g|gif)$/i;

const SAFE_STYLE =/^(?:\s*text-align\s*:\s*(?:left|right|center|justify)\s*;?\s*)$/i;

const options: IFilterXSSOptions = {
  whiteList,
  stripIgnoreTag: true, // drop unknown tags, keep their text
  stripIgnoreTagBody: ["script", "style", "iframe", "object", "embed", "form", "textarea", "noscript", "svg", "math"],
  css: false,
  safeAttrValue(tag, name, value, cssFilter) {
    if (name === "style") return SAFE_STYLE.test(value) ? value : "";
    if (tag === "img" && name === "src") {
      const v = value.trim();
      return /^\/media\/[\w.-]+$/.test(v) || OLD_IMAGE.test(v) || /^https:\/\/[^\s"'<>]+$/i.test(v) ? v : "";
    }
    if (tag === "a" && name === "href") {
      const v = value.trim();
      return /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(v) ? v : "";
    }
    return defaultSafeAttrValue(tag, name, value, cssFilter);
  },
  onTagAttr(tag, name, value) {
    // external links: always noopener
    if (tag === "a" && name === "target") return `target="_blank"`;
    if (tag === "img" && name === "loading") return `loading="lazy"`;
    void value;
    return undefined;
  },
};

const filter = new FilterXSS(options);

export function sanitizePostHtml(html: string): string {
  let out = filter.process(html ?? "");
  // force rel on every target=_blank link
  out = out.replace(/<a\b([^>]*\btarget="_blank"[^>]*)>/gi, (m: string, attrs: string) =>
    /\brel=/.test(attrs) ? m : `<a${attrs} rel="noopener noreferrer">`,
  );
  // drop images whose src was rejected
  out = out.replace(/<img\b(?![^>]*\bsrc="[^"]+")[^>]*>/gi, "");
  return out;
}

/** Plain-text version for excerpts / meta descriptions. */
export function htmlToText(html: string): string {
  return (html ?? "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
