import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Award, Building2, Phone, ShieldCheck } from "lucide-react";
import CountUp from "@/components/CountUp";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/** Concentric "breath" rings — sizes are % of the arch width, centred on the arch. */
const RINGS = [
  { size: 128, border: "rgba(47,143,107,.30)", delay: 0 },
  { size: 168, border: "rgba(47,143,107,.20)", delay: -2.2 },
  { size: 215, border: "rgba(14,59,50,.11)", delay: -4.4 },
  { size: 272, border: "rgba(14,59,50,.07)", delay: -6.6 },
];

/* Old home counter block "(주)엔에스티의 NST공법 시공 실적과 전국 네트워크": 누적 시공량 60,000건+ / 전국 지점 30개+ /
   업력 (24년 on the old homepage; the recruitment poster separately says 20년). */
const STATS = [
  { label: "누적 시공량", to: 60000, suffix: "건+", lead: true },
  { label: "전국 지점", to: 30, suffix: "개+", lead: false },
  { label: "업력", to: SITE.homepageExperienceYears, suffix: "년", lead: false },
];

/* Verbatim fragments of the old home (새집증후군3 infographic, OUR Difference, 그림16-1 gallery slide). */
const FACTS = [
  { icon: Building2, text: "대형건설사 전세대 일괄시공 실적" },
  { icon: ShieldCheck, text: "생활화학제품 안전성 합격, 환경부 신고 완료" },
  { icon: Award, text: "「2025년 대한민국환경대상」 ‘환경제품부문’ 수상" },
];

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="grain relative isolate overflow-hidden">
      {/* mint air mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(52rem 38rem at 80% 22%, rgba(205,238,221,.95), rgba(205,238,221,0) 62%)",
            "radial-gradient(36rem 30rem at -8% 78%, rgba(205,238,221,.75), rgba(205,238,221,0) 60%)",
            "radial-gradient(26rem 20rem at 62% 100%, rgba(0,71,156,.06), rgba(0,71,156,0) 70%)",
            "radial-gradient(30rem 24rem at 30% 8%, rgba(255,255,255,.9), rgba(255,255,255,0) 70%)",
            "linear-gradient(180deg, #f6faf7 0%, #eef8f2 55%, #f6faf7 100%)",
          ].join(","),
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 px-4 pb-20 pt-3 sm:px-6 sm:pb-24 lg:grid-cols-12 lg:gap-x-6 lg:px-10 lg:pb-28 lg:pt-8">
        {/* ── Visual: arch photo + breath rings ── */}
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <div className="relative ml-auto h-[19rem] w-[80%] max-w-[30rem] sm:h-[26rem] lg:-ml-2 lg:mr-auto lg:h-[min(38rem,calc(100svh-11rem))] lg:min-h-[32rem] lg:w-[min(31rem,88%)]">
            {RINGS.map((r) => (
              <span
                key={r.size}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[44%] -z-10 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  width: `${r.size}%`,
                  borderColor: r.border,
                  animation: `breathe 9s cubic-bezier(.4,0,.2,1) ${r.delay}s infinite`,
                }}
              />
            ))}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[44%] -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "radial-gradient(closest-side, rgba(205,238,221,.95), rgba(205,238,221,.35) 60%, rgba(205,238,221,0))",
                animation: "breathe 9s cubic-bezier(.4,0,.2,1) -1s infinite",
              }}
            />

            <div className="absolute inset-0 overflow-hidden rounded-b-[2rem] rounded-t-full shadow-[0_50px_90px_-45px_rgba(14,59,50,.55)] ring-1 ring-inset ring-white/60 lg:rounded-b-[2.75rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/hero.webp"
                alt="햇살이 드는 새 아파트 거실"
                width={601}
                height={752}
                fetchPriority="high"
                decoding="async"
                className={cn(
                  "size-full object-cover object-[50%_58%] animate-in fade-in zoom-in-108 duration-[1800ms] fill-mode-both",
                  EASE,
                )}
              />
              {/* soft floor fade so the overlapping headline stays crisp */}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#f6faf7]/85 via-[#f6faf7]/30 to-transparent lg:h-1/4 lg:from-[#f6faf7]/40" />
            </div>
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="relative z-10 -mt-[4.75rem] sm:-mt-28 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-center lg:pb-6">
          {/* old hero: "NST공법 공식홈페이지 | 새집증후군 개선 시공 전문 기술" / "우리가족! 우리아이! 건강 지킴이 (주)엔에스티" */}
          <h1
            id="hero-title"
            className="font-display font-extrabold tracking-[-0.03em] text-pine [text-shadow:0_1px_0_rgba(255,255,255,.5),0_0_32px_rgba(246,250,247,.9)]"
          >
            <span className="rise block text-pretty text-[clamp(1rem,0.9rem+0.6vw,1.3125rem)] font-bold leading-[1.35] text-pine-2" style={delay(0)}>
              NST공법 공식홈페이지 <span aria-hidden="true" className="text-leaf/60">|</span>
              <span className="sr-only">,</span> <span className="whitespace-nowrap">새집증후군 개선 시공 전문 기술</span>
            </span>
            <span className="mt-2 block text-[clamp(1.875rem,1rem+3vw,3.375rem)] leading-[1.08] lg:mt-3">
              <span className="rise block" style={delay(100)}>
                우리가족! 우리아이!
              </span>
              <span className="rise block" style={delay(200)}>
                건강 지킴이 <span className="whitespace-nowrap">(주)엔에스티</span>
              </span>
            </span>
          </h1>

          {/* old hero notice (yellow line on knst.co.kr) */}
          <p
            className="rise mt-6 max-w-[33rem] text-pretty text-[18px] font-medium leading-[1.7] text-ink/85 sm:text-[20px] lg:mt-8 lg:max-w-[min(30rem,calc(40vw-1rem))] lg:text-[1.3125rem] lg:leading-[1.65]"
            style={delay(300)}
          >
            <a
              href="#partner"
              className="rounded-md underline decoration-pine/25 underline-offset-[6px] outline-none transition-colors hover:decoration-pine focus-visible:ring-3 focus-visible:ring-trust/40"
            >
              <mark className="bg-transparent bg-[linear-gradient(transparent_58%,#cdeedd_58%)] px-0.5 font-bold text-pine">
                ★2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집中
              </mark>{" "}
              (많은 관심 바랍니다.)
            </a>
          </p>

          <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10" style={delay(500)}>
            <a
              href="#contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-14 gap-4 rounded-full bg-action pl-7 pr-2 text-[17px] font-bold text-white sm:h-[60px] sm:text-[18px]",
                "shadow-[0_18px_36px_-16px_rgba(0,71,156,.55)] transition-[translate,box-shadow,background-color] duration-300",
                "hover:-translate-y-1 hover:bg-action-hover hover:shadow-[0_26px_44px_-18px_rgba(0,71,156,.7)] focus-visible:ring-ink/30",
                EASE,
              )}
            >
              무료 상담 신청
              <span className="grid size-10 place-items-center rounded-full bg-white text-action transition-transform duration-300 group-hover:translate-x-0.5 sm:size-11">
                <ArrowRight aria-hidden="true" className="size-5" />
              </span>
            </a>
            <a
              href="#steps"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-14 rounded-full border border-pine/20 bg-white/55 px-7 text-[16px] font-semibold text-pine backdrop-blur sm:h-[60px] sm:text-[17px]",
                "transition-[background-color,border-color] duration-300 hover:border-pine/40 hover:bg-white hover:text-pine",
              )}
            >
              3단계 시공 보기
            </a>
          </div>

          <p className="rise mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px] text-muted-ink" style={delay(600)}>
            <a
              href="tel:043-222-2322"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full pr-2 outline-none focus-visible:ring-3 focus-visible:ring-trust/40"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/80 ring-1 ring-hairline">
                <Phone aria-hidden="true" className="size-3.5 text-leaf" />
              </span>
              전화 상담
              <span className="font-bold tabular-nums tracking-[0.01em] text-pine underline decoration-pine/25 underline-offset-4">
                043-222-2322
              </span>
            </a>
            {/* old hero pill button (mascot icon) → Naver blog */}
            <a
              href={SITE.naverBlog}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full pr-2 font-semibold text-pine outline-none hover:underline hover:underline-offset-4 focus-visible:ring-3 focus-visible:ring-trust/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/saejibi.webp" alt="" width={150} height={168} loading="lazy" className="h-8 w-auto" />
              (주)엔에스티 블로그
              <ArrowUpRight aria-hidden="true" className="size-4 text-leaf" />
              <span className="sr-only">(새 창)</span>
            </a>
          </p>
        </div>

        {/* ── Proof: frosted stat card overlapping the arch's lower edge ── */}
        <div className="relative z-20 mt-10 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:-ml-12 lg:-mt-32 lg:max-w-[39rem]">
          {/* .rise sits on the frosted element itself — an animating ancestor would stop backdrop-blur from sampling the photo */}
          <div style={delay(700)} className="rise relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/60 px-5 py-6 shadow-[0_34px_70px_-36px_rgba(14,59,50,.6)] backdrop-blur-xl backdrop-saturate-150 sm:px-8 sm:py-7 lg:rounded-[2rem]">
            {/* faint ring echo */}
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full border border-leaf/15" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 size-28 rounded-full border border-leaf/10" />

            <h2 className="relative mb-5 text-[14px] font-bold leading-snug text-pine-2 sm:text-[15px]">
              (주)엔에스티의 NST공법 시공 실적과 전국 네트워크
            </h2>
            <dl className="relative grid grid-cols-2 gap-y-5 sm:grid-cols-[auto_1fr_1fr] sm:gap-x-6 sm:gap-y-0">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "flex flex-col-reverse gap-1.5",
                    "[&_dd]:whitespace-nowrap [&_dd]:font-display [&_dd]:font-extrabold [&_dd]:leading-none [&_dd]:tracking-[-0.035em] [&_dd]:text-pine [&_dd]:tabular-nums",
                    "[&_small]:ml-1 [&_small]:font-sans [&_small]:text-[0.4em] [&_small]:font-bold [&_small]:tracking-normal [&_small]:text-leaf",
                    s.lead
                      ? "col-span-2 border-b border-pine/10 pb-5 sm:col-span-1 sm:border-b-0 sm:pb-0 [&_dd]:text-[clamp(2.25rem,1.8rem+2vw,3rem)]"
                      : "[&_dd]:text-[clamp(1.75rem,1.5rem+1.2vw,2.25rem)]",
                    i > 0 && "sm:border-l sm:border-pine/10 sm:pl-6",
                    i === 0 && "sm:pr-2",
                    i === 2 && "border-l border-pine/10 pl-5",
                  )}
                >
                  <dt className="text-[14px] font-semibold text-muted-ink sm:text-[15px]">{s.label}</dt>
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
              ))}
            </dl>

            {/* real facts — no ratings, no invented reviews */}
            <ul
              aria-label="시공 실적과 안전 인증"
              className="relative mt-5 flex flex-wrap gap-2 border-t border-pine/10 pt-4 sm:mt-6 sm:pt-5"
            >
              {FACTS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Badge
                    variant="outline"
                    className="h-auto gap-2 whitespace-normal rounded-full border-transparent bg-mint/55 py-1 pl-1 pr-3 text-left text-[13px] font-semibold leading-snug text-pine sm:text-[13.5px]"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-leaf">
                      <Icon aria-hidden="true" className="size-3.5" />
                    </span>
                    {text}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
