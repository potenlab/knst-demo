/** Single source of truth for SEO / GEO metadata. Facts come from knst.co.kr (see docs/reference/content.md). */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://knst.co.kr").replace(/\/$/, ""),
  name: "(주)엔에스티",
  nameEn: "NST Co., Ltd.",
  brand: "NST공법",
  title: "새집증후군 시공 NST공법 | VOCs·포름알데히드 3단계 개선 | (주)엔에스티",
  shortTitle: "새집증후군 시공 NST공법 | (주)엔에스티",
  /* Old-site wording: home intro sentence + the home counters (누적 시공량 60,000건+ / 전국 지점 30개+ / 업력 20년)
     + "대형건설사 전세대 일괄시공 실적" (새집증후군3 infographic). */
  description:
    "NST공법은 휘발성유기화합물(VOCs), 포름알데하이드 등 실내공간에서 보이지 않는 유해물질을 차단·분해·흡착 제거해 주는 새집증후군 개선 시공 기술입니다. 누적 시공량 60,000건+, 전국 지점 30개+, 대형건설사 전세대 일괄시공 실적의 (주)엔에스티.",
  keywords: [
    "새집증후군",
    "새집증후군 시공",
    "새집증후군 시공업체",
    "새집증후군 제거",
    "NST공법",
    "VOCs",
    "포름알데히드",
    "입주 전 시공",
    "아파트 전세대 시공",
    "베이크아웃",
    "엔에스티",
  ],
  phone: "+82-43-222-2322",
  phoneDisplay: "043-222-2322",
  phone2: "+82-70-4270-7346",
  fax: "+82-43-222-2321",
  email: "isnst@naver.com",
  /** 카카오톡 채널 (1:1 채팅) — client request 2026-10-29 */
  kakao: "https://pf.kakao.com/_ScCkn",
  /** 구 사이트 히어로의 "(주)엔에스티 블로그" 버튼 */
  naverBlog: "https://blog.naver.com/nst-pro",
  address: {
    streetAddress: "공단로 134 세중테크노밸리 1408호",
    addressLocality: "청주시 흥덕구",
    addressRegion: "충청북도",
    addressCountry: "KR",
  },
  originalSite: "https://knst.co.kr",
  /** 대표자 — 구 사이트(knst.co.kr) 푸터·인사말 "대표이사 장대규" 기준. 2026-10-29 클라이언트 확인으로 김용득에서 되돌림. */
  ceo: "장대규",
  /** 사업자등록증 개업연월일 2009-07-01, 연혁 "2009-07 주식회사 엔에스티 설립" */
  foundingDate: "2009-07",
  /** 회사 공개 자료(이미지) 표기: "NST공법 20년 경력 노하우" */
  experienceYears: 20,
} as const;
