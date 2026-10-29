import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CardLead, Post } from "@/lib/db";
import { categoryLabel, postPathFor } from "@/lib/post-categories";
import { cn } from "@/lib/utils";
import { bodyText, firstImageSrc, formatDateShort, truncateText } from "@/app/blog/_lib/blog";

export type CardPost = Pick<Post, "slug" | "title" | "excerpt" | "cover_image" | "category" | "published_at"> & Partial<CardLead>;

/** Cover: explicit cover_image, else the first image in the post body. */
const cardCover = (p: CardPost) => p.cover_image || firstImageSrc(p.lead_img) || null;

/** Excerpt: explicit excerpt, else the opening of the post body as plain text. */
const cardExcerpt = (p: CardPost) =>
  p.excerpt ||
  (p.lead_html ? truncateText(p.lead_format === "md" ? bodyText(null, p.lead_html) : bodyText(p.lead_html), 140) : "");

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/* ------------------------------------------------------------------ */
/*  Generated cover — the "breath ring" motif, varied per slug          */
/* ------------------------------------------------------------------ */

const PALETTES = [
  {
    // deep pine, mint rings
    bg: (x: number, y: number) =>
      `radial-gradient(85% 95% at ${x}% ${y}%, #2f8f6b 0%, #14503f 42%, #0e3b32 78%)`,
    ring: (a: number) => `rgba(205,238,221,${a})`,
    core: "radial-gradient(closest-side, rgba(205,238,221,.95), rgba(205,238,221,.25) 70%, rgba(205,238,221,0))",
    label: "text-mint/85",
  },
  {
    // mint air, leaf rings
    bg: (x: number, y: number) =>
      `radial-gradient(80% 90% at ${x}% ${y}%, #ffffff 0%, #e6f6ed 38%, #cdeedd 80%)`,
    ring: (a: number) => `rgba(47,143,107,${a * 1.05})`,
    core: "radial-gradient(closest-side, rgba(47,143,107,.55), rgba(47,143,107,.12) 70%, rgba(47,143,107,0))",
    label: "text-pine-2",
  },
  {
    // paper air, pine rings + a cool blue breath
    bg: (x: number, y: number) =>
      `radial-gradient(70% 80% at ${x}% ${y}%, rgba(0,71,156,.10) 0%, rgba(0,71,156,0) 60%), linear-gradient(160deg, #f6faf7 0%, #e9f3ee 100%)`,
    ring: (a: number) => `rgba(14,59,50,${a * 0.8})`,
    core: "radial-gradient(closest-side, rgba(205,238,221,1), rgba(205,238,221,.4) 65%, rgba(205,238,221,0))",
    label: "text-pine-2",
  },
] as const;

const RING_SIZES = [26, 48, 74, 104, 140];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Decorative placeholder cover: concentric breath rings on a brand gradient. Deterministic per slug. */
export function BlogCover({ seed, label, className }: { seed: string; label?: string; className?: string }) {
  const h = hash(seed);
  const p = PALETTES[h % PALETTES.length];
  const x = 22 + ((h >>> 3) % 57); // 22–78 %
  const y = 30 + ((h >>> 9) % 41); // 30–70 %
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", className)} style={{ background: p.bg(x, y) }}>
      <div
        className={cn("absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]", EASE)}
        style={{ transformOrigin: `${x}% ${y}%` }}
      >
        <span
          className="absolute aspect-square w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${x}%`, top: `${y}%`, background: p.core }}
        />
        {RING_SIZES.map((s, i) => (
          <span
            key={s}
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, borderColor: p.ring(0.42 - i * 0.07) }}
          />
        ))}
      </div>
      {label && (
        <span
          className={cn(
            "absolute bottom-3.5 left-4 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] sm:bottom-4 sm:left-5",
            p.label,
          )}
        >
          <span className="relative inline-block size-2.5">
            <span className="absolute inset-0 rounded-full border border-current opacity-70" />
            <span className="absolute inset-[3px] rounded-full bg-current" />
          </span>
          {label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

export default function BlogCard({
  post,
  headingLevel = "h2",
  eager = false,
  fullPageNav = false,
}: {
  post: CardPost;
  headingLevel?: "h2" | "h3";
  /** First-row cards on /blog/: load the cover immediately. */
  eager?: boolean;
  /** Plain <a> instead of next/link — use on the home page (see the note in components/Header.tsx). */
  fullPageNav?: boolean;
}) {
  const H = headingLevel;
  const PostLink = fullPageNav ? "a" : Link;
  const cover = cardCover(post);
  const excerpt = cardExcerpt(post);
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] bg-white/80 p-2 ring-1 ring-hairline",
        "transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_32px_60px_-38px_rgba(14,59,50,.6)] motion-reduce:hover:translate-y-0",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-trust",
        EASE,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.375rem] bg-mint">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={900}
            height={600}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={cn("absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]", EASE)}
          />
        ) : (
          <BlogCover seed={post.slug} label="NST공법" />
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px]">
          <span className="inline-flex items-center rounded-full bg-mint px-2.5 py-0.5 text-[13px] font-semibold text-pine">
            {categoryLabel(post.category)}
          </span>
          {post.published_at && (
            <time dateTime={post.published_at} className="tabular-nums text-muted-ink">
              {formatDateShort(post.published_at)}
            </time>
          )}
        </p>

        <H className="mt-3 text-pretty font-display text-[1.25rem] font-bold leading-[1.4] tracking-[-0.02em] text-ink sm:text-[1.3125rem]">
          <PostLink
            href={postPathFor(post.category, post.slug)}
            className="outline-none after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']"
          >
            {post.title}
          </PostLink>
        </H>

        {excerpt && <p className="mt-2.5 line-clamp-3 text-pretty text-[15.5px] leading-[1.7] text-muted-ink">{excerpt}</p>}

        <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-trust">
          읽기
          <ArrowRight className={cn("size-4 transition-transform duration-300 group-hover:translate-x-1", EASE)} />
        </span>
      </div>
    </article>
  );
}
