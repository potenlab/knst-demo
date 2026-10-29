import Markdown from "@/components/Markdown";
import { sanitizePostHtml } from "@/lib/sanitize";

/**
 * Post body. HTML (`content_html`) is the source of truth and is sanitized again here on every
 * render (defence in depth — it was already sanitized on save). Legacy rows with only
 * `content_md` fall back to the Markdown renderer.
 */
export default function PostBody({ html, markdown }: { html: string | null | undefined; markdown?: string | null }) {
  if (!html?.trim()) {
    return markdown?.trim() ? <Markdown source={markdown} /> : null;
  }
  return <div className="prose-nst prose-html" dangerouslySetInnerHTML={{ __html: renderPostHtml(html) }} />;
}

/** ids the page chrome uses itself — an author heading must not take them (duplicate ids break aria-labelledby/anchors). */
const RESERVED_IDS = new Set([
  "main", "post-title", "related-title", "blog-title", "blog-list-title", "nf-title",
  "mobile-menu", "process", "footer-page-title", "footer-site-title", "latest", "latest-title",
  "notices-title", "notices-list-title", "news-title", "news-list-title", "blog-consult-title",
]);

/** Sanitize, then apply presentation-only tweaks that never add new URLs or scriptable attributes. */
export function renderPostHtml(html: string) {
  let out = sanitizePostHtml(html);

  // per tag: drop attributes the sanitizer emptied (`<a href>` → plain text, `<p style>`) and reserved ids.
  // Quoted values are matched whole first, so text inside them is never touched.
  out = out.replace(/<[a-z][\w-]*\b[^>]*>/gi, (tag) =>
    tag.replace(/(\s[\w-]+="[^"]*")|\s[\w-]+(?=[\s/>])/g, (_attr, quoted?: string) => {
      if (!quoted) return "";
      const id = /^\sid="([^"]*)"$/.exec(quoted)?.[1];
      return id !== undefined && (!id || RESERVED_IDS.has(id.toLowerCase())) ? "" : quoted;
    }),
  );

  // images: lazy + async decode; an integer width attr becomes the max display width
  // (CSS caps it at 100% and keeps the width/height aspect ratio, so there's no layout shift).
  out = out.replace(/<img\b([^>]*?)\s*\/?>/gi, (_m, attrs: string) => {
    let a = attrs.replace(/\s(?:loading|decoding)="[^"]*"/gi, "");
    a += ' loading="lazy" decoding="async"';
    const w = /\swidth="(\d{1,5})"/i.exec(a)?.[1];
    if (w && Number(w) > 0) a += ` style="width:${Number(w)}px"`;
    return `<img${a}>`;
  });

  // wide tables scroll inside their own box on phones instead of widening the page
  const opens = out.match(/<table\b/gi)?.length ?? 0;
  const closes = out.match(/<\/table>/gi)?.length ?? 0;
  if (opens && opens === closes) {
    out = out
      .replace(/<table\b/gi, '<div class="prose-table" role="region" aria-label="표" tabindex="0"><table')
      .replace(/<\/table>/gi, "</table></div>");
  }

  return balanceTags(out);
}

const VOID_TAGS = new Set(["br", "hr", "img", "wbr"]);

/**
 * Close what's left open and drop stray closing tags, so a malformed body can never close the
 * page's own wrappers (e.g. a lone `</div>`) and shift the rest of the layout. Runs on sanitizer
 * output, where `<`/`>` inside text and attribute values are already escaped.
 */
function balanceTags(html: string) {
  const stack: string[] = [];
  const out = html.replace(/<(\/?)([a-zA-Z][\w-]*)\b[^>]*>/g, (tag, close: string, name: string) => {
    const n = name.toLowerCase();
    if (VOID_TAGS.has(n)) return tag;
    if (!close) {
      stack.push(n);
      return tag;
    }
    const at = stack.lastIndexOf(n);
    if (at === -1) return "";
    const inner = stack.splice(at).slice(1);
    return inner.reverse().map((t) => `</${t}>`).join("") + tag;
  });
  return out + stack.reverse().map((t) => `</${t}>`).join("");
}
