import { ArrowRight, Mail, Phone } from "lucide-react";
import { KakaoSymbol } from "@/components/KakaoFloat";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Element 9 — FAQ (home excerpt of /faq/).
 * Group 1: the old /faq/ Q&A, verbatim. Group 2: Q&A blocks inside the company's columns, verbatim.
 * No FAQPage JSON-LD here — it lives only on /faq/ (one FAQPage per site for the same questions).
 * Tenure follows the company's own "20년" wording site-wide.
 */

type QA = { q: string; a: string[] };
type ColumnQA = QA & { href: string; column: string };

const FAQ_URL = "/faq/";

const OFFICIAL: QA[] = [
  {
    q: "NST공법이란 무엇인가요?",
    a: [
      "NST공법은 실내 공간에서 이미 발생했거나 앞으로 방출될 수 있는 유해물질을 단계적으로 제거하는 흡착 → 분해 → 차단 하는 3단계 과정을 통해 안전하고 건강한 주거환경을 실현합니다.",
      "NST-S100은 벽면·천장에 도포되어 빛(가시광 등)에 반응하는 광촉매 작용으로 유해가스를 지속 분해하고, 자가세정 코팅막을 형성합니다.",
      "NST-S200은 가구 및 붙박이장으로 부터 유해물질이 실내로 확산되는 것을 사전에 차단하는 차단막(기공 차단)을 생성하는 역할을 합니다.",
      "NST-F100은 빛이 닿지 않는 암실, 가구 내부, 장롱 속 등에서도 작동하는 천연 기반 흡착·탈취 솔루션으로, 공간 전체의 잔류 유해가스를 안전하게 제거합니다.",
      "NST공법은 20년간 축적된 기술력으로 완성된 새집증후군 근본 해결형 친환경 실내공기질 개선 솔루션입니다.",
    ],
  },
  {
    q: "새집증후군의 원인은 무엇인가요?",
    a: ["도배·장판·가구에서 나오는 포름알데히드와 VOCs 같은 유해 화학물질이 주요 원인입니다."],
  },
  {
    q: "일반 탈취 서비스와 차이는 무엇인가요?",
    a: [
      "탈취제는 냄새만 잠시 가리지만, NST공법은 유해물질 자체를 분해하여 효과가 오래가며 앞으로 발생될 유해물질을 차단하기 때문에 근본적인 솔루션을 제공한다는 것에 차이가 있습니다.",
    ],
  },
  {
    q: "NST 제품은 어떤 종류가 있나요?",
    a: [
      "NST-S100 : 벽·천장용 (흡착/분해 코팅)",
      "NST-S200 : 가구·목재용 (차단/차폐 코팅)",
      "NST-F100 : 붙박이장·신발장 등 밀폐공간용 (흡착/탈취제)",
    ],
  },
  {
    q: "시공 후 바로 입주할 수 있나요?",
    a: [
      "NST공법은 무해한 친환경 성분만 사용하기 때문에 시공 후 환기만 하시면 곧바로 생활이 가능합니다.",
      "또한 원하실 경우, 시공 현장을 직접 참관하실 수 있어 안심하실 수 있습니다.",
    ],
  },
  {
    q: "아이나 반려동물이 있어도 안전한가요?",
    a: ["안전합니다. 공인 시험기관 검증을 거쳐 영유아·임산부·반려동물까지 안심할 수 있습니다."],
  },
  {
    q: "시공 시간은 얼마나 걸리나요?",
    a: ["아파트 34평 기준 약 3~4시간이 소요됩니다."],
  },
  {
    q: "제품만 따로 구매할 수 있나요?",
    a: [
      "NST 공법은 단순히 제품만 사용하는 것이 아니라 전문 시공 노하우와 품질 관리가 함께해야 효과가 극대화됩니다.",
      "따라서 제품 단독 구매는 불가하며 NST 공식 지점을 통한 시공 서비스로만 만나보실 수 있습니다.",
    ],
  },
];

