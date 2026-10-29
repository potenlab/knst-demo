"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { KakaoSymbol } from "@/components/KakaoFloat";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { PAGE_GROUPS, samePath } from "@/lib/static-pages";
import { cn } from "@/lib/utils";

/** Home-page sections (scroll-spied on "/", linked as "/#id" from other pages). */
const NAV = [
  { id: "method", label: "공법" },
  { id: "steps", label: "시공 단계" },
  { id: "proof", label: "실적·증빙" },
  { id: "faq", label: "자주 묻는 질문" },
  { id: "partner", label: "파트너 모집" },
] as const;

const BLOG = { href: "/blog/", label: "블로그" } as const;

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/*
 * Leaving "/" uses a full page load, not next/link. (History: a section with id="process" used to shadow
 * `window.process` via named element access and crashed vinext's client navigation — the id is now
 * "steps". Plain anchors are kept anyway: they are simple and crawl-friendly.)
 */
type NavItem = { key: string; label: string; href: string; active: boolean; route: boolean };

/** Section roots whose sub-pages (e.g. /notices/12/) still count as "inside" that link. */
const isInside = (href: string, pathname: string) =>
  !href.includes("#") && (samePath(href, pathname) || (href !== "/" && pathname.startsWith(href.replace(/\/?$/, "/"))));

