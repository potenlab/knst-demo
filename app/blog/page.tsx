import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { ArrowRight, Phone, Rss } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { countPublished, listCategories, listPublished } from "@/lib/db";
import { BLOG_CATEGORIES, CATEGORY_LABEL, CATEGORY_SECTION, isBlogCategory, toCategory } from "@/lib/post-categories";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import BlogBackdrop from "./_components/BlogBackdrop";
import Breadcrumbs from "./_components/Breadcrumbs";
import ConsultCTA from "./_components/ConsultCTA";
import Pagination from "./_components/Pagination";
import {
  BLOG_DESCRIPTION,
  BLOG_PATH,
  BLOG_TITLE,
  DEFAULT_OG_IMAGE,
  LD_ID,
  LD_ORG,
  LD_SITE,
  PAGE_SIZE,
  RSS_ALTERNATE,
  RSS_PATH,
  categoryPath,
  jsonLd,
  pageParam,
  postUrlFor,
} from "./_lib/blog";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

type BlogTab = (typeof BLOG_CATEGORIES)[number];

/**
 * `?category=` takes a key (column | guide) or its Korean label (old links used ?category=칼럼).
 * 공지사항 / 언론동향 have their own sections; anything else is not a page. Pure — the page acts on
 * `redirect` / `invalid` (generateMetadata only reads it).
 */
function parseQuery(sp: Awaited<SearchParams>) {
  const raw = (Array.isArray(sp.category) ? sp.category[0] : sp.category)?.trim().slice(0, 40) || undefined;
  const key = toCategory(raw);
  const page = pageParam(sp.page);
  const category: BlogTab | undefined = key && isBlogCategory(key) ? key : undefined;
  const invalid = !!raw && !key;
  const redirect =
    key && !isBlogCategory(key)
      ? CATEGORY_SECTION[key]
      : raw && category && raw !== category
        ? categoryPath(category, page) // a label spelling (?category=칼럼) → the canonical key
        : undefined;
  return { category, page, invalid, redirect };
}

/** Deduped between generateMetadata and the page within one request. "All" = every blog category. */
const countFor = cache((category?: BlogTab) => countPublished(category ?? BLOG_CATEGORIES));

function titleFor(category: BlogTab | undefined, page: number) {
  const base = category ? `${CATEGORY_LABEL[category]} · 블로그` : BLOG_TITLE;
  return page > 1 ? `${base} (${page}페이지)` : base;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category, page } = parseQuery(await searchParams);
  const total = await countFor(category);
  const title = titleFor(category, page);
  const canonical = categoryPath(category, page);
  return {
    title,
    description: BLOG_DESCRIPTION,
    alternates: { canonical, types: RSS_ALTERNATE },
    // empty filtered views shouldn't be indexed; links on them still count
    robots: total === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: canonical,
      siteName: "(주)엔에스티 NST공법",
      title: `${title} | (주)엔에스티`,
      description: BLOG_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: `${title} | (주)엔에스티`, description: BLOG_DESCRIPTION },
  };
}

