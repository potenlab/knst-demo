import { Bus, Mail, MapPin, Phone, Printer, TrainFront } from "lucide-react";
import PageShell from "@/components/pages/PageShell";
import { pageMetadata } from "@/components/pages/seo";
import { Codes, FOCUS, Figure, H3, LINK, PageCTA, REVEAL, Section, SourceNote, WRAP } from "@/components/pages/ui";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * 회사소개 — old pages /about-nst/ (인사말), /our-vision/ (비전), /history/ (연혁), /directions/ (오시는 길).
 * - 인사말 verbatim from /about-nst/, including the opening line "안녕하십니까, 엔에스티 대표이사 장대규입니다."
 *   (대표 장대규, confirmed by the client 2026-10-29 — see lib/site.ts) and the signature "엔에스티 대표이사 拜上".
 * - The 대형배너(2026) board that /about-nst/ showed is reproduced as image + its text.
 * - 연혁: the /history/ list verbatim + dated items from 언론동향/증빙 (marked in the footnote).
 * - Address spelled "세중테크노밸리" as on /directions/, the product labels and lib/site.ts.
 */

const PATH = "/about/";
const TITLE = "회사소개 · 인사말·비전·연혁·오시는 길";
const DESCRIPTION =
  "엔에스티는 자연과 과학기술(Natural Science&Technology)을 융합하여 건강한 실내공간을 만드는 기업입니다. 대표이사 인사말, 비전, 연혁, 오시는 길.";

/* 대형배너(2026) board text (image-text part-4) */
const BANNER_POINTS = [
  "새집증후군 해결 전용 특허·기술",
  "20년 이상 현장에서 최적화 된 시공기술",
  "환경부 후원 2025 대한민국 환경대상 수상",
  "국가공인 분석기관 안전성·성능 검증 완료",
  "대형건설사 신축아파트 전세대 (1,018세대 외) 일괄시공",
  "현장시공 직접 참관 가능한 신뢰성",
  "원료 관리·연구개발, 제품생산·공급 직접 수행",
];

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const ADDRESS = "충북 청주시 흥덕구 공단로 134 세중테크노밸리 1408호";
const MAP_QUERY = encodeURIComponent("충북 청주시 흥덕구 공단로 134");

const FACTS: [string, string][] = [
  ["상호", "엔에스티 (NST Co., Ltd.)"],
  ["대표", SITE.ceo],
  ["설립", "2009년 7월"],
  ["사업자등록번호", "301-86-03073"],
  ["기업부설연구소", "엔에스티연구소 (2025년 9월 설립)"],
  ["본사", ADDRESS],
];

const GREETING = [
  "엔에스티는 새집증후군 및 아토피와 같은 눈에 보이지 않는 실내 유해 환경으로부터 국민 건강을 지키기 위해 존재하는 친(親)환경 기업입니다.",
  "엔에스티는 과학 기술을 기반으로 솔루션을 직접 연구·개발하고 현장 적용 가능한 실질적인 친환경 제품을 만듭니다. 당사의 모든 제품은 환경부의 생활화학제품안전 기준을 통과하여 안전성을 확보하였습니다. 또한, 현장(아파트 등)에서 직접 유해물질 저감 효과도 입증해 왔습니다.",
  "뿐만 아니라 국내 대형 건설사와 직접 계약하여 대단지 아파트 전체 세대를 대상으로 NST공법 시공을 한 경험이 있는 우리의 기술력은 말이 아닌 실력으로 증명되었습니다.",
  "우리 엔에스티의 사명은 분명합니다. “눈에 보이지 않는 위협으로부터 국민 건강을 지키는 것”으로 친(親)환경 기술을 가지고 신뢰를 쌓아 대한민국 친환경 대표기업이 되겠습니다.",
];

const VISION = [
  {
    n: "01",
    key: "통합솔루션 기업",
    title: "연구개발·제조·판매·시공을 직접하는 ‘통합솔루션 기업’",
    text: "연구개발(R&D)부터 제조, 유통, 현장시공까지 직접 수행하는 친환경 실내공기질 전문 기업입니다.",
  },
  {
    n: "02",
    key: "친환경 기업",
    title: "친환경 기술로 사람과 공간을 바꾸는 ‘친환경 기업’",
    text: "국민 건강과 실내환경 모두를 지키는 기술을 적용해 삶의 질을 바꾸는 친환경 혁신을 만들어갑니다.",
  },
  {
    n: "03",
    key: "신뢰가 가는 기업",
    title: "투명한 시공과 검증된 기술로 ‘신뢰가 가는 기업’",
    text: "고객님이 전(全) 시공과정을 직접 확인할 수 있고 검증된 제품만 사용해 친환경 기술을 제공합니다.",
  },
  {
    n: "04",
    key: "글로벌 환경 기업",
    title: "친환경 기술로 세계로 확장해 나가는 ‘글로벌 환경 기업’",
    text: "새집증후군을 예방하는 NST공법의 친환경 기술력으로 글로벌 시장을 선도합니다.",
  },
];

