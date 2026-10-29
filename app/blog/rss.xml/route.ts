import { listPublished } from "@/lib/db";
import { categoryLabel } from "@/lib/post-categories";
import { SITE } from "@/lib/site";
import { BLOG_PATH, RSS_PATH, postUrlFor } from "../_lib/blog";

const FEED_TITLE = `${SITE.name} 블로그 · 공지사항 · 언론동향`;
const FEED_DESCRIPTION =
  "엔에스티의 새집증후군 칼럼과 실내공기질 가이드, 공지사항, 언론동향. 블로그(/blog/), 공지사항(/notices/), 언론동향(/news/)의 새 글을 한 피드로 받아 보세요.";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s
    // drop characters that are illegal in XML 1.0
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** RFC 822 date (RSS 2.0 pubDate). */
const rfc822 = (iso: string | null | undefined) => {
  const t = iso ? Date.parse(iso) : NaN;
  return new Date(Number.isNaN(t) ? Date.now() : t).toUTCString();
};

/** RSS 2.0 feed of the 50 newest published posts of every section (blog, 공지사항, 언론동향). */
export async function GET() {
  let posts: Awaited<ReturnType<typeof listPublished>>;
  try {
    posts = await listPublished({ limit: 50 });
  } catch {
    return new Response("Feed temporarily unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "300", "Cache-Control": "no-store" },
    });
  }

  const blogUrl = `${SITE.url}${BLOG_PATH}`;
  const lastBuild = posts.reduce<string | null>(
    (max, p) => (!max || (p.updated_at && p.updated_at > max) ? p.updated_at : max),
    null,
  );

  const items = posts
    .map((p) => {
      const link = postUrlFor(p.category, p.slug);
      return [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${esc(link)}</link>`,
        `      <guid isPermaLink="true">${esc(link)}</guid>`,
        `      <pubDate>${rfc822(p.published_at ?? p.created_at)}</pubDate>`,
        p.excerpt ? `      <description>${esc(p.excerpt)}</description>` : "",
        `      <category>${esc(categoryLabel(p.category))}</category>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${esc(blogUrl)}</link>
    <description>${esc(FEED_DESCRIPTION)}</description>
    <language>ko-KR</language>
    <copyright>${esc(`© ${new Date().getFullYear()} ${SITE.name}`)}</copyright>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${esc(`${SITE.url}${RSS_PATH}`)}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${esc(`${SITE.url}/icon.png`)}</url>
      <title>${esc(FEED_TITLE)}</title>
      <link>${esc(blogUrl)}</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
