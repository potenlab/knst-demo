import { ArrowRight } from "lucide-react";
import { productLd } from "@/components/pages/ProductDetail";
import PageShell from "@/components/pages/PageShell";
import { PRODUCTS, PRODUCT_ORDER, productPath } from "@/components/pages/products-data";
import { abs, pageMetadata } from "@/components/pages/seo";
import { Codes, EASE, FOCUS, Figure, PageCTA, REVEAL, Section, SourceNote, WRAP } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

/*
 * 제품현황 — old /our-products/ verbatim (headings, "※제품을 클릭하시면 …"), the text of its 제품 삼총사 board
 * (스크린샷_9-9-2025, ✓/▪ lines), 3단계 흐름도 labels (media__1780388543486), label 표시사항, FAQ Q4·Q8.
 * The old page's "NST공법 시공 영상" embed is not in the archive, so that block is not reproduced.
 */

const PATH = "/products/";
const TITLE = "제품현황 · NST공법 제품 삼총사 NST-S100·S200·F100";
const DESCRIPTION =
  "NST 공법은 현장 맞춤형 기술로 유해물질을 “차단-흡착-분해” 하는 [상온 경화 코팅] 솔루션, 시공현장 조건에 최적화된 3종 제품(NST-S100, NST-S200, NST-F100)으로 구성됩니다.";

/* 제품 삼총사 board (스크린샷_9-9-2025) — ▪ lines verbatim */
const TRIO = [
  "NST-S100 : 공기 중의 유해물질을 끌어당기고(흡착) ‘분해’하는 광촉매 기반 투명 코팅제",
  "NST-S200 : 목재, 가구 표면 등을 코팅하여 내부에서 방출되는 유해물질을 ‘차단’하는 코팅제",
  "NST-F100 : 어두운 공간에서 포름알데하이드 등을 흡착하고 ‘솔(숲)향’을 조성하는 탈취제",
];

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const FLOW = [
  { slug: "nst-s200", zone: "원인제거 (대량발생)", what: "VOCs 원천봉쇄", text: "자재·가구에서 나오는 대량방출 원인 제거" },
  { slug: "nst-f100", zone: "잔류제거 (사각지대)", what: "VOCs 제거보조", text: "S200 시공 사각지대 제거 보조·숲향 제공" },
  { slug: "nst-s100", zone: "지속제거 (일반공간)", what: "VOCs 지속제거", text: "빛이 있는 조건에서 효과 지속" },
] as const;

const TH = "border-b border-hairline bg-mint/60 px-3 py-3 text-left align-bottom text-[14px] font-bold text-pine sm:px-4";
const TD = "border-b border-hairline px-3 py-3 align-top text-[15px] leading-[1.55] text-ink sm:px-4";

