import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small shared building blocks for the static pages (server components only). */

export const WRAP = "mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10";
export const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
export const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2";
export const H2 = "font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-[1.25] tracking-[-0.03em]";
export const H3 = "font-display text-[1.125rem] font-bold leading-[1.4] tracking-[-0.02em] sm:text-[1.25rem]";
export const LINK = "font-semibold text-trust underline decoration-trust/30 underline-offset-4 hover:decoration-trust";

/* scroll-linked entrance — transform/opacity only, progressive (no-op where unsupported or reduced motion) */
export const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:both] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:linear] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_cover_18%]";

type Tone = "plain" | "white" | "mint" | "pine";

const TONE: Record<Tone, string> = {
  plain: "",
  white: "border-y border-hairline bg-white",
  mint: "bg-[linear-gradient(180deg,#f6faf7_0%,#e6f6ed_18%,#e6f6ed_82%,#f6faf7_100%)]",
  pine: "grain relative isolate overflow-hidden bg-pine text-white",
};

export function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-[14px] font-bold tracking-[0.06em]", dark ? "text-mint" : "text-pine-2")}>
      <span aria-hidden className="relative grid size-3 place-items-center">
        <span className={cn("absolute inset-0 rounded-full border", dark ? "border-mint/60" : "border-leaf/60")} />
        <span className={cn("size-1.5 rounded-full", dark ? "bg-mint" : "bg-leaf")} />
      </span>
      {children}
    </p>
  );
}

export function Section({
  id,
  title,
  kicker,
  intro,
  tone = "plain",
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  kicker?: string;
  intro?: ReactNode;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  const dark = tone === "pine";
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-24", TONE[tone], className)}>
      <div className={cn(WRAP, "py-14 sm:py-20 lg:py-24")}>
        <div className={cn("max-w-[46rem]", REVEAL)}>
          {kicker && <Kicker dark={dark}>{kicker}</Kicker>}
          <h2 id={`${id}-title`} className={cn(H2, "mt-3 text-balance", dark ? "text-white" : "text-pine")}>
            {title}
          </h2>
          {intro && (
            <div className={cn("mt-4 text-pretty text-[16px] leading-[1.75] sm:text-[17px] [&>p+p]:mt-3", dark ? "text-white/75" : "text-muted-ink")}>
              {intro}
            </div>
          )}
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Product codes are Latin — IBM Plex Mono for the code, Pretendard for the Korean around it. */
export function Codes({ text }: { text: string }) {
  return (
    <>
      {text.split(/(NST-[SF]\d{3})/g).map((part, i) =>
        /^NST-[SF]\d{3}$/.test(part) ? (
          <span key={i} className="font-mono text-[0.92em] font-medium">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Figure({
  src,
  width,
  height,
  alt,
  caption,
  zoom = false,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: ReactNode;
  zoom?: boolean;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  const img = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-auto w-full rounded-[1.25rem] bg-white shadow-[0_24px_50px_-34px_rgba(14,59,50,.55)] ring-1 ring-hairline", imgClassName)}
    />
  );
  return (
    <figure className={className}>
      {zoom ? (
        <a href={src} target="_blank" rel="noopener" className={cn("group relative block rounded-[1.25rem]", FOCUS)}>
          {img}
          <span className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-1 rounded-full bg-ink/75 px-3 text-[13px] font-semibold text-white backdrop-blur">
            원본 크게 보기
            <ArrowUpRight aria-hidden className="size-3.5" />
            <span className="sr-only">(새 창)</span>
          </span>
        </a>
      ) : (
        img
      )}
      {caption && <figcaption className="mt-3 text-pretty text-[14px] leading-[1.6] text-muted-ink">{caption}</figcaption>}
    </figure>
  );
}

export function SourceNote({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={cn("mt-5 text-[13px] leading-[1.65]", dark ? "text-white/65" : "text-muted-ink")}>{children}</p>;
}

/* Old knst.co.kr wording only: heading/lines from /contact/, facts from the 대형배너(2026) board and the old home page. */
const CTA_FACTS = [
  "현장시공 직접 참관 가능한 신뢰성",
  "현장 방문이 어려운 경우, 실시간 문자 또는 카카오톡으로 시공 진행 상황을 안내해 드립니다.",
];

/** Closing consultation band → /contact/ + phone. Light surface so the brand-blue button keeps contrast. */
export function PageCTA({ id = "page-cta" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className={cn(WRAP, "pb-20 pt-6 sm:pb-24")}>
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#eef8f2_0%,#cdeedd_100%)] ring-1 ring-leaf/15">
        <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 -z-10 size-[26rem] sm:-right-20">
          {[0, 13, 26, 39].map((inset, i) => (
            <span key={inset} className="absolute rounded-full border" style={{ inset: `${inset}%`, borderColor: `rgba(47,143,107,${0.3 - i * 0.05})` }} />
          ))}
        </div>
        <div className="grid gap-8 px-6 py-9 sm:px-10 sm:py-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:px-12 lg:py-12">
          <div>
            <Kicker>고객지원 · 문의하기</Kicker>
            <h2 id={`${id}-title`} className={cn(H2, "mt-3 text-pretty text-pine")}>
              고객님, 새집증후군 예방
              <br />
              하실 준비가 되셨나요?
            </h2>
            <p className="mt-4 max-w-[34rem] text-[16px] leading-[1.75] text-ink/80 sm:text-[17px]">
              친환경 NST공법 기술로 주거공간을 설계해 드립니다. 상담 신청을 남겨주시면 빠르게 연락드리겠습니다.
            </p>
            <ul className="mt-5 flex max-w-[40rem] flex-col gap-2">
              {CTA_FACTS.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] font-medium leading-[1.6] text-pine">
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-pine text-mint">
                    <Check className="size-3.5" strokeWidth={2.75} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <a
              href="/contact/"
              className={cn(
                "group inline-flex h-14 items-center justify-between gap-4 rounded-full bg-action pl-7 pr-2 text-[17px] font-bold text-white",
                "shadow-[0_18px_36px_-16px_rgba(0,71,156,.55)] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-hover motion-reduce:hover:translate-y-0",
                FOCUS,
                EASE,
              )}
            >
              문의하기
              <span className="grid size-10 place-items-center rounded-full bg-white text-action transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight aria-hidden className="size-5" />
              </span>
            </a>
            <a
              href="tel:0432222322"
              className={cn(
                "inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-pine/20 bg-white/70 px-7 text-[16px] font-semibold text-pine transition-colors duration-300 hover:border-pine/40 hover:bg-white",
                FOCUS,
              )}
            >
              <Phone aria-hidden className="size-4 text-leaf" />
              <span>
                전화상담 <span className="font-bold tabular-nums">043-222-2322</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
