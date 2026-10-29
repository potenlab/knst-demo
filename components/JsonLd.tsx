import { SITE } from "@/lib/site";

const ID = { org: `${SITE.url}/#organization`, site: `${SITE.url}/#website`, page: `${SITE.url}/#webpage`, service: `${SITE.url}/#service` };

const graph = [
  {
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "@id": ID.org,
    name: SITE.name,
    alternateName: [SITE.nameEn, SITE.brand],
    url: SITE.url,
    logo: { "@type": "ImageObject", url: `${SITE.url}/img/logo-color.webp`, width: 500, height: 336 },
    image: `${SITE.url}/opengraph-image.png`,
    description: SITE.description,
    telephone: [SITE.phone, SITE.phone2],
    faxNumber: SITE.fax,
    email: SITE.email,
    address: { "@type": "PostalAddress", ...SITE.address },
    areaServed: { "@type": "Country", name: "대한민국" },
    foundingDate: SITE.foundingDate,
    /* 대표 — SITE.ceo (구 사이트 인사말 "대표이사 장대규", 구 푸터 "대 표 : 장대규"); same node as app/about/page.tsx */
    employee: { "@type": "Person", name: SITE.ceo, jobTitle: "대표이사" },
    slogan: "국민의 건강을 지키는 친환경 기술 NST공법",
    award: "제20회 2025 대한민국환경대상 환경제품부문 (대한민국환경대상위원회, 2025-07-18)",
    identifier: { "@type": "PropertyValue", propertyID: "사업자등록번호", value: "301-86-03073" },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer service", telephone: SITE.phone, email: SITE.email, url: SITE.kakao, availableLanguage: "ko" },
    ],
    sameAs: [SITE.naverBlog, SITE.kakao],
    knowsAbout: ["새집증후군", "휘발성유기화합물(VOCs)", "포름알데히드", "실내공기질", "베이크아웃", "광촉매 코팅", "가구 유해물질 방출 차단"],
  },
  {
    "@type": "WebSite",
    "@id": ID.site,
    url: SITE.url,
    name: SITE.shortTitle,
    inLanguage: "ko-KR",
    publisher: { "@id": ID.org },
  },
  {
    "@type": "WebPage",
    "@id": ID.page,
    url: `${SITE.url}/`,
    name: SITE.title,
    description: SITE.description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": ID.site },
    about: { "@id": ID.service },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE.url}/opengraph-image.png` },
  },
  {
    "@type": "Service",
    "@id": ID.service,
    name: "NST공법 새집증후군 개선 시공",
    serviceType: "새집증후군 개선 시공",
    provider: { "@id": ID.org },
    areaServed: { "@type": "Country", name: "대한민국" },
    description:
      "현장진단 후 NST-S200(침투·차단) → NST-F100(흡착·탈취, 지속제거 보조) → NST-S100(분해·흡착, 지속제거) 순서로 시공하는 3단계 새집증후군 개선 시공. 문제 진단·분석 → 맞춤형 솔루션 제안 → 제품 개발·생산 → 맞춤형 현장 시공 → 사후 관리·유지 보수까지 직접 수행하며, 시공 후 2~3일 자연환기(베이크아웃)를 권장합니다. 아파트 34평 기준 시공 시간 약 3~4시간.",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "NST공법 제품",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "NST-S200",
            description:
              "1단계 제거/차단 — 목재·가구 표면 등을 코팅해 내부에서 방출되는 유해물질을 차단하는 코팅제. 약 2시간 내 보호막 형성, 3~5일 후 완전 경화. 특수목적코팅제, 안전기준 적합확인 신고 GB25-07-0028호, 특허 10-1036607.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "NST-F100",
            description:
              "2단계 흡착/탈취(지속제거 보조) — 신발장·수납장·서랍 등 닫힌 공간에서 포름알데하이드 등을 흡착하고 천연 솔(숲)향을 조성하는 탈취제. 안전기준 적합확인 신고 GB25-13-0044호.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "NST-S100",
            description:
              "3단계 흡착/제거(지속제거) — 벽·천장 등에 코팅막을 만들어 유해물질을 끌어당기고(흡착) 빛을 받으면 분해하는 광촉매 기반 투명 코팅제. 안전기준 적합확인 신고 GB25-13-0045호, 특허 10-1032904.",
          },
        },
      ],
    },
  },
];

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}
