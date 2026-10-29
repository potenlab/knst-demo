import PageShell from "@/components/pages/PageShell";
import { pageMetadata } from "@/components/pages/seo";
import { FOCUS, LINK, WRAP } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

/*
 * 개인정보처리방침 — archived /terms_page/privacy-policy/ (시행 2024.09.15), old wording kept.
 * Decision: the archived text still carried the WordPress theme's template placeholders (company '십분의일',
 * 책임자 '홍길동', 02-1234-5678, studio.onetenth@gmail.com). Those are NOT published: '회사' is 엔에스티 and the
 * 개인정보관리책임자 line shows the company's real phone/e-mail. A named 책임자 must be supplied by the company.
 * Obvious typo fixed: "고개문의" → "고객문의".
 */

const PATH = "/privacy/";
const TITLE = "개인정보처리방침";
const DESCRIPTION =
  "엔에스티 개인정보처리방침 — 수집하는 개인정보 항목, 개인정보의 수집 및 이용목적, 수집 및 보유기간, 자동 수집 장치(쿠키), 개인정보에 관한 민원서비스.";

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const H = "mt-12 border-b border-hairline pb-3 font-display text-[1.25rem] font-bold tracking-[-0.02em] text-pine first:mt-0";
const P = "mt-4 text-[16px] leading-[1.85] text-ink/85";

export default function PrivacyPage() {
  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "개인정보처리방침" }]}
      eyebrow="이용 안내"
      title="개인정보처리방침"
      name={TITLE}
      description={DESCRIPTION}
    >
      <article className={cn(WRAP, "pb-20 sm:pb-24")}>
        <div className="max-w-[46rem] rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline sm:p-10">
          <p className="text-[16px] leading-[1.85] text-ink/85">
            ‘엔에스티’ 는 (이하 ‘회사’는) 고객님의 개인정보를 중요시하며, “정보통신망 이용촉진 및 정보보호”에 관한 법률을 준수하고 있습니다.
          </p>
          <p className={P}>
            회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가
            취해지고 있는지 알려드립니다.
          </p>
          <p className={P}>회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</p>

          <h2 className={cn(H, "mt-12")}>수집하는 개인정보 항목</h2>
          <p className={P}>회사는 상담, 고객문의 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
          <dl className="mt-4 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-[1.25rem] bg-air px-5 py-4 text-[16px] leading-[1.7]">
            <dt className="font-semibold text-muted-ink">수집항목</dt>
            <dd>이름, 업체명, 연락처, 이메일</dd>
            <dt className="font-semibold text-muted-ink">개인정보 수집방법</dt>
            <dd>홈페이지(문의하기) 를 통한 문의</dd>
          </dl>

          <h2 className={H}>개인정보의 수집 및 이용목적</h2>
          <p className={P}>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-[16px] leading-[1.8] text-ink/85 marker:text-leaf">
            <li>문의내용 확인 및 안내를 위한 연락</li>
          </ul>

          <h2 className={H}>개인정보의 수집 및 보유기간</h2>
          <p className={P}>
            고객의 개인정보는 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기하며, 보유기간은 최대 3년을 넘기지 않는 것을 원칙으로 합니다.
          </p>

          <h2 className={H}>개인정보의 자동 수집 장치의 설치/운영 및 거부에 관한 사항</h2>
          <p className={P}>당 홈페이지는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용하지 않습니다.</p>

          <h2 className={H}>개인정보에 관한 민원서비스</h2>
          <p className={P}>
            회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보관리책임자를 지정하고 있습니다.
          </p>
          <dl className="mt-4 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-[1.25rem] bg-air px-5 py-4 text-[16px] leading-[1.7]">
            <dt className="font-semibold text-muted-ink">개인정보관리책임자</dt>
            <dd>엔에스티</dd>
            <dt className="font-semibold text-muted-ink">전화번호</dt>
            <dd>
              <a href="tel:0432222322" className={cn(LINK, FOCUS, "rounded tabular-nums")}>
                043-222-2322
              </a>
            </dd>
            <dt className="font-semibold text-muted-ink">이메일</dt>
            <dd>
              <a href="mailto:isnst@naver.com" className={cn(LINK, FOCUS, "rounded")}>
                isnst@naver.com
              </a>
            </dd>
          </dl>

          <p className="mt-12 border-t border-hairline pt-6 text-[15px] text-muted-ink">본 방침은 2024년 09월 15일부터 시행됩니다.</p>
        </div>
      </article>
    </PageShell>
  );
}
