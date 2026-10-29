import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import PostBody from "@/components/PostBody";
import { listPublished, type Post } from "@/lib/db";
import { CATEGORY_LABEL, isBlogCategory, postPathFor } from "@/lib/post-categories";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import BlogBackdrop from "./BlogBackdrop";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import ConsultCTA from "./ConsultCTA";
import {
  BLOG_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  LD_ID,
  LD_ORG,
  LD_SITE,
  RSS_ALTERNATE,
  absUrl,
  allImageSrcs,
  bodyText,
  categoryPath,
  differentDay,
  firstImageSrc,
  formatDate,
  formatDateShort,
  hostOf,
  jsonLd,
  postUrlFor,
  readingMinutes,
  sectionOf,
  truncateText,
} from "../_lib/blog";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/** vinext hands dynamic params over still percent-encoded; Hangul slugs must be decoded before the lookup. */
export const decodeSlug = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** Derived from the body (HTML first, legacy markdown fallback): text, description, lead image, reading time. */
export function postFacts(post: Post) {
  const text = bodyText(post.content_html, post.content_md);
  const image = post.cover_image || firstImageSrc(post.content_html);
  return {
    text,
    description: post.excerpt || (text ? truncateText(text, 155) : BLOG_DESCRIPTION),
    image,
    minutes: readingMinutes(text),
  };
}

/** Metadata for any post page (/blog/…, /notices/…, /news/…). */
export function postMetadata(post: Post | null | undefined): Metadata {
  if (!post) return { title: "글을 찾을 수 없습니다", robots: { index: false, follow: true } };
  const path = postPathFor(post.category, post.slug);
  const { description, image } = postFacts(post);
  const images = image ? [{ url: absUrl(image), alt: post.title }] : [DEFAULT_OG_IMAGE];
  return {
    title: post.title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: path,
      siteName: "(주)엔에스티 NST공법",
      title: post.title,
      description,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      section: CATEGORY_LABEL[post.category] ?? post.category,
      images,
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: images.map((i) => i.url) },
  };
}

/** Other posts to show under this one: same category first, topped up from the same section. */
async function relatedPosts(post: Post, count: number) {
  const section = sectionOf(post.category);
  const same = await listPublished({ limit: count + 1, category: post.category });
  let related = same.filter((p) => p.slug !== post.slug).slice(0, count);
  if (related.length < count && section.categories.length > 1) {
    const more = await listPublished({ limit: count + 3, category: section.categories });
    const seen = new Set([post.slug, ...related.map((p) => p.slug)]);
    related = [...related, ...more.filter((p) => !seen.has(p.slug))].slice(0, count);
  }
  return related;
}

/**
 * One published post in the site design: header, body, consultation block, related posts, and
 * JSON-LD (BlogPosting for blog/공지사항, NewsArticle for 언론동향, plus WebPage and BreadcrumbList).
 */
