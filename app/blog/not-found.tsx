import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogBackdrop from "./_components/BlogBackdrop";

/** Rendered inside app/blog/layout.tsx when a page calls notFound() (missing slug, draft, page out of range). */
export default function BlogNotFound() {
  return (
    <section aria-labelledby="nf-title" className="grain relative isolate overflow-hidden">
      <BlogBackdrop />
      <div className="mx-auto flex min-h-[60svh] max-w-[760px] flex-col justify-center px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-display text-[15px] font-bold tracking-[0.08em] text-pine-2">404</p>
        <h1
          id="nf-title"
          className="mt-3 text-pretty font-display text-[clamp(1.75rem,1.3rem+2vw,2.5rem)] font-extrabold leading-[1.2] tracking-[-0.035em] text-pine"
        >
          글을 찾을 수 없습니다
        </h1>
        <p className="mt-5 max-w-[32rem] text-pretty text-[17px] leading-[1.75] text-muted-ink">
          주소가 바뀌었거나 아직 공개되지 않은 글입니다. 블로그 목록에서 다른 칼럼을 찾아보세요.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/blog/"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-action px-7 text-[16px] font-bold text-white outline-none transition-colors hover:bg-action-hover focus-visible:ring-3 focus-visible:ring-trust/40"
          >
            블로그 목록으로
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-13 items-center justify-center rounded-full border border-pine/20 bg-white/70 px-7 text-[16px] font-semibold text-pine outline-none hover:border-pine/40 focus-visible:ring-3 focus-visible:ring-trust/40"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </section>
  );
}
