import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { sanitizePostHtml } from "@/lib/sanitize";

/**
 * Light server-side conversion for legacy posts that only have `content_md`, so the HTML editor
 * can open them. Same dialect as components/Markdown.tsx (CommonMark + GFM, raw HTML escaped,
 * external links open in a new tab), then the save-time sanitizer. `react-dom/server` cannot be
 * imported in the RSC environment, hence micromark.
 */
export function markdownToPostHtml(md: string) {
  const html = micromark(md.replace(/\r\n/g, "\n"), {
    allowDangerousHtml: false,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  }).replace(/<a href="(https?:\/\/[^"]+)"/gi, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  return sanitizePostHtml(html).replace(/\n{2,}/g, "\n").trim();
}
