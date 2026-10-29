"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ScrollText, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Element 8 — "Proof" (신뢰 증빙). knst.co.kr publishes NO customer reviews
 * (/고객-찐-후기-시공-갤러리/ only says "업데이트 될 예정입니다"), so this section does the
 * testimonial job with the company's own published documents instead. Every fact below is
 * from docs/reference/content.md / content/knst-content.json and the transcribed image text in
 * docs/reference/image-text/part-1..4.md. Old-home text placed here: the "'안전한 기술'" heading + 기술현황 pointer,
 * the 새집증후군8 board (시공 실적), the 엔에스티8 slide and the "OUR GALLERY" block.
 * Still left out (unreadable / inconsistent on the sources):
 *  - FITI 확인결과서: product↔number mapping is inconsistent on the source board → shown as a set only
 *  - KCL "0.097→0.005" raw table (unit unclear) → only the published % reductions are quoted
 *  - 현장 테스트 수치 (issuer/date unknown); "강서 경성하늘샵/하늘삽" (단지명·세대수 판독 불일치)
 *  - 표창장·연구소 사업자등록증의 개인 성명 (판독 불확실)
 * Personal data inside the scans (inventor ID/home address, a mobile number) is blurred in the assets.
 */

type Doc = { src: string; w: number; h: number; alt: string; label?: string; cutout?: boolean };
type Proof = {
  id: string;
  kind: string;
  title: string;
  sub: string;
  issuer: string;
  /** Latin/digits only — rendered in Plex Mono (no Hangul glyphs) */
  ref?: string;
  date: string;
  note: string;
  /** verbatim citation printed on the document */
  quote?: string;
  source: { href: string; label: string };
  docs: Doc[];
  featured?: boolean;
};

/* Same-site pages (the old knst.co.kr URLs, resolved through lib/old-redirects.json). */
const SRC = {
  award:
    "/news/%EC%A3%BC-%EC%97%94%EC%97%90%EC%8A%A4%ED%8B%B0-2025-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%ED%99%98%EA%B2%BD%EB%8C%80%EC%83%81-%ED%99%98%EA%B2%BD%EC%A0%9C%ED%92%88-%EB%B6%80%EB%AC%B8-%EB%B3%B8%EC%83%81-%EC%88%98%EC%83%81/",
  history: "/about/#history",
  tech: "/technology/",
  reports: "/blog/test-report-verification/",
  evidence: "/evidence/",
};