/* /history/ verbatim; items marked `extra` come from 언론동향·증빙 자료 (see footnote). */
const HISTORY: { year: string; items: { m: string; t: string; extra?: boolean }[] }[] = [
  { year: "2026", items: [{ m: "01", t: "NST공법 전용 ‘하이앤드 듀얼’ 신제품 3종(NST-S100·S200·F100) 출시", extra: true }] },
  {
    year: "2025",
    items: [
      { m: "09", t: "기업부설연구소 엔에스티연구소 설립 완료" },
      { m: "08", t: "NST-S100 리뉴얼 제품 출시" },
      { m: "07", t: "NST-S100·S200·F100 안전기준 적합확인 신고 완료 (한국환경산업기술원)", extra: true },
      { m: "07", t: "제20회 2025 대한민국환경대상 환경제품 부문 본상 수상", extra: true },
      { m: "06", t: "안전확인대상생활화학제품 확인결과서 3종 발급 (FITI 시험연구원)", extra: true },
    ],
  },
  { year: "2021", items: [{ m: "11", t: "에어그린 상표등록 완료 [등록번호: 제40-1799007호]" }] },
  { year: "2016", items: [{ m: "01", t: "NST 브랜드 특허청 상표등록 및 서비스표 등록 완료" }] },
  { year: "2014", items: [{ m: "03", t: "조달청 경쟁입찰 참가자격 등록" }] },
  {
    year: "2011",
    items: [
      { m: "05", t: "가구 유해물질 차단재 NST-S200 특허등록 완료 [특허등록번호: 10-1036607호]" },
      { m: "04", t: "고성능 가시광촉매 NST-S100 특허등록 완료 [특허등록번호: 10-1032904호]" },
      { m: "03", t: "세중테크노밸리 부동산 취득 및 본사 이전" },
    ],
  },
  { year: "2010", items: [{ m: "12", t: "건축물 외장재 오염방지 코팅소재 개발 완료" }] },
  { year: "2009", items: [{ m: "07", t: "주식회사 엔에스티 설립" }] },
];

const ORG_EXTRA = {
  "@type": ["Organization", "HomeAndConstructionBusiness"],
  "@id": `${SITE.url}/#organization`,
  description: "자연과 과학기술(Natural Science&Technology)을 융합하여 건강한 실내공간을 만드는 기업. 2009년 창립 이후 직접 연구개발·제조·판매하며 신축 아파트 등 실내공간의 공기질 개선 솔루션을 제공.",
  employee: { "@type": "Person", name: SITE.ceo, jobTitle: "대표이사" },
  slogan: "국민의 건강을 지키는 친환경 기술 NST공법",
  identifier: { "@type": "PropertyValue", propertyID: "사업자등록번호", value: "301-86-03073" },
  award: "제20회 2025 대한민국환경대상 환경제품부문 (대한민국환경대상위원회, 2025-07-18)",
  subOrganization: { "@type": "Organization", name: "엔에스티연구소", description: "기업부설연구소 (2025년 9월 설립)" },
};

