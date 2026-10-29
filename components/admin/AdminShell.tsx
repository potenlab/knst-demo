import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

/** Pine top bar + page container for every signed-in admin page. */
export default function AdminShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  const width = wide ? "max-w-[1440px]" : "max-w-[1180px]";
  return (
    <>
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-full bg-white font-semibold text-pine shadow-lg focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:px-5 focus-visible:py-2.5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-glow"
      >
        본문으로 건너뛰기
      </a>
      <header className="sticky top-0 z-40 bg-pine text-white shadow-[0_12px_30px_-24px_rgba(0,0,0,.8)]">
        <div className={`mx-auto flex h-16 ${width} items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-10`}>
          <Link
            href="/admin/"
            className="flex min-h-11 items-center gap-2.5 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-glow/60"
          >
            <span className="flex items-center rounded-full bg-white p-1 shadow-[0_8px_20px_-12px_rgba(0,0,0,.7)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo-white.webp" alt="(주)엔에스티" width={300} height={300} className="size-9 rounded-full object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-glow">NST CMS</span>
              <span className="font-display text-[17px] font-bold">관리자</span>
            </span>
          </Link>

          <nav aria-label="관리자 메뉴" className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/admin/"
              className="hidden min-h-11 items-center rounded-full px-3.5 text-[15px] font-semibold text-white/85 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-glow/60 sm:inline-flex"
            >
              글 목록
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-[15px] font-semibold text-white/85 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-glow/60"
            >
              사이트<span className="hidden sm:inline"> 보기</span>
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(새 탭)</span>
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-[15px] font-semibold text-white outline-none hover:border-white/50 hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-glow/60"
              >
                <LogOut aria-hidden className="size-4" />
                로그아웃
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="admin-main" className={`mx-auto w-full ${width} px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-10`}>
        {children}
      </main>
    </>
  );
}