const GROUPS: { label: string; items: Proof[] }[] = [
  {
    label: "수상 · 특허",
    items: [
      {
        id: "award",
        kind: "국가 포상",
        title: "2025 대한민국환경대상 환경제품 부문 본상",
        sub: "제20회 · 환경부 등 정부 부처 후원",
        issuer: "대한민국환경대상위원회",
        date: "2025.07.18",
        note: "NST-S100·S200·F100 제품 3총사를 활용한 복합 솔루션으로 환경제품 부문 본상을 받았습니다(한국경제TV, 2025.07.21 보도). 대한민국환경대상위원회 위원장 이규용, 미래는우리손안에·환경미디어 발행인 서동숙. 주 최 : 대한민국환경대상위원회·미래는우리손안에·환경미디어 / 후 원 : 환경부·농림축산식품부·산업통상자원부·해양수산부",
        quote: "귀 사는 미래지향적인 친환경사회와 지속가능한 국가 발전을 위해 기여한 공이 크므로 제20회 2025대한민국환경대상에 선정되어 이 상을 드립니다.",
        source: { href: SRC.award, label: "수상 보도" },
        featured: true,
        docs: [
          {
            src: "/img/proof-award.webp",
            w: 440,
            h: 576,
            alt: "제20회 2025 대한민국환경대상 환경제품부문 상패. 엔에스티 수상, 2025년 7월 18일, 대한민국환경대상위원회 발행",
          },
        ],
      },
      {
        id: "patents",
        kind: "특허",
        title: "특허 등록 2건",
        sub: "NST-S100 가시광촉매 · NST-S200 방출 억제제",
        issuer: "특허청",
        ref: "10-1032904 · 10-1036607",
        date: "2011.04.27 · 2011.05.17",
        note: "「가시광 활성 티타니아졸의 제조방법」(고성능 가시광촉매, NST-S100)과 「천연물질을 이용한 유해물질의 표면 방출 억제제 및 그 제조방법」(가구 유해물질 차단재, NST-S200). 출원일: 2010년 12월 08일",
        source: { href: SRC.history, label: "연혁" },
        docs: [
          {
            src: "/img/proof-patent-1032904.webp",
            w: 880,
            h: 1100,
            label: "10-1032904 · NST-S100",
            alt: "특허증 제10-1032904호. 발명의 명칭: 가시광 활성 티타니아졸의 제조방법. 특허권자 주식회사 엔에스티, 2011년 4월 27일 등록. 발명자 개인정보는 흐림 처리",
          },
          {
            src: "/img/proof-patent-1036607.webp",
            w: 905,
            h: 1100,
            label: "10-1036607 · NST-S200",
            alt: "특허증 제10-1036607호. 발명의 명칭: 천연물질을 이용한 유해물질의 표면 방출 억제제 및 그 제조방법. 특허권자 주식회사 엔에스티, 2011년 5월 17일 등록. 발명자 개인정보는 흐림 처리",
          },
        ],
      },
    ],
  },
  {
    label: "안전성 확인",
    items: [
      {
        id: "safety",
        kind: "안전기준 신고",
        title: "안전기준 적합확인 신고증명서 3종",
        sub: "NST-S100 · NST-S200 · NST-F100",
        issuer: "한국환경산업기술원",
        ref: "GB25-13-0045 · GB25-07-0028 · GB25-13-0044",
        date: "2025.07.21 – 07.25",
        note: "품목: NST-S100·NST-F100 탈취제, NST-S200 특수목적코팅제.",
        source: { href: SRC.tech, label: "기술현황" },
        docs: [
          {
            src: "/img/proof-safety-s100.webp",
            w: 869,
            h: 1000,
            label: "NST-S100 · GB25-13-0045 · 2025.07.21",
            alt: "안전기준 적합확인 신고증명서 신고번호 GB25-13-0045호. 제품명 엔에스티-에스100, 품목 탈취제, 한국환경산업기술원장 발급, 2025년 7월 21일",
          },
          {
            src: "/img/proof-safety-s200.webp",
            w: 865,
            h: 1000,
            label: "NST-S200 · GB25-07-0028 · 2025.07.25",
            alt: "안전기준 적합확인 신고증명서 신고번호 GB25-07-0028호. 제품명 엔에스티-에스200, 품목 특수목적코팅제, 한국환경산업기술원장 발급, 2025년 7월 25일",
          },
          {
            src: "/img/proof-safety-f100.webp",
            w: 874,
            h: 1000,
            label: "NST-F100 · GB25-13-0044 · 2025.07.21",
            alt: "안전기준 적합확인 신고증명서 신고번호 GB25-13-0044호. 제품명 엔에스티-에프100, 품목 탈취제, 한국환경산업기술원장 발급, 2025년 7월 21일",
          },
        ],
      },
      {
        id: "fiti",
        kind: "안전확인",
        title: "안전확인대상생활화학제품 확인결과서 3종",
        sub: "확인 완료 · 2028.06.25까지 유효",
        issuer: "FITI 시험연구원",
        ref: "M287-25-02137 · 02138 · 02139",
        date: "2025.06.26",
        note: "확인 완료일 2025.06.26, 유효기간 2025.06.26 – 2028.06.25.",
        source: { href: SRC.tech, label: "기술현황" },
        docs: [
          {
            src: "/img/proof-fiti-02137.webp",
            w: 863,
            h: 1000,
            label: "M287-25-02137",
            alt: "FITI 시험연구원 안전확인대상생활화학제품 확인결과서, 발행번호 M287-25-02137, 확인 완료일 2025년 6월 26일. 담당자 연락처는 흐림 처리",
          },
          {
            src: "/img/proof-fiti-02139.webp",
            w: 867,
            h: 1000,
            label: "M287-25-02139",
            alt: "FITI 시험연구원 안전확인대상생활화학제품 확인결과서, 발행번호 M287-25-02139, 확인 완료일 2025년 6월 26일. 담당자 연락처는 흐림 처리",
          },
          {
            src: "/img/proof-fiti-02138.webp",
            w: 867,
            h: 1000,
            label: "M287-25-02138",
            alt: "FITI 시험연구원 안전확인대상생활화학제품 확인결과서, 발행번호 M287-25-02138, 확인 완료일 2025년 6월 26일. 담당자 연락처는 흐림 처리",
          },
        ],
      },
    ],
  },
  {
    label: "공인 시험성적서",
    items: [
      {
        id: "kicet",
        kind: "공인시험",
        title: "한국세라믹기술원 시험성적서",
        sub: "NST-S100 · 포름알데히드 (암조건 · 광조건)",
        issuer: "한국세라믹기술원(KICET)",
        ref: "2025-1985",
        date: "시험 2025.06.23 – 06.25",
        note: "시험 결과(포름알데하이드 농도): 초기 25ppm → 암조건 1·2시간 15ppm, 광조건 1·2시간 10ppm. 엔에스티는 이 성적서를 ‘한국세라믹기술원 공인시험을 통한 포름알데하이드 분해 성능 입증’ 자료로 공개하고 있습니다.",
        source: { href: SRC.reports, label: "공인시험성적서 자료" },
        docs: [
          {
            src: "/img/proof-kicet.webp",
            w: 697,
            h: 1028,
            cutout: true,
            label: "KICET 2025-1985",
            alt: "한국세라믹기술원 시험성적서 제2025-1985호 두 쪽. 의뢰자 주식회사 엔에스티, 시험 시료 NST-S100, 시험기간 2025년 6월 23일부터 25일, 시험 결과표",
          },
        ],
      },
      {
        id: "kcl",
        kind: "공인시험",
        title: "KCL 시험성적서",
        sub: "엔에스티-에스200 · KS M 1998:2022 소형챔버법",
        issuer: "한국건설생활환경시험연구원(KCL) · KOLAS 인정",
        ref: "CT25-051997K · CT25-051998K",
        date: "발행 2025.07.22",
        note: "시험기간 2025.06.16 – 07.22. KOLAS 인정 시험기관(ILAC-MRA)이 발행한 엔에스티-에스200 성적서입니다. 엔에스티는 KS M 1998:2022 소형챔버법 결과를 ‘NST-S200 코팅 후 톨루엔 100% 감소(불검출), 포름알데히드 94.8% 감소’로 공개하고 있습니다.",
        source: { href: SRC.reports, label: "공인시험성적서 자료" },
        docs: [
          {
            src: "/img/proof-kcl.webp",
            w: 767,
            h: 1028,
            cutout: true,
            label: "KCL CT25-051998K",
            alt: "한국건설생활환경시험연구원(KCL) 시험성적서 CT25-051998K 묶음. 의뢰자 주식회사 엔에스티, 시료명 엔에스티-에스200, 시험방법 KS M 1998:2022 소형챔버법, 2025년 7월 22일 발행",
          },
        ],
      },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

/** Resting / spread transforms per stack size. Index 0 is always the front document. */
const FAN: Record<number, { rest: string; spread: string }[]> = {
  1: [{ rest: "rotate(-1.2deg)", spread: "rotate(0deg) scale(1.035)" }],
  2: [
    { rest: "translateX(-16%) rotate(-4.5deg)", spread: "translateX(-23%) rotate(-6.5deg)" },
    { rest: "translateX(16%) translateY(3%) rotate(3.5deg)", spread: "translateX(23%) translateY(1%) rotate(5.5deg)" },
  ],
  3: [
    { rest: "translateY(3%) rotate(-.6deg)", spread: "translateY(-1%) rotate(0deg)" },
    { rest: "translateX(-25%) rotate(-7deg) scale(.92)", spread: "translateX(-34%) rotate(-9deg) scale(.92)" },
    { rest: "translateX(25%) translateY(1%) rotate(6deg) scale(.92)", spread: "translateX(34%) rotate(8deg) scale(.92)" },
  ],
};

/* 시공 실적 — the old gallery slide "엔에스티 새집증후군 예방 시공 실적(대형 건설사 전세대)" (image-text part-1 엔에스티8),
   same order and wording. Left out: "강서 경성하늘삽 162 전세대" (단지명·세대수 판독 불확실; other boards read 경성하늘샵 160세대). */
const PROJECTS: { name: string; units: string; all: boolean; client?: string }[] = [
  { name: "오송 힐데스하임", units: "402", all: true, client: "원건설" },
  { name: "유성 네오미아", units: "1,018", all: true, client: "운암건설" },
  { name: "북문로 한신휴플러스", units: "286", all: true, client: "한신공영" },
  { name: "오산 엘리시아", units: "275", all: true, client: "KD건설" },
  { name: "동해 엘리시아", units: "268", all: true, client: "KD건설" },
  { name: "세종시 한신 리버파크", units: "955", all: false },
  { name: "세종시 한양수자인 에듀시티", units: "520", all: false },
  { name: "울산 동원 로얄듀크 1차", units: "309", all: false },
  { name: "양산동원 로얄듀크 2차", units: "621", all: false },
];

/* OUR GALLERY — the old home carousel slides (그림15, 그림16-1, 엔에스티8); captions = the slide headlines. */
const GALLERY = [
  {
    src: "/img/g-1.webp",
    w: 1400,
    h: 789,
    alt: "NST-S100·NST-S200·NST-F100 제품 용기와 각 제품 시공 사진을 모은 슬라이드",
    caption: "엔에스티 친환경 제품 삼총사 (NST-S100, NST-S200, NST-F100)",
  },
  {
    src: "/img/g-2.webp",
    w: 1400,
    h: 789,
    alt: "제20회 2025 대한민국환경대상 환경제품부문 상패와 상장 슬라이드",
    caption: "엔에스티, 「2025년 대한민국환경대상」 ‘환경제품부문’ 수상",
  },
  {
    src: "/img/g-3.webp",
    w: 1280,
    h: 720,
    alt: "대형 건설사 신축 아파트 단지와 시공 현수막 사진을 모은 슬라이드",
    caption: "엔에스티 새집증후군 예방 시공 실적(대형 건설사 전세대)",
  },
];

const OTHER_SITES = [
  { name: "수원특례시의회", scope: "수원특례시 신청사 11층 전체" },
  { name: "국방과학연구소", scope: "대전시 유성구, 4층 전체" },
  { name: "롯데호텔", scope: "롯데시티호텔 마포" },
];

/* 그 밖의 등록·인증 — certificate boards "증명서로 보는 NST공법 (1)–(3)", 그림35, 연혁. Text only. */
const REGISTRY: { t: string; d: string }[] = [
  { t: "서비스표 등록 제41-0375364호", d: "제40류 공기정화 및 탈취업 등 10건 · 2016.10.21 등록 · 특허청" },
  { t: "상표 등록 제40-1241651호 (NST 로고)", d: "제01류 등 2개류, 가구용 유해물질차단 코팅제 등 9건 · 2017.03.23 등록 · 특허청" },
  { t: "상표 등록 제40-1799007호 ‘에어그린’", d: "제01류 오염장소 정화용 화학제 등 5건 · 2021.11.12 등록 · 특허청" },
  { t: "조달청 경쟁입찰참가자격 등록", d: "2014.03 · 조달청" },
  { t: "공장등록", d: "청주산업단지관리공단 공장등록증명" },
  { t: "실내환경관리사 교육 수료", d: "제4회 실내환경 관리사 교육 · 2011.10.06 · 한국실내환경학회" },
  { t: "환경부장관 표창 제44754호", d: "사업장폐기물 관리 기여 · 2023.09.15 (개인 표창)" },
  { t: "기업부설연구소 엔에스티연구소", d: "2025.09 설립" },
];

const TIMELINE = [
  { d: "2009-07", y: "2009", m: "07", t: "주식회사 엔에스티 설립" },
  { d: "2011-04", y: "2011", m: "04", t: "고성능 가시광촉매 NST-S100 특허 등록" },
  { d: "2011-05", y: "2011", m: "05", t: "가구 유해물질 차단재 NST-S200 특허 등록" },
  { d: "2014-03", y: "2014", m: "03", t: "조달청 경쟁입찰 참가자격 등록" },
  { d: "2025-07", y: "2025", m: "07", t: "대한민국환경대상 환경제품 부문 본상" },
  { d: "2025-08", y: "2025", m: "08", t: "빛이 없어도 유해물질을 제거하는 NST-S100 리뉴얼 출시" },
  { d: "2025-09", y: "2025", m: "09", t: "기업부설연구소 엔에스티연구소 설립" },
  { d: "2026-01", y: "2026", m: "01", t: "‘하이앤드 듀얼’ 신제품 3종 출시" },
];

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2";
/* scroll-linked entrance — transform/opacity only, progressive (no-op where unsupported or reduced motion) */
const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:forwards] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:linear] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_cover_22%]";
const TILTS = ["rotate-[-1.1deg]", "rotate-[0.9deg]"];

