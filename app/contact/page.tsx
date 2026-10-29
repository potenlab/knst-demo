import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Printer } from "lucide-react";
import PageShell from "@/components/pages/PageShell";
import { LD_ID, pageMetadata } from "@/components/pages/seo";
import { EASE, FOCUS, H3, LINK, REVEAL, Section, SourceNote, WRAP } from "@/components/pages/ui";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * 문의하기 — old /contact/ verbatim (heading, 문의메일·전화상담·카톡 1:1 채널 https://pf.kakao.com/_ScCkn and the
 * "카카오톡 문의" board that linked to the channel), /directions/ (주소·전화 2회선), fax from the FITI/safety documents
 * (lib/site.ts), "(주)엔에스티 블로그" from the old home page. No form: every action is a tel:/mailto:/KakaoTalk link.
 */

const PATH = "/contact/";
const TITLE = "문의하기 · 새집증후군 시공 상담";
const DESCRIPTION =
  "고객님, 새집증후군 예방 하실 준비가 되셨나요? 친환경 NST공법 기술로 주거공간을 설계해 드립니다. 문의메일 isnst@naver.com, 전화상담 043-222-2322, 카톡 1:1 채널 채팅.";

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const EMAIL = "isnst@naver.com";
const KAKAO = "https://pf.kakao.com/_ScCkn";
const BLOG = "https://blog.naver.com/nst-pro";
const MAIL_SUBJECT = "새집증후군 시공 문의";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;

const CARD = "flex min-h-[5.5rem] items-center gap-4 rounded-[1.5rem] border border-hairline bg-white px-5 py-4 transition-[border-color,box-shadow] duration-300 hover:border-pine/40 hover:shadow-[0_24px_48px_-34px_rgba(14,59,50,.55)]";
const CHIP = "inline-flex min-h-11 items-center rounded-full border border-pine/15 bg-white px-4 text-[14px] font-semibold text-pine hover:border-pine/40";

