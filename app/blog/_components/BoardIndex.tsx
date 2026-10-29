import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Rss } from "lucide-react";
import { countPublished, listPublished } from "@/lib/db";
import { postPathFor } from "@/lib/post-categories";
import { SITE } from "@/lib/site";
import BlogBackdrop from "./BlogBackdrop";
import Breadcrumbs from "./Breadcrumbs";
import ConsultCTA from "./ConsultCTA";
import Pagination from "./Pagination";
import {
  DEFAULT_OG_IMAGE,
  LD_ID,
  LD_ORG,
  LD_SITE,
  RSS_ALTERNATE,
  RSS_PATH,
  boardPath,
  bodyText,
  firstImageSrc,
  formatDateShort,
  hostOf,
  jsonLd,
  postUrlFor,
  truncateText,
  type Section,
} from "../_lib/blog";

export const BOARD_PAGE_SIZE = 20;

const titleFor = (section: Section, page: number) => (page > 1 ? `${section.title} (${page}페이지)` : section.title);

/** Metadata for /notices/ and /news/ (page N canonicalises to itself). */
export async function boardMetadata(section: Section, page: number): Promise<Metadata> {
  const total = await countPublished(section.categories).catch(() => 0);
  const title = titleFor(section, page);
  const canonical = boardPath(section, page);
  return {
    title,
    description: section.description,
    alternates: { canonical, types: RSS_ALTERNATE },
    robots: total === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: canonical,
      siteName: "(주)엔에스티 NST공법",
      title: `${title} | (주)엔에스티`,
      description: section.description,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: `${title} | (주)엔에스티`, description: section.description },
  };
}

/**
 * Compact, newest-first list of one board (공지사항 / 언론동향): date · title (· press source), paginated.
 * Same header, colours and consultation block as /blog/. Returns null when `page` is past the end
 * (the route then calls notFound()).
 */
