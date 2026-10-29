"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy, Mail } from "lucide-react";
import { KakaoSymbol } from "@/components/KakaoFloat";
import { SITE } from "@/lib/site";

/* Old home "Contact NST" block: heading + "문의하기" button → /contact/. */
const CONTACT_URL = "/contact/";
const EMAIL = "isnst@naver.com";
const PHONE_MAIN = { display: "043-222-2322", tel: "0432222322" };
const PHONE_ALT = { display: "070-4270-7346", tel: "07042707346" };

const MAIL_SUBJECT = "새집증후군 시공 문의";
const MAIL_BODY = [
  "안녕하세요, 새집증후군 시공 상담을 요청합니다.",
  "",
  "· 평수: ",
  "· 지역(아파트·단지명): ",
  "· 입주 예정일: ",
  "· 연락받을 번호: ",
  "",
  "문의 내용:",
  "",
].join("\n");
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

/* Fragments of the old home's own lines (안전한 기술 block, OUR Difference) */
const BENEFITS = [
  "시공과정을 현장에 오셔서 확인",
  "실시간 문자 또는 카카오톡으로 시공 진행 상황 안내",
  "국내 대형건설사 직접 시공(전세대) 다수 실적",
];

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/* Scroll-linked entrance: CSS-only, transform/opacity, off under reduced motion
   and in browsers without scroll-driven animations (content simply shows). */
const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:both] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:cubic-bezier(.4,0,.2,1)] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_entry_75%]";

/* concentric "breath" rings: inset % of the ring field */
const RINGS = [0, 9, 18, 27, 36];

function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  // Fallback for in-app browsers (e.g. KakaoTalk) without the async Clipboard API
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (ok) resolve();
    else reject(new Error("copy failed"));
  });
}

