import { Mail, MessageCircle, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PageShell from "@/components/pages/PageShell";
import { pageMetadata } from "@/components/pages/seo";
import { Codes, EASE, FOCUS, H3, PageCTA, WRAP } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

/*
 * 자주묻는질문 — old /faq/ (Q1–Q8, verbatim) + the Q&A blocks of two old 자료실 pages:
 * /nst-method-three-step-process/ (3) and /test-report-verification/ (5). FAQPage JSON-LD = visible text.
 */

const PATH = "/faq/";
const TITLE = "자주묻는질문 · NST공법 FAQ";
const DESCRIPTION =
  "NST공법이란? 시공 후 바로 입주할 수 있는지, 아이·반려동물 안전, 시공 시간(34평 약 3~4시간), 제품 단독 구매 여부, 간이측정기와 공인시험성적서의 차이까지 자주 묻는 질문을 모았습니다.";

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

type QA = { q: string; a: string[]; list?: string[]; after?: string[] };
type Group = { id: string; title: string; source: { label: string; href: string }; items: QA[] };

const GROUPS: Group[] = [
  {
    id: "basic",
    title: "자주묻는 질문",
    source: { label: "knst.co.kr/faq", href: "https://knst.co.kr/faq/" },
    items: [
      {
        q: "NST공법이란 무엇인가요?",
        a: [
          "NST공법은 실내 공간에서 이미 발생했거나 앞으로 방출될 수 있는 유해물질을 단계적으로 제거하는 흡착 → 분해 → 차단하는 3단계 과정을 통해 안전하고 건강한 주거환경을 실현합니다.",
        ],
        list: [
          "NST-S100은 벽면·천장에 도포되어 빛(가시광 등)에 반응하는 광촉매 작용으로 유해가스를 지속 분해하고, 자가세정 코팅막을 형성합니다.",
          "NST-S200은 가구 및 붙박이장으로부터 유해물질이 실내로 확산되는 것을 사전에 차단하는 차단막(기공 차단)을 생성하는 역할을 합니다.",
          "NST-F100은 빛이 닿지 않는 암실, 가구 내부, 장롱 속 등에서도 작동하는 천연 기반 흡착·탈취 솔루션으로, 공간 전체의 잔류 유해가스를 안전하게 제거합니다.",
        ],
        after: ["NST공법은 20년간 축적된 기술력으로 완성된 새집증후군 근본 해결형 친환경 실내공기질 개선 솔루션입니다."],
      },
      { q: "새집증후군의 원인은 무엇인가요?", a: ["도배·장판·가구에서 나오는 포름알데히드와 VOCs 같은 유해 화학물질이 주요 원인입니다."] },
      {
        q: "일반 탈취 서비스와 차이는 무엇인가요?",
        a: [
          "탈취제는 냄새만 잠시 가리지만, NST공법은 유해물질 자체를 분해하여 효과가 오래가며 앞으로 발생될 유해물질을 차단하기 때문에 근본적인 솔루션을 제공한다는 것에 차이가 있습니다.",
        ],
      },
      {
        q: "NST 제품은 어떤 종류가 있나요?",
        a: [],
        list: ["NST-S100 : 벽·천장용 (흡착/분해 코팅)", "NST-S200 : 가구·목재용 (차단/차폐 코팅)", "NST-F100 : 붙박이장·신발장 등 밀폐공간용 (흡착/탈취제)"],
      },
      {
        q: "시공 후 바로 입주할 수 있나요?",
        a: [
          "NST공법은 무해한 친환경 성분만 사용하기 때문에 시공 후 환기만 하시면 곧바로 생활이 가능합니다.",
          "또한 원하실 경우, 시공 현장을 직접 참관하실 수 있어 안심하실 수 있습니다.",
        ],
      },
      { q: "아이나 반려동물이 있어도 안전한가요?", a: ["안전합니다. 공인 시험기관 검증을 거쳐 영유아·임산부·반려동물까지 안심할 수 있습니다."] },
      { q: "시공 시간은 얼마나 걸리나요?", a: ["아파트 34평 기준 약 3~4시간이 소요됩니다."] },
      {
        q: "제품만 따로 구매할 수 있나요?",
        a: [
          "NST공법은 단순히 제품만 사용하는 것이 아니라 전문 시공 노하우와 품질 관리가 함께해야 효과가 극대화됩니다.",
          "따라서 제품 단독 구매는 불가하며 NST 공식 지점을 통한 시공 서비스로만 만나보실 수 있습니다.",
        ],
      },
    ],
  },
  {
    id: "method",
    title: "NST공법 3단계 시공",
    source: { label: "NST공법이란? 3단계 시공 원리", href: "https://knst.co.kr/nst-method-three-step-process/" },
    items: [
      {
        q: "빛이 없는 야간이나 서랍 안쪽에서도 정말 효과가 있나요?",
        a: [
          "네. NST-S100의 듀얼 촉매 기술은 빛이 없을 때는 오염물질을 포집해 두고, 조명이나 햇빛이 비칠 때 분해하는 시스템을 갖춰 24시간 끊임없이 공기질을 관리합니다.",
        ],
      },
      {
        q: "일반적인 베이크아웃이나 단기 새집증후군 시공과 가장 큰 차이점은 무엇인가요?",
        a: [
          "단순 탈취제나 향으로 냄새만 덮거나 일시적으로 오염물질을 날려보내는 것이 아니라, 유해물질의 방출원 자체를 구조적으로 차단하고 억제(NST-S200)한다는 점입니다. 이로 인해 단기적인 효과에 그치지 않고 지속형 관리가 가능합니다.",
        ],
      },
      {
        q: "1,018세대 일괄시공 등 대형 현장 검증이 왜 중요한가요?",
        a: [
          "대형 건설사가 요구하는 까다로운 환경, 안전 기준, 그리고 품질 관리 기준을 모두 통과했다는 공식적인 증명이기 때문입니다. 이러한 반복 검증을 통해 현장에서 발생할 수 있는 변수를 통제하는 매뉴얼을 완성했습니다.",
        ],
      },
    ],
  },
  {
    id: "measure",
    title: "시험성적서·측정",
    source: { label: "공인시험성적서와 간이측정 결과의 차이", href: "https://knst.co.kr/test-report-verification/" },
    items: [
      {
        q: "간이측정기 수치가 낮게 나오면 새집증후군이 해결된 건가요?",
        a: [
          "아닙니다. 간이측정기 수치는 온도, 습도, 환기 상태, 측정 위치, 센서 상태 등에 따라 달라질 수 있습니다. 낮은 수치가 일시적으로 나왔다고 해서 오염물질 발생원이 완전히 관리되었다고 단정하기는 어렵습니다.",
        ],
      },
      {
        q: "포름알데히드는 측정이 가능한가요?",
        a: [
          "가능합니다. 포름알데히드는 공인시험기관을 통해 공식 측정이 가능한 항목입니다. 다만 현장용 포름알데히드 간이측정기의 순간 수치는 공인시험성적서와 동일한 공식 결과로 보기 어렵습니다.",
        ],
      },
      {
        q: "포름알데히드 간이측정기도 국가 성능인증 대상인가요?",
        a: [
          "현재 환경분야 간이측정기 성능인증 대상에는 실내공기질 분야의 이산화탄소와 라돈 등이 포함되어 있으나, 포름알데히드 간이측정기는 대상 항목에 포함되어 있지 않습니다. 따라서 포름알데히드 간이측정 수치는 공식 성적서와 구분해 참고용으로 보는 것이 적절합니다.",
        ],
      },
      {
        q: "NST공법은 왜 간이측정기 수치보다 공인시험성적서를 강조하나요?",
        a: [
          "간이측정기 수치는 현장에서 바로 확인할 수 있다는 장점이 있지만, 환경 조건과 센서 방식에 따라 편차가 발생할 수 있습니다. NST공법은 순간 수치보다 공인시험성적서, 제품 안전성 자료, 표준화된 시공 공정, 대형 현장 적용 실적을 기준으로 신뢰성을 설명드립니다.",
        ],
      },
      {
        q: "KBS 보도는 어떻게 이해해야 하나요?",
        a: [
          "KBS 보도는 일부 간이측정기의 정확도와 신뢰성 문제가 제기된 사례로 참고할 수 있습니다. 다만 모든 간이측정기가 허위라는 뜻이 아니라, 간이측정 수치만으로 새집증후군 개선 효과를 단정하는 것은 주의해야 한다는 의미로 이해하는 것이 적절합니다.",
        ],
      },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

function PlusMinus() {
  const bar = "absolute rounded-full bg-pine transition-[scale,background-color] duration-500 group-aria-expanded/accordion-trigger:bg-white";
  return (
    <span
      aria-hidden
      className={cn(
        "relative mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-pine/15 bg-air transition-[background-color,border-color] duration-500",
        "group-hover/accordion-trigger:border-pine/40 group-aria-expanded/accordion-trigger:border-pine group-aria-expanded/accordion-trigger:bg-pine",
        EASE,
      )}
    >
      <span className={cn(bar, "h-[2px] w-3.5", EASE)} />
      <span className={cn(bar, "h-3.5 w-[2px] group-aria-expanded/accordion-trigger:scale-y-0", EASE)} />
    </span>
  );
}

export default function FaqPage() {
  let n = 0;
  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "고객지원", href: "/contact/" }, { label: "자주묻는질문" }]}
      eyebrow="고객지원 · FAQ"
      title="궁금한 점이 있으신가요?"
      name={TITLE}
      description={DESCRIPTION}
      pageType="FAQPage"
      pageExtra={{
        mainEntity: ALL.map(({ q, a, list, after }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: [...a, ...(list ?? []), ...(after ?? [])].join("\n") },
        })),
      }}
      toc={GROUPS.map((g) => ({ id: g.id, label: g.title }))}
    >
      <div className={cn(WRAP, "grid gap-12 pb-16 lg:grid-cols-12 lg:gap-x-10")}>
        <div className="space-y-14 lg:col-span-8">
          {GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-pine pb-3">
                <h2 id={`${g.id}-title`} className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold tracking-[-0.03em] text-pine">
                  {g.title} <span className="font-sans text-[15px] font-semibold tabular-nums text-muted-ink">{g.items.length}</span>
                </h2>
                <a href={g.source.href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-11 items-center rounded px-1 text-[13px] text-muted-ink hover:text-pine", FOCUS)}>
                  원문: {g.source.label}
                  <span className="sr-only">(새 창)</span>
                </a>
              </div>
              <Accordion hiddenUntilFound defaultValue={g.id === "basic" ? ["basic-1"] : []} className="mt-4 gap-3">
                {g.items.map((qa, i) => {
                  n += 1;
                  return (
                    <AccordionItem
                      key={qa.q}
                      value={`${g.id}-${i + 1}`}
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
                        <span className="w-8 shrink-0 pt-[9px] font-display text-[15px] font-bold tabular-nums text-pine-2/80">Q{n}</span>
                        <span className="flex-1 pt-[8px] tracking-[-0.01em]">{qa.q}</span>
                        <PlusMinus />
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 pl-11 pr-1 text-[16px] leading-[1.8] text-ink/80 sm:pb-7 sm:pl-12 sm:pr-14 sm:text-[17px] [&_p:not(:last-child)]:mb-2.5">
                        {qa.a.map((line) => (
                          <p key={line}>
                            <Codes text={line} />
                          </p>
                        ))}
                        {qa.list && (
                          <ul className="mt-2 space-y-2">
                            {qa.list.map((l) => (
                              <li key={l} className="relative pl-4 before:absolute before:left-0 before:top-[0.75em] before:size-1.5 before:rounded-full before:bg-leaf">
                                <Codes text={l} />
                              </li>
                            ))}
                          </ul>
                        )}
                        {qa.after?.map((line) => (
                          <p key={line} className="mt-3">
                            <Codes text={line} />
                          </p>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          ))}
        </div>

        {/* contact aside */}
        <aside aria-labelledby="faq-ask" className="lg:col-span-4">
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(14,59,50,.6)] ring-1 ring-hairline sm:p-7 lg:sticky lg:top-28">
            <h2 id="faq-ask" className={cn(H3, "text-ink")}>
              문의하기
            </h2>
            <p className="mt-1 text-[15px] leading-[1.6] text-muted-ink">상담 신청을 남겨주시면 빠르게 연락드리겠습니다.</p>
            <a href="tel:0432222322" className={cn("mt-5 flex min-h-14 items-center gap-3 rounded-2xl bg-air px-4 py-3 hover:bg-mint/60", FOCUS)}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pine text-white">
                <Phone aria-hidden className="size-[18px]" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium text-muted-ink">전화상담</span>
                <span className="font-display text-[21px] font-bold tabular-nums text-pine">043-222-2322</span>
              </span>
            </a>
            <a href="mailto:isnst@naver.com" className={cn("mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-hairline px-4 text-[15px] font-semibold text-ink hover:border-pine/40", FOCUS)}>
              <Mail aria-hidden className="size-[18px] text-pine-2" />
              isnst@naver.com
            </a>
            <a
              href="https://pf.kakao.com/_ScCkn"
              target="_blank"
              rel="noopener noreferrer"
              className={cn("mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-hairline px-4 text-[15px] font-semibold text-ink hover:border-pine/40", FOCUS)}
            >
              <MessageCircle aria-hidden className="size-[18px] text-pine-2" />
              카톡 : 1:1 채널 채팅
              <span className="sr-only">(새 창)</span>
            </a>
            <nav aria-label="관련 페이지" className="mt-5 flex flex-wrap gap-2">
              <a href="/products/" className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}>
                제품현황
              </a>
              <a href="/evidence/" className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}>
                시험성적서·시공 실적
              </a>
            </nav>
          </div>
        </aside>
      </div>

      <PageCTA />
    </PageShell>
  );
}
