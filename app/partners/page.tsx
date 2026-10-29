import { Check, Mail, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import PageShell from "@/components/pages/PageShell";
import PartnerDirectory from "@/components/pages/PartnerDirectory";
import { BOARD_COUNTS, PARTNERS, PARTNERS_DATE, RECRUIT_REGIONS } from "@/components/pages/partners-data";
import { pageMetadata } from "@/components/pages/seo";
import { Figure, H3, PageCTA, REVEAL, Section, SourceNote } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

/*
 * 시공업체 — old /business-partner/ (regional lists incl. 대표자, 권역 headings), its four 협력업체 현황 infographics
 * (2026. 10. 18 기준; text transcribed), 공지 uid=4 (공식 시공업체 확인 안내, verbatim), recruitment poster
 * 지점모집공고.png (신청자격 "5년 이상", same as components/Partner.tsx — the notice-01 poster says "3년 이상"),
 * notice uid=1 (모집 안내 문장) and the 2026 recruitment line on the old home page. KakaoTalk: the 1:1 channel
 * linked from the old /contact/ page (the poster's QR code).
 */

const PATH = "/partners/";
const TITLE = "시공업체 · NST공법 시공 업체 현황";
const DESCRIPTION = `NST공법 시공 업체 현황(${PARTNERS_DATE} 기준 ${PARTNERS.length}곳) — 수도권(서울/경기/인천), 중부권(충청/세종/대전), 남부권(영남/호남) 업체명·대표자·소재지·연락처·품목. 2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집.`;

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const EMAIL = "isnst@naver.com";
const KAKAO = "https://pf.kakao.com/_ScCkn";
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

const QUALIFICATIONS = [
  { main: "입주시장 5년 이상 경력 업체" },
  { main: "다(多)품목 ‘종합업체’", sub: "입주청소, 줄눈, 나노코팅, 방충망, 커튼 등" },
  { main: "입주박람회 참여 업체" },
];

const WARN = ["시공업체 명단 없는 업체", "NST-S100, NST-S200, NST-F100 아닌 다른 제품으로 시공하는 업체", "NST공법 시공 후 연락두절"];

const ZONE_BOARDS = [
  { src: "/img/partners-capital.webp", w: 1100, h: 967, label: "수도권", alt: "NST공법 전국 협력업체 현황 - 수도권 - 인포그래픽: 서울(4)·인천(3)·경기(18) 협력업체명과 지역을 지도와 함께 표시" },
  { src: "/img/partners-central.webp", w: 1100, h: 811, label: "충북권", alt: "NST공법 전국 협력업체 현황 - 충북권 - 인포그래픽: 충북/충남/세종/대전(7) 협력업체명과 지역 표" },
  { src: "/img/partners-south.webp", w: 1100, h: 758, label: "남부권", alt: "NST공법 전국 협력업체 현황 - 남부권 - 인포그래픽: 경북/대구/울산(2)·경남/부산(2)·전북/전남/광주(1) 협력업체명과 지역 표, 나머지 칸은 모집중" },
];

export default function PartnersPage() {
  const itemList = {
    "@type": "ItemList",
    name: `NST공법 공식 시공업체 (${PARTNERS_DATE} 기준)`,
    numberOfItems: PARTNERS.length,
    itemListElement: PARTNERS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "HomeAndConstructionBusiness",
        name: p.name,
        ...(p.rep ? { employee: { "@type": "Person", name: p.rep, jobTitle: p.repLabel ?? "대표자" } } : {}),
        telephone: p.phones.map((t) => `+82-${t.slice(1)}`),
        address: { "@type": "PostalAddress", addressRegion: p.region, addressLocality: p.area, addressCountry: "KR" },
        knowsAbout: p.items,
      },
    })),
  };

  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "시공업체" }]}
      eyebrow="Business Partner · 업체현황"
      title="NST공법 시공 업체 현황"
      name={TITLE}
      description={DESCRIPTION}
      pageType="CollectionPage"
      pageExtra={{ mainEntity: itemList }}
      lead={
        <>
          <p className="font-semibold text-pine">깨끗한 공기, 건강한 공간 | NST가 함께합니다.</p>
          <p>전국 어디서나 NST공법을 만나보세요!</p>
        </>
      }
      toc={[
        { id: "map", label: "전국 현황" },
        { id: "directory", label: "지역별 업체" },
        { id: "check", label: "시공업체 확인" },
        { id: "recruit", label: "신규 사업자 모집" },
      ]}
    >
      {/* ── 전국 현황 인포그래픽 (text transcribed from the boards) ── */}
      <Section id="map" kicker="2026. 10. 18 기준" title="NST공법 전국 협력업체 현황">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <Figure
            className="lg:col-span-6"
            src="/old/partners-map.webp"
            width={1243}
            height={1265}
            zoom
            alt="NST공법 전국 협력업체 현황 지도 인포그래픽 (2026. 10. 18 기준): 지역별 협력업체명과 지역이 지도 위에 표시되어 있음"
          />
          <div className="lg:col-span-6">
            <dl className="divide-y divide-hairline overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-hairline">
              {BOARD_COUNTS.map((r) => (
                <div key={r.label} className="px-4 py-3.5 sm:px-5">
                  <dt className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-pine">
                    {r.label} <span className="tabular-nums">({r.n})</span>
                    {r.open && <span className="rounded-full bg-glow/40 px-2 py-0.5 text-[12px] font-bold text-pine">모집중</span>}
                  </dt>
                  <dd className="mt-1 text-[14px] leading-[1.65] text-ink/80">{r.list}</dd>
                </div>
              ))}
            </dl>
            <SourceNote>
              업체명 표기 차이: 인포그래픽의 ‘(주)피코’·‘청소남자’는 시공업체 목록에서 ‘피코’·‘청소남자 C&amp;M’으로 적혀 있습니다. 충북권 인포그래픽에는 대전
              업체가 ‘청소PRO 대전시’로 적혀 있으나 전국 현황과 시공업체 목록 기준(더그린)으로 표기했습니다.
            </SourceNote>
          </div>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {ZONE_BOARDS.map((b) => (
            <li key={b.src}>
              <Figure src={b.src} width={b.w} height={b.h} zoom alt={b.alt} caption={`- ${b.label} -`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="directory" tone="white" kicker="업체현황" title="지역별 시공업체">
        <PartnerDirectory />
        <SourceNote>출처: (주)엔에스티 시공업체 현황 ({PARTNERS_DATE} 기준). 업체명·대표자·소재지·연락처·품목은 원문 그대로입니다.</SourceNote>
      </Section>

      {/* ── 공식 업체 확인 ── */}
      <Section
        id="check"
        kicker="왜? NST공법 시공업체 확인이 중요할까요?"
        title="NST공법 전문 시공업체 확인은 선택이 아닌 필수 입니다."
        intro={
          <>
            <p>NST공법은 단순한 제품 뿌리기가 아닙니다. 인증된 제품 기술과 시공 메뉴얼이 필요한 정밀한 새집증후군 개선 공법 입니다.</p>
            <p className="font-semibold text-pine">반드시 홈페이지에 있는 시공업체를 확인하세요!!</p>
          </>
        }
      >
        <div className={cn("rounded-[1.5rem] border border-hairline bg-air p-6 sm:p-8", REVEAL)}>
          <h3 className={cn(H3, "flex items-center gap-2.5 text-pine")}>
            <ShieldAlert aria-hidden className="size-5 text-leaf" />
            다음과 같은 경우는 정식 시공팀이 아닐 가능성이 높습니다
          </h3>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
            {WARN.map((w, i) => (
              <li key={w} className="flex gap-3 rounded-[1.25rem] bg-white p-4 ring-1 ring-hairline">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-pine font-display text-[14px] font-bold text-white">{i + 1}</span>
                <span className="pt-1 text-[16px] leading-[1.6] text-ink">{w}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[16px] font-medium leading-[1.7] text-pine">고객님의 안전한 선택을 위해 반드시 공식 홈페이지 시공업체를 확인해주세요.</p>
          <SourceNote>출처: (주)엔에스티 공지사항 「[공식]새집증후군 개선 NST공법 시공업체 알림」(2025.10.10)</SourceNote>
        </div>
      </Section>

      {/* ── 신규 사업자 모집 ── */}
      <Section
        id="recruit"
        tone="pine"
        kicker="신규 사업자 모집"
        title="2026 울산/경북/경남/부산/광주/전북/전남 신규사업자 모집中"
        intro={
          <>
            <p>(많은 관심 바랍니다.)</p>
            <p>
              (주)엔에스티는 새집증후군 개선 전문회사로 20년 노하우가 집약된 새집증후군 개선 시공 방법인 NST공법을 개발한 회사입니다. 국민 건강을
              지키기 위해 함께할 NST공법 시공업체 신규 사업자를 모집합니다.
            </p>
          </>
        }
      >
        <div aria-hidden className="pointer-events-none absolute -right-48 top-10 -z-10 size-[40rem]">
          {[100, 78, 56].map((s) => (
            <span
              key={s}
              className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/[.09]"
              style={{ width: `${s}%` }}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[.05] p-6">
            <h3 className="text-[15px] font-bold text-mint">모집 지역</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {RECRUIT_REGIONS.map((r) => (
                <li key={r} className="inline-flex h-10 items-center gap-2 rounded-full border border-mint/30 bg-pine-2/70 px-4 text-[16px] font-bold">
                  <span aria-hidden className="size-1.5 rounded-full bg-mint" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[.05] p-6">
            <h3 className="flex flex-wrap items-center gap-2 text-[15px] font-bold text-mint">
              모집부문
              <span className="rounded-full border border-mint/30 px-2.5 py-0.5 text-[13px] font-semibold text-white/80">물품공급계약</span>
            </h3>
            <p className="mt-4 font-display text-[1.25rem] font-bold leading-[1.4] tracking-[-0.02em]">
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
                  <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-pine">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>
                    <span className="font-semibold">{q.main}</span>
                    {q.sub && <span className="mt-0.5 block text-[14px] text-white/70">{q.sub}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="mt-12 text-[15px] font-bold text-white">신청방법</h3>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { href: MAILTO, icon: Mail, k: "① 이메일 문의", v: EMAIL, ext: false },
            { href: KAKAO, icon: MessageCircle, k: "② 카카오톡 1:1 채팅", v: "→ 가입문의", ext: true },
            { href: "tel:0432222322", icon: Phone, k: "③ 전화문의", v: "(043)222-2322", ext: false },
          ].map(({ href, icon: Icon, k, v, ext }) => (
            <li key={k}>
              <a
                href={href}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 transition-colors duration-300 hover:border-mint/40 hover:bg-white/[.08]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-pine",
                )}
              >
                <Icon aria-hidden className="size-5 shrink-0 text-mint" />
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[13px] text-white/70">{k}</span>
                  <span className="truncate text-[15px] font-semibold tabular-nums">{v}</span>
                </span>
                {ext && <span className="sr-only">(새 창)</span>}
              </a>
            </li>
          ))}
        </ol>

        <SourceNote dark>출처: (주)엔에스티 신규 사업자 모집 포스터·공지사항 · 국민의 건강을 지키는 친환경 기술 NST공법</SourceNote>
      </Section>

      <PageCTA />
    </PageShell>
  );
}

