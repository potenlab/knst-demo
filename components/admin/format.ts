const fmt = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** ISO string → "2026. 10. 28. 14:03" (KST). */
export function formatKst(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : fmt.format(d);
}

export function hostOf(url: string | null | undefined) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Public URL of a post on the site (trailingSlash: true): /blog/, /notices/ or /news/ by category. */
export { postPathFor as postHref } from "@/lib/post-categories";
