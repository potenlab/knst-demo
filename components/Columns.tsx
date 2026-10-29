import { ArrowRight } from "lucide-react";
import { categoryPath, postPath } from "@/app/blog/_lib/blog";

type Post = {
  slug: string;
  title: string;
  summary: string;
  /** product code, rendered in mono (Latin only) */
  code?: string;
};

type Group = { id: string; label: string; note: string; posts: Post[] };

/*
 * The 12 "NST공법 자료실" articles of the old site, now posts at /blog/<slug>/ (migrations/0008).
 * Titles: the old page titles (S200/F100/S100 without their product code, shown as a chip). Summaries: a
 * sentence quoted from each article. Ordered as a reading path: cause → method → verify the contractor.
 */
const GROUPS: Group[] = [
  {
    id: "columns-cause",
    label: "원인 알기",
    note: "냄새는 왜 오래 가고, 환기·청소로는 어디까지 될까",
    posts: [
      {
        slug: "new-house-syndrome-formaldehyde-vocs",
        title: "새집증후군이란? 포름알데히드와 VOCs가 발생하는 이유",
        summary: "새집증후군 관리는 냄새를 가리는 것이 아니라, 포름알데히드와 VOCs 같은 실내 오염물질의 발생·방출·축적을 줄이는 과정입니다.",
      },
      {
        slug: "new-furniture-built-in-odor",
        title: "새 가구·붙박이장에서 냄새가 오래 나는 이유",
        summary: "입주 전인데도 유해물질 수치가 높게 나타나는 이유는 오염물질이 지속적으로 뿜어져 나오기 때문입니다.",
      },
      {
        slug: "bakeout-effect-limit",
        title: "베이크아웃의 효과와 한계",
        summary: "베이크아웃은 좋은 보조 수단이지만, 단기간에 자재 속 모든 화학물질을 빼낼 수는 없습니다.",
      },
      {
        slug: "move-in-cleaning-vs-air-quality",
        title: "입주청소와 새집증후군 실내공기질 관리의 차이",
        summary: "미세먼지는 공기청정기로, 새집증후군은 화학적 정화 기술인 NST공법으로 제어해야 합니다.",
      },
    ],
  },
  {
    id: "columns-method",
    label: "공법 이해하기",
    note: "NST공법 3단계와 공정별 역할",
    posts: [
      {
        slug: "nst-method-three-step-process",
        title: "NST공법이란? 3단계 시공 원리",
        summary:
          "방출원 구조 안정화(S200), 24시간 자동 분해(S100), 사각지대 밀착 케어(F100)로 이어지는 3단계 프리미엄 공정을 통해 시간이 지나도 쾌적한 실내공기질이 유지되도록 설계되었습니다.",
      },
      {
        slug: "nst-s200-source-stabilization",
        code: "NST-S200",
        title: "가구·목재 방출원 구조 안정화 공정",
        summary:
          "서랍과 선반을 분리한 후, 코팅되지 않은 노출된 목재 단면에 S200을 도포하여 유해물질 방출 통로를 차단하고 구조를 안정화함으로써 포름알데히드 발생을 효과적으로 억제합니다.",
      },
      {
        slug: "nst-f100-blind-spot-care",
        code: "NST-F100",
        title: "수납장 내부 사각지대 보완 관리",
        summary:
          "빛이나 공기 순환이 부족하여 유해물질이 정체되기 쉬운 신발장, 붙박이장, 싱크대 등 밀폐된 수납 공간 내부에 적용되어 사각지대의 공기질을 효과적으로 보완 관리합니다.",
      },
      {
        slug: "nst-s100-dual-catalyst",
        code: "NST-S100",
        title: "생활공간 지속케어용 하이앤드 듀얼촉매",
        summary: "하이앤드 듀얼촉매는 빛이 부족한 실내 환경에서도 활성화되어 벽지, 마루 등 넓은 면적에서 지속적으로 유해물질을 분해하고 관리합니다.",
      },
    ],
  },
  {
    id: "columns-verify",
    label: "업체 검증하기",
    note: "후기보다 성적서와 실적으로 확인하기",
    posts: [
      {
        slug: "new-house-syndrome-contractor-checklist",
        title: "새집증후군 시공업체 선택 체크리스트 7가지",
        summary: "믿을 수 있는 새집증후군 실내공기질 관리 시공업체를 고르는 절대 기준은 무엇인가요?",
      },
      {
        slug: "test-report-verification",
        title: "공인시험성적서와 간이측정 결과의 차이",
        summary: "공인시험성적서와 간이측정 결과는 신뢰도, 측정 목적, 법적·기술적 활용성이 다릅니다.",
      },
      {
        slug: "nst-evidence",
        title: "NST공법 공식 증빙 허브: 시험성적서 및 시공 실적",
        summary: "새집증후군의 원인 중 하나인 새 가구와 마감재에서 방출되는 포름알데히드(HCHO)와 톨루엔 등은 단기간에 사라지지 않습니다.",
      },
      {
        slug: "large-scale-project-track-record",
        title: "대단지·건설사·공공기관 시공 실적이 중요한 이유",
        summary: "전 세대 시공은 기술력만으로는 불가능합니다. 신뢰성, 안전성, 품질관리, 현장 수행 능력이 모두 검증된 기업만이 가능합니다.",
      },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.posts.length, 0);

/* Scroll-linked entrance: CSS-only, transform/opacity, skipped under reduced motion
   or where scroll-driven animations are unsupported (content simply shows). */
const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:both] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:cubic-bezier(.4,0,.2,1)] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_entry_80%]";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";