export default async function BlogIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, page, invalid, redirect } = parseQuery(await searchParams);
  if (invalid) notFound();
  if (redirect) permanentRedirect(redirect);
  const [total, allTotal, perCategory] = await Promise.all([countFor(category), countFor(undefined), listCategories()]);
  const tabs = BLOG_CATEGORIES.map((c) => ({ key: c, n: perCategory.find((r) => r.category === c)?.n ?? 0 }));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) notFound();
  const offset = (page - 1) * PAGE_SIZE;
  const posts = total ? await listPublished({ limit: PAGE_SIZE, offset, category: category ?? BLOG_CATEGORIES }) : [];

  const pageUrl = `${SITE.url}${categoryPath(category, page)}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      LD_ORG,
      LD_SITE,
      {
        "@type": "Blog",
        "@id": LD_ID.blog,
        url: `${SITE.url}${BLOG_PATH}`,
        name: "(주)엔에스티 블로그",
        description: BLOG_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": LD_ID.org },
        isPartOf: { "@id": LD_ID.site },
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: titleFor(category, page),
        description: BLOG_DESCRIPTION,
        inLanguage: "ko-KR",
        isPartOf: { "@id": LD_ID.site },
        about: { "@id": LD_ID.blog },
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
          { "@type": "ListItem", position: 2, name: "블로그", item: `${SITE.url}${BLOG_PATH}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      {/* ── Editorial header ─────────────────────────────────────────── */}
      <section aria-labelledby="blog-title" className="grain relative isolate overflow-hidden">
        <BlogBackdrop />
        <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
          <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "블로그" }]} />

          <div className="mt-6 grid gap-8 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h1 id="blog-title" className="font-display tracking-[-0.03em] text-pine lg:col-span-7">
              <span className="inline-flex items-center gap-2.5 text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] font-bold text-pine-2">
                <span aria-hidden className="relative inline-block size-3.5">
                  <span className="absolute inset-0 rounded-full border border-leaf" />
                  <span className="absolute inset-[4px] rounded-full bg-leaf" />
                </span>
                블로그
              </span>
              <span className="mt-3 block text-[clamp(1.9rem,1.2rem+2vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">
                새집증후군{" "}
                <span className="bg-[linear-gradient(transparent_62%,#cdeedd_62%,#cdeedd_92%,transparent_92%)] box-decoration-clone">
                  {category === "guide" ? "가이드" : category === "column" ? "칼럼" : "칼럼·가이드"}
                </span>
              </span>
            </h1>

            <div className="border-t border-hairline pt-6 lg:col-span-5 lg:mb-2">
              <p className="max-w-[34rem] text-pretty text-[17px] leading-[1.75] text-muted-ink sm:text-[18px]">
                원인부터 공법, 업체를 고르는 기준까지. <span className="whitespace-nowrap">(주)엔에스티가</span> 직접 쓴
                새집증후군 칼럼과 실내공기질 가이드를 모았습니다.
              </p>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
                <span className="text-ink">
                  게시된 글 <strong className="font-display text-[1.25rem] font-extrabold tabular-nums text-pine">{allTotal}</strong>편
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

      {/* ── Filter + grid ─────────────────────────────────────────────── */}
      <section aria-labelledby="blog-list-title" className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10">
        <h2 id="blog-list-title" className="sr-only">
          {category ? `‘${CATEGORY_LABEL[category]}’ 분류 글 목록` : "전체 글 목록"}
        </h2>

        <div className="flex flex-col gap-4 border-b-2 border-pine pb-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="분류">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Chip href={BLOG_PATH} active={!category} label="전체" count={allTotal} />
              </li>
              {tabs.map((t) => (
                <li key={t.key}>
                  <Chip href={categoryPath(t.key)} active={category === t.key} label={CATEGORY_LABEL[t.key]} count={t.n} />
                </li>
              ))}
            </ul>
          </nav>
          {total > 0 && (
            <p className="text-[15px] text-muted-ink">
              {totalPages > 1 ? (
                <>
                  <span className="tabular-nums">{offset + 1}–{offset + posts.length}</span> / 총{" "}
                </>
              ) : (
                "총 "
              )}
              <strong className="font-semibold tabular-nums text-ink">{total}</strong>편
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <>
            <ul role="list" className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-9">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <BlogCard post={p} headingLevel="h3" eager={i < 3} />
                </li>
              ))}
            </ul>
            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} hrefFor={(n) => categoryPath(category, n)} />}
          </>
        ) : (
          <EmptyState category={category} />
        )}
      </section>

      <div className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-6 sm:pb-28 lg:px-10">
        <ConsultCTA />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Chip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold outline-none transition-colors duration-300",
        "focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2 focus-visible:ring-offset-air",
        active ? "border-pine bg-pine text-white" : "border-hairline bg-white/70 text-ink hover:border-pine/50",
        EASE,
      )}
    >
      {label}
      <span className={cn("text-[13px] font-medium tabular-nums", active ? "text-mint" : "text-muted-ink")}>{count}</span>
    </Link>
  );
}

function EmptyState({ category }: { category?: BlogTab }) {
  return (
    <div className="relative isolate mt-10 overflow-hidden rounded-[2rem] border border-dashed border-leaf/40 bg-white/60 px-6 py-16 text-center sm:mt-12 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2">
        {[0, 14, 28, 42].map((inset, i) => (
          <span
            key={inset}
            className="absolute rounded-full border motion-safe:animate-[breathe_9s_cubic-bezier(.4,0,.2,1)_infinite]"
            style={{ inset: `${inset}%`, borderColor: `rgba(47,143,107,${0.1 + i * 0.05})`, animationDelay: `${-i * 1.5}s` }}
          />
        ))}
      </div>
      <h3 className="text-pretty font-display text-[1.5rem] font-bold leading-[1.35] tracking-[-0.02em] text-pine sm:text-[1.75rem]">
        {category ? `‘${CATEGORY_LABEL[category]}’ 분류에는 아직 글이 없습니다` : "아직 게시된 글이 없습니다"}
      </h3>
      <p className="mx-auto mt-3 max-w-[30rem] text-pretty text-[16px] leading-[1.75] text-muted-ink">
        {category ? "전체 글에서 다른 칼럼을 찾아보세요." : "새 칼럼을 준비하고 있습니다."} 시공 일정이 급하다면 전화로 바로
        물어보셔도 됩니다.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={category ? BLOG_PATH : "/"}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-action px-6 text-[16px] font-bold text-white outline-none transition-colors hover:bg-action-hover focus-visible:ring-3 focus-visible:ring-trust/40"
        >
          {category ? "전체 글 보기" : "홈으로 가기"}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
        <a
          href="tel:0432222322"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-pine/20 bg-white/80 px-6 text-[16px] font-semibold text-pine outline-none hover:border-pine/40 focus-visible:ring-3 focus-visible:ring-trust/40"
        >
          <Phone aria-hidden className="size-4 text-leaf" />
          <span className="tabular-nums">043-222-2322</span>
        </a>
      </div>
    </div>
  );
}