/** Product codes are Latin — Plex Mono for the code, Pretendard for the Korean around it. */
function withCodes(line: string): ReactNode[] {
  return line.split(/(NST-[SF]\d{3})/g).map((part, i) =>
    /^NST-[SF]\d{3}$/.test(part) ? (
      <span key={i} className="font-mono text-[0.9em] font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function SourceBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold",
        dark ? "border-mint/35 text-mint" : "border-pine/20 bg-white/70 text-pine",
      )}
    >
      <ScrollText aria-hidden="true" className="size-3.5" />
      공식 자료 인용
    </span>
  );
}

function ProofCard({ item, index, tilt, onOpen }: { item: Proof; index: number; tilt: string; onOpen: (i: number) => void }) {
  const n = item.docs.length;
  const fan = FAN[n] ?? FAN[1];
  const order = n === 3 ? [1, 2, 0] : item.docs.map((_, i) => i);
  const width = item.featured ? "62%" : n === 1 ? (item.docs[0].cutout ? "84%" : "70%") : n === 2 ? "56%" : "54%";
  const dark = !!item.featured;

  return (
    <article
      className={cn(
        "group/card relative rounded-[1.75rem] p-2.5 transition-[translate,rotate,box-shadow] duration-500 hover:-translate-y-2 hover:rotate-0 focus-within:-translate-y-2 focus-within:rotate-0 sm:p-3",
        tilt,
        dark
          ? "bg-pine text-white shadow-[0_40px_70px_-36px_rgba(14,59,50,.85)]"
          : "bg-white text-ink shadow-[0_1px_0_rgba(14,59,50,.05),0_30px_60px_-38px_rgba(14,59,50,.55)] ring-1 ring-hairline hover:shadow-[0_1px_0_rgba(14,59,50,.05),0_40px_70px_-36px_rgba(14,59,50,.6)]",
        EASE,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-haspopup="dialog"
        aria-label={`${item.title} — 서류 크게 보기`}
        className={cn(
          "block w-full rounded-[1.25rem] text-left outline-none",
          "after:absolute after:inset-0 after:z-20 after:rounded-[1.75rem] after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-trust",
        )}
      >
        <span
          className={cn(
            "relative block aspect-[4/5] overflow-hidden rounded-[1.25rem]",
            dark
              ? "bg-[radial-gradient(circle_at_50%_46%,rgba(205,238,221,.34),rgba(20,80,63,.55)_46%,rgba(14,59,50,1)_78%)]"
              : "bg-[radial-gradient(circle_at_50%_40%,#ffffff,#e4f5ec_70%)]",
          )}
        >
          {dark &&
            [92, 72].map((s, i) => (
              <span
                key={s}
                aria-hidden="true"
                className="absolute left-1/2 top-[48%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/20"
                style={{ width: `${s}%`, animation: `breathe 9s cubic-bezier(.4,0,.2,1) ${-i * 2.5}s infinite` }}
              />
            ))}
          {order.map((di) => {
            const d = item.docs[di];
            const pos = fan[di] ?? fan[0];
            return (
              <img
                key={d.src}
                src={d.src}
                alt={d.alt}
                width={d.w}
                height={d.h}
                loading="lazy"
                decoding="async"
                style={{ width, zIndex: di === 0 ? 3 : 1 + di, "--rest": pos.rest, "--spread": pos.spread } as CSSProperties}
                className={cn(
                  "absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 [transform:var(--rest)] group-hover/card:[transform:var(--spread)] group-focus-within/card:[transform:var(--spread)]",
                  d.cutout
                    ? "drop-shadow-[0_18px_22px_rgba(14,59,50,.22)]"
                    : dark
                      ? "rounded-[6px] shadow-[0_30px_50px_-20px_rgba(0,0,0,.65)]"
                      : "rounded-[5px] bg-white shadow-[0_18px_30px_-16px_rgba(14,59,50,.55)] ring-1 ring-black/5",
                  EASE,
                )}
              />
            );
          })}
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-pine shadow-[0_6px_16px_-8px_rgba(14,59,50,.6)] transition-[scale] duration-300 group-hover/card:scale-110"
          >
            <ZoomIn className="size-[18px]" />
          </span>
          {n > 1 && (
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 z-10 rounded-full bg-ink/75 px-2.5 py-1 text-[12px] font-semibold tabular-nums text-white backdrop-blur"
            >
              {n}장
            </span>
          )}
        </span>
      </button>

      <div className="px-2 pb-2 pt-5 sm:px-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className={cn("rounded-full px-2.5 py-1 text-[13px] font-bold", dark ? "bg-mint text-pine" : "bg-mint/70 text-pine")}>
            {item.kind}
          </span>
          {item.ref && <span className={cn("font-mono text-[12px] tracking-[0.02em]", dark ? "text-white/70" : "text-muted-ink")}>{item.ref}</span>}
        </div>
        <h3 className="mt-3 font-display text-[21px] font-bold leading-[1.3] tracking-[-0.025em] sm:text-[22px]">{item.title}</h3>
        <p className={cn("mt-1.5 text-[15px] font-medium leading-[1.5]", dark ? "text-mint" : "text-pine-2")}>{withCodes(item.sub)}</p>
        <dl className={cn("mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[14px] leading-[1.5]", dark ? "text-white/90" : "text-ink")}>
          <dt className={dark ? "text-white/70" : "text-muted-ink"}>발급</dt>
          <dd>{item.issuer}</dd>
          <dt className={dark ? "text-white/70" : "text-muted-ink"}>일자</dt>
          <dd className="tabular-nums">{item.date}</dd>
        </dl>
        {/* the note is real page text (the lightbox only renders on demand) */}
        <p className={cn("relative z-30 mt-4 border-t pt-4 text-[14px] leading-[1.65]", dark ? "border-white/15 text-white/75" : "border-hairline text-muted-ink")}>
          {withCodes(item.note)}
        </p>
        {item.quote && (
          <blockquote className={cn("relative z-30 mt-3 text-[14px] leading-[1.65]", dark ? "text-mint" : "text-pine-2")}>
            <p>「{item.quote}」</p>
          </blockquote>
        )}
      </div>
    </article>
  );
}

export default function Proof() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const open = useCallback((i: number) => {
    returnRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActive(i);
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setActive((i) => (i === null ? i : (i + dir + ALL.length) % ALL.length));
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (active === null || !d || d.open) return;
    d.showModal();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
  }, [active]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    setActive(null);
    returnRef.current?.focus({ preventScroll: true });
  };

  const item = active === null ? null : ALL[active];

  return (
    <section id="proof" aria-labelledby="proof-title" className="grain relative isolate overflow-clip bg-air">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(44rem 32rem at 92% 6%, rgba(205,238,221,.85), rgba(205,238,221,0) 64%)",
            "radial-gradient(38rem 30rem at -6% 46%, rgba(205,238,221,.6), rgba(205,238,221,0) 62%)",
          ].join(","),
        }}
      />

      <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
        {/* ── header + pull statement ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-6">
          <div className={cn("lg:col-span-6", REVEAL)}>
            <p className="flex items-center gap-2.5 text-[14px] font-bold tracking-[0.08em] text-pine-2">
              <span aria-hidden="true" className="relative grid size-3 place-items-center">
                <span className="absolute inset-0 rounded-full border border-leaf/60" />
                <span className="size-1.5 rounded-full bg-leaf" />
              </span>
              특허 및 증명서
            </p>
            {/* old home: "공인기관 및 정부 시스템이 검증한 '안전한 기술'입니다." + the 기술현황 pointer */}
            <h2
              id="proof-title"
              className="mt-4 text-balance font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.18] tracking-[-0.035em] text-pine"
            >
              공인기관 및 정부 시스템이 검증한{" "}
              <span className="whitespace-nowrap">
                <span className="bg-[linear-gradient(transparent_62%,#cdeedd_62%,#cdeedd_92%,transparent_92%)] box-decoration-clone">
                  ‘안전한 기술’
                </span>
                입니다.
              </span>
            </h2>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.75] text-muted-ink sm:text-[18px]">
              ※특허 및 증명서 등 관련 자료는{" "}
              <a
                href={SRC.tech}
                className={cn("rounded font-semibold text-trust underline decoration-trust/30 underline-offset-4 hover:decoration-trust", FOCUS)}
              >
                ▶기술현황(클릭)
              </a>{" "}
              에서 확인하실수 있습니다.
            </p>
            <p className="mt-3 text-[14px] text-muted-ink">※ 서류 속 개인 주소·연락처는 흐림 처리했습니다.</p>
          </div>

          <figure className={cn("relative lg:col-span-5 lg:col-start-8 lg:self-end", REVEAL)}>
            <SourceBadge />
            <blockquote className="relative mt-5 font-display text-[clamp(1.375rem,1.1rem+1.2vw,1.875rem)] font-bold leading-[1.32] tracking-[-0.03em] text-ink">
              <p className="relative">
                <span aria-hidden="true" className="mr-0.5 text-leaf/60">
                  「
                </span>
                새집증후군은 측정기 숫자 쇼가 아니라,{" "}
                <span className="bg-[linear-gradient(transparent_60%,#cdeedd_60%,#cdeedd_94%,transparent_94%)] box-decoration-clone text-pine">
                  실내 오염물질 발생원을 관리하는 공정
                </span>
                입니다.
                <span aria-hidden="true" className="ml-0.5 text-leaf/60">
                  」
                </span>
              </p>
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-[1.6] text-muted-ink">
              <span>엔에스티 칼럼 「공인시험성적서 vs 간이측정」</span>
              <a
                href={SRC.reports}
                className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-1 font-semibold text-trust hover:underline", FOCUS)}
              >
                칼럼 보기
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </figcaption>
          </figure>
        </div>

        {/* ── document cards: three editorial columns, staggered ── */}
        <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-6 lg:mt-24 lg:grid-cols-3 lg:gap-x-8">
          {GROUPS.map((g, gi) => (
            <div key={g.label} className={cn("flex flex-col gap-7", gi === 1 && "lg:mt-24", gi === 2 && "lg:mt-10")}>
              <p className="flex items-center gap-3 text-[14px] font-bold text-pine-2">
                {g.label}
                <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
              </p>
              {g.items.map((it, ii) => (
                <div key={it.id} className={REVEAL}>
                  <ProofCard item={it} index={ALL.indexOf(it)} tilt={TILTS[(gi + ii) % 2]} onOpen={open} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── other registrations (text only) ── */}
        <div className={cn("mt-20 lg:mt-24", REVEAL)}>
          <div className="flex flex-col gap-2 border-b-2 border-pine pb-4 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="font-display text-[1.25rem] font-bold leading-[1.3] tracking-[-0.02em] text-pine sm:text-[1.375rem]">
              그 밖의 등록 · 인증
            </h3>
            <p className="text-[14px] text-muted-ink">출처: 엔에스티 「증명서로 보는 NST공법」·연혁</p>
          </div>
          <dl className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
            {REGISTRY.map((r) => (
              <div key={r.t} className="border-b border-hairline py-4">
                <dt className="text-[15px] font-bold leading-[1.45] text-ink">{r.t}</dt>
                <dd className="mt-1 text-[14px] leading-[1.6] text-muted-ink">{r.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── verified site record ── */}
        <div
          className={cn(
            "relative isolate mt-24 overflow-hidden rounded-[2rem] bg-pine px-5 py-10 text-white sm:px-10 sm:py-12 lg:mt-32 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-14 lg:py-16",
            REVEAL,
          )}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[36rem]">
            {[100, 76, 52].map((s, i) => (
              <span
                key={s}
                className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/10"
                style={{ width: `${s}%`, animation: `breathe 10s cubic-bezier(.4,0,.2,1) ${-i * 2.4}s infinite` }}
              />
            ))}
          </div>

          {/* old home image 새집증후군8, as text */}
          <div className="lg:col-span-5">
            <p className="text-[14px] font-bold tracking-[0.08em] text-mint">시공 실적</p>
            <h3 className="mt-3 text-balance font-display text-[clamp(1.5rem,1.2rem+1.3vw,2rem)] font-extrabold leading-[1.25] tracking-[-0.03em]">
              NST공법, 다수의 대형건설사 전세대 일괄시공 실적
            </h3>
            <div className="mt-8 space-y-7">
              <div>
                <h4 className="text-[17px] font-bold text-mint">NST공법 건설사 전세대 일괄시공 프로젝트 완료</h4>
                <p className="mt-2 font-display text-[19px] font-bold leading-[1.5] tracking-[-0.02em] text-white sm:text-[21px]">
                  총 <span className="tabular-nums">1,018</span>세대 외 다수의 대규모 프로젝트 일괄 시공
                </p>
                <p className="mt-2 text-[15px] leading-[1.7] text-white/75 sm:text-[16px]">
                  주요 건설사 신축아파트 전세대 시공 프로젝트를 성황리에 마무리하며 NST공법의 기술력과 시공 능력을 입증하였습니다.
                </p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <h4 className="text-[17px] font-bold text-mint">NST공법 시공 기술이 업계에 미친 영향력</h4>
                <p className="mt-2 font-display text-[19px] font-bold leading-[1.5] tracking-[-0.02em] text-white sm:text-[21px]">
                  새집증후군 및 실내공기질 개선 업계 시공 표준 NST공법
                </p>
                <p className="mt-2 text-[15px] leading-[1.7] text-white/75 sm:text-[16px]">
                  친환경 NST공법을 통해 전세대에 맞춤형 실내공기질 개선 솔루션을 일괄 시공하여 쾌적하고 건강한 주거 환경을 제공
                  하였습니다.
                </p>
              </div>
            </div>
          </div>

          {/* old gallery slide 엔에스티8, as text (same order and wording) */}
          <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-center">
            <h4 className="text-[14px] font-bold tracking-[0.04em] text-mint">엔에스티 새집증후군 예방 시공 실적(대형 건설사 전세대)</h4>
            <dl className="mt-3 divide-y divide-white/15 border-y border-white/15">
              {PROJECTS.map((r, i) => (
                <div key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3.5">
                  <dt className={cn("min-w-0 font-semibold text-white", i === 1 ? "text-[18px]" : "text-[16px]")}>{r.name}</dt>
                  <dd className="whitespace-nowrap text-right">
                    <span
                      className={cn(
                        "font-display font-black leading-none tracking-[-0.04em] tabular-nums",
                        i === 1 ? "text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] text-mint" : "text-[22px]",
                      )}
                    >
                      {r.units}
                    </span>
                    <span className="ml-1 font-display text-[15px] font-bold">{r.all ? "전세대" : "세대"}</span>
                  </dd>
                  {r.client && <dd className="col-span-2 mt-0.5 text-[14px] text-white/65">발주처: {r.client}</dd>}
                </div>
              ))}
            </dl>

            <h4 className="mt-8 text-[14px] font-bold tracking-[0.08em] text-mint">공공기관 · 호텔</h4>
            <dl className="mt-3 divide-y divide-white/15 border-y border-white/15">
              {OTHER_SITES.map((r) => (
                <div key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3">
                  <dt className="text-[16px] font-semibold text-white">{r.name}</dt>
                  <dd className="text-right text-[14px] text-white/75">{r.scope}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── OUR GALLERY — the old home carousel (poster → #partner) ── */}
        <div className={cn("mt-20 lg:mt-28", REVEAL)}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-pine-2">OUR GALLERY</p>
              <h3 className="mt-2 font-display text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] font-extrabold leading-[1.2] tracking-[-0.03em] text-pine">
                엔에스티에 대해서 더 알아보세요
              </h3>
            </div>
            <a
              href="#partner"
              className={cn("inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-1 text-[15px] font-semibold text-trust hover:underline sm:self-auto", FOCUS)}
            >
              2025 전국 신규 사업자 모집 포스터
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((g) => (
              <li key={g.src}>
                <figure className="h-full rounded-[1.5rem] bg-white p-2.5 shadow-[0_1px_0_rgba(14,59,50,.05),0_30px_60px_-38px_rgba(14,59,50,.55)] ring-1 ring-hairline">
                  <a
                    href={g.src}
                    target="_blank"
                    rel="noopener"
                    className={cn("group/g relative block overflow-hidden rounded-[1.1rem]", FOCUS)}
                  >
                    <img
                      src={g.src}
                      alt={g.alt}
                      width={g.w}
                      height={g.h}
                      loading="lazy"
                      decoding="async"
                      className={cn("h-auto w-full transition-transform duration-700 group-hover/g:scale-[1.03]", EASE)}
                    />
                    <span className="sr-only">(원본 이미지, 새 창)</span>
                  </a>
                  <figcaption className="px-2 pb-2 pt-4 text-[15px] font-semibold leading-[1.5] text-ink">{withCodes(g.caption)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        {/* ── timeline ── */}
        <div className={cn("mt-20 lg:mt-28", REVEAL)}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="font-display text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] font-extrabold leading-[1.2] tracking-[-0.03em] text-pine">
              연혁
            </h3>
            <a
              href={SRC.history}
              className={cn("inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-1 text-[15px] font-semibold text-trust hover:underline lg:self-auto", FOCUS)}
            >
              회사소개 · 연혁 보기
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <div
            role="region"
            aria-label="엔에스티 연혁"
            tabIndex={0}
            className="-mx-4 mt-8 overflow-x-auto overscroll-x-contain px-4 pb-4 outline-none [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-trust sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0"
          >
            <ol className="relative flex w-max lg:grid lg:w-auto lg:grid-cols-8">
              <span aria-hidden="true" className="absolute inset-x-0 top-[7px] h-px bg-[linear-gradient(90deg,#d5e4dc,#2f8f6b_92%)]" />
              {TIMELINE.map((t, i) => {
                const last = i === TIMELINE.length - 1;
                return (
                  <li key={t.d} className="relative w-[10.5rem] shrink-0 pr-5 pt-9 lg:w-auto lg:pr-4">
                    <span aria-hidden="true" className="absolute left-0 top-0 grid size-[15px] place-items-center">
                      {last && (
                        <span
                          className="absolute size-9 rounded-full border border-leaf/50"
                          style={{ animation: "breathe 5s cubic-bezier(.4,0,.2,1) infinite" }}
                        />
                      )}
                      <span className={cn("size-[15px] rounded-full border-[3px] border-air", last ? "bg-leaf" : "bg-pine-2")} />
                    </span>
                    <time dateTime={t.d} className="block font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] text-pine tabular-nums">
                      {t.y}
                      <span className="ml-1 text-[15px] font-bold text-muted-ink">.{t.m}</span>
                    </time>
                    <p className="mt-3 text-[15px] leading-[1.55] text-ink/85">{withCodes(t.t)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* ── lightbox ── */}
      <dialog
        ref={dialogRef}
        aria-labelledby="proof-dialog-title"
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        className={cn(
          "m-auto h-[min(100dvh_-_1rem,60rem)] max-h-none w-[min(100vw_-_1rem,76rem)] max-w-none overflow-hidden bg-transparent p-0 text-ink",
          "backdrop:bg-[rgba(10,26,22,.78)] backdrop:backdrop-blur-[2px] open:flex",
          "transition-[opacity,translate] duration-300 starting:open:translate-y-4 starting:open:opacity-0",
          EASE,
        )}
      >
        {item && active !== null && (
          <div className="flex size-full flex-col overflow-hidden rounded-[1.5rem] bg-air shadow-[0_40px_120px_-40px_rgba(0,0,0,.7)] sm:rounded-[1.75rem]">
            <header className="flex items-start gap-3 border-b border-hairline bg-white px-4 py-3.5 sm:px-6 sm:py-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-muted-ink">
                  <span className="rounded-full bg-mint px-2.5 py-0.5 font-bold text-pine">{item.kind}</span>
                  <span className="tabular-nums">
                    {active + 1} / {ALL.length}
                  </span>
                </p>
                <h3
                  id="proof-dialog-title"
                  aria-live="polite"
                  className="mt-1.5 font-display text-[19px] font-bold leading-[1.3] tracking-[-0.02em] sm:text-[23px]"
                >
                  {item.title}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="닫기"
                className={cn("grid size-11 shrink-0 place-items-center rounded-full bg-air text-ink transition-colors hover:bg-mint", FOCUS)}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ul
                key={item.id}
                aria-label="서류 이미지"
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 pt-5 sm:px-6 lg:justify-center"
              >
                {item.docs.map((d) => (
                  <li
                    key={d.src}
                    className={cn(
                      "flex shrink-0 snap-center flex-col items-center",
                      item.docs.length === 1 ? "basis-full" : "basis-[84%] sm:basis-[46%]",
                      item.docs.length === 3 && "lg:basis-[calc((100%_-_2rem)/3)]",
                    )}
                  >
                    <img
                      src={d.src}
                      alt={d.alt}
                      width={d.w}
                      height={d.h}
                      decoding="async"
                      className={cn(
                        "h-auto max-h-[min(62dvh,44rem)] w-auto max-w-full object-contain",
                        d.cutout ? "drop-shadow-[0_18px_24px_rgba(14,59,50,.25)]" : "rounded-md bg-white shadow-[0_20px_40px_-24px_rgba(14,59,50,.6)] ring-1 ring-black/5",
                      )}
                    />
                    <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-center">
                      {d.label && <span className="font-mono text-[12.5px] text-muted-ink">{d.label}</span>}
                      <a
                        href={d.src}
                        target="_blank"
                        rel="noopener"
                        className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-[13px] font-semibold text-trust hover:underline", FOCUS)}
                      >
                        원본 이미지
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        <span className="sr-only">(새 창)</span>
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              {item.docs.length > 1 && (
                <p className="px-4 text-center text-[13px] text-muted-ink sm:hidden">옆으로 넘겨 {item.docs.length}장 모두 보기</p>
              )}

              <div className="mx-4 mb-5 mt-4 grid gap-5 rounded-[1.25rem] bg-white p-5 ring-1 ring-hairline sm:mx-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-8">
                <dl className="grid grid-cols-[auto_1fr] content-start gap-x-4 gap-y-2 text-[15px] leading-[1.5]">
                  <dt className="text-muted-ink">발급</dt>
                  <dd>{item.issuer}</dd>
                  {item.ref && (
                    <>
                      <dt className="text-muted-ink">번호</dt>
                      <dd className="font-mono text-[14px]">{item.ref}</dd>
                    </>
                  )}
                  <dt className="text-muted-ink">일자</dt>
                  <dd className="tabular-nums">{item.date}</dd>
                </dl>
                <div>
                  <p className="text-[15px] leading-[1.75] text-ink/85">{withCodes(item.note)}</p>
                  <a
                    href={item.source.href}
                    className={cn("mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full text-[15px] font-semibold text-trust hover:underline", FOCUS)}
                  >
                    {item.source.label} 보기
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-hairline bg-white px-3 py-2.5 sm:px-5">
              <button
                type="button"
                onClick={() => step(-1)}
                className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-[15px] font-semibold text-ink hover:bg-air", FOCUS)}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
                이전<span className="sr-only"> 자료</span>
              </button>
              <p className="hidden text-[13px] text-muted-ink sm:block">← → 키로 넘기기 · ESC로 닫기</p>
              <button
                type="button"
                onClick={() => step(1)}
                className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-[15px] font-semibold text-ink hover:bg-air", FOCUS)}
              >
                다음<span className="sr-only"> 자료</span>
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </footer>
          </div>
        )}
      </dialog>
    </section>
  );
}