export default function Columns() {
  return (
    <section
      id="columns"
      aria-labelledby="columns-title"
      className="grain relative isolate overflow-clip bg-air"
    >
      {/* soft "air" bloom, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-56 -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(205,238,221,.85),rgba(205,238,221,0))]"
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-10 lg:py-36">
        {/* ── Masthead (sticky on desktop) ─────────────────────────────── */}
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="inline-flex items-center gap-2.5 text-[0.875rem] font-semibold tracking-[0.08em] text-pine-2">
              <span aria-hidden className="relative inline-block size-3.5">
                <span className="absolute inset-0 rounded-full border border-leaf" />
                <span className="absolute inset-[4px] rounded-full bg-leaf" />
              </span>
              NST공법 칼럼
            </p>

            <h2
              id="columns-title"
              className="mt-5 font-display text-[clamp(1.75rem,1.25rem+1.7vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pine"
            >
              <span className="block">시공 전에</span>
              <span className="block">
                <span className="bg-[linear-gradient(transparent_64%,#cdeedd_64%,#cdeedd_92%,transparent_92%)] box-decoration-clone">
                  알아둘
                </span>{" "}
                것들
              </span>
            </h2>

            <p className="mt-6 max-w-md text-[17px] leading-[1.75] text-muted-ink sm:text-lg">
              원인부터 공법, 업체를 고르는 기준까지. <span className="whitespace-nowrap">(주)엔에스티가</span> 직접 쓴 칼럼 {TOTAL}편을 읽는 순서대로
              묶었습니다.
            </p>

            <nav aria-label="칼럼 분류" className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {GROUPS.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline bg-white/70 px-4 text-[15px] font-semibold text-ink outline-none hover:border-pine/50 focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2 focus-visible:ring-offset-air"
                    >
                      {g.label}
                      <span className="text-[13px] font-medium tabular-nums text-muted-ink">
                        {g.posts.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={categoryPath("column")}
              className="group mt-7 inline-flex min-h-11 items-center gap-1.5 rounded-md text-[16px] font-semibold text-trust underline decoration-trust/30 underline-offset-[6px] outline-none hover:decoration-trust focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-4 focus-visible:ring-offset-air"
            >
              칼럼 전체 보기
              <ArrowRight aria-hidden className={`size-4 transition-transform duration-300 ${EASE} group-hover:translate-x-1`} />
            </a>
          </div>
        </header>

        {/* ── Index ───────────────────────────────────────────────────── */}
        <div className="mt-16 space-y-16 sm:space-y-20 lg:col-span-8 lg:mt-2">
          {GROUPS.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b-2 border-pine pb-4">
                <h3 className="font-display text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-pine sm:text-[2rem]">
                  {g.label}
                </h3>
                <p className="text-[15px] text-muted-ink">{g.note}</p>
              </div>

              <ul role="list">
                {g.posts.map((p) => (
                  <li key={p.slug} className={`border-b border-hairline ${REVEAL}`}>
                    <a
                      href={postPath(p.slug)}
                      className="group relative -mx-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-2xl px-3 py-5 outline-none focus-visible:ring-2 focus-visible:ring-trust sm:-mx-5 sm:gap-x-8 sm:px-5 sm:py-7"
                    >
                      {/* hover / focus wash — sweeps in from the left */}
                      <span
                        aria-hidden
                        className={`absolute inset-0 origin-left scale-x-[0.04] rounded-2xl bg-mint/70 opacity-0 transition-[translate,scale,rotate,opacity] duration-500 ${EASE} group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100`}
                      />

                      <span
                        className={`relative min-w-0 transition-transform duration-500 ${EASE} group-hover:translate-x-1.5`}
                      >
                        {p.code && (
                          <span className="mb-2 inline-flex items-center rounded-full bg-pine px-2.5 py-0.5 font-mono text-[12px] font-medium tracking-[0.06em] text-mint">
                            {p.code}
                          </span>
                        )}
                        <span className="block text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink sm:text-xl text-pretty">
                          {p.title}
                        </span>
                        <span className="mt-1.5 block text-[15px] leading-[1.65] text-muted-ink sm:text-base text-pretty">
                          {p.summary}
                        </span>
                      </span>

                      {/* arrow: outline → filled, cross-faded */}
                      <span
                        aria-hidden
                        className="relative grid size-11 shrink-0 place-items-center rounded-full border border-pine/25 sm:size-12"
                      >
                        <span
                          className={`absolute inset-0 scale-50 rounded-full bg-pine opacity-0 transition-[translate,scale,rotate,opacity] duration-500 ${EASE} group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100`}
                        />
                        <ArrowRight
                          className={`absolute size-5 text-pine transition-[translate,scale,rotate,opacity] duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:opacity-0`}
                        />
                        <ArrowRight
                          className={`absolute size-5 text-white opacity-0 transition-[translate,scale,rotate,opacity] duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100`}
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
