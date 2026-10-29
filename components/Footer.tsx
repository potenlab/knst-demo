import { ArrowUp } from "lucide-react";
import { KakaoSymbol } from "@/components/KakaoFloat";
import { SITE as META } from "@/lib/site";

/* Old knst.co.kr footer menu order (회사소개 · 제품현황 · 기술현황 · 시공업체 · 공지사항 · 언론동향 · NST공법 칼럼 · 고객지원),
   plus the new evidence page; 고객지원 = 자주묻는질문 + 문의하기. */
const SITE_LINKS = [
  { label: "회사소개", href: "/about/" },
  { label: "제품현황", href: "/products/" },
  { label: "기술현황", href: "/technology/" },
  { label: "시공업체", href: "/partners/" },
  { label: "공지사항", href: "/notices/" },
  { label: "언론동향", href: "/news/" },
  { label: "NST공법 칼럼", href: "/blog/" },
  { label: "시험성적서·시공 실적", href: "/evidence/" },
  { label: "자주묻는질문", href: "/faq/" },
  { label: "문의하기", href: "/contact/" },
];

/* Home-page sections as "/#id" (ids match Header NAV + Columns/FinalCTA) so they work from /blog too;
   on "/" itself these are same-document fragment jumps. */
const PAGE_LINKS = [
  { label: "NST공법", href: "/#method" },
  { label: "시공 단계", href: "/#steps" },
  { label: "실적·증빙", href: "/#proof" },
  { label: "자주 묻는 질문", href: "/#faq" },
  { label: "파트너 모집", href: "/#partner" },
  { label: "상담 신청", href: "/#contact" },
];

/* Old footer labels: "상호명 : (주)엔에스티 / 대 표 : 장대규 / 주 소 : … / 사업자등록번호 : 301-86-03073" */
const COMPANY: [string, string][] = [
  ["상호명", META.name],
  ["대표", META.ceo],
  ["사업자등록번호", "301-86-03073"],
];

const EASE = "ease-[cubic-bezier(.4,0,.2,1)]";
const ROW = "grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]";
const DT = "pt-[0.6rem] text-[15px] text-white/55";
const DD = "pt-[0.6rem] text-[15px] leading-relaxed text-white/85";
const INLINE_LINK =
  "inline-flex min-h-11 items-center rounded-md -my-[0.6rem] tabular-nums underline decoration-white/25 underline-offset-[5px] outline-none hover:text-white hover:decoration-mint focus-visible:ring-2 focus-visible:ring-mint";
const NAV_LINK =
  "group inline-flex min-h-11 items-center gap-1.5 rounded-md text-[16px] text-white/85 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-mint";
