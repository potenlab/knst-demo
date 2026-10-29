import { ArrowRight, Check, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

/* Only facts stated on knst.co.kr (same list as components/FinalCTA.tsx) */
const FACTS = ["현장 방문 확인 가능", "문자·카카오톡 실시간 시공 안내"];

/** Consultation block for blog pages → home #contact + phone. Light surface so the brand-blue button keeps contrast. */
export default function ConsultCTA({ id = "blog-consult" }: { id?: string }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="grain relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#eef8f2_0%,#cdeedd_100%)] ring-1 ring-leaf/15"
    >
      {/* breath rings, top-right */}
      <div aria-hidden className="pointer-events-none absolute -right-28 -top-28 -z-10 size-[26rem] sm:-right-20">
        {[0, 13, 26, 39].map((inset, i) => (
          <span
            key={inset}
            className="absolute rounded-full border motion-safe:animate-[breathe_10s_cubic-bezier(.4,0,.2,1)_infinite]"
            style={{ inset: `${inset}%`, borderColor: `rgba(47,143,107,${0.3 - i * 0.05})`, animationDelay: `${-i * 1.6}s` }}
          />
        ))}
      </div>

      <div className="grid gap-8 px-6 py-9 sm:px-10 sm:py-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:px-12 lg:py-12">
        <div>
          <p className="inline-flex items-center gap-2.5 text-[0.875rem] font-semibold tracking-[0.08em] text-pine-2">
            <span aria-hidden className="relative inline-block size-3.5">
              <span className="absolute inset-0 rounded-full border border-leaf" />
              <span className="absolute inset-[4px] rounded-full bg-leaf" />
            </span>
            상담 · 문의
          </p>
          <h2
            id={`${id}-title`}
            className="mt-4 text-pretty font-display text-[clamp(1.625rem,1.25rem+1.6vw,2.25rem)] font-bold leading-[1.3] tracking-[-0.03em] text-pine"
          >
            우리 집도 궁금하다면,
            <br />
            현장진단부터 받아 보세요
          </h2>
          <p className="mt-4 max-w-[34rem] text-[16px] leading-[1.75] text-ink/80 sm:text-[17px]">
            평수와 입주 예정일을 알려 주시면 상담해 드립니다. 시공 후 2~3일 베이크아웃을 권장하니, 입주 전에 여유 있게
            일정을 잡아 두세요.
          </p>
          <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {FACTS.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[15px] font-medium text-pine">
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
            href="/#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-14 justify-between gap-4 rounded-full bg-action pl-7 pr-2 text-[17px] font-bold text-white",
              "shadow-[0_18px_36px_-16px_rgba(0,71,156,.55)] transition-[translate,box-shadow,background-color] duration-300",
              "hover:-translate-y-0.5 hover:bg-action-hover focus-visible:ring-ink/30 motion-reduce:hover:translate-y-0",
              EASE,
            )}
          >
            무료 상담 신청
            <span className="grid size-10 place-items-center rounded-full bg-white text-action transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight aria-hidden className="size-5" />
            </span>
          </a>
          <a
            href="tel:0432222322"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full border border-pine/20 bg-white/70 px-7 text-[16px] font-semibold text-pine outline-none transition-colors duration-300 hover:border-pine/40 hover:bg-white focus-visible:ring-3 focus-visible:ring-trust/40"
          >
            <Phone aria-hidden className="size-4 text-leaf" />
            <span>
              전화 상담 <span className="font-bold tabular-nums">043-222-2322</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
