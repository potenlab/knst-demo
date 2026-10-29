/**
 * NST공법 공식 시공업체 — old /business-partner/ text (업체명·소재지·연락처·품목, verbatim) cross-checked with
 * the "NST공법 전국 협력업체 현황" infographics (2026.10.18 기준, 37곳). 대표자 as printed on /business-partner/
 * ("[업체명] … ㅣ [대표자] …"; 하이엔드 그린 "[지점장]", 네오그린 "본사 직영" without a name).
 * Name variants on the boards: 피코 ↔ (주)피코, 청소남자 C&M ↔ 청소남자 (aliases kept for search).
 * 대전: the 충북권 board alone lists 청소PRO(대전시); the nationwide board and the page list 더그린(대전 동구) → 더그린.
 */

export type Partner = {
  name: string;
  /** 대표자 as printed on /business-partner/ (absent for 네오그린 "본사 직영") */
  rep?: string;
  /** label printed before the name when it is not "대표자" (하이엔드 그린: "지점장") */
  repLabel?: string;
  /** 소재지 as printed on /business-partner/ */
  area: string;
  region: Region;
  phones: string[];
  items: string[];
  badge?: string;
  note?: string;
  alias?: string;
};

export type Region = "서울" | "경기" | "인천" | "충북" | "충남" | "세종" | "대전" | "경북" | "대구" | "부산" | "전북";

/** 권역 headings as on /business-partner/ */
export const ZONES: { zone: string; title: string; regions: Region[] }[] = [
  { zone: "수도권", title: "수도권(서울/경기/인천)", regions: ["서울", "경기", "인천"] },
  { zone: "중부권", title: "중부권(충청/세종/대전)", regions: ["충북", "충남", "세종", "대전"] },
  { zone: "남부권", title: "남부권(영남/호남)", regions: ["경북", "대구", "부산", "전북"] },
];

export const PARTNERS_DATE = "2026.10.18";

export const PARTNERS: Partner[] = [
  // 서울
  { name: "네오하우스", rep: "이수익", area: "서울 도봉구", region: "서울", phones: ["010-2224-5366"], items: ["새집증후군", "입주청소", "줄눈", "나노코팅", "커튼"] },
  { name: "이온크린", rep: "윤승병", area: "서울 용산구", region: "서울", phones: ["010-8819-0526"], items: ["새집증후군", "준공청소", "줄눈", "나노코팅", "방충망"] },
  { name: "이삭엔에스티", rep: "장양순", area: "서울 송파구", region: "서울", phones: ["010-6321-3217"], items: ["새집증후군"] },
  { name: "파란공간", rep: "김민우", area: "서울 강남구", region: "서울", phones: ["010-3199-7859"], items: ["새집증후군", "입주청소"] },
  // 경기
  { name: "NST힐링하우스", rep: "윤홍규", area: "경기 남양주시", region: "경기", phones: ["010-5653-3789"], items: ["새집증후군", "방충망", "음식물처리기"] },
  { name: "네오홈디자인", rep: "강도희", area: "경기 남양주시", region: "경기", phones: ["010-2275-1165"], items: ["새집증후군", "입주청소"] },
  { name: "클린랩", rep: "최은규", area: "경기 동두천시", region: "경기", phones: ["010-7133-6006"], items: ["새집증후군", "입주청소"] },
  { name: "온케어 홈케어", rep: "김지혜", area: "경기 의왕시", region: "경기", phones: ["010-4941-2600"], items: ["새집증후군", "입주청소"] },
  { name: "THE CLASS", rep: "김주희", area: "경기 시흥시", region: "경기", phones: ["010-7608-4116"], items: ["새집증후군", "입주청소", "나노코팅"] },
  { name: "부부클린", rep: "조종협", area: "경기 화성시", region: "경기", phones: ["010-7232-1038"], items: ["새집증후군", "입주청소", "나노코팅", "상판코팅"] },
  { name: "깔끔한삼형제", rep: "장호영", area: "경기 군포시", region: "경기", phones: ["010-5181-9447"], items: ["새집증후군", "입주청소", "줄눈"] },
  { name: "신성클린", rep: "정성환", area: "경기 안양시", region: "경기", phones: ["010-3315-7979"], items: ["새집증후군", "입주청소"] },
  { name: "우리환경", rep: "박시완", area: "경기 용인시", region: "경기", phones: ["010-3088-2353"], items: ["새집증후군", "입주청소", "방역(소독 및 방재)"] },
  { name: "성실깔끄미", rep: "고승환", area: "경기 김포시", region: "경기", phones: ["010-9275-5421"], items: ["새집증후군", "입주청소", "줄눈", "나노코팅"] },
  { name: "올인원클린", rep: "최진아", area: "경기 파주시", region: "경기", phones: ["010-7257-0422"], items: ["새집증후군", "입주청소"] },
  { name: "숨 홈케어", rep: "김동근", area: "경기 고양시", region: "경기", phones: ["010-7726-2208"], items: ["새집증후군", "입주청소"] },
  {
    name: "스토리샵",
    rep: "임창호",
    area: "경기 남양주시",
    region: "경기",
    phones: ["010-6215-2476"],
    items: ["새집증후군", "방역(먼지다듬이 등)"],
    note: "건설사(B2B) 사업제휴 전문",
  },
  { name: "향기로운집", rep: "김문영", area: "경기 성남시", region: "경기", phones: ["010-2587-0824"], items: ["새집증후군", "입주청소", "상가청소"] },
  { name: "아이앤아이", rep: "남기윤", area: "경기 오산시", region: "경기", phones: ["010-3177-6159"], items: ["새집증후군", "음식물처리기"] },
  { name: "피코", rep: "안병진", alias: "(주)피코", area: "경기 수원시", region: "경기", phones: ["010-2112-4113"], items: ["새집증후군", "방역(소독 및 방재)"] },
  { name: "(주)영우", rep: "김환", area: "경기 의정부시", region: "경기", phones: ["010-9187-9128"], items: ["새집증후군", "음식물처리기"] },
  {
    name: "청소남자 C&M",
    rep: "민경수, 임성혁",
    alias: "청소남자",
    area: "경기 파주시",
    region: "경기",
    phones: ["010-8186-0027", "010-6689-4180"],
    items: ["새집증후군", "입주청소", "줄눈", "코팅"],
  },
  // 인천
  { name: "PK CLASS", rep: "박수지", area: "인천 서구", region: "인천", phones: ["010-6598-8801"], items: ["새집증후군", "입주청소", "나노코팅", "방역"] },
  { name: "감성홈케어", rep: "서기원", area: "인천 서구", region: "인천", phones: ["010-3319-9193"], items: ["새집증후군", "입주청소", "줄눈"] },
  { name: "늘미소크린", rep: "이희숙", area: "인천 검단구", region: "인천", phones: ["010-4301-5511"], items: ["새집증후군", "입주청소", "줄눈"] },
  // 충북
  { name: "네오그린", badge: "본사 직영", area: "충북 청주시", region: "충북", phones: ["010-9540-1035"], items: ["새집증후군"] },
  { name: "슈퍼빗자루", rep: "이천희", area: "충북 청주시", region: "충북", phones: ["010-9417-4044"], items: ["새집증후군", "입주청소", "줄눈", "탄성", "나노코팅", "커튼"] },
  { name: "까사홈케어", rep: "김건준", area: "충북 청주시", region: "충북", phones: ["010-2706-8273"], items: ["새집증후군", "입주청소"] },
  { name: "에이앤씨솔루션", rep: "성현욱", area: "충북 청주시", region: "충북", phones: ["010-3165-0517"], items: ["새집증후군", "입주청소"] },
  // 충남 · 세종 · 대전
  { name: "별별청소", rep: "최솔아", area: "충남 서산시", region: "충남", phones: ["010-9852-5279"], items: ["새집증후군", "방충망", "음식물처리기"] },
  { name: "에코그린", rep: "윤용훈", area: "세종시", region: "세종", phones: ["010-2676-1444"], items: ["새집증후군", "커튼"] },
  { name: "더그린", rep: "김성중", area: "대전 동구", region: "대전", phones: ["010-8525-8270"], items: ["새집증후군", "입주청소", "커튼"] },
  // 경북 · 대구 · 부산 · 전북
  { name: "숲속이야기", rep: "조은숙", area: "경북 구미시", region: "경북", phones: ["010-4112-7386"], items: ["새집증후군", "입주청소", "방역(먼지다듬이 등)"] },
  { name: "클린868", rep: "김진영", area: "대구 달서구", region: "대구", phones: ["010-9165-7026"], items: ["새집증후군", "입주청소", "줄눈"] },
  { name: "하이엔드 그린", rep: "김회상", repLabel: "지점장", area: "부산 해운대구", region: "부산", phones: ["010-8924-6030"], items: ["새집증후군", "입주청소"] },
  { name: "아이보홈케어", rep: "이내한", area: "부산 사하구", region: "부산", phones: ["010-8946-4849"], items: ["새집증후군"] },
  { name: "태양홈케어", rep: "고영민", area: "전북 군산시", region: "전북", phones: ["010-3676-7363"], items: ["새집증후군", "방충망"] },
];

