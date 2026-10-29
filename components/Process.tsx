"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { ArrowRight, MessageCircle, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Scroll reveal (one-shot, transform/opacity only)                   */
/*  Elements with `data-reveal` that start below the fold are hidden   */
/*  after hydration and revealed once by IntersectionObserver. No JS / */
/*  reduced motion -> everything simply stays visible.                 */
/* ------------------------------------------------------------------ */

// (Not exported: a "use client" module's non-component exports arrive in Server Components as references, not values.)
const REVEAL =
  "transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)] data-[reveal=pending]:translate-y-8 data-[reveal=pending]:opacity-0";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fold = window.innerHeight * 0.9;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > fold,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.reveal = "in";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    for (const el of els) {
      el.dataset.reveal = "pending";
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return ref;
}

/** `<section>` that runs the one-shot reveal for its `[data-reveal]` descendants. Used by Benefits. */
export function RevealSection(props: ComponentProps<"section">) {
  const ref = useReveal<HTMLElement>();
  return <section {...props} ref={ref} />;
}


/* ------------------------------------------------------------------ */
/*  Content — the old home's method section, verbatim                  */
/*  (docs/reference/old-site/content/page-1227-practice-2.md + image   */
/*  text of 새집증후군11 / 새집증후군9 in docs/reference/image-text/part-1.md). */
/*  Step bodies: the old /faq/ answer Q1; 용도: old /faq/ Q4.          */
/* ------------------------------------------------------------------ */

type Step = {
  n: string;
  stage: string;
  role: string;
  /** old home product-card heading */
  title: string;
  /** short label for the sticky photo caption */
  short: string;
  /** old home "[n단계] : …" line */
  line?: string;
  code?: string;
  img: string;
  pos: string;
  alt: string;
  body: string;
  facts: [string, string][];
  /** old card link ("클릭하시면 상세설명을 보실 수 있습니다") */
  href?: string;
};

const STEPS: Step[] = [
  {
    n: "00",
    stage: "시공 전",
    role: "문제 진단 및 분석",
    title: "Diagnosis [현장진단]",
    short: "현장진단",
    img: "/img/proc-diagnosis.webp",
    pos: "28% 50%",
    alt: "NST 시공 담당자가 빈 아파트 방에서 현장 상태를 기록하는 모습",
    body: "시공 현장 상황을 정확히 진단하고, 20년간 현장에서 쌓인 경험과 노하우로 오염원과 문제점을 면밀히 분석합니다.",
    facts: [],
  },
  {
    n: "01",
    stage: "1단계",
    role: "안정화",
    title: "NST-S200 [침투/차단(제거)]",
    short: "침투/차단",
    line: "[1단계] : 하이앤드 듀얼정착, NST-S200 (안정화)",
    code: "NST-S200",
    img: "/img/proc-s200.webp",
    pos: "62% 50%",
    alt: "시공 담당자가 가구 목재에 붓으로 NST-S200을 바르는 모습",
    body: "NST-S200은 가구 및 붙박이장으로 부터 유해물질이 실내로 확산되는 것을 사전에 차단하는 차단막(기공 차단)을 생성하는 역할을 합니다.",
    facts: [["용도", "가구·목재용 (차단/차폐 코팅)"]],
    href: "/products/nst-s200/",
  },
  {
    n: "02",
    stage: "2단계",
    role: "지속제거 보조",
    title: "NST-F100 [흡착/탈취(제거)]",
    short: "흡착/탈취",
    line: "[2단계] : 하이앤드 듀얼케어, NST-F100 (지속제거 보조)",
    code: "NST-F100",
    img: "/img/proc-f100.webp",
    pos: "34% 50%",
    alt: "시공 담당자가 수납장 안쪽에 NST-F100을 뿌리는 모습",
    body: "NST-F100은 빛이 닿지 않는 암실, 가구 내부, 장롱 속 등에서도 작동하는 천연 기반 흡착·탈취 솔루션으로, 공간 전체의 잔류 유해가스를 안전하게 제거합니다.",
    facts: [["용도", "붙박이장·신발장 등 밀폐공간용 (흡착/탈취제)"]],
    href: "/products/nst-f100/",
  },
  {
    n: "03",
    stage: "3단계",
    role: "지속제거",
    title: "NST-S100 [분해(제거)/흡착]",
    short: "분해/흡착",
    line: "[3단계] : 하이앤드 듀얼촉매, NST-S100 (지속제거)",
    code: "NST-S100",
    img: "/img/proc-s100.webp",
    pos: "72% 50%",
    alt: "시공 담당자가 분사 장비로 거실 벽에 NST-S100을 시공하는 모습",
    body: "NST-S100은 벽면·천장에 도포되어 빛(가시광 등)에 반응하는 광촉매 작용으로 유해가스를 지속 분해하고, 자가세정 코팅막을 형성합니다.",
    facts: [["용도", "벽·천장용 (흡착/분해 코팅)"]],
    href: "/products/nst-s100/",
  },
];