const FROM_COLUMNS: ColumnQA[] = [
  {
    q: "베이크아웃과 환기만으로 포름알데히드를 없앨 수 없나요?",
    a: [
      "환기와 베이크아웃은 좋은 방법이지만 한계가 명확합니다. 앞서 설명했듯 환기는 ‘이미 공기 중으로 나온 물질’을 빼낼 뿐입니다. 자재 속에서 수년간 지속적으로 뿜어져 나오는 포름알데히드의 근본적인 방출을 막으려면 전문적인 차폐 시공(NST-S200 등)이 병행되어야 합니다.",
    ],
    href: "/blog/new-house-syndrome-formaldehyde-vocs/",
    column: "새집증후군이란? 포름알데히드와 VOCs",
  },
  {
    q: "편백수나 피톤치드를 뿌리면 유해물질이 사라지나요?",
    a: [
      "사라지지 않습니다. 편백수와 피톤치드는 강한 향으로 화학적 냄새를 덮는(Masking) 역할만 할 뿐, 포름알데히드나 VOCs를 구조적으로 분해하거나 방출을 억제하는 기능이 없습니다. 냄새를 덮는 것과 유해물질의 발생을 줄이는 것은 완전히 다른 과정입니다.",
    ],
    href: "/blog/new-house-syndrome-formaldehyde-vocs/",
    column: "새집증후군이란? 포름알데히드와 VOCs",
  },
  {
    q: "입주청소와 NST공법 중 어떤 것을 먼저 해야 하나요?",
    a: [
      "입주청소를 먼저 진행하여 물리적인 먼지와 오염물질을 제거한 후, 깨끗해진 공간에 NST공법 시공을 진행하여 방출원 차단막을 형성하고 촉매를 코팅하는 것이 정석입니다.",
    ],
    href: "/blog/move-in-cleaning-vs-air-quality/",
    column: "입주청소만으로는 새집증후군이 해결되지 않는 이유",
  },
  {
    q: "벽지나 마루가 손상되지 않나요?",
    a: ["미립자 형태로 코팅되므로 시각적 변화나 자재 손상 없이 안전하게 시공됩니다."],
    href: "/blog/nst-s100-dual-catalyst/",
    column: "NST-S100: 생활공간 지속케어용 하이앤드 듀얼촉매",
  },
];

/* scroll-linked entrance — transform/opacity only, progressive (no-op where unsupported or reduced motion) */
const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:forwards] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:linear] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_cover_24%]";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2";

/** Product codes are Latin — render them in Plex Mono, keep the Korean in Pretendard. */
function withCodes(line: string) {
  return line.split(/(NST-[SF]\d{3})/g).map((part, i) =>
    /^NST-[SF]\d{3}$/.test(part) ? (
      <span key={i} className="font-mono text-[0.92em] font-medium text-pine">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function PlusMinus() {
  const bar = "absolute rounded-full bg-pine transition-[scale,background-color] duration-500 group-aria-expanded/accordion-trigger:bg-white";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-pine/15 bg-air transition-[background-color,border-color,rotate] duration-500 sm:size-11",
        "group-hover/accordion-trigger:border-pine/40 group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:border-pine group-aria-expanded/accordion-trigger:bg-pine",
        EASE,
      )}
    >
      <span className={cn(bar, "h-[2px] w-3.5", EASE)} />
      <span className={cn(bar, "h-3.5 w-[2px] group-aria-expanded/accordion-trigger:scale-y-0", EASE)} />
    </span>
  );
}

