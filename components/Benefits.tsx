import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RevealSection } from "@/components/Process";

/*
 * Old home, section "새집증후군 개선 업계 현장 시공 표준": intro heading, the "NST공법은 WHY! 특별한가?" board
 * (image 새집증후군3 → bento A/B/C), the "OUR Difference — 엔에스티 차별화" icon boxes and the
 * "키워드로 보는 NST공법" board (image 새집증후군13). All copy verbatim from docs/reference/old-site/content/
 * page-1227-practice-2.md and the image transcriptions in docs/reference/image-text/part-1..4.md.
 * Reveal is one-shot via <RevealSection> (IntersectionObserver, transform/opacity only).
 */

const REVEAL =
  "transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)] data-[reveal=pending]:translate-y-8 data-[reveal=pending]:opacity-0";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/** 1px gradient border painted with a mask so it never tints the glass behind it. */
const EDGE =
  "pointer-events-none absolute inset-0 z-10 rounded-[inherit] p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]";

function Tile({
  children,
  className,
  surface,
  edge = "bg-[linear-gradient(150deg,rgba(255,255,255,.95),rgba(213,228,220,.95)_45%,rgba(47,143,107,.35))]",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  surface?: string;
  edge?: string;
  delay?: number;
}) {
  return (
    <li
      data-reveal=""
      className={cn(REVEAL, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <article
        className={cn(
          "group relative isolate h-full rounded-[28px] transition-[translate] duration-500 hover:-translate-y-1.5 motion-reduce:hover:translate-y-0",
          EASE,
        )}
      >
        {/* grounded shadow on hover */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-8 -bottom-4 -z-10 h-10 rounded-full bg-pine/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100",
            EASE,
          )}
        />
        <span aria-hidden className={cn(EDGE, edge)} />
        <span
          aria-hidden
          className={cn(
            EDGE,
            "bg-[linear-gradient(150deg,#2f8f6b,#cdeedd_50%,#00479c)] opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            EASE,
          )}
        />
        <Card
          className={cn(
            "relative h-full gap-0 rounded-[28px] bg-white/70 py-0 text-base text-ink ring-0 backdrop-blur-xl",
            surface,
          )}
        >
          {children}
        </Card>
      </article>
    </li>
  );
}

function IconChip({ src, className }: { src: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(145deg,#ffffff,#e2f4ea)] ring-1 ring-hairline sm:size-16",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        width={256}
        height={256}
        loading="lazy"
        decoding="async"
        className={cn(
          "size-10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:size-11",
          EASE,
        )}
      />
    </span>
  );
}

/** h3 = benefit name (label) + benefit-first headline. */
function TileTitle({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <h3 className={className}>
      <span className="block text-[13px] font-semibold tracking-[.08em] text-pine-2">{label}</span>
      <span className="mt-1.5 block font-display text-[21px] font-bold leading-[1.3] tracking-[-.025em] text-ink sm:text-[24px]">
        {children}
      </span>
    </h3>
  );
}

const Code = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-[.9em] tracking-[.01em] text-pine-2">{children}</span>
);


const CHAIN = ["원료확보", "연구개발", "생산", "품질관리", "제품생산"];
const RING_SCALE = [2, 3.3, 4.8, 6.6];

/** "원료관리-연구개발-제품생산 원스톱 시스템" infographic, verbatim (docs/reference/image-text/part-3.md) */
const ONESTOP_POINTS = [
  {
    t: "철저한 제품 품질 관리",
    d: "제품 원료 확보부터 개발, 그리고 생산에 이르기까지 모든 과정을 엔에스티가 직접 관리하여 최고 수준의 품질을 보장합니다.",
  },
  {
    t: "뛰어난 비용 효율성",
    d: "모든 원료를 직접관리하고 중간 유통 과정 없이 직접 연구개발 및 생산/공급, 불필요한 비용을 절감합니다.",
  },
  {
    t: "책임감 있는 서비스",
    d: "본사와 직접 계약한 사업자만 NST공법 시공을 하기 때문에 품질 관리가 수월하고 문제 발생 시 신속한 대응이 가능합니다.",
  },
];

/** Old home "OUR Difference — 엔에스티 차별화" (three icon boxes), verbatim. */
const DIFFERENCE = [
  { t: "자체생산", d: "제품 연구부터 생산, 판매까지 원-스탑(One-Stop)", icon: "/img/icon-inhouse.webp" },
  { t: "안전성 확보", d: "생활화학제품 안전성 합격, 환경부 신고 완료", icon: "/img/icon-safety.webp" },
  { t: "성능검증", d: "국내 대형건설사 직접 시공(전세대) 다수 실적", icon: "/img/icon-proof.webp" },
];

/** "키워드로 보는 NST공법 - 압도적인 강점" 9 cards, verbatim (part-1 새집증후군13 / part-3 …1779973476750).
    Only change: the board's "올해 8월" (printed in 2025) is written "2025년 8월" so it does not read as 2026. */
const KEYWORDS = [
  { t: "기술력 집약, 자체 개발", d: "NST는 모든 제품을 직접 연구, 개발, 생산하여 완벽한 품질을 약속합니다." },
  { t: "국가 공인기관 검증 완료", d: "최고 수준의 성능과 안전성을 국가 공인기관으로부터 철저히 입증받았습니다." },
  { t: "환경부 교차검증 통과", d: "환경부의 까다로운 기준을 만족하는 안전성을 공식적으로 인정받았습니다." },
  { t: "다수 건설사 아파트 일괄 시공", d: "대형 건설사가 선택한 검증된 기술력 압도적인 현장 경험을 자랑합니다." },
  {
    t: "개발부터 시공까지, 완벽 신뢰",
    d: "20년의 경험과 노하우로 현장 맞춤형 기술로 탄생한 NST공법, 만족도 높은 서비스를 제공합니다.",
  },
  {
    t: "20년 노하우, 안전성 확보",
    d: "수많은 시공 실적과 축적된 기술력으로 인체에 무해한 시공 안전성과 위해성을 담보합니다.",
  },
  {
    t: "자타공인 시공 기술 표준화",
    d: "20년 노하우 NST공법, 체계적인 시공 프로세스는 시공 방법이 업계 표준화가 되었습니다.",
  },
  {
    t: "2025 대한민국환경대상 수상",
    d: "7월 국회의사당에서 진행된 환경부가 후원하는 2025대한민국환경대상 수상으로 20년 노하우 NST공법 기술력과 그 가치를 증명하였습니다.",
  },
  {
    t: "고객 중심의 지속적인 혁신",
    d: "2025년 8월 고객님들에게 더 나은 서비스 제공을 위해 빛이 없어도 유해물질을 제거하는 NST-S100 제품을 리뉴얼 출시하였습니다.",
  },
];

/** Product codes are Latin — Plex Mono for the code. */
function withCodes(line: string) {
  return line.split(/(NST-[SF]\d{3})/g).map((part, i) => (/^NST-[SF]\d{3}$/.test(part) ? <Code key={i}>{part}</Code> : part));
}

export default function Benefits() {
  return (
    <RevealSection
      id="why"
      aria-labelledby="why-title"
      className="grain relative overflow-clip bg-air"
      style={{
        backgroundImage:
          "radial-gradient(65% 45% at 100% 0%, rgba(205,238,221,.95) 0%, rgba(205,238,221,0) 70%), radial-gradient(55% 40% at 0% 100%, rgba(205,238,221,.7) 0%, rgba(205,238,221,0) 72%), linear-gradient(180deg, #f6faf7 0%, #eef7f1 100%)",
      }}
    >
      {/* faint breath rings behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-40 size-[560px] lg:-right-24 lg:-top-32 lg:size-[680px]"
      >
        {[1, 0.74, 0.5].map((k, i) => (
          <span
            key={k}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-leaf/15 motion-safe:animate-[breathe_10s_ease-in-out_infinite]"
            style={{ width: `${k * 100}%`, height: `${k * 100}%`, animationDelay: `${i * -2}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        {/* ---------- heading (old home: section intro + "NST공법은 WHY! 특별한가?" board) ---------- */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p
              data-reveal=""
              className={cn(
                REVEAL,
                "inline-flex items-center gap-3 text-[13px] font-semibold tracking-[.12em] text-pine-2",
              )}
            >
              <span aria-hidden className="h-px w-8 bg-pine-2/40" />
              새집증후군 개선 업계 현장 시공 표준
            </p>
            <h2
              id="why-title"
              data-reveal=""
              className={cn(
                REVEAL,
                "mt-5 text-balance font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.2] tracking-[-.03em] text-pine",
              )}
              style={{ transitionDelay: "80ms" }}
            >
              20년의 노하우로 최적화 된 <span className="text-leaf">NST공법</span>은 고객님의 실내공간을 과학적으로 설계합니다.
            </h2>
          </div>
          <div
            data-reveal=""
            className={cn(REVEAL, "max-w-[44ch] border-t border-hairline pt-6 lg:col-span-5 lg:mb-2")}
            style={{ transitionDelay: "160ms" }}
          >
            <h3 className="font-display text-[19px] font-bold tracking-[-.02em] text-pine sm:text-[21px]">
              NST공법은 <span className="text-leaf">WHY!</span> 특별한가?
            </h3>
            <p className="mt-2 text-[16px] font-semibold leading-[1.7] text-ink sm:text-[17px]">
              20년의 연구와 경험, 그리고 노하우로 완성된 NST공법!
            </p>
            <p className="mt-3 text-[16px] leading-[1.75] text-muted-ink sm:text-[17px]">
              모든 제품은 원료 확보부터 연구·개발, 생산까지 본사에서 직접 수행하며, 정부 시스템에 따른 안전성 검증 절차를
              철저히 준수하고 있습니다.
            </p>
            <p className="mt-3 text-[16px] leading-[1.75] text-muted-ink sm:text-[17px]">
              대형건설사 전세대 일괄시공 실적을 통해 검증된 NST공법은 20년의 경험과 노하우가 집약된 현장 맞춤형 새집증후군
              개선 솔루션입니다.
            </p>
          </div>
        </div>

        {/* ---------- bento: the board's three points ---------- */}
        <ul className="mt-14 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {/* A — featured: 원스톱 시스템, 국내 유일 통합 솔루션 */}
          <Tile
            className="md:col-span-2 lg:col-span-7 lg:row-span-2"
            surface="bg-pine text-white backdrop-blur-none"
            edge="bg-[linear-gradient(150deg,rgba(205,238,221,.35),rgba(205,238,221,.06)_50%,rgba(205,238,221,.2))]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(70% 55% at 85% 20%, rgba(47,143,107,.55), transparent 70%), radial-gradient(60% 50% at 0% 100%, rgba(20,80,63,.9), transparent 70%)",
              }}
            />
            <div className="relative flex h-full flex-col p-7 sm:p-10 lg:p-12">
              <p className="relative z-10 text-[13px] font-semibold uppercase tracking-[.22em] text-mint/90">One-stop system</p>

              {/* breath rings radiating from the icon */}
              <div className="relative my-14 size-24 sm:size-28 lg:absolute lg:right-[13%] lg:top-[24%] lg:my-0 lg:size-32">
                {RING_SCALE.map((k, i) => (
                  <span
                    key={k}
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border motion-safe:animate-[breathe_7s_ease-in-out_infinite]"
                    style={{
                      width: `${k * 100}%`,
                      height: `${k * 100}%`,
                      borderColor: `rgba(205,238,221,${0.34 - i * 0.07})`,
                      animationDelay: `${i * -1.1}s`,
                    }}
                  />
                ))}
                <span className="relative grid size-full place-items-center rounded-full bg-mint shadow-[0_0_70px_rgba(205,238,221,.35)]">
                  <img
                    src="/img/icon-onestop.webp"
                    alt=""
                    width={256}
                    height={256}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "size-[66%] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105",
                      EASE,
                    )}
                  />
                </span>
              </div>

              <div className="relative z-10 mt-auto lg:pt-56">
                <h3 className="font-display text-[28px] font-black leading-[1.15] tracking-[-.04em] sm:text-[34px] lg:text-[40px]">
                  원스톱
                  <br />
                  시스템
                </h3>
                <p className="mt-4 inline-flex rounded-full border border-mint/35 px-3 py-1 text-[13px] font-semibold text-mint">
                  국내 유일 통합 솔루션
                </p>
                <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.75] text-white/80 sm:text-[17px]">
                  원료확보-연구개발-생산-품질관리-제품생산까지 모든 과정을 직접 수행하는 국내 유일 통합 솔루션!
                </p>
                <ol aria-label="원스톱 공정" className="mt-7 flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
                  {CHAIN.map((step, i) => (
                    <li
                      key={step}
                      data-reveal=""
                      className={cn(REVEAL, "flex items-center gap-1.5")}
                      style={{ transitionDelay: `${260 + i * 90}ms` }}
                    >
                      <span
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-[14px] font-medium sm:text-[15px]",
                          i === CHAIN.length - 1
                            ? "border-mint bg-mint text-pine"
                            : "border-white/20 bg-white/[.06] text-white/90",
                        )}
                      >
                        {step}
                      </span>
                      {i < CHAIN.length - 1 && (
                        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 text-mint/60">
                          <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ol>
                <dl className="mt-8 grid gap-x-6 gap-y-4 border-t border-white/12 pt-6 sm:grid-cols-3">
                  {ONESTOP_POINTS.map((p) => (
                    <div key={p.t}>
                      <dt className="text-[15px] font-bold text-mint">{p.t}</dt>
                      <dd className="mt-1.5 text-[14px] leading-[1.65] text-white/75 sm:text-[15px]">{p.d}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Tile>

          {/* B — 아파트 전세대 실적, 검증된 NST공법 */}
          <Tile className="lg:col-span-5" delay={120}>
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <IconChip src="/img/icon-apartment.webp" />
                <TileTitle label="아파트 전세대 실적,">검증된 NST공법</TileTitle>
              </div>
              <p className="mt-6 flex items-baseline gap-1.5 font-display text-pine">
                <span className="text-[40px] font-black leading-none tracking-[-.04em] tabular-nums sm:text-[48px]">
                  1,018
                </span>
                <span className="text-[22px] font-bold tracking-[-.02em]">세대</span>
              </p>
              <p className="mt-2 text-[14px] font-medium text-pine-2">
                총 <span className="tabular-nums">1,018</span>세대 외 다수의 대규모 프로젝트 일괄 시공
              </p>
              <p className="mt-4 text-[16px] leading-[1.7] text-muted-ink">
                실제 현장에서 축적된 노하우 및 기술력으로 대단지 아파트 전세대 일괄시공으로 검증된 성능!
              </p>
            </div>
          </Tile>

          {/* C — 20년 노하우, 현장 맞춤형 3단계 시공 */}
          <Tile className="lg:col-span-5" delay={200}>
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <IconChip src="/img/icon-steps.webp" />
                <TileTitle label="20년 노하우,">현장 맞춤형 3단계 시공</TileTitle>
              </div>
              <ol aria-label="시공 순서" className="mt-6 flex flex-wrap items-center gap-2">
                {[
                  ["S200", "차단"],
                  ["F100", "흡착"],
                  ["S100", "분해"],
                ].map(([code, act], i) => (
                  <li key={code} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-mint/70 py-1.5 pl-3 pr-3.5 text-[14px] ring-1 ring-leaf/15">
                      <span className="font-mono text-[13px] text-pine-2">{code}</span>
                      <span className="font-semibold text-pine">{act}</span>
                    </span>
                    {i < 2 && <span aria-hidden className="h-px w-3 bg-leaf/40" />}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[16px] leading-[1.7] text-muted-ink">
                20년 경력과 노하우로 완성된 3단계(분해-차단-흡착·탈취 제거) 맞춤형 시공 원조 솔루션
              </p>
              <a
                href="#steps"
                className="group/link mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-[15px] font-semibold text-trust underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-trust"
              >
                시공 과정 자세히 보기
                <ArrowDown
                  aria-hidden
                  className={cn("size-4 transition-transform duration-300 group-hover/link:translate-y-0.5", EASE)}
                />
              </a>
            </div>
          </Tile>
        </ul>

        {/* ---------- OUR Difference — 엔에스티 차별화 (old home icon boxes) ---------- */}
        <div className="mt-20 sm:mt-24 lg:mt-28">
          <div data-reveal="" className={cn(REVEAL, "flex flex-col items-start gap-2")}>
            <p className="inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[.22em] text-pine-2">
              <span aria-hidden className="h-px w-8 bg-pine-2/40" />
              OUR Difference
            </p>
            <h3 className="font-display text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] font-extrabold leading-[1.25] tracking-[-.03em] text-pine">
              엔에스티 차별화
            </h3>
          </div>
          <ul className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            {DIFFERENCE.map((d, i) => (
              <Tile
                key={d.t}
                delay={i * 100}
                surface={i === 1 ? "bg-mint/75" : undefined}
                edge={i === 1 ? "bg-[linear-gradient(150deg,rgba(255,255,255,.9),rgba(47,143,107,.25))]" : undefined}
              >
                <div className="flex h-full items-start gap-4 p-6 sm:flex-col sm:gap-5 sm:p-7">
                  <IconChip src={d.icon} />
                  <div>
                    <h4 className="font-display text-[21px] font-bold leading-[1.3] tracking-[-.025em] text-ink sm:text-[24px]">
                      {d.t}
                    </h4>
                    <p className="mt-2 text-[16px] leading-[1.7] text-muted-ink">{d.d}</p>
                  </div>
                </div>
              </Tile>
            ))}
          </ul>
        </div>

        {/* ---------- 9 keywords (text from the original "키워드로 보는 NST공법" board) ---------- */}
        <div className="mt-20 sm:mt-24 lg:mt-28">
          <div data-reveal="" className={cn(REVEAL, "border-b-2 border-pine pb-4")}>
            <h3 className="font-display text-[1.25rem] font-bold leading-[1.3] tracking-[-.02em] text-pine sm:text-[1.375rem]">
              키워드로 보는 NST공법 <span className="text-leaf">-</span> 압도적인 강점
            </h3>
          </div>
          <ol className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
            {KEYWORDS.map((k, i) => (
              <li
                key={k.t}
                data-reveal=""
                className={cn(REVEAL, "flex gap-4 border-b border-hairline py-5 sm:py-6")}
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                <span
                  aria-hidden
                  className="w-7 shrink-0 pt-0.5 font-display text-[15px] font-bold tabular-nums text-leaf"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-[17px] font-bold leading-[1.4] tracking-[-.01em] text-ink">{k.t}</h4>
                  <p className="mt-1.5 text-[15px] leading-[1.7] text-muted-ink">{withCodes(k.d)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </RevealSection>
  );
}