/** "NST공법 3단계 친환경 시공기술 - 공기를 설계하는 과학" board (새집증후군11): the three contamination zones. */
const ZONES = [
  { n: 1, zone: "일반공간 오염지역", act: "지속적 제거(분해/제거)", code: "NST-S100" },
  { n: 2, zone: "대량방출 오염지역", act: "지속적 제거(침투/차단)", code: "NST-S200" },
  { n: 3, zone: "시공취약 오염지역", act: "지속제거(흡착/탈취) 보조", code: "NST-F100" },
];

/* ---- 토탈 솔루션 5단계 — "NST공법 새집증후군 및 실내공기질 개선 - 토탈 솔루션" board (새집증후군9), verbatim ---- */
const TOTAL = [
  {
    t: "문제 진단 및 분석",
    d: "시공 현장 상황을 정확히 진단하고, 20년간 현장에서 쌓인 경험과 노하우로 오염원과 문제점을 면밀히 분석합니다.",
  },
  {
    t: "맞춤형 솔루션 제안",
    d: "진단 결과를 바탕으로 고객의 환경과 요구에 최적화된 NST공법 공기질 개선 솔루션을 설계하고 제안합니다.",
  },
  {
    t: "제품 개발 및 생산",
    d: "엔에스티 자체 독자 기술력으로 개발된 고성능 공기정화 제품을 직접 생산하여 솔루션(NST공법)에 적용합니다.",
  },
  {
    t: "맞춤형 현장 시공",
    d: "풍부한 경험을 가진 NST공법 전문 시공팀 등이 각 현장 맞춤형 제품을 시공하고 3단계 기능이 활성화 되도록 만듭니다.",
  },
  {
    t: "사후 관리 및 유지 보수",
    d: "NST공법 시공 후, 베이크아웃&환기 보조작업, 실내공기질 유지관리 노하우, 새 가구 시공 서비스 등을 제공해 드립니다.",
  },
];

/* ------------------------------------------------------------------ */