function CopyPhone({ value }: { value: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2600);
    return () => window.clearTimeout(t);
  }, [state]);

  const onCopy = () => {
    copyText(value).then(
      () => setState("done"),
      () => setState("fail"),
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        className="group relative inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/25 py-2 pl-3 pr-5 text-[15px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        />
        <span aria-hidden className="relative grid size-8 place-items-center rounded-full bg-mint text-pine">
          <Copy
            className={`absolute size-4 transition-[translate,scale,rotate,opacity] duration-300 ${EASE} ${
              state === "done" ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Check
            strokeWidth={3}
            className={`absolute size-4 transition-[translate,scale,rotate,opacity] duration-300 ${EASE} ${
              state === "done" ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </span>
        <span className="relative">{state === "done" ? "복사했어요" : "번호 복사"}</span>
        <span className="sr-only"> {value}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "done"
          ? `${value} 번호를 복사했습니다.`
          : state === "fail"
            ? "복사하지 못했습니다. 번호를 길게 눌러 복사해 주세요."
            : ""}
      </span>
    </>
  );
}

export default function FinalCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="grain relative isolate overflow-hidden bg-pine text-white"
    >
      {/* ── backdrop: depth + fade into the footer ─────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(110%_70%_at_0%_0%,#14503f_0%,rgba(20,80,63,0)_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-[#0a2923]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-y-16 px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14 lg:px-10 lg:pb-20 lg:pt-40">
        {/* ── Copy + primary actions ─────────────────────────────────── */}
        <div className="relative z-10 lg:col-span-7 lg:row-start-1">
          <p className="inline-flex items-center gap-2.5 text-[0.875rem] font-semibold tracking-[0.08em] text-mint">
            <span aria-hidden className="relative inline-block size-3.5">
              <span className="absolute inset-0 rounded-full border border-mint/70" />
              <span className="absolute inset-[4px] rounded-full bg-mint" />
            </span>
            Contact NST
          </p>

          <h2
            id="contact-title"
            className="mt-6 font-display text-[clamp(1.625rem,1.1rem+2vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.035em] lg:text-[2.25rem]"
          >
            <span className={`block ${REVEAL}`}>새집증후군 예방!</span>
            <span className={`block ${REVEAL}`}>
              <span className="whitespace-nowrap">더 이상</span>{" "}
              <span className="whitespace-nowrap">고민하지 마세요.</span>
            </span>
            <span className={`mt-3 block text-mint ${REVEAL}`}>
              <span className="whitespace-nowrap">엔에스티가</span> 있습니다.
            </span>
          </h2>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {/* primary — larger than the hero CTA on purpose */}
            <a
              href={CONTACT_URL}
              className={`group relative inline-flex min-h-[4.75rem] items-center justify-between gap-6 rounded-full bg-glow py-2.5 pl-8 pr-2.5 text-[1.375rem] font-extrabold tracking-[-0.01em] text-pine shadow-[0_24px_50px_-18px_rgba(143,240,192,.8)] outline-none transition-transform duration-300 ${EASE} hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-glow/60 focus-visible:ring-offset-4 focus-visible:ring-offset-pine sm:min-h-[5.25rem] sm:pl-10 sm:text-[1.625rem]`}
            >
              문의하기
              <span className="grid size-14 place-items-center rounded-full bg-pine text-glow sm:size-16">
                <ArrowRight
                  aria-hidden
                  className={`size-7 transition-transform duration-300 ${EASE} group-hover:translate-x-0.5`}
                />
              </span>
            </a>

            <a
              href={MAILTO}
              className="group relative inline-flex min-h-16 items-center justify-center gap-3 rounded-full border border-white/30 px-7 text-[17px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine sm:min-h-[5.25rem] sm:px-8 sm:text-lg"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
              />
              <Mail aria-hidden className="relative size-5 text-mint" />
              <span className="relative">이메일 문의</span>
            </a>
          </div>

          <ul aria-label="엔에스티 시공 안내" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[16px] font-medium text-white/90">
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint ring-1 ring-mint/30"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Duotone arch + breath rings ────────────────────────────── */}
        <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-center">
          <div className={`relative ml-auto mr-1 w-[76%] max-w-[26rem] sm:mx-auto sm:w-[60%] lg:w-full ${REVEAL}`}>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[185%] -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgba(205,238,221,.16),rgba(205,238,221,0))]" />
              {RINGS.map((inset, i) => (
                <span
                  key={inset}
                  className="absolute rounded-full border border-mint/[0.14] motion-safe:animate-[breathe_9s_cubic-bezier(.4,0,.2,1)_infinite]"
                  style={{ inset: `${inset}%`, animationDelay: `${-i * 1.4}s` }}
                />
              ))}
            </div>

            {/* duotone: pine shadows → mint highlights (light bg + multiply, dark overlay + lighten) */}
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-[#c4ead6] shadow-[0_40px_80px_-30px_rgba(0,0,0,.65)]">
              <img
                src="/img/consult.webp"
                alt="상담 테이블에서 시공 상담을 진행하고 서류에 서명하는 모습"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover object-[47%_50%] mix-blend-multiply grayscale contrast-[1.15]"
              />
              <div aria-hidden className="absolute inset-0 bg-[#0b3029] mix-blend-lighten" />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/0 to-pine/0"
              />
              <div aria-hidden className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
            </div>

            <a
              href={SITE.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -left-6 bottom-8 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#FEE500] py-2.5 pl-3 pr-4 text-[15px] font-semibold text-[#191919] shadow-[0_18px_40px_-16px_rgba(0,0,0,.55)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine sm:-left-10"
            >
              <KakaoSymbol className="size-5" />
              카카오톡 1:1 채팅
              <span className="sr-only">(새 창)</span>
            </a>
          </div>
        </div>

        {/* ── Phone: the giant alternative action ────────────────────── */}
        <div className="lg:col-span-12 lg:row-start-2">
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-mint/50 via-mint/15 to-transparent" />
          <div className="pt-9 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10">
            <div className="lg:col-span-8">
              <h3 className="text-[0.875rem] font-semibold tracking-[0.08em] text-mint">전화로 바로 상담</h3>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={`tel:${PHONE_MAIN.tel}`}
                  className="group relative whitespace-nowrap rounded-lg font-display text-[clamp(1.75rem,1.1rem+2.4vw,2.5rem)] font-extrabold leading-[1.15] tracking-[-0.03em] tabular-nums text-white outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-4 focus-visible:ring-offset-pine lg:text-[clamp(2.25rem,3vw,2.75rem)]"
                >
                  <span className="sr-only">전화 걸기 </span>
                  {PHONE_MAIN.display}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-1 h-[3px] origin-left scale-x-0 rounded-full bg-mint transition-transform duration-500 ${EASE} group-hover:scale-x-100`}
                  />
                </a>
                <CopyPhone value={PHONE_MAIN.display} />
              </div>
            </div>

            <div className="mt-6 lg:col-span-4 lg:mt-0 lg:pt-11">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <a
                  href={`tel:${PHONE_ALT.tel}`}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md font-display text-[1.75rem] font-bold tracking-[-0.02em] tabular-nums text-white/90 underline decoration-white/0 underline-offset-[6px] outline-none hover:decoration-mint focus-visible:ring-2 focus-visible:ring-mint sm:text-[2rem]"
                >
                  <span className="sr-only">전화 걸기 </span>
                  {PHONE_ALT.display}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md text-[17px] text-white/85 underline decoration-white/30 underline-offset-[6px] outline-none hover:decoration-mint focus-visible:ring-2 focus-visible:ring-mint"
                >
                  <Mail aria-hidden className="size-[18px] text-mint" />
                  {EMAIL}
                </a>
              </div>

              <a
                href={SITE.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md text-[17px] text-white/85 underline decoration-white/30 underline-offset-[6px] outline-none hover:decoration-mint focus-visible:ring-2 focus-visible:ring-mint"
              >
                <KakaoSymbol className="size-[18px] text-[#FEE500]" />
                카카오톡 1:1 채팅
                <span className="sr-only">(새 창)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
