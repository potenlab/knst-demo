/**
 * Static company / product / support pages (rebuilt from the old knst.co.kr pages as real HTML).
 * `STATIC_PAGES` is meant for app/sitemap.ts; `PAGE_GROUPS` drives the footer.
 * The header preserves the original website's menu order separately.
 */

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export type StaticPage = { path: string; title: string; priority: number; changefreq: ChangeFreq };

export const STATIC_PAGES: StaticPage[] = [
  { path: "/about/", title: "회사소개", priority: 0.7, changefreq: "monthly" },
  { path: "/technology/", title: "기술현황", priority: 0.8, changefreq: "monthly" },
  { path: "/products/", title: "제품현황", priority: 0.8, changefreq: "monthly" },
  { path: "/products/nst-s100/", title: "NST-S100", priority: 0.7, changefreq: "monthly" },
  { path: "/products/nst-s200/", title: "NST-S200", priority: 0.7, changefreq: "monthly" },
  { path: "/products/nst-f100/", title: "NST-F100", priority: 0.7, changefreq: "monthly" },
  { path: "/evidence/", title: "시험성적서·시공 실적", priority: 0.7, changefreq: "monthly" },
  { path: "/partners/", title: "시공업체", priority: 0.7, changefreq: "weekly" },
  { path: "/faq/", title: "자주묻는질문", priority: 0.6, changefreq: "monthly" },
  { path: "/contact/", title: "문의하기", priority: 0.6, changefreq: "yearly" },
  { path: "/privacy/", title: "개인정보처리방침", priority: 0.2, changefreq: "yearly" },
];

export type NavLink = { href: string; label: string; mono?: boolean };
export type NavGroup = { label: string; links: NavLink[] };

/** Every page outside the home landing page, grouped like the old site's menu. /notices/ and /news/ are D1 boards. */
export const PAGE_GROUPS: NavGroup[] = [
  {
    label: "회사",
    links: [
      { href: "/about/", label: "회사소개" },
      { href: "/about/#directions", label: "오시는 길" },
    ],
  },
  {
    label: "공법·제품",
    links: [
      { href: "/technology/", label: "기술현황" },
      { href: "/products/", label: "제품현황" },
      { href: "/products/nst-s100/", label: "NST-S100", mono: true },
      { href: "/products/nst-s200/", label: "NST-S200", mono: true },
      { href: "/products/nst-f100/", label: "NST-F100", mono: true },
    ],
  },
  {
    label: "실적·업체",
    links: [
      { href: "/evidence/", label: "시험성적서·시공 실적" },
      { href: "/partners/", label: "시공업체" },
      { href: "/partners/#recruit", label: "신규 사업자 모집" },
    ],
  },
  {
    label: "소식",
    links: [
      { href: "/notices/", label: "공지사항" },
      { href: "/news/", label: "언론동향" },
      { href: "/blog/", label: "블로그" },
    ],
  },
  {
    label: "고객지원",
    links: [
      { href: "/faq/", label: "자주묻는질문" },
      { href: "/contact/", label: "문의하기" },
    ],
  },
];

/** "/about" and "/about/" compare equal; fragments are ignored. */
export const samePath = (a: string, b: string) => {
  const norm = (p: string) => (p.split("#")[0].replace(/\/+$/, "") || "/");
  return norm(a) === norm(b);
};