/** Product codes are Latin — Plex Mono for the code, Pretendard for the Korean around it. */
function withCodes(line: string) {
  return line.split(/(NST-[SF]\d{3})/g).map((part, i) =>
    /^NST-[SF]\d{3}$/.test(part) ? (
      <span key={i} className="font-mono text-[0.92em] font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const SUB = "text-[13px] font-semibold tracking-[.12em] text-mint";

/** "NST공법 3단계 친환경 시공기술 - 공기를 설계하는 과학" (image 새집증후군11, as text). */
function ThreeStepScience() {
  return (
    <div data-reveal="" className={cn(REVEAL, "mt-16 sm:mt-20 lg:mt-24")}>
      <article className="rounded-[32px] border border-white/12 bg-white/[.04] p-6 sm:p-9">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className={SUB}>NST공법 3단계</p>
            <h3 className="mt-2 font-display text-[1.25rem] font-bold leading-[1.35] tracking-[-.02em] text-white sm:text-[1.375rem]">
              NST공법 3단계 친환경 시공기술 <span className="text-mint">-</span> 공기를 설계하는 과학
            </h3>
            <p className="mt-4 text-[16px] leading-[1.75] text-white/80 sm:text-[17px]">
              NST공법은 단순한 코팅이 아닙니다. ①분해(제거)/흡착→②차단/제거→③흡착/탈취, 20년 노하우로 완성된 3단계 맞춤형
              시공방법으로 유해물질을 원천 제거/차단하는 공기를 설계하는 과학기술의 결정체입니다.
            </p>
          </div>
          <div className="space-y-3 text-[15px] leading-[1.7] text-white/75 sm:text-[16px] lg:col-span-6 lg:pt-8">
            <p>모든 제품은 안전성을 확보하였으며 시공 또한 상온(25~30°C)에서 경화되며 고온처리도 없습니다.</p>
            <p>{withCodes("NST공법 시공은 아래와 같은 제품 삼총사(NST-S100, S200, F100)가 사용되며, 새집증후군 유발물질 방출 환경을 근본적으로 개선합니다.")}</p>
          </div>
        </div>
        <ol className="mt-7 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">
          {ZONES.map((z) => (
            <li key={z.code} className="rounded-[22px] bg-white/[.05] p-5 ring-1 ring-white/[.06]">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-full bg-mint text-[14px] font-bold tabular-nums text-pine"
              >
                {z.n}
              </span>
              <p className="mt-3 text-[17px] font-bold text-white">{z.zone}</p>
              <p className="mt-1 text-[15px] text-white/75">{z.act}</p>
              <p className="mt-2 font-mono text-[13px] tracking-[.04em] text-mint">[ {z.code} ]</p>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}

function TotalSolution() {
  return (
    <div className="mt-20 sm:mt-24 lg:mt-28">
      <div data-reveal="" className={cn(REVEAL, "grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-12")}>
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-3 text-[13px] font-semibold tracking-[.2em] text-mint">
            <span aria-hidden className="h-px w-8 bg-mint/50" />
            토탈 솔루션
          </p>
          <h3 className="mt-4 font-display text-[1.25rem] font-bold leading-[1.35] tracking-[-.02em] text-white sm:text-[1.375rem]">
            NST공법 새집증후군 및 실내공기질 개선 <span className="text-mint">-</span> 토탈 솔루션
          </h3>
        </div>
        <div className="space-y-3 text-[15px] leading-[1.7] text-white/70 sm:text-[16px] lg:col-span-6">
          <p>
            엔에스티는 단순한 제품 판매를 넘어, 실내 공기질 문제 진단부터 맞춤형 솔루션 기술보유, 원자재 관리, 제품 개발 및
            생산, 현장시공 그리고 사후 서비스까지 모든 과정을 아우르는 업계 유일 독보적인 ‘토탈 솔루션’을 제공합니다.
          </p>
          <p>
            고객님의 삶의 질 향상과 건강을 생각하며, 쾌적한 실내 공간에서 생활할 수 있도록 설계하는 20년 경력 노하우를 가진
            NST공법만의 차별화된 강점입니다.
          </p>
        </div>
      </div>
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TOTAL.map((s, i) => (
          <li
            key={s.t}
            data-reveal=""
            className={cn(
              REVEAL,
              "rounded-[24px] border border-white/12 bg-white/[.04] p-5 sm:p-6",
              i === TOTAL.length - 1 && "sm:col-span-2 lg:col-span-1",
            )}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span aria-hidden className="font-display text-[26px] font-black leading-none tracking-[-.04em] tabular-nums text-mint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-3 text-[17px] font-bold leading-[1.4] text-white">{s.t}</h4>
            <p className="mt-2 text-[15px] leading-[1.65] text-white/70">{s.d}</p>
          </li>
        ))}
      </ol>
      <p
        data-reveal=""
        className={cn(REVEAL, "mt-6 flex gap-3 rounded-[22px] bg-mint/[.08] px-5 py-4 text-[15px] leading-[1.7] text-white/85 ring-1 ring-mint/15 sm:text-[16px]")}
      >
        <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-mint" />
        <span>
          20년 경력과 노하우로 만들어진 현장 맞춤형 최적화 기술인 NST공법은 새집증후군 개선 지속 효과가 가능한 토탈 관리
          시스템입니다.
        </span>
      </p>
    </div>
  );
}

function Rings({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      {[1, 0.76, 0.52, 0.3].map((k, i) => (
        <span
          key={k}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/15 motion-safe:animate-[breathe_9s_ease-in-out_infinite]"
          style={{ width: `${k * 100}%`, height: `${k * 100}%`, animationDelay: `${i * -1.6}s` }}
        />
      ))}
    </div>
  );
}

export default function Process() {
  const rootRef = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Which step crosses the middle of the viewport drives the sticky stage (lg+).
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // overflow-clip (not -hidden): clips the decorative rings without creating a scroll container, so `sticky` keeps working.
  return (
    <section
      ref={rootRef}
      id="steps"
      aria-labelledby="process-title"
      className="relative overflow-clip bg-pine text-white"
    >
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 40% at 6% 0%, rgba(47,143,107,.42), transparent 70%), radial-gradient(55% 35% at 100% 100%, rgba(20,80,63,.95), transparent 72%)",
        }}
      />
      <Rings className="-right-56 -top-56 size-[620px] lg:-right-40 lg:-top-48 lg:size-[760px]" />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        {/* ---------- header ---------- */}
        <header className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p
              data-reveal=""
              className={cn(
                REVEAL,
                "inline-flex items-center gap-3 text-[13px] font-semibold tracking-[.2em] text-mint",
              )}
            >
              <span aria-hidden className="h-px w-8 bg-mint/50" />
              NST공법 시공 과정
            </p>
            <h2
              id="process-title"
              data-reveal=""
              className={cn(
                REVEAL,
                "mt-5 text-balance font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.15] tracking-[-.04em] text-white",
              )}
              style={{ transitionDelay: "80ms" }}
            >
              20년간 발전해 온 현장 <span className="text-mint">‘맞춤형 기술’</span> 입니다.
            </h2>
            <div
              data-reveal=""
              className={cn(REVEAL, "mt-6 max-w-[46ch] space-y-3 text-[17px] leading-[1.75] text-white/75 lg:text-[19px]")}
              style={{ transitionDelay: "160ms" }}
            >
              <p className="font-semibold text-white">
                20년의 노하우로 완성된 ‘3단계 현장 맞춤형’ 친환경 새집증후군 개선 시공 기술입니다.
              </p>
              <p>유해화학물질을 원천적으로 차단하고 지속제거하며, 주거공간의 실내공기질을 과학적으로 설계합니다.</p>
            </div>
          </div>

          {/* the old home's three stage lines */}
          <aside
            aria-labelledby="process-legend"
            data-reveal=""
            className={cn(
              REVEAL,
              "rounded-[28px] border border-white/12 bg-white/[.04] p-5 sm:p-7 lg:col-span-5",
            )}
            style={{ transitionDelay: "240ms" }}
          >
            <h3 id="process-legend" className="text-[16px] font-bold leading-[1.5] text-white sm:text-[17px]">
              신축 아파트 전세대 일괄시공으로 <span className="text-mint">‘검증된 기술’</span>입니다.
            </h3>
            <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {STEPS.filter((s) => s.line).map((s) => (
                <li key={s.n} className="flex items-center gap-3 py-3 text-[15px] leading-[1.55] text-white/85 sm:text-[16px]">
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-[13px] font-bold tabular-nums text-pine"
                  >
                    {Number(s.n)}
                  </span>
                  <span>{withCodes(s.line!)}</span>
                </li>
              ))}
            </ol>
          </aside>
        </header>

        <ThreeStepScience />

        {/* ---------- 업계 원조 기술 + the four old product cards, as a sequence ---------- */}
        <div data-reveal="" className={cn(REVEAL, "mt-20 max-w-[44rem] sm:mt-24 lg:mt-28")}>
          <h3 className="font-display text-[clamp(1.5rem,1.2rem+1.3vw,2rem)] font-extrabold leading-[1.2] tracking-[-.03em] text-white">
            업계 원조 기술은 다릅니다.
          </h3>
          <p className="mt-4 text-[17px] leading-[1.75] text-white/75 lg:text-[18px]">
            NST공법은 국내 유일의 새집증후군 개선 ‘통합 솔루션’으로 고객님의 실내공간의 공기질을 설계하고 유해물질을 원천
            제거합니다.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* sticky photo stage (desktop) — decorative twin of the inline photos */}
          <div aria-hidden className="relative hidden lg:col-span-6 lg:block">
            <div className="sticky top-[max(6.5rem,calc(50svh-16rem))]">
              <Rings className="-left-32 -top-32 size-[480px]" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-pine-2 shadow-[0_48px_90px_-48px_rgba(0,0,0,.7)] ring-1 ring-white/10">
                {STEPS.map((s, i) => (
                  <img
                    key={s.img}
                    src={s.img}
                    alt=""
                    width={900}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
                    style={{
                      objectPosition: s.pos,
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "scale(1)" : "scale(1.06)",
                    }}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-pine/85 to-transparent" />
                {STEPS.map((s, i) => (
                  <p
                    key={s.n}
                    className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 rounded-full bg-pine/75 px-4 py-2 text-[14px] text-white ring-1 ring-white/10 backdrop-blur-md transition-[opacity,transform] duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "none" : "translateY(8px)",
                    }}
                  >
                    <span className="font-semibold text-mint">{s.stage}</span>
                    {s.code && <span className="font-mono text-[13px]">{s.code}</span>}
                    <span className="text-white/80">{s.short}</span>
                  </p>
                ))}
              </div>
              <ol className="mt-6 grid grid-cols-4 gap-3">
                {STEPS.map((s, i) => (
                  <li key={s.n}>
                    <span className="block h-[3px] overflow-hidden rounded-full bg-white/12">
                      <span
                        className="block h-full origin-left rounded-full bg-mint transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
                        style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-2 block text-[13px]",
                        s.code && "font-mono",
                        i === active ? "text-white" : "text-white/50",
                      )}
                    >
                      {s.code ? s.code.replace("NST-", "") : "진단"}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* the steps */}
          <ol className="relative lg:col-span-6 lg:before:absolute lg:before:inset-y-0 lg:before:left-6 lg:before:w-px lg:before:bg-linear-to-b lg:before:from-white/0 lg:before:via-white/15 lg:before:to-white/0">
            {STEPS.map((s, i) => {
              const odd = i % 2 === 1;
              const state = i === active ? "active" : i < active ? "done" : "next";
              return (
                <li
                  key={s.n}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  data-step={i}
                  data-state={state}
                  className="group/step relative pb-20 last:pb-0 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-10 lg:pl-20 lg:last:pb-10"
                >
                  {/* inline photo (mobile/tablet) — alternating bleed */}
                  <div
                    data-reveal=""
                    className={cn(
                      REVEAL,
                      "relative lg:hidden",
                      odd ? "-mr-5 ml-8 sm:-mr-8 sm:ml-20" : "-ml-5 mr-8 sm:-ml-8 sm:mr-20",
                    )}
                  >
                    <img
                      src={s.img}
                      alt={s.alt}
                      width={900}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "aspect-[3/2] w-full bg-pine-2 object-cover",
                        odd ? "rounded-l-[28px]" : "rounded-r-[28px]",
                      )}
                      style={{ objectPosition: s.pos }}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-9 font-display text-[60px] font-black leading-none tracking-[-.05em] text-mint sm:text-[72px]",
                        odd ? "left-4" : "right-4",
                      )}
                    >
                      {s.n}
                    </span>
                  </div>

                  <div className="relative">
                    {/* numeral + rail node (desktop) */}
                    <div
                      aria-hidden
                      className="relative hidden font-display text-[clamp(64px,6vw,88px)] font-black leading-[.8] tracking-[-.06em] lg:block"
                    >
                      <span className="absolute -left-[65px] top-[calc(.36em-9px)] size-[18px]">
                        <span className="absolute inset-0 rounded-full border border-mint/40 bg-pine" />
                        <span className="absolute inset-[4px] rounded-full bg-mint opacity-0 transition-opacity duration-500 group-data-[state=active]/step:opacity-100 group-data-[state=done]/step:opacity-60" />
                        <span className="absolute -inset-3 opacity-0 transition-opacity duration-500 group-data-[state=active]/step:opacity-100">
                          <span className="absolute inset-0 rounded-full border border-mint/50 motion-safe:animate-[breathe_3.6s_ease-in-out_infinite]" />
                        </span>
                      </span>
                      <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(205,238,221,.42)]">
                        {s.n}
                      </span>
                      <span className="absolute inset-0 text-mint opacity-0 transition-opacity duration-500 group-data-[state=active]/step:opacity-100">
                        {s.n}
                      </span>
                    </div>

                    <div
                      data-reveal=""
                      className={cn(REVEAL, "mt-14 lg:mt-8")}
                      style={{ transitionDelay: "120ms" }}
                    >
                      <div className="transition-opacity duration-500 lg:opacity-50 lg:group-data-[state=active]/step:opacity-100">
                        <h3>
                          <span className="flex items-center gap-2.5 text-[14px] font-semibold tracking-[.06em] text-mint">
                            {s.stage}
                            <span aria-hidden className="h-px w-6 bg-mint/45" />
                            {s.role}
                          </span>
                          <span className="mt-3 block font-display text-[24px] font-extrabold leading-[1.25] tracking-[-.03em] text-white sm:text-[28px] lg:text-[32px]">
                            {s.title}
                          </span>
                        </h3>
                        {s.line && (
                          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-mint/25 bg-mint/[.08] py-1.5 pl-3.5 pr-4 text-[14px] text-white/85">
                            {withCodes(s.line)}
                          </p>
                        )}
                        <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.75] text-white/80 sm:text-[17px] lg:text-[18px]">
                          {withCodes(s.body)}
                        </p>
                        {s.facts.length > 0 && (
                          <dl className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5 border-t border-white/10 pt-4 text-[15px]">
                            {s.facts.map(([k, v]) => (
                              <div key={k} className="contents">
                                <dt className="text-white/60">{k}</dt>
                                <dd className="font-medium text-white/90">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {s.href && (
                          <a
                            href={s.href}
                            className="group/more mt-5 inline-flex min-h-11 items-center gap-2 rounded-full text-[15px] font-semibold text-mint underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine"
                          >
                            <span className="sr-only">{s.code} — </span>
                            클릭하시면 상세설명을 보실 수 있습니다
                            <ArrowRight
                              aria-hidden
                              className="size-4 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] group-hover/more:translate-x-0.5"
                            />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <TotalSolution />

        {/* ---------- after care + on-site check (old home lines) ---------- */}
        <div className="mt-20 grid gap-5 sm:mt-24 lg:mt-28 lg:grid-cols-12 lg:gap-6">
          <div data-reveal="" className={cn(REVEAL, "lg:col-span-7")}>
            <article className="relative isolate flex h-full flex-col gap-7 overflow-hidden rounded-[32px] bg-mint p-7 text-pine sm:flex-row sm:items-center sm:gap-9 sm:p-9">
              <div
                aria-hidden
                className="relative grid h-36 w-28 shrink-0 place-items-center overflow-hidden rounded-t-full rounded-b-[20px] bg-air ring-1 ring-pine/10 sm:h-44 sm:w-32"
              >
                <span className="absolute left-1/2 top-[38%] size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-leaf/30 motion-safe:animate-[breathe_5s_ease-in-out_infinite]" />
                <span className="absolute left-1/2 top-[38%] size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-leaf/20 motion-safe:animate-[breathe_5s_ease-in-out_-1.6s_infinite]" />
                <Wind className="relative -mt-4 size-9 text-leaf" strokeWidth={1.75} />
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-pine/10" />
              </div>
              <div>
                <p className="text-[13px] font-semibold tracking-[.14em] text-pine-2">시공 후</p>
                <h3 className="mt-2 font-display text-[26px] font-extrabold leading-[1.25] tracking-[-.03em] sm:text-[30px]">
                  자연환기(Bake-out)
                </h3>
                <p className="mt-3 text-[16px] leading-[1.75] text-pine/80 sm:text-[17px]">
                  ※NST공법 시공 후에는 생활 온도에서 2~3일간 ‘자연환기(Bake-out)’를 권장하여 시공 효율 극대화
                </p>
              </div>
            </article>
          </div>

          <div data-reveal="" className={cn(REVEAL, "lg:col-span-5")} style={{ transitionDelay: "120ms" }}>
            <article className="h-full rounded-[32px] border border-white/12 bg-white/[.05] p-7 sm:p-9">
              <p className="text-[13px] font-semibold tracking-[.14em] text-mint">현장 확인</p>
              <h3 className="mt-2 font-display text-[22px] font-extrabold leading-[1.35] tracking-[-.03em] text-white sm:text-[24px]">
                인체에 무해한 친환경 기술로 시공과정을 현장에 오셔서 확인할 수 있습니다.
              </h3>
              <p className="mt-6 flex gap-4 text-[16px] leading-[1.7] text-white/80">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mint/12 text-mint ring-1 ring-mint/20">
                  <MessageCircle aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <span>현장 방문이 어려운 경우, 실시간 문자 또는 카카오톡으로 시공 진행 상황을 안내해 드립니다.</span>
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