const COL_TITLE = "text-[0.875rem] font-semibold tracking-[0.08em] text-mint";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#0a2923] text-white/75">
      {/* still breath rings, bottom-right — echo of the CTA above */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[24rem] -right-[20rem] -z-10 size-[46rem] sm:-bottom-[20rem] sm:-right-[14rem]"
      >
        {[0, 11, 22, 33].map((inset) => (
          <span
            key={inset}
            className="absolute rounded-full border border-mint/[0.07]"
            style={{ inset: `${inset}%` }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-x-10 gap-y-14 pb-14 pt-16 sm:pt-20 md:grid-cols-2 lg:grid-cols-12 lg:pb-20">
          {/* ── Brand + company facts ─────────────────────────────────── */}
          <div className="md:col-span-2 lg:col-span-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-[0_14px_30px_-18px_rgba(0,0,0,.7)]">
              <img
                src="/img/logo-white.webp"
                alt=""
                width={300}
                height={300}
                loading="lazy"
                decoding="async"
                className="size-12 rounded-full object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[17px] font-bold text-pine">(주)엔에스티</span>
                <span className="text-[12px] font-medium tracking-[0.04em] text-muted-ink">
                  Natural Science&amp;Technology
                </span>
              </span>
            </div>

            <p className="mt-7 max-w-md font-display text-[1.5rem] font-bold leading-snug tracking-[-0.02em] text-white sm:text-[1.75rem]">
              국민의 건강을 지키는
              <br />
              친환경 기술 NST공법
            </p>

            <dl className="mt-8 max-w-xl">
              {COMPANY.map(([k, v]) => (
                <div key={k} className={ROW}>
                  <dt className={DT}>{k}</dt>
                  <dd className={`${DD} tabular-nums`}>{v}</dd>
                </div>
              ))}
            </dl>

            <address className="max-w-xl not-italic">
              <dl>
                <div className={ROW}>
                  <dt className={DT}>주소</dt>
                  <dd className={DD}>충청북도 청주시 흥덕구 공단로 134 세중테크노밸리 1408호</dd>
                </div>
                <div className={ROW}>
                  <dt className={DT}>전화</dt>
                  <dd className={`${DD} flex flex-wrap gap-x-4`}>
                    <a href="tel:0432222322" className={INLINE_LINK}>
                      (043)222-2322
                    </a>
                    <a href="tel:07042707346" className={INLINE_LINK}>
                      070-4270-7346
                    </a>
                  </dd>
                </div>
                <div className={ROW}>
                  <dt className={DT}>팩스</dt>
                  <dd className={`${DD} tabular-nums`}>(043)222-2321</dd>
                </div>
                <div className={ROW}>
                  <dt className={DT}>이메일</dt>
                  <dd className={DD}>
                    <a href={`mailto:${META.email}`} className={INLINE_LINK}>
                      {META.email}
                    </a>
                  </dd>
                </div>
                <div className={ROW}>
                  <dt className={DT}>카카오톡</dt>
                  <dd className={DD}>
                    <a href={META.kakao} target="_blank" rel="noopener noreferrer" className={`${INLINE_LINK} gap-2`}>
                      <KakaoSymbol className="size-4 shrink-0 text-[#FEE500]" />
                      카카오톡 1:1 채팅
                      <span className="sr-only">(새 창)</span>
                    </a>
                  </dd>
                </div>
              </dl>
            </address>
          </div>

          {/* ── company / product / support pages ───────────────────────── */}
          <nav aria-labelledby="footer-site-title" className="lg:col-span-3">
            <h2 id="footer-site-title" className={COL_TITLE}>
              회사·고객지원
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={NAV_LINK}>
                    <span
                      aria-hidden
                      className={`h-px w-3 origin-left scale-x-50 bg-mint/60 transition-transform duration-300 ${EASE} group-hover:scale-x-100`}
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── In-page anchors ───────────────────────────────────────── */}
          <nav aria-labelledby="footer-page-title" className="lg:col-span-3">
            <h2 id="footer-page-title" className={COL_TITLE}>
              바로가기
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={NAV_LINK}>
                    <span
                      aria-hidden
                      className={`h-px w-3 origin-left scale-x-50 bg-mint/60 transition-transform duration-300 ${EASE} group-hover:scale-x-100`}
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* gradient hairline */}
        <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-mint/35 to-transparent" />

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        {/* pb clears the fixed KakaoTalk button (components/KakaoFloat.tsx) at the very end of the page */}
        <div className="flex flex-col gap-6 pb-24 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:pb-28">
          <div className="space-y-1.5 text-[14px] leading-relaxed text-white/55">
            <p>
              © {year} <span className="whitespace-nowrap">(주)엔에스티</span>. All rights reserved.
            </p>
            <p>
              <a
                href="/privacy/"
                className="inline-flex min-h-11 items-center rounded-md font-semibold text-white/85 underline decoration-white/30 underline-offset-[5px] outline-none hover:text-white hover:decoration-mint focus-visible:ring-2 focus-visible:ring-mint"
              >
                개인정보처리방침
              </a>
            </p>
          </div>

          <a
            href="#top"
            className="group relative inline-flex min-h-12 shrink-0 items-center gap-3 self-start rounded-full border border-white/20 py-1.5 pl-5 pr-1.5 text-[15px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a2923] sm:self-auto"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
            />
            <span className="relative">맨 위로</span>
            <span aria-hidden className="relative grid size-9 place-items-center rounded-full bg-mint text-pine">
              <ArrowUp className={`size-4 transition-transform duration-300 ${EASE} group-hover:-translate-y-0.5`} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
