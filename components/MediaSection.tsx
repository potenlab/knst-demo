"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Play } from "lucide-react";
import LiteYouTube from "@/components/LiteYouTube";
import { cn } from "@/lib/utils";

const VIDEO_ID = "81_tlLaCGB4";
const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/* Scroll reveal. SSR/no-JS: everything visible. With JS (and motion allowed), only elements
   still below the fold are hidden, then revealed once as they enter the viewport. */
const REVEAL = cn(
  "transition-[opacity,translate] duration-[900ms] data-[reveal=out]:translate-y-7 data-[reveal=out]:opacity-0",
  EASE,
);
const wait = (ms: number): CSSProperties => ({ transitionDelay: `${ms}ms` });

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const fold = window.innerHeight * 0.92;
    const pending = els.filter((el) => el.getBoundingClientRect().top > fold);
    pending.forEach((el) => (el.dataset.reveal = "out"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.reveal = "in";
          io.unobserve(e.target);
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      pending.forEach((el) => (el.dataset.reveal = "in"));
    };
  }, []);
  return ref;
}

/* ── The three agents: small mechanism glyphs (40×40, stroke = currentColor) ── */
const glyph = {
  // particles arrive, a barrier stops them
  block: (
    <>
      <path d="M25 5v30" strokeWidth={2.6} />
      <circle cx="9" cy="12" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="20" r="2.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="28" r="2.3" fill="currentColor" stroke="none" />
      <path d="M2.5 12h2.5M8.5 20h2.5M2.5 28h2.5" opacity={0.55} />
      <path d="M30 14.5c2.2 1.4 3.4 3.3 3.4 5.5s-1.2 4.1-3.4 5.5" opacity={0.45} />
    </>
  ),
  // a bonded pair splits apart
  split: (
    <>
      <circle cx="10" cy="20" r="5.5" />
      <circle cx="30" cy="20" r="5.5" />
      <path d="M15.5 20h2.6M21.9 20h2.6" />
      <path d="M20 9.5v3.5M20 27v3.5M13.5 12.5l2 2M26.5 12.5l-2 2M13.5 27.5l2-2M26.5 27.5l-2-2" opacity={0.6} />
    </>
  ),
  // particles cling to a porous surface
  hold: (
    <>
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="3.2" opacity={0.5} />
      <circle cx="20" cy="9.8" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="29.2" cy="24" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="27.4" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="33.5" cy="7.5" r="1.7" fill="currentColor" stroke="none" opacity={0.7} />
      <path d="M37 4.5l-1.6 1.6" opacity={0.55} />
    </>
  ),
} satisfies Record<string, ReactNode>;

const AGENTS = [
  { word: "차단", place: "가구·목재", code: "NST-S200", g: glyph.block },
  { word: "분해", place: "벽·천장", code: "NST-S100", g: glyph.split },
  { word: "흡착", place: "밀폐공간", code: "NST-F100", g: glyph.hold },
];