function Item({
  value,
  n,
  qa,
  column,
}: {
  value: string;
  n: number;
  qa: QA;
  column?: { href: string; column: string };
}) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        "group/item rounded-[1.5rem] border border-hairline bg-white/60 px-4 transition-[background-color,border-color,box-shadow] duration-500 sm:px-6",
        "hover:border-pine/25 data-[open]:border-leaf/35 data-[open]:bg-white data-[open]:shadow-[0_28px_56px_-36px_rgba(14,59,50,.55)]",
        EASE,
      )}
    >
      <AccordionTrigger
        className={cn(
          "min-h-11 items-start gap-3 rounded-[1.1rem] py-4 text-[17px] font-semibold leading-[1.5] text-ink hover:no-underline sm:gap-4 sm:py-5 sm:text-[18px]",
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-trust/60",
          "**:data-[slot=accordion-trigger-icon]:hidden!",
        )}
      >
        <span className="w-7 shrink-0 pt-[11px] font-display text-[15px] font-bold leading-[1.5] tabular-nums text-pine-2/80 sm:w-8 sm:pt-[12px] sm:text-[16px]">
          {String(n).padStart(2, "0")}
        </span>
        <span className="flex-1 pt-[9px] tracking-[-0.01em] sm:pt-[10px]">{qa.q}</span>
        <PlusMinus />
      </AccordionTrigger>
      <AccordionContent className="pb-6 pl-10 pr-1 text-[16px] leading-[1.75] text-muted-ink sm:pb-7 sm:pl-12 sm:pr-14 sm:text-[17px] [&_a]:no-underline [&_a]:hover:text-trust [&_p:not(:last-child)]:mb-2.5">
        <div
          className={cn(
            "translate-y-1.5 opacity-0 transition-[opacity,translate] duration-500 group-data-[open]/item:translate-y-0 group-data-[open]/item:opacity-100",
            EASE,
          )}
        >
          {qa.a.map((line, i) => (
            <p key={i}>{withCodes(line)}</p>
          ))}
          {column && (
            <a
              href={column.href}
              className={cn(
                "mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-pine/15 bg-air px-4 text-[15px] font-semibold text-trust transition-colors duration-300 hover:border-trust/40 hover:bg-white",
                FOCUS,
              )}
            >
              <span>
                <span className="sr-only">칼럼 </span>「{column.column}」 더 보기
              </span>
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative isolate overflow-clip bg-[linear-gradient(180deg,#f6faf7_0%,#e6f6ed_14%,#e2f4ea_70%,#eaf7f0_100%)]"
    >
      {/* breath rings, bottom-left — the page's recurring motif */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-[34rem] sm:-bottom-56 sm:-left-56 sm:size-[46rem]">
        {[100, 78, 56].map((s, i) => (
          <span
            key={s}
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-leaf/20"
            style={{ width: `${s}%`, animation: `breathe 10s cubic-bezier(.4,0,.2,1) ${-i * 2.4}s infinite` }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-x-6 lg:px-10 lg:py-32">
        {/* ── sticky intro + contact ── */}
        <div className="lg:col-span-4">
          <div className={cn("lg:sticky lg:top-28", REVEAL)}>
            <p className="flex items-center gap-2.5 text-[14px] font-bold tracking-[0.08em] text-pine-2">
              <span aria-hidden="true" className="relative grid size-3 place-items-center">
                <span className="absolute inset-0 rounded-full border border-leaf/60" />
                <span className="size-1.5 rounded-full bg-leaf" />
              </span>
              고객지원
            </p>
            <h2
              id="faq-title"
              className="mt-4 font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-pine"
            >
              자주 묻는
              <br />
              질문
            </h2>

            <aside
              aria-labelledby="faq-contact-title"
              className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(14,59,50,.6)] ring-1 ring-hairline sm:p-7"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-[radial-gradient(closest-side,rgba(205,238,221,.9),rgba(205,238,221,0))]"
              />
              <h3 id="faq-contact-title" className="relative text-[17px] font-bold text-ink">
                문의하기
              </h3>

              <a
                href="tel:0432222322"
                className={cn(
                  "group relative mt-5 flex min-h-14 items-center gap-3 rounded-2xl bg-air px-4 py-3 transition-colors duration-300 hover:bg-mint/60",
                  FOCUS,
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pine text-white">
                  <Phone aria-hidden="true" className="size-[18px]" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[13px] font-medium text-muted-ink">전화 상담</span>
                  <span className="font-display text-[22px] font-bold tracking-[-0.02em] text-pine tabular-nums">043-222-2322</span>
                </span>
              </a>
              <p className="relative mt-2 pl-[3.75rem] text-[14px] text-muted-ink">
                또는{" "}
                <a href="tel:07042707346" className={cn("rounded font-semibold text-ink underline decoration-hairline underline-offset-4 hover:decoration-pine", FOCUS)}>
                  070-4270-7346
                </a>
              </p>

              <a
                href="mailto:isnst@naver.com"
                className={cn(
                  "relative mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-hairline px-4 py-2.5 text-[15px] font-semibold text-ink transition-colors duration-300 hover:border-pine/40",
                  FOCUS,
                )}
              >
                <Mail aria-hidden="true" className="size-[18px] text-pine-2" />
                isnst@naver.com
              </a>
              <a
                href={SITE.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "relative mt-3 flex min-h-12 items-center gap-3 rounded-2xl bg-[#FEE500] px-4 py-2.5 text-[15px] font-semibold text-[#191919] transition-[filter] duration-300 hover:brightness-95",
                  FOCUS,
                )}
              >
                <KakaoSymbol className="size-[18px]" />
                카카오톡 1:1 채팅
                <span className="sr-only">(새 창)</span>
              </a>
              <a
                href="#contact"
                className={cn(
                  "relative mt-3 flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 text-[15px] font-semibold text-trust transition-colors duration-300 hover:bg-air",
                  FOCUS,
                )}
              >
                무료 상담 신청하기
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </aside>
          </div>
        </div>

        {/* ── questions ── */}
        <div className="lg:col-span-8 lg:col-start-5 lg:pl-6">
          <div className={REVEAL}>
            <p className="mb-4 flex items-baseline justify-between gap-4 text-[14px] font-semibold text-muted-ink">
              <span>
                자주묻는 질문 <span className="tabular-nums text-pine-2">{OFFICIAL.length}</span>
              </span>
              <a
                href={FAQ_URL}
                className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[14px] text-muted-ink hover:text-pine", FOCUS)}
              >
                자주묻는질문 전체 보기
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </p>
            <Accordion hiddenUntilFound defaultValue={["faq-1"]} className="gap-3">
              {OFFICIAL.map((qa, i) => (
                <Item key={qa.q} value={`faq-${i + 1}`} n={i + 1} qa={qa} />
              ))}
            </Accordion>
          </div>

          <div className={cn("mt-14", REVEAL)}>
            <p className="mb-4 flex items-center gap-3 text-[14px] font-semibold text-muted-ink">
              NST공법 칼럼 <span className="tabular-nums text-pine-2">{FROM_COLUMNS.length}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
            </p>
            <Accordion hiddenUntilFound className="gap-3">
              {FROM_COLUMNS.map((qa, i) => (
                <Item key={qa.q} value={`col-${i + 1}`} n={OFFICIAL.length + i + 1} qa={qa} column={qa} />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
