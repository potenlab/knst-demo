"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { KakaoSymbol } from "@/components/KakaoFloat";
import { Button, buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { samePath } from "@/lib/static-pages";
import { cn } from "@/lib/utils";

type HeaderLink = { label: string; href: string };
type HeaderItem = HeaderLink & { children?: HeaderLink[] };

/** Original website menu order and labels, mapped to the redesigned pages. */
const NAV: HeaderItem[] = [
  { label: "회사소개", href: "/about/", children: [
    { label: "인사말", href: "/about/" },
    { label: "비전", href: "/about/#vision" },
    { label: "연혁", href: "/about/#history" },
    { label: "오시는 길", href: "/about/#directions" },
  ] },
  { label: "제품현황", href: "/products/" },
  { label: "기술현황", href: "/technology/" },
  { label: "시공업체", href: "/partners/" },
  { label: "공지사항", href: "/notices/" },
  { label: "언론동향", href: "/news/" },
  { label: "NST공법 칼럼", href: "/blog/" },
  { label: "고객지원", href: "/contact/", children: [
    { label: "자주묻는질문", href: "/faq/" },
    { label: "NST공법 자료실", href: "/blog/" },
    { label: "문의하기", href: "/contact/" },
  ] },
];

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

// Plain anchors use the site's public HTML page cache on navigation.

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
  const [sheetTop, setSheetTop] = useState(0);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const submenuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname() ?? "/";
  const isActive = (item: HeaderItem) => isInside(item.href, pathname) ||
    !!item.children?.some((link) => link.href !== "/blog/" && isInside(link.href, pathname));

  // Dismiss desktop dropdowns on navigation, outside press, and Escape.
  useEffect(() => setSubmenu(null), [pathname]);
  useEffect(() => {
    if (!submenu) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setSubmenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSubmenu(null);
        submenuButtonRefs.current[submenu]?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [submenu]);

  // transparent → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    let raf = requestAnimationFrame(() => {
      // Wait for the sheet's visibility transition to start before focusing it.
      raf = requestAnimationFrame(() => {
        sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
      });
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
      if (window.matchMedia("(min-width: 1280px)").matches) close();
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
    setSubmenu(null);
    setSheetTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    setOpen(true);
  };

  const solid = scrolled || open;

  return (
    <>
      {/* ── Announcement strip ── */}
      <a
        href="/partners/#recruit"
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

        <div className="relative mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-10">
          {/* logo */}
          <a
            href="/"
            onClick={() => open && close()}
            className="-ml-1 flex shrink-0 items-center rounded-xl p-1 outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo-color.webp"
              alt="엔에스티 NST"
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
          <nav ref={navRef} aria-label="주요 메뉴" className="hidden xl:absolute xl:left-1/2 xl:top-1/2 xl:block xl:-translate-x-1/2 xl:-translate-y-1/2">
            <ul className="flex items-center gap-0.5">
              {NAV.map((item, index) => {
                const expanded = submenu === item.label;
                const linkClass = cn(
                  "relative inline-flex h-11 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[14px] font-semibold tracking-[-0.01em] outline-none transition-colors duration-300",
                  "hover:bg-pine/[.06] hover:text-pine focus-visible:ring-3 focus-visible:ring-trust/40",
                  "after:absolute after:bottom-1.5 after:left-1/2 after:size-[5px] after:-translate-x-1/2 after:rounded-full after:bg-leaf after:transition-[opacity,scale] after:duration-300",
                  isActive(item) ? "text-pine after:scale-100 after:opacity-100" : "text-ink/70 after:scale-0 after:opacity-0",
                );
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onBlur={(event) => {
                      if (expanded && !event.currentTarget.contains(event.relatedTarget as Node | null)) setSubmenu(null);
                    }}
                  >
                    {item.children ? (
                      <>
                        <button
                          ref={(element) => { submenuButtonRefs.current[item.label] = element; }}
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`header-submenu-${index}`}
                          onClick={() => setSubmenu(expanded ? null : item.label)}
                          className={linkClass}
                        >
                          {item.label}
                          <ChevronDown aria-hidden="true" className={cn("size-3.5 transition-transform duration-300", expanded && "rotate-180")} />
                        </button>
                        {expanded && (
                          <ul
                            id={`header-submenu-${index}`}
                            className={cn(
                              "absolute top-full mt-2 w-52 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-20px_rgba(14,59,50,.4)] ring-1 ring-hairline",
                              index === NAV.length - 1 ? "right-0" : "left-0",
                            )}
                          >
                            {item.children.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  onClick={() => setSubmenu(null)}
                                  aria-current={!link.href.includes("#") && samePath(link.href, pathname) ? "page" : undefined}
                                  className="flex min-h-11 items-center rounded-xl px-3 text-[14px] text-ink/80 outline-none transition-colors hover:bg-mint/50 hover:text-pine focus-visible:ring-2 focus-visible:ring-trust/50 aria-[current=page]:font-bold aria-[current=page]:text-pine"
                                >
                                  {link.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <a href={item.href} aria-current={isActive(item) ? "page" : undefined} className={linkClass}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a
              href="tel:043-222-2322"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-[14px] font-semibold tabular-nums text-pine outline-none transition-colors hover:bg-pine/[.06] focus-visible:ring-3 focus-visible:ring-trust/40 2xl:inline-flex"
            >
              <Phone aria-hidden="true" className="size-4 text-leaf" />
              043-222-2322
            </a>
            <a
              href="/contact/"
              onClick={() => open && close()}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-action px-5 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(0,71,156,.55)] transition-[translate,box-shadow,background-color] duration-300",
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
              className="relative size-11 rounded-full border border-pine/15 bg-white/60 p-0 text-pine backdrop-blur hover:bg-white xl:hidden"
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
            "grain fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain bg-air transition-[opacity,translate,visibility] duration-300 xl:hidden",
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
            <ul>
              {NAV.map((item) => (
                <li key={item.label} className="border-b border-hairline">
                  <a
                    href={item.href}
                    onClick={() => close()}
                    aria-current={isActive(item) ? "page" : undefined}
                    className="group flex min-h-14 items-center justify-between gap-4 py-2.5 font-display text-[1.25rem] font-bold tracking-[-0.03em] text-pine outline-none focus-visible:bg-mint/40 aria-[current=page]:text-leaf"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" className="size-5 text-leaf" />
                  </a>
                  {item.children && (
                    <ul className="grid grid-cols-2 gap-x-4 pb-3">
                      {item.children.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={() => close()}
                            aria-current={!link.href.includes("#") && samePath(link.href, pathname) ? "page" : undefined}
                            className="flex min-h-11 items-center rounded-lg px-2 text-[15px] text-ink/75 outline-none hover:bg-mint/40 focus-visible:ring-2 focus-visible:ring-trust/50 aria-[current=page]:font-bold aria-[current=page]:text-leaf"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <a
              href="/contact/"
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
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-hairline bg-white/70 text-[14px] font-semibold tabular-nums text-pine outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
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
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#FEE500] text-[14px] font-semibold text-[#191919] outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
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