export default async function PostArticle({ post }: { post: Post }) {
  const section = sectionOf(post.category);
  const isBlog = section.key === "blog";
  const isNews = section.key === "news";
  const label = CATEGORY_LABEL[post.category] ?? post.category;
  const categoryHref = isBlogCategory(post.category) ? categoryPath(post.category) : section.path;

  const related = await relatedPosts(post, isBlog ? 3 : 5);

  const url = postUrlFor(post.category, post.slug);
  const sectionUrl = `${SITE.url}${section.path}`;
  const updated = differentDay(post.published_at, post.updated_at);
  const { text, image, minutes } = postFacts(post);
  // the seeded columns open with their excerpt; don't print it twice
  const showDek = isBlog && !!post.excerpt && !text.startsWith(bodyText(null, post.excerpt));
  // cover_image is usually the body's first image (it's what the list cards show) — then the body shows it, not the hero
  const heroCover = post.cover_image && !allImageSrcs(post.content_html).includes(post.cover_image) ? post.cover_image : null;
  const sourceHost = hostOf(post.source_url);

  const crumbs: Crumb[] = [{ label: "홈", href: "/" }, { label: section.label, href: section.path }];
  if (isBlog) crumbs.push({ label, href: categoryHref });

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      LD_ORG,
      LD_SITE,
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: post.title,
        inLanguage: "ko-KR",
        isPartOf: { "@id": LD_ID.site },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": section.ldType,
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt || (text ? truncateText(text, 155) : undefined),
        ...(text ? { articleBody: truncateText(text, 500), wordCount: text.split(/\s+/).length } : {}),
        timeRequired: `PT${minutes}M`,
        url,
        mainEntityOfPage: { "@id": url },
        datePublished: post.published_at ?? post.created_at,
        dateModified: post.updated_at,
        author: { "@id": LD_ID.org },
        publisher: { "@id": LD_ID.org },
        image: absUrl(image ?? DEFAULT_OG_IMAGE.url),
        articleSection: label,
        inLanguage: "ko-KR",
        isPartOf: isBlog
          ? { "@type": "Blog", "@id": LD_ID.blog, name: "(주)엔에스티 블로그", url: sectionUrl }
          : { "@type": "CollectionPage", "@id": `${sectionUrl}#webpage`, name: section.label, url: sectionUrl },
        ...(post.source_url ? { isBasedOn: post.source_url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: section.label, item: sectionUrl },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  const sourceLabel = isNews ? "기사 원문 보기" : "원문 보기";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <article aria-labelledby="post-title">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="grain relative isolate overflow-hidden">
          <BlogBackdrop />
          <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10 lg:pt-10">
            <div className="mx-auto max-w-[720px]">
              <Breadcrumbs items={crumbs} />

              <h1
                id="post-title"
                className="mt-5 text-pretty font-display text-[clamp(1.625rem,1.2rem+1.8vw,2.25rem)] font-extrabold leading-[1.28] tracking-[-0.03em] text-pine sm:mt-7"
              >
                {post.title}
              </h1>

              {showDek && (
                <p className="mt-5 text-pretty text-[18px] leading-[1.7] text-ink/80 sm:text-[19px]">{post.excerpt}</p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-hairline py-3 text-[15px] text-muted-ink">
                <Link
                  href={categoryHref}
                  className="group inline-flex min-h-11 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-trust"
                >
                  <span className="rounded-full bg-mint px-3 py-1 text-[14px] font-semibold text-pine transition-colors group-hover:bg-pine group-hover:text-white">
                    {label}
                  </span>
                </Link>
                {post.published_at && (
                  <span>
                    <span className="sr-only">게시일 </span>
                    <time dateTime={post.published_at} className="tabular-nums">
                      {formatDate(post.published_at)}
                    </time>
                  </span>
                )}
                {updated && (
                  <span>
                    수정{" "}
                    <time dateTime={post.updated_at} className="tabular-nums">
                      {formatDate(post.updated_at)}
                    </time>
                  </span>
                )}
                {isBlog && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden className="size-4 text-leaf" />
                    <span className="tabular-nums">{minutes}분</span> 읽기
                  </span>
                )}
                {post.source_url && (
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener"
                    className="group inline-flex min-h-11 items-center gap-1 rounded-md font-semibold text-trust underline decoration-trust/30 underline-offset-[5px] outline-none hover:decoration-trust focus-visible:ring-2 focus-visible:ring-trust sm:ml-auto"
                  >
                    {sourceLabel}
                    <ArrowUpRight
                      aria-hidden
                      className={cn("size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", EASE)}
                    />
                    <span className="sr-only">({sourceHost ?? "외부 사이트"}, 새 창에서 열림)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {heroCover && (
          <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroCover}
              alt=""
              width={900}
              height={600}
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/9] w-full rounded-[1.75rem] object-cover shadow-[0_40px_80px_-50px_rgba(14,59,50,.6)] ring-1 ring-hairline sm:rounded-[2rem]"
            />
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-[768px] px-4 pb-12 pt-10 sm:px-6 sm:pt-12">
          <PostBody html={post.content_html} markdown={post.content_md} />

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6">
            <Link
              href={section.path}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full pr-2 text-[15px] font-semibold text-pine outline-none focus-visible:ring-2 focus-visible:ring-trust"
            >
              <ArrowLeft aria-hidden className={cn("size-4 transition-transform duration-300 group-hover:-translate-x-1", EASE)} />
              {section.backLabel}
            </Link>
            {post.source_url && (
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-[15px] font-semibold text-trust underline decoration-trust/30 underline-offset-[5px] outline-none hover:decoration-trust focus-visible:ring-2 focus-visible:ring-trust"
              >
                {sourceHost ? `${sourceHost}에서 ${isNews ? "기사" : "원문"} 읽기` : sourceLabel}
                <ArrowUpRight aria-hidden className="size-4" />
                <span className="sr-only">(새 창에서 열림)</span>
              </a>
            )}
          </div>
        </div>
      </article>

      {/* ── Consult ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1100px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <ConsultCTA />
      </div>

      {/* ── Related ───────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-hairline bg-[linear-gradient(180deg,#eef8f2,#f6faf7)]">
          <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 border-pine pb-4">
              <h2
                id="related-title"
                className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-pine"
              >
                {section.relatedTitle}
              </h2>
              <Link
                href={section.path}
                className="group inline-flex min-h-11 items-center gap-1.5 rounded-md text-[16px] font-semibold text-trust outline-none focus-visible:ring-2 focus-visible:ring-trust"
              >
                {section.label} 전체 보기
                <ArrowRight aria-hidden className={cn("size-4 transition-transform duration-300 group-hover:translate-x-1", EASE)} />
              </Link>
            </div>
            {isBlog ? (
              <ul role="list" className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {related.map((p) => (
                  // 2-column tablet grid: show two so the row stays even
                  <li key={p.slug} className={related.length === 3 ? "sm:max-lg:last:hidden" : undefined}>
                    <BlogCard post={p} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul role="list" className="mt-4 divide-y divide-hairline">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={postPathFor(p.category, p.slug)}
                      className="group flex min-h-14 flex-col gap-1 rounded-xl px-1 py-4 outline-none focus-visible:ring-2 focus-visible:ring-trust sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <span className="text-pretty text-[16.5px] font-semibold leading-snug text-ink group-hover:text-trust group-hover:underline group-hover:underline-offset-4">
                        {p.title}
                      </span>
                      {p.published_at && (
                        <time dateTime={p.published_at} className="shrink-0 text-[14px] tabular-nums text-muted-ink">
                          {formatDateShort(p.published_at)}
                        </time>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </>
  );
}
