import type { MetadataRoute } from "next";
import { SECTIONS, absUrl, allImageSrcs, postUrlFor, sectionOf } from "@/app/blog/_lib/blog";
import { listSitemapRows } from "@/lib/db";
import { STATIC_PAGES } from "@/lib/static-pages";
import { SITE } from "@/lib/site";

/**
 * Dynamic: home + the post sections (/blog/, /notices/, /news/) + every published post at its
 * category's URL (read from D1 per request), with post images.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof listSitemapRows>> = [];
  try {
    posts = await listSitemapRows(5000);
  } catch {
    // DB unavailable → still serve the static entries
  }

  const newestIn = (key: keyof typeof SECTIONS) =>
    posts
      .filter((p) => sectionOf(p.category).key === key)
      .reduce<string | undefined>((max, p) => (!max || p.updated_at > max ? p.updated_at : max), undefined);
  const priority = { blog: 0.6, news: 0.5, notices: 0.4 } as const;

  return [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...STATIC_PAGES.map((p) => ({
      url: `${SITE.url}${p.path}`,
      lastModified: new Date(),
      changeFrequency: p.changefreq,
      priority: p.priority,
    })),
    ...(["blog", "notices", "news"] as const).map((key) => {
      const newest = newestIn(key);
      return {
        url: `${SITE.url}${SECTIONS[key].path}`,
        lastModified: newest ? new Date(newest) : new Date(),
        changeFrequency: "weekly" as const,
        priority: key === "blog" ? 0.8 : 0.6,
      };
    }),
    ...posts.map((p) => {
      // cover first, then body images; Google reads up to 1,000 images per <url>
      const images = [...new Set([p.cover_image, ...allImageSrcs(p.content_html)].filter((s): s is string => !!s).map(absUrl))].slice(0, 1000);
      return {
        url: postUrlFor(p.category, p.slug),
        lastModified: new Date(p.updated_at),
        changeFrequency: "monthly" as const,
        priority: priority[sectionOf(p.category).key],
        ...(images.length ? { images } : {}),
      };
    }),
  ];
}