/**
 * Announcement strip + sticky site header.
 * Renders a fragment: place <Header /> as a direct child of <body>/<main>'s top level
 * (not inside a short wrapper) so the sticky header stays pinned for the whole page.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [sheetTop, setSheetTop] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // same-page anchors on the home page, "/#id" everywhere else
  const pathname = usePathname() ?? "/";
  const onHome = pathname === "/";
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const anchor = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const sections: NavItem[] = NAV.map((n) => ({ key: n.id, label: n.label, href: anchor(n.id), active: active === n.id, route: false }));
  const items: NavItem[] = [...sections, { key: "blog", label: BLOG.label, href: BLOG.href, active: onBlog, route: true }];
  // "더보기" lights up on any static page / board it lists (the blog keeps its own top-level link)
  const moreActive = PAGE_GROUPS.some((g) => g.links.some((l) => l.href !== BLOG.href && isInside(l.href, pathname)));

  // close the "더보기" panel on navigation, outside press and Esc
  useEffect(() => setMoreOpen(false), [pathname]);
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
        moreBtnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  // transparent → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the section crossing the middle of the viewport (home page only)
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const ids = ["top", ...NAV.map((n) => n.id)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  const close = useCallback((restoreFocus = false) => {
    document.documentElement.style.overflow = "";
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // mobile sheet: scroll lock, Esc, focus trap, focus first link
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    document.documentElement.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !header) return;
      const focusables = Array.from(
        header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) close();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  const openMenu = () => {
    setSheetTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setOpen(true);
  };

  const solid = scrolled || open;

  return (
    <>
      {/* ── Announcement strip ── */}
      <a
        href={anchor("partner")}
        className="group flex min-h-11 items-center justify-center gap-x-2.5 bg-pine px-4 py-2 text-center text-[13px] leading-snug text-white/90 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mint sm:text-[14px]"
      >
        <span aria-hidden="true" className="relative hidden size-2 shrink-0 sm:inline-flex">
          <span className="absolute inset-0 animate-ping rounded-full bg-glow/70" />
          <span className="relative size-2 rounded-full bg-glow" />
        </span>
        {/* old hero notice, verbatim */}
        <span>
          <strong className="font-semibold text-white">★2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집中</strong>{" "}
          <span className="text-mint">(많은 관심 바랍니다.)</span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className={cn("size-4 shrink-0 text-mint transition-transform duration-300 group-hover:translate-x-1", EASE)}
        />
      </a>

      {/* ── Sticky header ── */}
      <header ref={headerRef} className="sticky top-0 z-50 isolate">
        {/* background layer (kept off <header> so the fixed sheet isn't trapped by backdrop-filter) */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
            EASE,
            solid
              ? "border-hairline/90 bg-air/80 shadow-[0_10px_30px_-22px_rgba(14,59,50,.45)] backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        />

        <div className="relative mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-10">
          {/* logo */}
          <a
            href={onHome ? "#top" : "/"}
            onClick={() => open && close()}
            className="-ml-1 flex shrink-0 items-center rounded-xl p-1 outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo-color.webp"
              alt="(주)엔에스티 NST"
              width={500}
              height={336}
              className={cn(
                "h-11 w-auto origin-left animate-in fade-in slide-in-from-left-3 zoom-in-95 duration-700 fill-mode-both lg:h-14",
                "transition-transform",
                EASE,
                scrolled && "lg:scale-[.92]",
              )}
            />
          </a>

          {/* desktop nav */}
          <nav
            ref={navRef}
            aria-label="주요 메뉴"
            onBlur={(e) => {
              if (moreOpen && !e.currentTarget.contains(e.relatedTarget as Node | null)) setMoreOpen(false);
            }}
            className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <ul className="flex items-center gap-0.5">
              {items.map((n) => {
                const Anchor = n.route && !onHome ? Link : "a";
                return (
                  <li key={n.key}>
                    <Anchor
                      href={n.href}
                      aria-current={n.active ? (n.route ? "page" : "true") : undefined}
                      className={cn(
                        "relative inline-flex h-11 items-center rounded-full px-3 text-[15.5px] font-semibold tracking-[-0.01em] outline-none transition-colors duration-300 xl:px-3.5",
                        "hover:bg-pine/[.06] hover:text-pine focus-visible:ring-3 focus-visible:ring-trust/40",
                        "after:absolute after:bottom-1.5 after:left-1/2 after:size-[5px] after:-translate-x-1/2 after:rounded-full after:bg-leaf after:transition-[opacity,scale] after:duration-300",
                        n.active ? "text-pine after:scale-100 after:opacity-100" : "text-ink/70 after:scale-0 after:opacity-0",
                      )}
                    >
                      {n.label}
                    </Anchor>
                  </li>
                );
              })}
              <li>
                <button
                  ref={moreBtnRef}
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="nav-more"
                  onClick={() => setMoreOpen((o) => !o)}
                  className={cn(
                    "relative inline-flex h-11 items-center gap-1 rounded-full px-3 text-[15.5px] font-semibold tracking-[-0.01em] outline-none transition-colors duration-300 xl:px-3.5",
                    "hover:bg-pine/[.06] hover:text-pine focus-visible:ring-3 focus-visible:ring-trust/40 aria-expanded:bg-pine/[.06] aria-expanded:text-pine",
                    "after:absolute after:bottom-1.5 after:left-[calc(50%-7px)] after:size-[5px] after:-translate-x-1/2 after:rounded-full after:bg-leaf after:transition-[opacity,scale] after:duration-300",
                    moreActive ? "text-pine after:scale-100 after:opacity-100" : "text-ink/70 after:scale-0 after:opacity-0",
                  )}
                >
                  더보기
                  <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300", EASE, moreOpen && "rotate-180")} />
                </button>
              </li>
            </ul>

            {moreOpen && (
              <div
                id="nav-more"
                className="absolute left-1/2 top-full mt-3 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.5rem] bg-white/95 p-6 shadow-[0_30px_60px_-30px_rgba(14,59,50,.45)] ring-1 ring-hairline backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <div className="grid grid-cols-5 gap-x-5">
                  {PAGE_GROUPS.map((g) => (
                    <div key={g.label}>
                      <p className="text-[12.5px] font-bold tracking-[0.08em] text-leaf">{g.label}</p>
                      <ul className="mt-2">
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <a
                              href={l.href}
                              onClick={() => setMoreOpen(false)}
                              aria-current={samePath(l.href, pathname) && !l.href.includes("#") ? "page" : undefined}
                              className={cn(
                                "-mx-2 flex min-h-10 items-center rounded-lg px-2 text-[15px] leading-snug text-ink/80 outline-none transition-colors hover:bg-mint/50 hover:text-pine focus-visible:ring-2 focus-visible:ring-trust/50 aria-[current=page]:font-bold aria-[current=page]:text-pine",
                                l.mono && "font-mono text-[14px]",
                              )}
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="tel:043-222-2322"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-[15px] font-semibold tabular-nums text-pine outline-none transition-colors hover:bg-pine/[.06] focus-visible:ring-3 focus-visible:ring-trust/40 xl:inline-flex"
            >
              <Phone aria-hidden="true" className="size-4 text-leaf" />
              043-222-2322
            </a>
            <a
              href={anchor("contact")}
              onClick={() => open && close()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-action px-5 text-[15px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(0,71,156,.55)] transition-[translate,box-shadow,background-color] duration-300",
                "hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-[0_16px_30px_-14px_rgba(0,71,156,.7)] focus-visible:ring-ink/30",
                EASE,
              )}
            >
              무료 상담
            </a>

            {/* hamburger */}
            <Button
              ref={toggleRef}
              type="button"
              variant="ghost"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => (open ? close() : openMenu())}
              className="relative size-11 rounded-full border border-pine/15 bg-white/60 p-0 text-pine backdrop-blur hover:bg-white lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-3 w-[18px]">
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-full rounded-full bg-current transition-[top,rotate] duration-300",
                    EASE,
                    open ? "top-[5px] rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[2px] rounded-full bg-current transition-[top,rotate,width] duration-300",
                    EASE,
                    open ? "top-[5px] w-full -rotate-45" : "top-[10px] w-[70%]",
                  )}
                />
              </span>
            </Button>
          </div>
        </div>

        {/* ── Mobile sheet ── */}
        <div
          id="mobile-menu"
          ref={sheetRef}
          inert={!open}
          style={{ top: sheetTop }}
          className={cn(
            "grain fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain bg-air transition-[opacity,translate,visibility] duration-300 lg:hidden",
            EASE,
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
          )}
        >
          {/* breath rings, decorative */}
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-40 size-[28rem]">
            {[100, 76, 52].map((s) => (
              <span
                key={s}
                className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-leaf/20"
                style={{ width: `${s}%` }}
              />
            ))}
          </div>

          <nav aria-label="모바일 메뉴" className="relative px-4 pb-10 pt-1 sm:px-6">
            <p className="pt-3 text-[13px] font-bold tracking-[0.08em] text-leaf">NST공법 한눈에</p>
            <ul>
              {sections.map((n) => (
                <li key={n.key} className="border-b border-hairline">
                  <a
                    href={n.href}
                    onClick={() => close()}
                    aria-current={n.active ? "true" : undefined}
                    className="group flex min-h-14 items-center justify-between gap-4 py-2.5 font-display text-[1.375rem] font-bold tracking-[-0.03em] text-pine outline-none focus-visible:bg-mint/40 aria-[current=true]:text-leaf"
                  >
                    {n.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-leaf transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>

            {PAGE_GROUPS.map((g) => (
              <div key={g.label} className="mt-7">
                <p className="text-[13px] font-bold tracking-[0.08em] text-leaf">{g.label}</p>
                <ul className="mt-1 grid grid-cols-2 gap-x-4">
                  {g.links.map((l) => (
                    <li key={l.href} className="border-b border-hairline">
                      <a
                        href={l.href}
                        onClick={() => close()}
                        aria-current={samePath(l.href, pathname) && !l.href.includes("#") ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center py-2 text-[16.5px] font-semibold leading-snug text-pine outline-none focus-visible:bg-mint/40 aria-[current=page]:text-leaf",
                          l.mono && "font-mono text-[15px] font-medium",
                        )}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <a
              href={anchor("contact")}
              onClick={() => close()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-14 w-full justify-between rounded-full bg-action pl-7 pr-2 text-[17px] font-bold text-white hover:bg-action-hover",
              )}
            >
              무료 상담 신청
              <span className="grid size-10 place-items-center rounded-full bg-white text-action">
                <ArrowRight aria-hidden="true" className="size-5" />
              </span>
            </a>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {[
                { href: "tel:043-222-2322", label: "043-222-2322" },
                { href: "tel:070-4270-7346", label: "070-4270-7346" },
              ].map((t) => (
                <a
                  key={t.href}
                  href={t.href}
                  onClick={() => close()}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-hairline bg-white/70 text-[15px] font-semibold tabular-nums text-pine outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
                >
                  <Phone aria-hidden="true" className="size-4 text-leaf" />
                  {t.label}
                </a>
              ))}
            </div>
            <a
              href={SITE.kakao}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => close()}
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#FEE500] text-[15px] font-semibold text-[#191919] outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
            >
              <KakaoSymbol className="size-[18px]" />
              카카오톡 상담
              <span className="sr-only">(새 창)</span>
            </a>
            <p className="mt-6 text-[14px] leading-relaxed text-muted-ink">
              ★2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집中 (많은 관심 바랍니다.)
            </p>
          </nav>
        </div>
      </header>
    </>
  );
}
