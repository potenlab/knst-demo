import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import PageShell from "@/components/pages/PageShell";
import { FIRST_AID, PRODUCTS, PRODUCT_ORDER, productPath, type Product, type Slug } from "@/components/pages/products-data";
import { LD_ID, abs } from "@/components/pages/seo";
import { Codes, FOCUS, Figure, H3, LINK, PageCTA, REVEAL, Section, SourceNote, WRAP } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

const STEP_TONE: Record<Product["step"], string> = {
  1: "bg-pine text-white",
  2: "bg-leaf text-white",
  3: "bg-mint text-pine",
};

export function productLd(p: Product) {
  const url = abs(productPath(p.slug));
  const pick = (k: string) => p.label.rows.find(([key]) => key === k)?.[1];
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.code,
    alternateName: pick("제품명"),
    description: `${p.summary} ${p.stepLabel} · ${p.dual}(${p.dualNote}).`,
    url,
    image: abs(p.photo.src),
    category: pick("품목"),
    brand: { "@type": "Brand", name: "NST공법" },
    manufacturer: { "@id": LD_ID.org },
    additionalProperty: p.label.rows
      .filter(([k]) => !["제품명", "주소", "연락처", "제조연월"].includes(k))
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
  };
}

/** order of the old product banner */
const BANNER_ORDER: Slug[] = ["nst-s100", "nst-s200", "nst-f100"];

const TH = "border-b border-hairline bg-mint/60 px-3 py-2.5 text-left text-[14px] font-bold text-pine sm:px-4";
const TD = "border-b border-hairline px-3 py-2.5 text-[15px] tabular-nums text-ink sm:px-4";

function TableBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cn("overflow-x-auto overscroll-x-contain rounded-[1.25rem] bg-white ring-1 ring-hairline", FOCUS)}>
      {children}
    </div>
  );
}

const CHECK = "relative pl-7 before:absolute before:left-0 before:top-0 before:font-bold before:text-leaf before:content-['✓']";