/** 「NST공법 전국 협력업체 현황」 nationwide board (2026. 10. 18 기준): region (count) and the names/areas as printed.
 *  `open`: the 남부권 board shows "모집중" slots for that region. */
export const BOARD_COUNTS: { label: string; n: number; list: string; open?: boolean }[] = [
  { label: "서울", n: 4, list: "네오하우스 도봉구 / 이온크린 용산구 / 이삭엔에스티 송파구 / 파란공간 강남구" },
  { label: "인천", n: 3, list: "PK CLASS 서구 / 감성홈케어 서구 / 늘미소크린 검단구" },
  {
    label: "충북/충남/세종/대전",
    n: 7,
    list: "네오그린 충북 청주시 / 슈퍼빗자루 충북 청주시 / 까사홈케어 충북 청주시 / 에이앤씨솔루션 충북 청주시 / 에코그린 세종시 / 더그린 대전 동구 / 별별청소 충남 서산시",
  },
  { label: "전북/전남/광주", n: 1, list: "태양홈케어 전북 군산시", open: true },
  { label: "경남/부산", n: 2, list: "하이엔드 그린 부산 해운대구 / 아이보홈케어 부산 사하구", open: true },
  { label: "경북/대구/울산", n: 2, list: "숲속이야기 경북 구미시 / 클린868 대구 달서구", open: true },
  {
    label: "경기",
    n: 18,
    list: "NST힐링하우스 남양주시 / 스토리샵 남양주시 / 네오홈디자인 남양주시 / 클린랩 동두천시 / 향기로운집 성남시 / 온케어 홈케어 의왕시 / THE CLASS 시흥시 / 부부클린 화성시 / 우리환경 용인시 / 깔끔한삼형제 군포시 / 신성클린 안양시 / (주)피코 수원시 / 성실깔끄미 김포시 / 올인원클린 파주시 / 청소남자 파주시 / 숨 홈케어 고양시 / 아이앤아이 오산시 / (주)영우 의정부시",
  },
];

export const RECRUIT_REGIONS = ["울산", "경북", "경남", "부산", "광주", "전북", "전남"];