export default async function BoardIndex({ section, page, eyebrow }: { section: Section; page: number; eyebrow: string }) {
  const total = await countPublished(section.categories);
  const totalPages = Math.max(1, Math.ceil(total / BOARD_PAGE_SIZE));
  if (page > totalPages) return null;
  const offset = (page - 1) * BOARD_PAGE_SIZE;
  const posts = total ? await listPublished({ limit: BOARD_PAGE_SIZE, offset, category: section.categories }) : [];
  const isNews = section.key === "news";

  const sectionUrl = `${SITE.url}${section.path}`;
  const pageUrl = `${SITE.url}${boardPath(section, page)}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      LD_ORG,
      LD_SITE,
      {
        "@type": "CollectionPage",
        "@id": page > 1 ? `${pageUrl}#webpage` : `${sectionUrl}#webpage`,
        url: pageUrl,
        name: titleFor(section, page),
        description: section.description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": LD_ID.site },
        publisher: { "@id": LD_ID.org },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: posts.length,
          itemListElement: posts.map((p, i) => ({
            "@type": "ListItem",
            position: offset + i + 1,
            url: postUrlFor(p.category, p.slug),
            name: p.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: section.label, item: sectionUrl },
        ],
      },
    ],
  };

  const headingId = `${section.key}-title`;
  const listId = `${section.key}-list-title`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <section aria-labelledby={headingId} className="grain relative isolate overflow-hidden">
        <BlogBackdrop />
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
          <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: section.label }]} />

          <div className="mt-6 grid gap-8 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h1 id={headingId} className="font-display tracking-[-0.03em] text-pine lg:col-span-7">
              <span className="inline-flex items-center gap-2.5 text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] font-bold text-pine-2">
                <span aria-hidden className="relative inline-block size-3.5">
                  <span className="absolute inset-0 rounded-full border border-leaf" />
                  <span className="absolute inset-[4px] rounded-full bg-leaf" />
                </span>
                {eyebrow}
              </span>
              <span className="mt-3 block text-[clamp(1.9rem,1.2rem+2vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">
                <span className="bg-[linear-gradient(transparent_62%,#cdeedd_62%,#cdeedd_92%,transparent_92%)] box-decoration-clone">
                  {section.label}
                </span>
              </span>
            </h1>

            <div className="border-t border-hairline pt-6 lg:col-span-5 lg:mb-2">
              <p className="max-w-[34rem] text-pretty text-[17px] leading-[1.75] text-muted-ink sm:text-[18px]">{section.description}</p>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
                <span className="text-ink">
                  게시된 글 <strong className="font-display text-[1.25rem] font-extrabold tabular-nums text-pine">{total}</strong>건
                </span>
                <a
                  href={RSS_PATH}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md font-semibold text-trust underline decoration-trust/30 underline-offset-[5px] outline-none hover:decoration-trust focus-visible:ring-2 focus-visible:ring-trust"
                >
                  <Rss aria-hidden className="size-4" />
                  RSS 구독
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── List ─────────────────────────────────────────────────────── */}
      <section aria-labelledby={listId} className="mx-auto max-w-[1040px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pine pb-4">
          <h2 id={listId} className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-pine">
            {section.label} 목록
          </h2>
          {total > 0 && (
            <p className="text-[15px] text-muted-ink">
              {totalPages > 1 ? (
                <>
                  <span className="tabular-nums">
                    {offset + 1}–{offset + posts.length}
                  </span>{" "}
                  / 총{" "}
                </>
              ) : (
                "총 "
              )}
              <strong className="font-semibold tabular-nums text-ink">{total}</strong>건
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <ol role="list" className="divide-y divide-hairline border-b border-hairline">
            {posts.map((p) => {
              const host = hostOf(p.source_url);
              const summary = isNews
                ? p.excerpt || (p.lead_html ? truncateText(p.lead_format === "md" ? bodyText(null, p.lead_html) : bodyText(p.lead_html), 140) : "")
                : "";
              // 언론동향 rows carry their image as a thumbnail, like the old /nst-news/ list did
              const thumb = isNews ? p.cover_image || firstImageSrc(p.lead_img) : null;
              return (
                <li key={p.slug}>
                  <article
                    className={
                      thumb
                        ? "group relative grid grid-cols-[minmax(0,1fr)_5rem] gap-x-4 gap-y-1.5 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_6.5rem] sm:gap-x-6 sm:py-6"
                        : "group relative grid gap-1.5 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6 sm:py-6"
                    }
                  >
                    {p.published_at ? (
                      <time dateTime={p.published_at} className="text-[14.5px] tabular-nums text-muted-ink sm:pt-0.5">
                        {formatDateShort(p.published_at)}
                      </time>
                    ) : (
                      <span aria-hidden />
                    )}
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        width={104}
                        height={104}
                        loading="lazy"
                        decoding="async"
                        className="row-span-2 size-20 self-start rounded-xl bg-mint object-cover ring-1 ring-hairline sm:col-start-3 sm:row-span-1 sm:row-start-1 sm:size-[6.5rem]"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-pretty text-[17px] font-semibold leading-[1.5] text-ink sm:text-[18px]">
                        <Link
                          href={postPathFor(p.category, p.slug)}
                          className="rounded outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-trust group-hover:underline group-hover:decoration-trust/40 group-hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-trust"
                        >
                          {p.title}
                        </Link>
                      </h3>
                      {summary && <p className="mt-1.5 line-clamp-2 text-pretty text-[15.5px] leading-[1.7] text-muted-ink">{summary}</p>}
                      {isNews && host && (
                        <p className="mt-2 inline-flex items-center gap-1 text-[14px] font-medium text-pine-2">
                          <ArrowUpRight aria-hidden className="size-3.5" />
                          출처 {host}
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-10 rounded-[1.5rem] border border-dashed border-leaf/40 bg-white/60 px-6 py-14 text-center text-[16px] text-muted-ink">
            아직 게시된 글이 없습니다.
          </p>
        )}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} hrefFor={(n) => boardPath(section, n)} />}
      </section>

      <div className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-6 sm:pb-28 lg:px-10">
        <ConsultCTA />
      </div>
    </>
  );
}