/** "실험조건" style key/value list */
function Conditions({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[15px] leading-[1.6]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted-ink">■ {k} :</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Effect({ slug }: { slug: Slug }) {
  if (slug === "nst-s100") {
    const steps: [string, string, string, string, string][] = [
      ["1", "1단계 (흡착)", "30분", "25 → 15 ppm (40% 제거)", "빠른 초기 반응, 공간 정화 개시"],
      ["2", "2단계 (광분해)", "1–2시간", "15 → 10 ppm (33% 제거)", "산화 라디칼(가위) 분해, 지속 정화 가능성 입증"],
      ["3", "3단계 (지속 반응)", "수시간", "10 → 0 ppm (100% 예상)", "흡착/광분해 반복 반응으로 공기 정화 유지 가능"],
    ];
    return (
      <div className="space-y-14">
        {/* 효과 -1 : S100-2 */}
        <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-12", REVEAL)}>
          <div className="lg:col-span-6">
            <h3 className={cn(H3, "text-pine")}>NST-S100 유해물질 제거 효과 -1</h3>
            <p className="mt-3 text-[14px] font-bold text-pine-2">[실험조건]</p>
            <p className="mt-1 text-[15px] leading-[1.7] text-ink/85">UV 1mW/cm2 / 25ppm 포름알데히드 / Teflon Gas Sampling Bag / 유리시편 NST-S100</p>
            <p className="mt-4 rounded-[1rem] bg-mint/50 px-4 py-3 text-[15px] font-semibold leading-[1.7] text-pine tabular-nums">
              25 → 15 흡착(40% 저감) → 10 분해(33% 저감) → 0 흡착+분해(95% 이상 저감)
            </p>
            <p className="mt-2 text-[14px] text-muted-ink tabular-nums">초기농도 / 흡착효율 / 분해효율 · 초기 / 30분 / 1~2시간 / 수시간</p>
          </div>
          <Figure
            className="lg:col-span-6"
            src="/img/s100-effect-gasbag.webp"
            width={1400}
            height={647}
            zoom
            alt="NST-S100 포름알데히드 가스백 실험 자료: 실험조건 도식과 농도 변화 그래프, 단계별 결과 표"
          />
          <div className="lg:col-span-12">
            <TableBox label="NST-S100 가스백 실험 결과표">
              <table className="w-full min-w-[40rem] border-collapse">
                <caption className="sr-only">NST-S100 포름알데히드 농도 변화</caption>
                <thead>
                  <tr>
                    {["NO", "구분", "시간", "농도 변화", "의미"].map((h) => (
                      <th key={h} scope="col" className={TH}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {steps.map((r, i) => (
                    <tr key={r[0]}>
                      {r.map((c, j) => (
                        <td key={j} className={cn(TD, j === 1 && "font-semibold", i === steps.length - 1 && "border-b-0")}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableBox>
            <SourceNote>*본 시험은 공정시험기준에서 정의하는 가스백법 시료채취 절차를 준용하였으며, 정량 분석은 간이측정기(GASTEC)를 활용 하였음</SourceNote>
          </div>
        </div>

        {/* 효과 -2 : S100-3 */}
        <div className={cn("grid gap-8 lg:grid-cols-12 lg:gap-12", REVEAL)}>
          <div className="lg:col-span-6">
            <h3 className={cn(H3, "text-pine")}>NST-S100 유해물질 제거 효과 -2</h3>
            <p className="mt-3 text-[14px] font-bold text-pine-2">[실험조건]</p>
            <div className="mt-2">
              <Conditions
                rows={[
                  ["광원", "LED (주광색 6400K, 16W)"],
                  ["파장", "가시광선 (약 400~700 nm)"],
                  ["방식", "상부 고정 조사, 수직방향"],
                ]}
              />
            </div>
            <p className="mt-3 text-[14px] leading-[1.65] text-muted-ink">
              *메틸렌블루(MB) 5ppm / NST-S100 · 초기 / 3시간 / 7시간
              <br />
              *메틸렌블루란? 광촉매 반응에 탈색되는 특성이 있어 광촉매 성능 평가에 활용되는 대표적인 지표물질
            </p>
            <ul className="mt-4 space-y-2 rounded-[1rem] bg-mint/50 px-4 py-3 text-[15px] font-medium leading-[1.7] text-pine">
              <li className={CHECK}>NST-S100의 메틸렌블루(MB, 5ppm) 실내조명 실험 결과, 7시간 내 MB(청색)이 거의 사라지고 투명해짐</li>
              <li className={CHECK}>NST-S100의 실내조명에 의한 분해 성능 입증</li>
            </ul>
          </div>
          <Figure
            className="lg:col-span-6"
            src="/img/s100-effect-mb.webp"
            width={1400}
            height={656}
            zoom
            alt="NST-S100 메틸렌블루 실내조명 실험 자료: 실험 장치 사진과 초기·3시간·7시간 시료 사진"
          />
        </div>

        {/* 공인 시험성적서 (sungjukseo3) */}
        <div className={REVEAL}>
          <h3 className={cn(H3, "text-pine")}>시험성적서 · 한국세라믹기술원</h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-muted-ink">성적서번호 : 2025-1985 · 시험 시료명/물질: NST-S100 · 시험기간: 2025년 06월 23일 ~ 2025년 06월 25일</p>
          <div className="mt-4 max-w-[36rem]">
            <TableBox label="한국세라믹기술원 시험 결과표">
              <table className="w-full min-w-[22rem] border-collapse">
                <caption className="sr-only">NST-S100 폼알데하이드 농도 (ppm)</caption>
                <thead>
                  <tr>
                    <th scope="col" className={TH}>분석항목 폼알데하이드</th>
                    <th scope="col" className={TH}>초기</th>
                    <th scope="col" className={TH}>1hr</th>
                    <th scope="col" className={TH}>2hr</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={cn(TD, "font-semibold")}>암조건</th>
                    <td className={TD}>25</td>
                    <td className={TD}>15</td>
                    <td className={TD}>15</td>
                  </tr>
                  <tr>
                    <th scope="row" className={cn(TD, "border-b-0 font-semibold")}>광조건</th>
                    <td className={cn(TD, "border-b-0")}>25</td>
                    <td className={cn(TD, "border-b-0 font-bold text-pine")}>10</td>
                    <td className={cn(TD, "border-b-0 font-bold text-pine")}>10</td>
                  </tr>
                </tbody>
              </table>
            </TableBox>
          </div>
          <SourceNote>농도 ppm. 성적서 원본은 <a href="/evidence/" className={cn(LINK, FOCUS, "rounded")}>시험성적서·시공 실적</a>에서 볼 수 있습니다.</SourceNote>
        </div>
      </div>
    );
  }

  if (slug === "nst-s200") {
    const rows: [string, string, string, string, string][] = [
      ["1", "총휘발성유기화합물(TVOC)", "0.02", "<0.01", "50% 이상 감소"],
      ["2", "톨루엔", "0.001", "불검출", "100% 감소"],
      ["3", "포름알데하이드", "0.097", "0.005", "94.8% 감소"],
      ["4", "아세트알데하이드", "0.006", "0.004", "33.3% 감소"],
      ["5", "벤젠/에틸벤젠/자일렌/스틸렌", "불검출", "불검출", "불검출"],
    ];
    return (
      <div className={cn("space-y-8", REVEAL)}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[14px] font-bold text-pine-2">[단위 : mg/(m2·h)] 코팅(안함x) / 코팅(NST-S200)</p>
            <p className="mt-2 text-[15px] leading-[1.7] text-ink/85 tabular-nums">
              붓질 2회 / NST-S200 / 25℃ /50% / 0.5 h-1/ ≤ 7일 (온도 / 습도 / 환기횟수 / 시험기간)
            </p>
            <ul className="mt-4 grid gap-2 text-[15px] font-semibold text-pine tabular-nums">
              {[
                "50% 이상 저감 (TVOC 0.02 → 0.01)",
                "100% 저감 (톨루엔 0.001 → 0)",
                "94.8% 저감 (포름알데하이드 0.097 → 0.005)",
                "33.3% 저감 (아세트알데하이드 0.006 → 0.004)",
              ].map((t) => (
                <li key={t} className="rounded-[0.9rem] bg-mint/50 px-4 py-2.5">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Figure
            className="lg:col-span-7"
            src="/img/s200-effect-chamber.webp"
            width={1400}
            height={675}
            zoom
            alt="NST-S200 소형챔버법 시험 자료: 코팅 안 한 시편과 NST-S200 코팅 시편의 방출량 비교 그래프와 결과 표"
          />
        </div>
        <TableBox label="NST-S200 소형챔버법 결과표">
          <table className="w-full min-w-[40rem] border-collapse">
            <caption className="sr-only">NST-S200 코팅 전후 방출량</caption>
            <thead>
              <tr>
                {["NO", "구분", "단위", "코팅(안함x)", "코팅(NST-S200)", "감소율"].map((h) => (
                  <th key={h} scope="col" className={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([n, k, a, b, c], i) => {
                const last = i === rows.length - 1;
                return (
                  <tr key={k}>
                    <td className={cn(TD, last && "border-b-0")}>{n}</td>
                    <th scope="row" className={cn(TD, "font-semibold", last && "border-b-0")}>{k}</th>
                    <td className={cn(TD, last && "border-b-0")}>mg/(m2·h)</td>
                    <td className={cn(TD, last && "border-b-0")}>{a}</td>
                    <td className={cn(TD, last && "border-b-0")}>{b}</td>
                    <td className={cn(TD, "font-bold text-pine", last && "border-b-0 font-normal text-ink")}>{c}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableBox>
        <SourceNote>
          *본 시험은 「공정시험기준 KS M 1998:2022」제7절 소형챔버법을 준용하였으며 시험 샘플을 채취하고 GC/MS로 정량 분석을 실시 함. 한국건설생활환경시험연구원(KCL)
          시험성적서는{" "}
          <a href="/evidence/" className={cn(LINK, FOCUS, "rounded")}>
            시험성적서·시공 실적
          </a>
          에서 볼 수 있습니다.
        </SourceNote>
      </div>
    );
  }

  const points = [
    {
      t: "NST-F100 시공 및 반응 시작",
      v: "100 ppm 포름알데히드 주입 / 가스백",
      d: "NST-F100을 오염원에 분사하면 즉시 포름알데히드와 반응을 시작합니다. 시험은 100 ppm의 고농도 환경에서 진행되었습니다.",
    },
    {
      t: "30분 후: 99% 이상 급속 제거",
      v: "30분 / 99% 이상 감소",
      d: "시험 시작 30분 만에 포름알데히드 농도가 99% 이상 감소하여 초기 단계부터 강력한 제거 효과를 입증했습니다.",
    },
    {
      t: "60~90분 경과: 지속적인 제거 효과 유지",
      v: "60분 99% 이상 유지 / 90분 99% 이상 유지",
      d: "60분, 90분 경과 시점에서도 99% 이상의 높은 제거율이 지속적으로 유지됨을 확인했습니다.",
    },
    {
      t: "120분 최종: 완벽에 가까운 제거 완료",
      v: "120분 99% 이상 (최종) CLEAR",
      d: "최종 120분 측정 결과 역시 99% 이상의 제거율을 기록하여, NST-F100의 탁월하고 지속적인 포름알데히드 제거 성능이 검증되었습니다.",
    },
  ];
  return (
    <div className={cn("space-y-8", REVEAL)}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <p className="font-display text-[1.125rem] font-bold leading-[1.6] text-pine lg:col-span-5">
          닫힌 공간에 사용하여 표준 시험을 통해 높은 포름알데히드 저감 효과를 입증하였습니다.
        </p>
        <Figure
          className="lg:col-span-7"
          src="/img/f100-effect-gasbag.webp"
          width={1400}
          height={702}
          zoom
          alt="NST-F100 포름알데히드 저감 시험 자료: 가스백에 100ppm 포름알데히드를 주입하고 30분·60분·90분·120분 경과별 결과를 보여 주는 단계별 그림"
        />
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <li key={p.t} className="rounded-[1.25rem] border border-hairline bg-white p-5">
            <p className="text-[13px] font-bold text-muted-ink">STEP {i + 1}.</p>
            <p className="mt-1 text-[16px] font-bold leading-[1.45] text-pine">{p.t}</p>
            <p className="mt-2 font-display text-[1.0625rem] font-extrabold tracking-[-0.01em] text-pine-2 tabular-nums">{p.v}</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-ink/80">{p.d}</p>
          </li>
        ))}
      </ol>
      <p className="rounded-[1.25rem] border-l-4 border-leaf bg-white px-5 py-4 text-[16px] font-medium leading-[1.7] text-pine">
        새집증후군 유발물질 제거 전용으로 대형건설사 수천세대 아파트 일괄시공에 적용된 검증된 제품 입니다.
      </p>
    </div>
  );
}

export default function ProductDetail({ slug }: { slug: Slug }) {
  const p = PRODUCTS[slug];
  const path = productPath(slug);
  const idx = PRODUCT_ORDER.indexOf(slug);
  const prev = idx > 0 ? PRODUCTS[PRODUCT_ORDER[idx - 1]] : null;
  const next = idx < PRODUCT_ORDER.length - 1 ? PRODUCTS[PRODUCT_ORDER[idx + 1]] : null;
  const pick = (k: string) => p.label.rows.find(([key]) => key === k)?.[1] ?? "";

  const facts: [string, string][] = [
    ["시공 단계", p.stepLabel],
    ["하이앤드 듀얼", `${p.dual} (${p.dualNote})`],
    ["용도", p.use],
    ["적용 공간", p.zone],
    ["품목 · 용량", `${pick("품목")} · ${pick("용량")}`],
    ["안전기준 신고번호", pick("신고번호")],
  ];

  return (
    <PageShell
      path={path}
      crumbs={[{ label: "제품현황", href: "/products/" }, { label: p.code }]}
      eyebrow={`${p.stepLabel} · ${p.dual}`}
      title={
        <>
          <span className="font-mono text-[0.86em] font-medium tracking-[-0.01em]">{p.code}</span>
          <br />
          {p.headline}
        </>
      }
      name={`${p.code} ${p.dual} — ${p.headline}`}
      description={p.summary}
      pageType="ItemPage"
      pageExtra={{ mainEntity: { "@id": `${abs(path)}#product` }, primaryImageOfPage: { "@type": "ImageObject", url: abs(p.photo.src) } }}
      ld={[productLd(p)]}
      lead={
        <>
          <p>
            <Codes text={p.summary} />
          </p>
          {p.extraNote && (
            <p className="text-[16px] text-pine-2">
              <Codes text={p.extraNote} />
            </p>
          )}
        </>
      }
      toc={[
        { id: "overview", label: "한눈에 보기" },
        { id: "principle", label: "제거 원리" },
        { id: "how", label: "시공 방법" },
        { id: "effect", label: "제거 효과" },
        { id: "label", label: "제품 설명서" },
      ]}
    >
      {/* ── 한눈에 보기 ── */}
      <section id="overview" aria-label={`${p.code} 한눈에 보기`} className={cn(WRAP, "scroll-mt-24 pb-6")}>
        {/* old product banner (NST-100 / NST-S200 / NST-F100 images): the three products, current one highlighted */}
        <ul aria-label="NST공법 제품" className="mb-10 grid gap-3 sm:grid-cols-3">
          {BANNER_ORDER.map((slug) => {
            const b = PRODUCTS[slug];
            const current = slug === p.slug;
            const body = (
              <>
                <span className={cn("block font-mono text-[17px] font-medium", current ? "text-white" : "text-pine")}>{b.code}</span>
                <span className={cn("block text-[13px] font-semibold", current ? "text-mint" : "text-muted-ink")}>새집증후군 전문시공용</span>
                <span className={cn("mt-2 block text-[15px] font-semibold leading-[1.5]", current ? "text-white" : "text-ink/70")}>{b.role}</span>
              </>
            );
            return (
              <li key={slug}>
                {current ? (
                  <div aria-current="page" className="h-full rounded-[1.25rem] bg-pine px-5 py-4">
                    {body}
                  </div>
                ) : (
                  <a
                    href={productPath(slug)}
                    className={cn("block h-full rounded-[1.25rem] border border-hairline bg-white/70 px-5 py-4 transition-colors hover:border-pine/40 hover:bg-white", FOCUS)}
                  >
                    {body}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <Figure className="lg:col-span-6" src={p.photo.src} width={p.photo.w} height={p.photo.h} alt={p.photo.alt} eager />
          <div className="lg:col-span-6">
            <p className={cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[14px] font-bold", STEP_TONE[p.step])}>
              STEP {p.step}
              <span aria-hidden className="opacity-60">·</span>
              {p.dual}
            </p>
            <dl className="mt-6 divide-y divide-hairline border-y border-hairline">
              {facts.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="text-[14px] font-semibold text-muted-ink">{k}</dt>
                  <dd className="text-[16px] leading-[1.6] text-ink">
                    <Codes text={v} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 rounded-[1.25rem] border border-hairline bg-white px-5 py-4 text-[15px] leading-[1.7] text-muted-ink">
              NST공법은 전문 시공 노하우와 품질 관리가 함께해야 효과가 극대화되기 때문에 제품 단독 구매는 불가하며, NST 공식 지점을 통한 시공
              서비스로만 만나보실 수 있습니다.{" "}
              <a href="/partners/" className={cn(LINK, FOCUS, "rounded")}>
                공식 시공업체 보기
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── 제거 원리 ── */}
      <Section
        id="principle"
        tone="white"
        kicker={`[${p.step}단계] ${p.dual}`}
        title={`${p.code} 유해물질 제거 원리`}
        intro={
          <>
            <p className="font-semibold text-pine">“{p.dualText.quote}”</p>
            {p.dualText.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <Figure src={p.principle.src} width={p.principle.w} height={p.principle.h} alt={p.principle.alt} zoom />
            <ul aria-label="도식 속 글자" className="mt-4 space-y-1 text-[14px] leading-[1.6] text-muted-ink">
              {p.principle.labels.map((l) => (
                <li key={l}>
                  <Codes text={l} />
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            {p.principle.checks.length > 0 && (
              <ul className="space-y-4">
                {p.principle.checks.map((c) => (
                  <li key={c.slice(0, 24)} className={cn(CHECK, "text-[16px] leading-[1.7] text-ink/85")}>
                    <Codes text={c} />
                  </li>
                ))}
              </ul>
            )}
            {p.principle.table && (
              <TableBox label={`${p.code} 기능표`}>
                <table className="w-full min-w-[20rem] border-collapse">
                  <caption className="sr-only">{p.code} 기능과 내용</caption>
                  <thead>
                    <tr>
                      <th scope="col" className={TH}>NO</th>
                      <th scope="col" className={TH}>기능</th>
                      <th scope="col" className={TH}>내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.principle.table.map(([k, v], i) => {
                      const last = i === p.principle.table!.length - 1;
                      return (
                        <tr key={k}>
                          <td className={cn(TD, last && "border-b-0")}>{i + 1}</td>
                          <th scope="row" className={cn(TD, "font-semibold", last && "border-b-0")}>{k}</th>
                          <td className={cn(TD, last && "border-b-0")}>
                            <Codes text={v} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableBox>
            )}
            {p.principle.targets && (
              <div className="mt-6">
                <p className="text-[14px] font-semibold text-muted-ink">대상 유해물질</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {p.principle.targets.map((t) => (
                    <li key={t} className="rounded-full bg-mint/70 px-3 py-1 text-[14px] font-semibold text-pine">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* /technology-overview/ board "20년 노하우 현장 맞춤형 시공" */}
        <div className={cn("mt-12 rounded-[1.75rem] border border-hairline bg-air p-6 sm:p-8", REVEAL)}>
          <p className="text-[14px] font-bold text-leaf">20년 노하우 현장 맞춤형 시공</p>
          <p className="mt-1 text-[17px] font-bold text-pine">
            <Codes text={p.board.heading} />
          </p>
          <p className="mt-3 text-[16px] leading-[1.7] text-ink/85">
            <Codes text={p.board.lead} />
          </p>
          <p className="mt-5 text-[15px] font-semibold text-pine-2">{p.board.sub}</p>
          <h3 className={cn(H3, "mt-1 text-pine")}>{p.board.title}</h3>
          <ol className="mt-4 space-y-3">
            {p.board.points.map((pt, i) => (
              <li key={pt.slice(0, 20)} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-pine font-display text-[14px] font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-[16px] leading-[1.7] text-ink/85">
                  <Codes text={pt} />
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-hairline pt-4 text-[15px] font-medium leading-[1.7] text-pine">
            👉 새집증후군 유발물질 제거 전용으로 대형건설사 수천세대 아파트 일괄시공에 적용된 검증된 제품 입니다.
          </p>
        </div>
      </Section>

      {/* ── 시공 방법 ── */}
      <Section id="how" kicker="20년 노하우 현장 맞춤형 시공" title={p.board.heading} intro={<p>{p.stepsIntro}</p>}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1">
            {p.steps.map((s, i) => (
              <li key={s.title} className={cn("rounded-[1.25rem] border border-hairline bg-white p-5 sm:p-6", REVEAL)}>
                <p className="text-[13px] font-bold tracking-[0.06em] text-leaf">STEP {i + 1}.</p>
                <h3 className={cn(H3, "mt-1 text-pine")}>{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-ink/80 sm:text-[16px]">{s.text}</p>
              </li>
            ))}
          </ol>
          <Figure
            className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
            src={p.site.src}
            width={p.site.w}
            height={p.site.h}
            alt={p.site.alt}
            caption={`${p.code} 시공 사진`}
          />
        </div>
      </Section>

      {/* ── 효과 자료 ── */}
      <Section id="effect" tone="mint" kicker={p.dual} title={p.effectTitle}>
        <Effect slug={slug} />
      </Section>

      {/* ── 표시사항 ── */}
      <Section
        id="label"
        tone="white"
        kicker="표시사항"
        title={`${p.code} 제품 설명서`}
        intro={
          <p>
            제품 라벨에 인쇄된 내용을 그대로 옮겼습니다. <Codes text={p.label.tagline} />
          </p>
        }
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <dl className="overflow-hidden rounded-[1.25rem] border border-hairline">
              {p.label.rows.map(([k, v], i) => (
                <div key={k} className={cn("grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]", i % 2 ? "bg-white" : "bg-air")}>
                  <dt className="text-[14px] font-semibold text-muted-ink">{k}</dt>
                  <dd className="text-[15px] leading-[1.6] text-ink">
                    <Codes text={v} />
                  </dd>
                </div>
              ))}
            </dl>
            <Figure
              className="mt-6"
              src={p.label.src}
              width={1600}
              height={801}
              alt={p.label.alt}
              zoom
              caption={`${p.code} 새집증후군 전문시공용 (안전기준확인)`}
            />
          </div>
          <div className="space-y-8 lg:col-span-6">
            <div>
              <h3 className={cn(H3, "text-pine")}>[사용 방법]</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px] leading-[1.7] text-ink/85 marker:font-bold marker:text-leaf">
                {p.label.usage.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className={cn(H3, "text-pine")}>[사용상 주의사항]</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px] leading-[1.7] text-ink/85 marker:font-bold marker:text-leaf">
                {p.label.cautions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className={cn(H3, "text-pine")}>[응급처치]</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-[16px] leading-[1.7] text-ink/85 marker:font-bold marker:text-leaf">
                {FIRST_AID.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 인증 · 다른 제품 ── */}
      <section aria-labelledby="certs-title" className={cn(WRAP, "py-14 sm:py-20")}>
        <h2 id="certs-title" className="font-display text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] font-extrabold leading-[1.25] tracking-[-0.03em] text-pine">
          인증·특허
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {p.certs.map((c) => (
            <li key={c.k} className="flex gap-3 rounded-[1.25rem] border border-hairline bg-white p-5">
              <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-pine text-mint">
                <Check className="size-3.5" strokeWidth={2.75} />
              </span>
              <span>
                <span className="block text-[14px] font-bold text-pine-2">{c.k}</span>
                <span className="mt-1 block text-[15px] leading-[1.65] text-ink">
                  <Codes text={c.v} />
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[15px] text-muted-ink">
          서류 원본과 안전확인대상생활화학제품 확인결과서(FITI)는{" "}
          <a href="/evidence/" className={cn(LINK, FOCUS, "rounded")}>
            시험성적서·시공 실적
          </a>
          에서 확인하세요.
        </p>

        <nav aria-label="다른 제품" className="mt-12 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <a
              href={productPath(prev.slug)}
              className={cn("group flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-hairline bg-white px-5 py-4 transition-colors hover:border-pine/40", FOCUS)}
            >
              <ArrowLeft aria-hidden className="size-5 shrink-0 text-leaf transition-transform group-hover:-translate-x-0.5" />
              <span>
                <span className="block text-[13px] font-semibold text-muted-ink">이전 단계 · {prev.stepLabel}</span>
                <span className="font-mono text-[17px] font-medium text-pine">{prev.code}</span>
              </span>
            </a>
          ) : (
            <a
              href="/products/"
              className={cn("group flex min-h-20 items-center gap-4 rounded-[1.5rem] border border-hairline bg-white px-5 py-4 transition-colors hover:border-pine/40", FOCUS)}
            >
              <ArrowLeft aria-hidden className="size-5 shrink-0 text-leaf" />
              <span className="text-[16px] font-semibold text-pine">제품현황 전체 보기</span>
            </a>
          )}
          {next ? (
            <a
              href={productPath(next.slug)}
              className={cn(
                "group flex min-h-20 items-center justify-end gap-4 rounded-[1.5rem] border border-hairline bg-white px-5 py-4 text-right transition-colors hover:border-pine/40",
                FOCUS,
              )}
            >
              <span>
                <span className="block text-[13px] font-semibold text-muted-ink">다음 단계 · {next.stepLabel}</span>
                <span className="font-mono text-[17px] font-medium text-pine">{next.code}</span>
              </span>
              <ArrowRight aria-hidden className="size-5 shrink-0 text-leaf transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <a
              href="/technology/"
              className={cn(
                "group flex min-h-20 items-center justify-end gap-4 rounded-[1.5rem] border border-hairline bg-white px-5 py-4 text-right transition-colors hover:border-pine/40",
                FOCUS,
              )}
            >
              <span className="text-[16px] font-semibold text-pine">NST공법 기술현황 보기</span>
              <ArrowUpRight aria-hidden className="size-5 shrink-0 text-leaf" />
            </a>
          )}
        </nav>
      </section>

      <PageCTA />
    </PageShell>
  );
}
