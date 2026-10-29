import { ArrowRight } from "lucide-react";
import BlogCard, { type CardPost } from "@/components/BlogCard";
import { BLOG_PATH } from "@/app/blog/_lib/blog";
import { listPublished } from "@/lib/db";
import { BLOG_CATEGORIES } from "@/lib/post-categories";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/**
 * Home: the 3 newest published blog posts (칼럼·가이드; 공지사항/언론동향 have their own pages).
 * Renders nothing if the DB is empty or unavailable.
 * Links are plain <a> (full page load) on purpose — see the note in components/Header.tsx.
 */
export default async function LatestPosts() {
  let posts: CardPost[] = [];
  try {
    posts = await listPublished({ limit: 3, category: BLOG_CATEGORIES });
  } catch {
    return null;
  }
  if (!posts.length) return null;

  return (
    <section
      id="latest"
      aria-labelledby="latest-title"
      className="relative isolate overflow-clip border-t border-hairline bg-[linear-gradient(180deg,#eef8f2_0%,#f6faf7_100%)]"
    >
      {/* faint breath rings, bottom-left */}
      <div aria-hidden className="pointer-events-none absolute -bottom-56 -left-48 -z-10 size-[36rem]">
        {[0, 14, 28].map((inset) => (
          <span key={inset} className="absolute rounded-full border border-leaf/[0.13]" style={{ inset: `${inset}%` }} />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2.5 text-[0.875rem] font-semibold tracking-[0.08em] text-pine-2">
              <span aria-hidden className="relative inline-block size-3.5">
                <span className="absolute inset-0 rounded-full border border-leaf" />
                <span className="absolute inset-[4px] rounded-full bg-leaf" />
              </span>
              블로그
            </p>
            <h2
              id="latest-title"
              className="mt-4 font-display text-[clamp(1.75rem,1.25rem+1.7vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pine"
            >
              최신 글
            </h2>
          </div>
          <a
            href={BLOG_PATH}
            className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-pine/20 bg-white/70 px-5 text-[15px] font-semibold text-pine outline-none transition-colors duration-300 hover:border-pine/40 hover:bg-white focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2 focus-visible:ring-offset-air sm:self-auto"
          >
            블로그 전체 보기
            <ArrowRight aria-hidden className={`size-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`} />
          </a>
        </div>

        <ul role="list" className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {posts.map((p, i) => (
            <li key={p.slug} className={i === 2 ? "sm:max-lg:hidden" : undefined}>
              <BlogCard post={p} headingLevel="h3" fullPageNav />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