export default function ProductsPage() {
  const list = PRODUCT_ORDER.map((s) => PRODUCTS[s]);
  const pick = (rows: [string, string][], k: string) => rows.find(([key]) => key === k)?.[1] ?? "";

  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "제품현황" }]}
      eyebrow="Our Products · 제품현황"
      title="(주)엔에스티 제품현황"
      name={TITLE}
      description={DESCRIPTION}
      pageType="CollectionPage"
      pageExtra={{
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: list.length,
          itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(productPath(p.slug)), item: { "@id": `${abs(productPath(p.slug))}#product` } })),
        },
      }}
      ld={list.map(productLd)}
      lead={
        <>
          <p>✓ NST 공법은 현장 맞춤형 기술로 유해물질을 “차단-흡착-분해” 하는 [상온 경화 코팅] 솔루션</p>
          <p>✓ NST 공법은 시공현장 조건에 최적화된 3종 제품으로 구성</p>
        </>
      }
    >
      <section aria-labelledby="trio-title" className={cn(WRAP, "pb-4")}>
        <h2 id="trio-title" className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-[1.25] tracking-[-0.03em] text-pine">
          NST공법 제품 삼총사
        </h2>
        <Figure
          className="mt-6"
          src="/old/products-trio.webp"
          width={1600}
          height={902}
          eager
          zoom
          alt="NST-S100(파란 라벨, 벽면 분사 시공), NST-S200(주황 라벨, 가구 붓 시공), NST-F100(초록 라벨, 수납장 분사 시공) 제품 용기와 시공 사진"
        />
        <ul className="mt-5 space-y-2">
          {TRIO.map((t) => (
            <li key={t} className="flex gap-2.5 text-[16px] leading-[1.65] text-ink/85">
              <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-leaf" />
              <span>
                <Codes text={t} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3단계 흐름 + 카드 ── */}
      <Section
        id="lineup"
        kicker="대량발생 → 취약지역 → 일반지역, 전 공간 케어"
        title="NST-S100, S200, F100 제품 소개"
        intro={<p>※제품을 클릭하시면 상세설명을 보실 수 있습니다.</p>}
      >
        <ol className="grid gap-5 lg:grid-cols-3">
          {list.map((p, i) => {
            const flow = FLOW.find((f) => f.slug === p.slug)!;
            return (
              <li key={p.slug} className={REVEAL}>
                <a
                  href={productPath(p.slug)}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-hairline transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgba(14,59,50,.55)]",
                    FOCUS,
                    EASE,
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo.src} alt={p.photo.alt} width={p.photo.w} height={p.photo.h} loading="lazy" decoding="async" className="h-auto w-full" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[13px] font-bold tracking-[0.06em] text-leaf">
                      0{i + 1} · {p.stepLabel}
                    </p>
                    <h3 className="mt-2 font-mono text-[1.5rem] font-medium tracking-[-0.01em] text-pine">{p.code}</h3>
                    <p className="mt-1 text-[15px] font-semibold text-pine-2">
                      {p.dual} ({p.dualNote})
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.7] text-ink/80">
                      <Codes text={p.summary} />
                    </p>
                    <p className="mt-4 rounded-[1rem] bg-air px-4 py-3 text-[14px] leading-[1.6] text-muted-ink">
                      <strong className="font-semibold text-pine">{flow.zone}</strong> · {flow.what}
                      <br />
                      <Codes text={flow.text} />
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[15px] font-semibold text-trust">
                      {p.code} 자세히 보기
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* ── 비교표 ── */}
      <Section id="compare" tone="white" kicker="제품 설명서" title="제품별 표시사항">
        <div
          role="region"
          aria-label="제품 비교표"
          tabIndex={0}
          className={cn("overflow-x-auto overscroll-x-contain rounded-[1.25rem] ring-1 ring-hairline", FOCUS)}
        >
          <table className="w-full min-w-[46rem] border-collapse bg-white">
            <caption className="sr-only">NST-S200, NST-F100, NST-S100 제품 비교</caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>구분</th>
                {list.map((p) => (
                  <th key={p.slug} scope="col" className={cn(TH, "font-mono font-medium")}>
                    {p.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["시공 단계", (p) => p.stepLabel],
                  ["하이앤드 듀얼", (p) => `${p.dual} (${p.dualNote})`],
                  ["용도", (p) => p.use],
                  ["사용 방법", (p) => p.label.usage.join(" ")],
                  ["품목", (p) => pick(p.label.rows, "품목")],
                  ["용량", (p) => pick(p.label.rows, "용량")],
                  ["제형", (p) => pick(p.label.rows, "제형")],
                  ["표시 용도", (p) => pick(p.label.rows, "용도")],
                  ["주요물질", (p) => pick(p.label.rows, "주요물질")],
                  ["사용기한", (p) => pick(p.label.rows, "사용기한")],
                  ["신고번호", (p) => pick(p.label.rows, "신고번호")],
                  ["제조자", (p) => pick(p.label.rows, "제조자")],
                ] as [string, (p: (typeof list)[number]) => string][]
              ).map(([k, f]) => (
                <tr key={k}>
                  <th scope="row" className={cn(TD, "whitespace-nowrap bg-air font-semibold text-pine-2")}>
                    {k}
                  </th>
                  {list.map((p) => (
                    <td key={p.slug} className={TD}>
                      <Codes text={f(p)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceNote>출처: 제품 라벨 표시사항, 자주묻는질문 Q4.</SourceNote>
      </Section>

      {/* ── 구매 안내 ── */}
      <Section id="buy" kicker="자주묻는질문" title="제품만 따로 구매할 수 있나요?">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className={cn("text-[16px] leading-[1.8] text-ink/85 sm:text-[17px] lg:col-span-7", REVEAL)}>
            <p>NST 공법은 단순히 제품만 사용하는 것이 아니라 전문 시공 노하우와 품질 관리가 함께해야 효과가 극대화됩니다.</p>
            <p className="mt-4">따라서 제품 단독 구매는 불가하며 NST 공식 지점을 통한 시공 서비스로만 만나보실 수 있습니다.</p>
          </div>
          <ul className="grid gap-3 lg:col-span-5">
            {[
              { href: "/partners/", t: "시공업체" },
              { href: "/technology/", t: "기술현황" },
              { href: "/evidence/", t: "시험성적서·시공 실적" },
              { href: "/faq/", t: "자주묻는질문" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn("group flex min-h-16 items-center justify-between gap-4 rounded-[1.25rem] border border-hairline bg-white px-5 py-3 hover:border-pine/40", FOCUS)}
                >
                  <span className="text-[16px] font-semibold text-pine">{l.t}</span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 text-leaf transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <PageCTA />
    </PageShell>
  );
}

