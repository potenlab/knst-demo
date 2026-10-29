import { ArrowRight, ArrowUpRight, Check, Mail, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Partner (B2B funnel) — 2026 신규사업자 모집.
 * Copy: knst.co.kr hero notice ("2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집中"), the recruitment
 * notice (notice-01: intro + "국민 건강을 지키기 위해 …") and the official poster (모집부문 / 신청자격(우대) / 신청방법), verbatim.
 * The poster itself is the 2025 national edition — captioned as such, not relabelled.
 * 신청자격 keeps "5년 이상" (지점모집공고.png, twice); one notice variant prints "3년 이상" — not used.
 * Below: text version of the "NST공법 전국 협력업체 현황" infographics + latest board notices.
 */

const EMAIL = "isnst@naver.com";
const TEL = "043-222-2322";

const MAIL_SUBJECT = "[파트너 신청] 2026 NST공법 신규사업자 모집";
const MAIL_BODY = [
  "안녕하세요. NST공법 신규사업자(파트너) 모집에 신청합니다.",
  "",
  "■ 업체명:",
  "■ 대표자 / 담당자:",
  "■ 연락처:",
  "■ 희망 지역 (울산·경북·경남·부산·광주·전북·전남):",
  "■ 신청 부문: 새집증후군 개선 NST공법 시공 업체 (물품공급계약)",
  "■ 입주시장 경력:   년",
  "■ 취급 품목 (입주청소·줄눈·나노코팅·방충망·커튼 등):",
  "■ 입주박람회 참여 여부:",
  "",
  "검토 후 연락 부탁드립니다.",
].join("\r\n");
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

/* Two clusters, loosely ordered north→south and nudged west/east — a hint of geography, not a map. */
const REGIONS: { cluster: string; items: { name: string; nudge: string }[] }[] = [
  {
    cluster: "호남권",
    items: [
      { name: "전북", nudge: "ml-3" },
      { name: "광주", nudge: "ml-0" },
      { name: "전남", nudge: "ml-5" },
    ],
  },
  {
    cluster: "영남권",
    items: [
      { name: "경북", nudge: "mr-6" },
      { name: "울산", nudge: "mr-0" },
      { name: "경남", nudge: "mr-14" },
      { name: "부산", nudge: "mr-3" },
    ],
  },
];

/* "NST공법 전국 협력업체 현황" infographic, 2026.10.18 기준 (image-text part-4 전국/수도권/충북권/남부권).
   Business names + area only (no personal names/phones). 대전: the nationwide board and /business-partner/ both say 더그린. */
const NETWORK_DATE = "2026.10.18";
const NETWORK: { region: string; wide?: boolean; items: [string, string][] }[] = [
  {
    region: "경기",
    wide: true,
    items: [
      ["NST힐링하우스", "남양주시"],
      ["스토리샵", "남양주시"],
      ["네오홈디자인", "남양주시"],
      ["클린랩", "동두천시"],
      ["향기로운집", "성남시"],
      ["온케어 홈케어", "의왕시"],
      ["THE CLASS", "시흥시"],
      ["부부클린", "화성시"],
      ["우리환경", "용인시"],
      ["깔끔한삼형제", "군포시"],
      ["신성클린", "안양시"],
      ["(주)피코", "수원시"],
      ["성실깔끄미", "김포시"],
      ["올인원클린", "파주시"],
      ["청소남자", "파주시"],
      ["숨 홈케어", "고양시"],
      ["아이앤아이", "오산시"],
      ["(주)영우", "의정부시"],
    ],
  },
  {
    region: "서울",
    items: [
      ["네오하우스", "도봉구"],
      ["이온크린", "용산구"],
      ["이삭엔에스티", "송파구"],
      ["파란공간", "강남구"],
    ],
  },
  {
    region: "인천",
    items: [
      ["PK CLASS", "서구"],
      ["감성홈케어", "서구"],
      ["늘미소크린", "검단구"],
    ],
  },
  {
    region: "충북·충남·세종·대전",
    items: [
      ["네오그린 (본사 직영)", "충북 청주시"],
      ["슈퍼빗자루", "충북 청주시"],
      ["까사홈케어", "충북 청주시"],
      ["에이앤씨솔루션", "충북 청주시"],
      ["에코그린", "세종시"],
      ["더그린", "대전 동구"],
      ["별별청소", "충남 서산시"],
    ],
  },
  {
    region: "경북·대구·울산",
    items: [
      ["숲속이야기", "경북 구미시"],
      ["클린868", "대구 달서구"],
    ],
  },
  {
    region: "경남·부산",
    items: [
      ["하이엔드 그린", "부산 해운대구"],
      ["아이보홈케어", "부산 사하구"],
    ],
  },
  { region: "전북·전남·광주", items: [["태양홈케어", "전북 군산시"]] },
];
const NETWORK_TOTAL = NETWORK.reduce((n, r) => n + r.items.length, 0);

/* Latest board notices (content/knst-content.json → notices, https://knst.co.kr/nst-notice/) */
const NOTICES = [
  { d: "2026-10-18", t: "입주시장 전문업체 ‘에이앤솔루션’ 계약 체결" },
  { d: "2026-08-11", t: "입주시장 전문업체 ‘늘미소크린’ 계약 체결" },
  { d: "2026-07-19", t: "입주시장 전문업체 ‘클린랩’ 계약 체결" },
  { d: "2026-05-08", t: "입주시장 전문업체 ‘까사홈케어’ 계약 체결" },
  { d: "2026-04-23", t: "입주시장 전문업체 ‘숨 홈케어’ 계약 체결" },
];

const QUALIFICATIONS = [
  { main: "입주시장 5년 이상 경력 업체", sub: null },
  { main: "다(多) 품목 (입주청소, 줄눈, 나노코팅, 방충망, 커튼 등) ‘종합업체’", sub: null },
  { main: "입주박람회 참여 업체", sub: null },
];

const REVEAL =
  "motion-safe:supports-[animation-timeline:view()]:[animation-name:rise] motion-safe:supports-[animation-timeline:view()]:[animation-fill-mode:forwards] motion-safe:supports-[animation-timeline:view()]:[animation-duration:auto] motion-safe:supports-[animation-timeline:view()]:[animation-timing-function:linear] motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view()] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_cover_24%]";

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine";

export default function Partner() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="grain relative isolate overflow-clip bg-pine text-white">
      {/* depth: pine-2 glow + breath rings centred behind the poster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(48rem 36rem at 82% 38%, rgba(47,143,107,.38), rgba(47,143,107,0) 65%)",
            "radial-gradient(40rem 30rem at 0% 100%, rgba(20,80,63,.9), rgba(20,80,63,0) 70%)",
          ].join(","),
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-30%] top-[46%] -z-10 aspect-square w-[150%] -translate-y-1/2 sm:right-[-12%] sm:w-[70rem] lg:right-[-14rem] lg:top-1/2">
        {[100, 80, 60, 40].map((s, i) => (
          <span
            key={s}
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/[.09]"
            style={{ width: `${s}%`, animation: `breathe 11s cubic-bezier(.4,0,.2,1) ${-i * 2.6}s infinite` }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-x-6 lg:px-10 lg:py-32">
        {/* ── copy ── */}
        <div className="lg:col-span-7">
          <div className={REVEAL}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-mint/25 bg-white/[.06] py-1.5 pl-3 pr-4 text-[14px] font-semibold text-mint">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 rounded-full bg-glow motion-safe:animate-ping" />
                <span className="relative size-2 rounded-full bg-glow" />
              </span>
              2026 신규사업자 모집中
            </p>
            <h2
              id="partner-title"
              className="mt-6 text-balance font-display text-[clamp(1.5rem,1.15rem+1.2vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.035em]"
            >
              국민 건강을 지키기 위해 함께할 NST공법 시공업체 <span className="text-mint">신규 사업자</span>를 모집합니다.
            </h2>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.75] text-white/75 sm:text-[18px]">
              엔에스티는 새집증후군 개선 전문회사로 20년 노하우가 집약된 새집증후군 개선 시공 방법인 NST공법을 개발한 회사입니다.
            </p>
          </div>

          {/* regions — stylised clusters, not a map */}
          <div className={cn("mt-12", REVEAL)}>
            <h3 className="flex items-baseline gap-3 text-[15px] font-bold text-white">
              모집 지역
              <span className="font-display text-[15px] font-bold text-mint">
                <span className="tabular-nums">7</span>곳
              </span>
            </h3>
            <div className="relative mt-5 grid max-w-[30rem] grid-cols-2 gap-x-8 rounded-[2rem] border border-white/10 bg-white/[.04] px-5 py-6 sm:gap-x-12 sm:px-8">
              <span aria-hidden="true" className="absolute inset-y-6 left-1/2 border-l border-dashed border-white/20" />
              {REGIONS.map((r, ci) => (
                <div key={r.cluster} className={ci === 1 ? "text-right" : undefined}>
                  <p className="text-[13px] font-semibold tracking-[0.14em] text-white/75">{r.cluster}</p>
                  <ul className={cn("mt-3 flex flex-col gap-2.5", ci === 1 ? "items-end" : "items-start")}>
                    {r.items.map((it) => (
                      <li
                        key={it.name}
                        className={cn(
                          "inline-flex h-11 items-center gap-2 rounded-full border border-mint/30 bg-pine-2/70 px-4 text-[16px] font-bold tracking-[-0.01em] text-white shadow-[0_10px_20px_-14px_rgba(0,0,0,.6)]",
                          it.nudge,
                        )}
                      >
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
                        {it.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 모집부문 / 신청자격 */}
          <div className={cn("mt-12 grid gap-4 sm:grid-cols-2", REVEAL)}>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[.05] p-6">
              <h3 className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-mint">
                모집부문
                <span className="rounded-full border border-mint/30 px-2.5 py-0.5 text-[13px] font-semibold text-white/80">물품공급계약</span>
              </h3>
              <p className="mt-4 font-display text-[22px] font-bold leading-[1.35] tracking-[-0.02em]">
                새집증후군 개선
                <br />
                “NST공법” 시공 업체
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[.05] p-6">
              <h3 className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-mint">
                신청자격
                <span className="rounded-full border border-mint/30 px-2.5 py-0.5 text-[13px] font-semibold text-white/80">우대</span>
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {QUALIFICATIONS.map((q) => (
                  <li key={q.main} className="flex gap-3 text-[16px] leading-[1.5]">
                    <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-pine">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span>
                      <span className="font-semibold">{q.main}</span>
                      {q.sub && <span className="mt-0.5 block text-[14px] text-white/65">{q.sub}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 신청방법 + CTA */}
          <div className={cn("mt-12", REVEAL)}>
            <h3 className="text-[15px] font-bold text-white">신청방법</h3>
            <ol className="mt-4 grid gap-2 sm:grid-cols-3">
              <li>
                <a
                  href={MAILTO}
                  className={cn(
                    "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 transition-colors duration-300 hover:border-mint/40 hover:bg-white/[.08]",
                    FOCUS,
                  )}
                >
                  <Mail aria-hidden="true" className="size-5 shrink-0 text-mint" />
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="text-[13px] text-white/70">① 이메일 문의</span>
                    <span className="truncate text-[15px] font-semibold">{EMAIL}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.kakao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 transition-colors duration-300 hover:border-mint/40 hover:bg-white/[.08]",
                    FOCUS,
                  )}
                >
                  <MessageCircle aria-hidden="true" className="size-5 shrink-0 text-mint" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] text-white/70">② 카카오톡 1:1 채팅</span>
                    <span className="text-[15px] font-semibold">QR 스캔 → 가입문의</span>
                  </span>
                  <span className="sr-only">(카카오톡 채널, 새 창)</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0432222322"
                  className={cn(
                    "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 transition-colors duration-300 hover:border-mint/40 hover:bg-white/[.08]",
                    FOCUS,
                  )}
                >
                  <Phone aria-hidden="true" className="size-5 shrink-0 text-mint" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] text-white/70">③ 전화문의</span>
                    <span className="text-[15px] font-semibold tabular-nums">{TEL}</span>
                  </span>
                </a>
              </li>
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={MAILTO}
                className={cn(
                  "group inline-flex h-14 items-center justify-between gap-4 rounded-full bg-glow pl-7 pr-2 text-[17px] font-bold text-pine sm:h-[60px] sm:justify-start sm:text-[18px]",
                  "shadow-[0_18px_36px_-16px_rgba(143,240,192,.75)] transition-[translate,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-glow-hover hover:shadow-[0_26px_44px_-18px_rgba(143,240,192,.9)]",
                  FOCUS,
                  EASE,
                )}
              >
                이메일 문의
                <span className="grid size-10 place-items-center rounded-full bg-pine text-glow transition-transform duration-300 group-hover:translate-x-0.5 sm:size-11">
                  <Mail aria-hidden="true" className="size-5" />
                </span>
              </a>
              <a
                href="tel:0432222322"
                className={cn(
                  "inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-[16px] font-semibold text-white transition-[background-color,border-color] duration-300 hover:border-white/60 hover:bg-white/[.08] sm:h-[60px] sm:text-[17px]",
                  FOCUS,
                )}
              >
                <Phone aria-hidden="true" className="size-[18px]" />
                전화문의 <span className="tabular-nums">{TEL}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── poster ── */}
        <div className="lg:col-span-5 lg:pl-4">
          <figure className={cn("mx-auto w-full max-w-[22rem] sm:max-w-[24rem] lg:sticky lg:top-28 lg:mt-6", REVEAL)}>
            <a
              href="/img/g-recruit.webp"
              target="_blank"
              rel="noopener"
              className={cn(
                "group relative block rotate-[3deg] rounded-[1.25rem] bg-white p-2.5 shadow-[0_50px_90px_-30px_rgba(0,0,0,.7),0_18px_30px_-18px_rgba(0,0,0,.5)] transition-[rotate,translate] duration-500 hover:-translate-y-2 hover:rotate-[1deg] sm:p-3",
                FOCUS,
                EASE,
              )}
            >
              {/* masking tape */}
              <span
                aria-hidden="true"
                className="absolute -top-4 left-1/2 z-10 h-8 w-28 -translate-x-1/2 -rotate-[5deg] rounded-[3px] bg-mint/85 shadow-[0_6px_12px_-8px_rgba(0,0,0,.5)]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/g-recruit.webp"
                alt="엔에스티 2025 전국 신규 사업자 모집 포스터. NST공법 홍보대사 “새집이”, 대한민국 환경대상 환경제품 부문 수상(2025년). 모집부문(물품공급계약): 새집증후군 개선 NST공법 시공 업체. 신청자격(우대): 입주시장 5년 이상 경력 업체, 다(多) 품목 종합업체, 입주박람회 참여 업체. 신청방법: 이메일 isnst@naver.com, 카카오톡 1:1 채팅 QR, 전화 (043)222-2322."
                width={900}
                height={1358}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-[0.8rem]"
              />
              <span className="absolute bottom-5 right-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-ink/80 px-3.5 text-[13px] font-semibold text-white opacity-90 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                원본 크게 보기
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only">(새 창)</span>
              </span>
            </a>
            <figcaption className="mt-7 text-center text-[14px] leading-[1.6] text-white/80">
              새집증후군 개선 시공 전문업체 · 2025 전국 신규 사업자 모집
              <br />
              NST공법 20년 경력 노하우!
              <br />
              <span className="text-white/65">국민의 건강을 지키는 친환경 기술 NST공법</span>
            </figcaption>
          </figure>
        </div>

        {/* ── nationwide partner network (text version of the 협력업체 현황 infographics) ── */}
        <div className={cn("lg:col-span-12", REVEAL)}>
          <div className="flex flex-col gap-2 border-b border-white/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="font-display text-[1.25rem] font-bold leading-[1.3] tracking-[-0.02em] sm:text-[1.375rem]">
              NST공법 전국 협력업체 현황
            </h3>
            <p className="text-[14px] text-white/70">
              <span className="tabular-nums">{NETWORK_DATE}</span> 기준 · <span className="tabular-nums">{NETWORK_TOTAL}</span>곳
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {NETWORK.map((r) => (
              <section
                key={r.region}
                aria-label={`${r.region} 협력업체`}
                className={cn(
                  "rounded-[1.5rem] border border-white/10 bg-white/[.05] p-5",
                  r.wide && "sm:col-span-2",
                )}
              >
                <h4 className="flex items-baseline justify-between gap-3 text-[16px] font-bold text-white">
                  {r.region}
                  <span className="font-display text-[15px] text-mint">
                    <span className="tabular-nums">{r.items.length}</span>곳
                  </span>
                </h4>
                <ul className={cn("mt-3 grid gap-y-1.5 text-[14px] leading-[1.5]", r.wide && "sm:grid-cols-2 sm:gap-x-6")}>
                  {r.items.map(([name, area]) => (
                    <li key={name} className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-medium text-white/90">{name}</span>
                      <span className="text-white/60">{area}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-start">
            <div className="space-y-2 text-[15px] leading-[1.7] text-white/75 lg:col-span-5">
              <p className="font-semibold text-white">전국 어디서나 NST공법을 만나보세요!</p>
              <p>본사와 직접 계약한 사업자만 NST공법 시공을 하기 때문에 품질 관리가 수월하고 문제 발생 시 신속한 대응이 가능합니다.</p>
              <a
                href="/partners/"
                className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full font-semibold text-mint hover:underline", FOCUS)}
              >
                시공업체 현황 전체 보기
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-[14px] font-bold tracking-[0.08em] text-mint">최근 공지</h4>
                <a
                  href="/notices/"
                  className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-1 text-[14px] font-semibold tracking-normal text-white/80 hover:text-white", FOCUS)}
                >
                  공지사항 전체
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </a>
              </div>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {NOTICES.map((n) => (
                  <li key={n.d + n.t} className="grid grid-cols-[6.25rem_minmax(0,1fr)] gap-x-3 py-2.5 text-[14px] leading-[1.55]">
                    <time dateTime={n.d} className="tabular-nums text-white/60">
                      {n.d.replace(/-/g, ".")}
                    </time>
                    <span className="text-white/85">{n.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