export default function MediaSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="method"
      aria-labelledby="method-title"
      className="grain relative isolate overflow-hidden rounded-[2rem] bg-pine text-white sm:rounded-[2.75rem] lg:mx-4 lg:rounded-[3.5rem]"
    >
      {/* atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/3 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(47,143,107,.45),rgba(47,143,107,0))]" />
        <div className="absolute -right-48 -top-48 size-[40rem]">
          {[100, 74, 48].map((s) => (
            <span
              key={s}
              className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.07]"
              style={{ width: `${s}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-y-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10 lg:px-10 lg:py-28">
        {/* ── Heading ── */}
        <div data-reveal="" className={cn(REVEAL, "lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end")}>
          <p className="flex items-center gap-2.5 text-[14px] font-semibold text-mint sm:text-[15px]">
            <span aria-hidden="true" className="relative grid size-4 place-items-center">
              <span className="absolute inset-0 rounded-full border border-mint/50" />
              <span className="size-1.5 rounded-full bg-mint" />
            </span>
            엔에스티의 새집증후군 예방 시공
          </p>
          <h2
            id="method-title"
            className="mt-5 text-balance font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.22] tracking-[-0.03em]"
          >
            새집증후군의 원인을 근본적으로 해결하고 가족의{" "}
            <span className="whitespace-nowrap">
              <span className="relative text-mint">
                ‘깨끗한 숨’
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full text-leaf"
                >
                  <path d="M2 8c18-6 34-6 52-1s36 5 64-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              을
            </span>{" "}
            책임지는 친환경 기술입니다.
          </h2>
        </div>

        {/* ── Video ── */}
        <div
          data-reveal=""
          style={wait(120)}
          className={cn(REVEAL, "relative lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center lg:pr-6")}
        >
          {/* ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -bottom-14 top-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(131,214,170,.38),rgba(131,214,170,0))] blur-2xl"
          />

          <div
            className={cn(
              "group/frame relative mt-12 rounded-[1.75rem] bg-white/[.07] p-1.5 ring-1 ring-white/15 sm:mt-14 sm:p-2",
              "shadow-[0_50px_100px_-40px_rgba(0,0,0,.7),0_0_0_1px_rgba(205,238,221,.04)]",
              "transition-[transform,box-shadow] duration-700 has-[button:focus-visible]:ring-4 has-[button:focus-visible]:ring-mint",
              "lg:[transform:perspective(1800px)_rotateY(-7deg)_rotateX(3deg)] lg:hover:[transform:perspective(1800px)_rotateY(0deg)_rotateX(0deg)] lg:has-[iframe]:[transform:perspective(1800px)_rotateY(0deg)_rotateX(0deg)]",
              EASE,
            )}
          >
            {/* mascot 새집이, perched on the frame */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/saejibi.webp"
              alt=""
              width={150}
              height={168}
              loading="lazy"
              className={cn(
                "pointer-events-none absolute -top-[3.6rem] right-6 z-10 w-[3.75rem] drop-shadow-[0_8px_14px_rgba(0,0,0,.35)] sm:-top-[4.6rem] sm:right-10 sm:w-[4.75rem]",
                "origin-bottom transition-transform duration-500 group-hover/frame:-rotate-6",
                EASE,
              )}
            />

            <div
              className={cn(
                "group/video relative overflow-hidden rounded-[1.375rem] bg-ink",
                "[&_.video]:relative [&_.video]:aspect-video",
                "[&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full [&_iframe]:border-0",
                "[&_button]:absolute [&_button]:inset-0 [&_button]:size-full [&_button]:cursor-pointer [&_button]:outline-none",
                "[&_img]:size-full [&_img]:object-cover [&_.play]:hidden",
              )}
            >
              <LiteYouTube id={VIDEO_ID} start={30} title="NST공법 새집증후군 예방 시공 소개 영상" />

              {/* custom poster + play affordance (decorative; the button underneath takes the click) */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 group-has-[iframe]/video:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 size-full object-cover saturate-[.45] transition-[filter,scale] duration-700 group-hover/video:scale-[1.03] group-hover/video:saturate-100",
                    EASE,
                  )}
                />
                <div className="absolute inset-0 bg-[#0e3b32]/30 mix-blend-multiply transition-opacity duration-700 group-hover/video:opacity-0" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0e3b32]/80 via-[#0e3b32]/10 to-transparent" />

                <div className="absolute inset-0 grid place-items-center">
                  <span className="relative grid size-24 place-items-center sm:size-28">
                    <span
                      className="absolute inset-0 rounded-full border border-white/45"
                      style={{ animation: "breathe 4.8s cubic-bezier(.4,0,.2,1) infinite" }}
                    />
                    <span
                      className="absolute -inset-5 rounded-full border border-white/20"
                      style={{ animation: "breathe 4.8s cubic-bezier(.4,0,.2,1) -1.6s infinite" }}
                    />
                    <span
                      className={cn(
                        "relative grid size-16 place-items-center rounded-full bg-white text-pine shadow-[0_18px_40px_-12px_rgba(0,0,0,.55)] transition-[scale,background-color] duration-500 group-hover/video:scale-110 group-hover/video:bg-mint sm:size-[4.5rem]",
                        EASE,
                      )}
                    >
                      <Play className="ml-1 size-6 fill-current sm:size-7" strokeWidth={1.5} />
                    </span>
                  </span>
                </div>

                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:text-[14px]">
                  <span className="size-1.5 rounded-full bg-glow" />
                  NST공법 소개 영상
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.7] text-white/60 sm:text-[16px] lg:mt-8">
            엔에스티 기술력이 어떻게 실내공간을 변화시키고 우리가족 일상에 스며드는지 영상을 통해 확인하실 수 있습니다.
          </p>
        </div>

        {/* ── Body + three agents ── */}
        <div
          data-reveal=""
          style={wait(200)}
          className={cn(REVEAL, "lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-start")}
        >
          {/* verbatim from the old home */}
          <p className="text-[17px] leading-[1.75] text-white/80 sm:text-[18px]">
            NST공법은 휘발성유기화합물(VOCs), 포름알데하이드 등 실내공간에서 보이지 않는 유해물질을{" "}
            <strong className="font-bold text-white">[차단&amp;분해&amp;흡착] 제거</strong> 해주고 고객님의 소중한 공간을 보호합니다.
          </p>

          <div className="mt-10">
            <p id="agents-title" className="text-[13px] font-semibold tracking-[0.02em] text-white/55">
              차단 · 분해 · 흡착
            </p>
            <ul aria-labelledby="agents-title" className="mt-4 flex items-stretch">
              {AGENTS.map((a, i) => (
                <li
                  key={a.word}
                  data-reveal=""
                  style={wait(260 + i * 120)}
                  className={cn(
                    REVEAL,
                    "group/agent relative w-[36%] shrink-0",
                    i > 0 && "-ml-[4%]",
                    i === 1 && "lg:-translate-y-3 data-[reveal=out]:lg:translate-y-4",
                  )}
                >
                  <div
                    className={cn(
                      "flex aspect-square flex-col items-center justify-center rounded-full border border-mint/30 bg-[radial-gradient(closest-side,rgba(205,238,221,.10),rgba(205,238,221,.03))] px-2 text-center",
                      "transition-[border-color,background-color] duration-500 group-hover/agent:border-mint/70 group-hover/agent:bg-mint/[.08]",
                      EASE,
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 40 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-9 text-mint sm:size-11"
                    >
                      {a.g}
                    </svg>
                    <p className="mt-1.5 font-display text-[clamp(1.25rem,1rem+1.1vw,1.75rem)] font-extrabold leading-none tracking-[-0.03em] sm:mt-2">
                      {a.word}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-tight text-white/65 sm:text-[13px]">{a.place}</p>
                    <p className="mt-1 font-mono text-[10.5px] tracking-[0.04em] text-mint/75 sm:text-[11.5px]">{a.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