export default function ContactPage() {
  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "문의하기" }]}
      eyebrow="Support · 고객지원"
      title={
        <>
          고객님, 새집증후군 예방
          <br />
          하실 준비가 되셨나요?
        </>
      }
      name={TITLE}
      description={DESCRIPTION}
      pageType="ContactPage"
      pageExtra={{ about: { "@id": LD_ID.org } }}
      ld={[
        {
          "@type": "Organization",
          "@id": LD_ID.org,
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: [SITE.phone, SITE.phone2],
              faxNumber: SITE.fax,
              email: SITE.email,
              areaServed: "KR",
              availableLanguage: "ko",
            },
          ],
          sameAs: [SITE.originalSite, BLOG],
        },
      ]}
      lead={
        <>
          <p className="font-semibold text-pine">친환경 NST공법 기술로 주거공간을 설계해 드립니다.</p>
          <p>상담 신청을 남겨주시면 빠르게 연락드리겠습니다.</p>
        </>
      }
    >
      {/* ── channels ── */}
      <section aria-labelledby="channels-title" className={cn(WRAP, "pb-6")}>
        <h2 id="channels-title" className="sr-only">
          상담 채널
        </h2>
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <li className={REVEAL}>
            <a href="tel:0432222322" className={cn(CARD, "bg-pine text-white hover:border-pine", FOCUS)}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-glow">
                <Phone aria-hidden className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[14px] font-medium text-white/75">전화상담</span>
                <span className="mt-1 font-display text-[1.375rem] font-bold tabular-nums">043-222-2322</span>
              </span>
            </a>
          </li>
          <li className={REVEAL}>
            <a href="tel:07042707346" className={cn(CARD, FOCUS)}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-pine">
                <Phone aria-hidden className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[14px] font-medium text-muted-ink">전화 (070)</span>
                <span className="mt-1 font-display text-[1.375rem] font-bold tabular-nums text-pine">070-4270-7346</span>
              </span>
            </a>
          </li>
          <li className={REVEAL}>
            <a href={MAILTO} className={cn(CARD, FOCUS)}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-pine">
                <Mail aria-hidden className="size-5" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[14px] font-medium text-muted-ink">문의메일</span>
                <span className="mt-1 truncate text-[1.0625rem] font-bold text-pine">{EMAIL}</span>
              </span>
            </a>
          </li>
          <li className={REVEAL}>
            <a href={KAKAO} target="_blank" rel="noopener noreferrer" className={cn(CARD, FOCUS)}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mint text-pine">
                <MessageCircle aria-hidden className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[14px] font-medium text-muted-ink">카톡</span>
                <span className="mt-1 text-[1.0625rem] font-bold text-pine">1:1 채널 채팅</span>
              </span>
              <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 text-leaf" />
              <span className="sr-only">(새 창)</span>
            </a>
          </li>
        </ul>
      </section>

      {/* ── 카카오톡 1:1 채널 (old board "카카오톡 클릭 문구", linked to the channel) ── */}
      <Section
        id="kakao"
        kicker="카카오톡 문의"
        title="카톡 : 1:1 채널 채팅"
        intro={<p>하단 사진 클릭해서 문의</p>}
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <a
            href={KAKAO}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("group block rounded-[1.25rem] lg:col-span-7", FOCUS)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/contact-kakao.webp"
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              alt="TALK 카카오톡 문의 클릭~♡ — 왼쪽에 카카오톡 말풍선 버튼, 오른쪽에 NST처리공법 시공 현수막이 걸린 아파트 사진 네 장과 새지비 캐릭터"
              className="h-auto w-full rounded-[1.25rem] bg-white shadow-[0_24px_50px_-34px_rgba(14,59,50,.55)] ring-1 ring-hairline transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0"
            />
            <span className="sr-only">(카카오톡 채널, 새 창)</span>
          </a>
          <div className="lg:col-span-5">
            <a
              href={KAKAO}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex h-14 items-center justify-between gap-4 rounded-full bg-action pl-7 pr-2 text-[17px] font-bold text-white",
                "shadow-[0_18px_36px_-16px_rgba(0,71,156,.55)] transition-[translate,background-color] duration-300 hover:-translate-y-0.5 hover:bg-action-hover motion-reduce:hover:translate-y-0",
                FOCUS,
                EASE,
              )}
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle aria-hidden className="size-5" />
                카카오톡 문의
              </span>
              <span className="grid size-10 place-items-center rounded-full bg-white text-action">
                <ArrowUpRight aria-hidden className="size-5" />
              </span>
              <span className="sr-only">(새 창)</span>
            </a>
            <SourceNote>
              사진 속 현수막: “286 전 세대 시공완료! 내 아파트에 숲을 가꾸어 드립니다!”, “실내공기질(새집증후군) 개선을 위한 NST처리공법 적용”, “160 전 세대
              시공으로 친환경 도시생활주택을 추구하는 경성”, “NST처리공법 전세대 적용!!”, “실내 유해공기 제거제 시공(NST-S100)”, “가구,목재 유해물질 방출
              차단제 시공(NST-S200)”, “주관사 : (주)운암건설 시공사 : (주)엔에스티”
            </SourceNote>
          </div>
        </div>
      </Section>

      {/* ── 회사 정보 ── */}
      <Section id="company" tone="white" kicker="(주)엔에스티" title="회사정보">
        <div className="grid gap-6 lg:grid-cols-2">
          <address className="not-italic">
            <dl className="divide-y divide-hairline rounded-[1.5rem] border border-hairline bg-air">
              {[
                { icon: MapPin, k: "주소", v: "충북 청주시 흥덕구 공단로 134 세중테크노밸리 1408호" },
                { icon: Phone, k: "전화", v: "(043)222-2322, 070-4270-7346" },
                { icon: Printer, k: "팩스", v: "(043) 222-2321" },
                { icon: Mail, k: "이메일", v: EMAIL },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="flex gap-3 px-5 py-4">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <div className="grid flex-1 gap-0.5 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-3">
                    <dt className="text-[14px] font-semibold text-muted-ink">{k}</dt>
                    <dd className="text-[16px] leading-[1.6] text-ink tabular-nums">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </address>
          <div className="rounded-[1.5rem] border border-hairline bg-white p-6">
            <h3 className={cn(H3, "text-pine")}>사업자 정보</h3>
            <dl className="mt-4 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 text-[15px] leading-[1.6]">
              <dt className="text-muted-ink">상호</dt>
              <dd>(주)엔에스티</dd>
              <dt className="text-muted-ink">대표</dt>
              <dd>{SITE.ceo}</dd>
              <dt className="text-muted-ink">사업자등록번호</dt>
              <dd className="tabular-nums">301-86-03073</dd>
              <dt className="text-muted-ink">블로그</dt>
              <dd>
                <a href={BLOG} target="_blank" rel="noopener noreferrer" className={cn(LINK, FOCUS, "rounded")}>
                  (주)엔에스티 블로그<span className="sr-only">(새 창)</span>
                </a>
              </dd>
            </dl>
            <nav aria-label="관련 페이지" className="mt-6 flex flex-wrap gap-2 border-t border-hairline pt-5">
              <a href="/about/#directions" className={cn(CHIP, FOCUS)}>
                오시는 길
              </a>
              <a href="/faq/" className={cn(CHIP, FOCUS)}>
                자주묻는질문
              </a>
              <a href="/partners/" className={cn(CHIP, FOCUS)}>
                시공업체
              </a>
              <a href="/privacy/" className={cn(CHIP, FOCUS)}>
                개인정보처리방침
              </a>
            </nav>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