export default function AboutPage() {
  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "회사소개" }]}
      eyebrow="회사소개 · About Us"
      title={
        <>
          실내공간의 환경을
          <br />
          디자인하다
        </>
      }
      name={TITLE}
      description={DESCRIPTION}
      pageType="AboutPage"
      pageExtra={{ about: { "@id": `${SITE.url}/#organization` }, mainEntity: { "@id": `${SITE.url}/#organization` } }}
      ld={[ORG_EXTRA]}
      lead={
        <p>
          엔에스티는 자연과 과학기술(Natural Science&amp;Technology)을 융합하여 건강한 실내공간을 만드는 기업입니다. 2009년 창립 이후, 직접
          연구개발·제조·판매하며 신축 아파트 등 실내공간의 실질적인 공기질 개선 솔루션을 제공해왔습니다.
        </p>
      }
      toc={[
        { id: "greeting", label: "인사말" },
        { id: "vision", label: "비전" },
        { id: "history", label: "연혁" },
        { id: "directions", label: "오시는 길" },
      ]}
    >
      {/* company facts */}
      <div className={cn(WRAP, "pb-4")}>
        <dl className="grid gap-px overflow-hidden rounded-[1.5rem] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map(([k, v]) => (
            <div key={k} className="bg-white px-5 py-4">
              <dt className="text-[13px] font-semibold text-muted-ink">{k}</dt>
              <dd className="mt-1 text-[16px] font-semibold leading-[1.5] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── 인사말 ── */}
      <Section id="greeting" kicker="대표이사 인사말" title="건강한 공간은 선택이 아니라 이제는 필수입니다">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className={cn("lg:col-span-7", REVEAL)}>
            <p className="font-display text-[1.25rem] font-bold leading-[1.5] tracking-[-0.02em] text-pine sm:text-[1.375rem]">
              엔에스티는 자체 기술로 실내 공기를 설계합니다.
            </p>
            <h3 className={cn(H3, "mt-8 text-ink")}>안녕하십니까, 엔에스티 대표이사 장대규입니다.</h3>
            <div className="mt-4 space-y-4 text-[16px] leading-[1.85] text-ink/85 sm:text-[17px]">
              {GREETING.map((p) => (
                <p key={p.slice(0, 16)}>{p}</p>
              ))}
            </div>
            <p className="mt-8 font-display text-[17px] font-bold text-pine">엔에스티 대표이사 拜上</p>
            <blockquote className="mt-8 rounded-r-[1.25rem] border-l-4 border-leaf bg-mint/60 px-5 py-4 font-display text-[17px] font-bold leading-[1.6] text-pine">
              <p>“눈에 보이지 않는 위협으로부터 국민 건강을 지키는 것”</p>
              <footer className="mt-1 font-sans text-[14px] font-medium text-pine-2">— 엔에스티의 사명</footer>
            </blockquote>
          </div>
          <div className="lg:col-span-5">
            <Figure
              src="/img/tech-banner.webp"
              width={800}
              height={1174}
              zoom
              alt="‘새집증후군 해결! 원조기술!! 검증된 NST공법’ 배너: 가운데 ‘20년 노하우’ 퍼즐 조각과 아파트 그림, 둘레에 일곱 가지 내용을 아이콘과 함께 배치하고 아래에 가족과 새지비 캐릭터 사진, 엔에스티 로고"
            />
          </div>
        </div>

        {/* 대형배너(2026) — the board's text as real text */}
        <div className={cn("mt-12 rounded-[1.75rem] border border-hairline bg-white p-6 sm:p-8", REVEAL)}>
          <p className="text-[15px] font-bold text-leaf">새집증후군 해결! 원조기술!!</p>
          <h3 className="mt-1 font-display text-[1.375rem] font-extrabold tracking-[-0.02em] text-pine sm:text-[1.5rem]">
            검증된 NST공법 <span className="ml-1 inline-flex rounded-full bg-pine px-3 py-1 align-middle text-[14px] font-bold text-white">20년 노하우</span>
          </h3>
          <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {BANNER_POINTS.map((t) => (
              <li key={t} className="flex gap-2.5 text-[16px] leading-[1.6] text-ink">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-leaf" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 비전 ── */}
      <Section
        id="vision"
        tone="white"
        kicker="OUR VISION"
        title="엔에스티 비전"
      >
        <ol className="grid gap-4 sm:grid-cols-2">
          {VISION.map((v) => (
            <li key={v.n} className={cn("relative overflow-hidden rounded-[1.5rem] border border-hairline bg-air p-6 sm:p-7", REVEAL)}>
              <span aria-hidden className="font-display text-[2.25rem] font-black leading-none tracking-[-0.04em] text-leaf/35">
                {v.n}
              </span>
              <p className="mt-3 inline-flex rounded-full bg-mint px-3 py-1 text-[13px] font-bold text-pine">{v.key}</p>
              <h3 className={cn(H3, "mt-3 text-pine")}>{v.title}</h3>
              <p className="mt-2 text-[16px] leading-[1.75] text-muted-ink">{v.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── 연혁 ── */}
      <Section
        id="history"
        kicker="연혁"
        title="새집증후군 예방 - NST 3단계 솔루션!"
      >
        <ol className="relative max-w-[52rem] border-l-2 border-hairline pl-6 sm:pl-10">
          {HISTORY.map((y, yi) => (
            <li key={y.year} className={cn("relative pb-10 last:pb-0", REVEAL)}>
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[33px] top-1.5 size-4 rounded-full border-[3px] border-air sm:-left-[49px]",
                  yi === 0 ? "bg-leaf" : "bg-pine-2",
                )}
              />
              <h3 className="font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-pine tabular-nums">{y.year}</h3>
              <ul className="mt-4 divide-y divide-hairline rounded-[1.25rem] border border-hairline bg-white">
                {y.items.map((it) => (
                  <li key={it.t} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 px-4 py-3.5 sm:px-5">
                    <time dateTime={`${y.year}-${it.m}`} className="pt-px font-display text-[15px] font-bold text-leaf tabular-nums">
                      {Number(it.m)}월
                    </time>
                    <p className="text-[16px] leading-[1.6] text-ink">
                      <Codes text={it.t} />
                      {it.extra && (
                        <>
                          <sup aria-hidden className="ml-0.5 text-[12px] font-semibold text-muted-ink">
                            *
                          </sup>
                          <span className="sr-only"> (언론동향·증빙 자료 기준)</span>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <SourceNote>
          출처: 엔에스티 연혁. * 표시 항목은 언론동향(2025.07.21·2026.01.28 보도)과 공개 증빙서류 기준으로 덧붙였습니다. 등록증 기준 등록일은 서비스표
          제41-0375364호 2016.10.21, 상표 제40-1241651호 2017.03.23입니다. 서류는{" "}
          <a href="/evidence/" className={cn(LINK, FOCUS, "rounded")}>
            시험성적서·시공 실적
          </a>
          에서 볼 수 있습니다.
        </SourceNote>
      </Section>

      {/* ── 오시는 길 ── */}
      <Section id="directions" tone="mint" kicker="오시는 길" title="오시는길">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={cn("rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline sm:p-8", REVEAL)}>
            <h3 className={cn(H3, "text-pine")}>회사정보</h3>
            <address className="mt-5 not-italic">
              <ul className="space-y-4 text-[16px] leading-[1.6]">
                <li className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <span>
                    <span className="block font-semibold text-ink">{ADDRESS}</span>
                    <span className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={`https://map.naver.com/p/search/${MAP_QUERY}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}
                      >
                        네이버 지도<span className="sr-only">(새 창)</span>
                      </a>
                      <a
                        href={`https://map.kakao.com/?q=${MAP_QUERY}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}
                      >
                        카카오맵<span className="sr-only">(새 창)</span>
                      </a>
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <span className="flex flex-wrap gap-x-4">
                    <a href="tel:0432222322" className={cn("inline-flex min-h-11 items-center rounded tabular-nums", LINK, FOCUS)}>
                      (043)222-2322
                    </a>
                    <a href="tel:07042707346" className={cn("inline-flex min-h-11 items-center rounded tabular-nums", LINK, FOCUS)}>
                      070-4270-7346
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Printer aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <span className="tabular-nums">팩스 (043) 222-2321</span>
                </li>
                <li className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <a href="mailto:isnst@naver.com" className={cn("inline-flex min-h-11 items-center rounded -my-3", LINK, FOCUS)}>
                    isnst@naver.com
                  </a>
                </li>
              </ul>
            </address>
          </div>

          <div className={cn("rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline sm:p-8", REVEAL)}>
            <h3 className={cn(H3, "text-pine")}>교통안내</h3>
            <ul className="mt-5 space-y-5">
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pine text-mint">
                  <TrainFront aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-pine-2">KTX/SRT</span>
                  <span className="mt-0.5 block text-[16px] leading-[1.6] text-ink">오송역 하차 → 약 20분</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pine text-mint">
                  <Bus aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-pine-2">버스</span>
                  <span className="mt-0.5 block text-[16px] leading-[1.6] text-ink">오송역 500번 (대농공원 하차) → 약 40분</span>
                </span>
              </li>
            </ul>
            <p className="mt-8 flex flex-wrap gap-2 border-t border-hairline pt-5">
              <a
                href="/contact/"
                className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}
              >
                문의하기
              </a>
              <a
                href="/partners/"
                className={cn("inline-flex min-h-11 items-center rounded-full border border-pine/15 px-4 text-[14px] font-semibold text-pine hover:border-pine/40", FOCUS)}
              >
                시공업체
              </a>
            </p>
          </div>
        </div>
      </Section>

      <PageCTA />
    </PageShell>
  );
}
