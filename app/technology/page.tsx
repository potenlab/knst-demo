import type { ReactNode } from "react";
import { ArrowRight, Award, BadgeCheck, Building2, Check, FlaskConical, Info, ShieldCheck } from "lucide-react";
import PageShell from "@/components/pages/PageShell";
import { LD_ID, pageMetadata } from "@/components/pages/seo";
import { Codes, FOCUS, Figure, H3, LINK, PageCTA, REVEAL, Section, SourceNote } from "@/components/pages/ui";
import { cn } from "@/lib/utils";

/*
 * 기술현황 — old /technology-overview/ (archive: docs/reference/old-site/content/page-1604-technology-overview.md).
 * Body text verbatim; the text that was only inside its images is set as real text next to the image
 * (transcriptions: docs/reference/image-text/part-1..4.md): 그림2, NST공법-3, 대형배너2026-1, NST공법-9/10/11/14/15/16/19/20/21,
 * 새집증후군14/15/16, 그림36, 그림25, 그림31, 그림33, NST공법.jpg, 그림34, 그림35. Images: public/img/tech-*.webp
 * (converted from docs/reference/assets/images-extra), public/old/tech-*.webp, public/img/proof-*.webp (redacted copies).
 * Also from the old site (home page boards): 새집증후군11 (3단계 intro, 공간 구분), media__…543486 (전 공간 케어),
 * 새집증후군9 (토탈 솔루션), media_…470956 (원스톱 시스템).
 * Certificate blocks reproduce the document text; omitted: the inventor's 생년월일·home address (그림31), the
 * 담당자 mobile number (그림33) and the personal name printed as 대표자/신고인/수료자 on 그림33·새집증후군14/16 (the site's
 * 대표 is 장대규 — CONTEXT/lib/site.ts; the documents name a different person, so the name is not repeated as text). Typo fixes vs. source: "이어여"→"이어야", "내장제"→"내장재", missing ")" after BTEX(…),
 * spacing ("빼내면안에", "꼼꼼하게마감", "흡착제거"), "바빠고"→"비싸고" (image reads 비싸고).
 * Left out: logo/shirt/garbled header-art text, the cut-off banner prefix "경지지구 최초" [?], a builder's phone number on
 * a banner (주관사 T.…234-9163, blurry), the brochure's tiny 시공실적 list (not in the transcription; visible in tech-banners.webp).
 */

const PATH = "/technology/";
const TITLE = "기술현황 · ‘하이앤드 듀얼’ 3단계 NST공법";
const DESCRIPTION =
  "지속관리 기술로 유해물질 발생 구조를 안정화 하는 ‘하이앤드 듀얼’ 기술, NST공법. [1단계] NST-S200 하이앤드 듀얼 정착 → [2단계] NST-F100 하이앤드 듀얼 케어 → [3단계] NST-S100 하이앤드 듀얼 촉매, 특허·상표, 안전확인 서류와 건설사 전세대 시공 실적을 담았습니다.";

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

/* ── 그림2 (출처 : 아산병원) ── */
const SYMPTOM_LABELS = ["안구건조증", "천식, 기관지염", "두통, 현기증, 수면장애", "알레르기성 비염", "아토피성 피부염", "폐질환", "암", "생식기능 저하"];
const SUBSTANCES = "포름알데히드, VOC, 톨루엔, 크실렌, CO2, 벤젠, 시멘트독";

/* ── NST공법-3 ── */
const CAUSES = [
  { k: "자재", en: "Material", d: "유해 화학 물질 지속 배출" },
  { k: "환경", en: "Environment", d: "온·습도 변화 시 유해 물질 재배출" },
  { k: "거주환경", en: "Lifestyle", d: "입주 후에도 VOC 추가 유입" },
];

/* ── 대형배너2026-1 ── */
const BANNER = [
  "새집증후군 해결 전용 특허·기술",
  "20년 이상 현장에서 최적화 된 시공기술",
  "환경부 후원 2025 대한민국 환경대상 수상",
  "국가공인 분석기관 안전성·성능 검증 완료",
  "대형건설사 신축아파트 전세대 (1,018세대 외) 일괄시공",
  "현장시공 직접 참관 가능한 신뢰성",
  "원료 관리·연구개발, 제품생산·공급 직접 수행",
];

const PRODUCT_LINE = "새집증후군 유발물질 제거 전용으로 대형건설사 수천세대 아파트 일괄시공에 적용된 검증된 제품입니다.";
const SITE_LINE = "NST공법 3단계 시공 방법은 20여 년간 실제 현장 적용을 통해 최적화 한 시공 프로세스입니다.";
const ALL_MATERIALS = "유리 등 크리스탈 재질을 제외한 플라스틱, 목재, 철판, 가죽, 고무 등 대부분의 자재에 시공이 가능합니다.";

type Img = { src: string; w: number; h: number; alt: string };

const TECH_STEPS: {
  n: 1 | 2 | 3;
  code: string;
  slug: string;
  head: string;
  quote: string;
  body: string;
  arrow: string;
  zone: string;
  slideTitle: string;
  slideLead: string;
  slideSub: string;
  slideHead: string;
  points: string[];
  labels: string[];
  principle: Img;
  stepsIntro: string;
  steps: { t: string; d: string }[];
  stepsImg: Img;
  site: Img;
}[] = [
  {
    n: 1,
    code: "NST-S200",
    slug: "nst-s200",
    head: "하이앤드 듀얼 정착",
    quote: "유해물질 제거 동시에 방출원 구조를 안정화",
    body: "가구 및 목재 오염원에 침투하여 방출되는 포름알데하이드와 VOCs의 확산을 억제하고 구조적으로 안정화 시킵니다.",
    arrow: "투명막 형성 + 친환경 원료 기반으로 가구 기능에 영향을 주지 않으면서 유해물질이 배출되지 않도록 안정적인 구조를 만듭니다.",
    zone: "대량방출 오염지역 · 지속적 제거(침투/차단)",
    slideTitle: "NST공법 1단계 : NST-S200 (제거/차단)",
    slideLead: "NST-S200 시공 직후부터 새집 특유의 냄새가 눈에 띄게 줄어드는 것을 느끼실 수 있습니다.",
    slideSub: "자재 내부에 침투하여 유해물질 방출 통로를 원천적으로 차단",
    slideHead: "숨 쉬는 공극까지 막는 기술",
    points: [
      "가구 및 목재 표면에 S200을 시공하면 표면에서 오염물질을 흡착 제거하고 소재 내부로 깊숙이 스며듭니다.",
      "퍼짐 및 젤(Gel)화로 침투한 용액이 넓게 퍼지면서 젤 형태로 변화하여 빈 공간(기공)을 빈틈없이 채웁니다.",
      "기공 봉쇄 및 경화 약 2시간 내 보호막을 형성하고 3~5일 후, 완전 경화되어 유해물질 재방출을 원천적으로 차단합니다.",
    ],
    labels: ["NST-S200 코팅층", "기재", "흡수", "퍼짐 & 젤화", "막 형성 (기공 봉쇄)", "유해물질 차단", "HCHO"],
    principle: {
      src: "/img/tech-s200-principle.webp",
      w: 1400,
      h: 838,
      alt: "NST공법 1단계 NST-S200 설명 슬라이드: 가구·목재 기재 위 NST-S200 코팅층이 흡수, 퍼짐과 젤화, 막 형성(기공 봉쇄) 단계를 거쳐 포름알데히드(HCHO) 방출을 막는 도식",
    },
    stepsIntro: ALL_MATERIALS,
    steps: [
      { t: "비노출면 차단 코팅 (모든 붙박이 가구 내부)", d: "보이지 않는 붙박이 가구 안쪽 면(싱크대, 옷장, 신발장 등)을 코팅하여 유해물질 방출을 차단합니다." },
      { t: "분리형 선반·서랍 정밀 차단 (절단면 집중 시공)", d: "가구를 모두 분리하여 유해가스 방출량이 가장 많은 절단면(엣지)과 모서리를 집중적으로 코팅합니다." },
      { t: "가구 내부 접합부 틈새 충진 (조인트 점착 시공)", d: "가구 조립 과정에서 생긴 미세한 틈새와 조인트(이음새) 깊숙이 전용 약품을 주입하여 유해물질 통로를 막습니다." },
      { t: "일체형 가구 틈새 브러싱 케어(내부 면과 면 사이)", d: "구조상 분리가 불가능한 가구 내부의 면과 면이 만나는 모서리 틈새까지 붓으로 꼼꼼하게 마감합니다." },
    ],
    stepsImg: {
      src: "/img/tech-s200-steps.webp",
      w: 1400,
      h: 1046,
      alt: "NST-S200 시공 STEP 1~4 사진: 붙박이 가구 안쪽 면, 분리한 선반 절단면, 가구 접합부 틈새, 일체형 가구 모서리 틈새를 붓으로 코팅하는 모습",
    },
    site: {
      src: "/old/tech-s200-site.webp",
      w: 1600,
      h: 1040,
      alt: "[실제 시공] NST공법 1단계 NST-S200: 시공자들이 붙박이 가구 내부와 분리한 선반 절단면에 NST-S200을 바르는 현장 사진 모음",
    },
  },
  {
    n: 2,
    code: "NST-F100",
    slug: "nst-f100",
    head: "하이앤드 듀얼 케어",
    quote: "공기 흐름이 정체되기 쉬운 공간의 사각지대에서 유해물질 제거 보조",
    body: "안전한 친환경 천연물질로 고객님의 체감 쾌적성과 만족도를 높입니다.",
    arrow: "어두운 공간에서도 반응하면서 은은한 천연 숲향(솔향)을 제공합니다.",
    zone: "시공취약 오염지역 · 지속제거(흡착/탈취) 보조",
    slideTitle: "NST공법 2단계 : NST-F100 (흡착/탈취)",
    slideLead: "천연물질로 구성된 NST-F100은 유해물질을 제거하고 시그니쳐 숲향을 고객님께 선사합니다.",
    slideSub: "그물망 구조의 성분이 포름알데하이드를 포획하여 제거",
    slideHead: "유해물질 꽉 잡는 흡착·탈취 기술",
    points: [
      "붓이 닿기 힘든 서랍장 안쪽, 옷장 깊은 곳, 선반 등 밀폐되고 협소한 공간까지 침투하여 잔류 유해물질을 제거합니다.",
      "공간에 잔류하고 있는 포름알데히드(HCHO) 등 유해 성분을 강력하게 흡착하여 제거합니다.",
      "인공적인 향이 아닌 자극 없는 천연 솔향(Pine Scent)으로 시공 후 마치 숲속에 온 듯한 상쾌한 잔향을 유지합니다.",
    ],
    labels: ["포름알데히드(HCHO)", "고정화", "솔(숲) 향 조성", "제품 사용 편의성", "NST-F100"],
    principle: {
      src: "/img/tech-f100-principle.webp",
      w: 1400,
      h: 850,
      alt: "NST공법 2단계 NST-F100 설명 슬라이드: 그물망 구조의 성분이 포름알데히드(HCHO)를 포획해 고정화하는 도식과 솔(숲) 향 조성, 제품 사용 편의성 표시",
    },
    stepsIntro: "신발장, 수납장, 서랍, 선반 등 닫힌 공간 어디든 간편하게 분사해 시공(숲향 제공)이 가능합니다.",
    steps: [
      {
        t: "비노출면 잔존 유해가스 흡착 제거 (붙박이 가구 내부 전체)",
        d: "붙박이장, 싱크대 등 가구 내부의 코팅되지 않은 면 전체에 F100을 분사하여, 자재 깊숙이 배어 있는 잔존 유해가스를 흡착해 제거합니다.",
      },
      {
        t: "분리형 선반·서랍 잔존 유해가스 흡착 제거",
        d: "선반과 서랍을 모두 분리한 뒤, 유해물질 방출이 가장 심한 합판 절단면(PB/MDF)에 약품을 집중 분사하여 배출하는 가스를 즉각적으로 흡착 제거합니다.",
      },
      {
        t: "접합부·모서리 틈새 잔존 유해물질 제거",
        d: "가구 조립 과정에서 생긴 모서리와 접합부 틈새 라인을 따라 정밀하게 분사하여, 깊은 곳에 숨어있는 잔존 유해물질까지 놓치지 않고 제거합니다.",
      },
      {
        t: "서랍 탈거 후 내부 비노출면 잔존 유해물질 흡착 제거",
        d: "서랍을 빼내면 안에 드러나는 가구 안쪽 깊숙한 뒷면과 레일 주변 사각지대까지 F100을 침투시켜, 눈에 보이지 않는 곳의 유해물질을 완벽하게 흡착 제거합니다.",
      },
    ],
    stepsImg: {
      src: "/img/tech-f100-steps.webp",
      w: 1400,
      h: 1046,
      alt: "NST-F100 시공 STEP 1~4 사진: 붙박이 가구 내부, 분리한 선반·서랍 절단면, 접합부·모서리 틈새, 서랍을 뺀 가구 안쪽에 NST-F100을 분사하는 모습",
    },
    site: {
      src: "/old/tech-f100-site.webp",
      w: 1600,
      h: 1165,
      alt: "[실제 시공] NST공법 2단계 NST-F100: 시공자가 옷장, 주방 수납장, 서랍 안쪽에 NST-F100을 분사하는 현장 사진 모음",
    },
  },
  {
    n: 3,
    code: "NST-S100",
    slug: "nst-s100",
    head: "하이앤드 듀얼 촉매",
    quote: "환경 조건에 따라 작동 방식이 자동으로 전환하며 유해물질을 제거",
    body: "빛이 없는 환경에서도 유해물질을 끌어당겨 포집하고 자연광이나 실내 조명이 확보되면 제거합니다.",
    arrow: "햇빛과 실내조명만으로도 지속 분해되며 자가세정(Self-Cleaning) 기능으로 오염물질을 반복 제거합니다.",
    zone: "일반공간 오염지역 · 지속적 제거(분해/제거)",
    slideTitle: "NST공법 3단계 : NST-S100 (흡착/제거)",
    slideLead: "빛이 있는 공간에서는 유해물질이 지속적(반영구)으로 제거되는 효과를 보실 수 있습니다.",
    slideSub: "한 번 시공으로 반영구적 유해물질 제거 효과 지속",
    slideHead: "흡착하고 분해하는 듀얼 액션",
    points: [
      "NST-S100이 실내공간 벽면, 천장 등 전체 면적에 코팅막을 형성합니다.",
      "이 코팅막은 실내공간에 떠다니는 포름알데히드, 톨루엔 등 유해물질을 끌어당깁니다(흡착).",
      "빛(光)을 받으면 지속적으로 효과(분해)가 일어나 유해물질을 이산화탄소와 물로 변환(제거)시킵니다.",
    ],
    labels: [
      "햇빛/실내조명 (LED)",
      "1단계: 흡착",
      "2단계: 분해",
      "톨루엔",
      "에틸벤젠",
      "자일렌",
      "스티렌",
      "포름알데하이드",
      "CO2",
      "H2O",
      "O2-",
      "OH-",
      "NST-S100 코팅층",
      "기재 (벽면/천장 등)",
    ],
    principle: {
      src: "/img/tech-s100-principle.webp",
      w: 1400,
      h: 855,
      alt: "NST공법 3단계 NST-S100 설명 슬라이드: 햇빛·실내조명(LED) 아래 벽면·천장의 NST-S100 코팅층이 톨루엔·포름알데하이드 등을 흡착(1단계)하고 분해(2단계)해 CO2와 H2O로 바꾸는 도식",
    },
    stepsIntro: ALL_MATERIALS,
    steps: [
      { t: "천장 전체 도장 코팅", d: "천장 표면에서 유해물질을 흡착 제거하고 빛이 도달하면 유해물질을 지속 제거합니다." },
      { t: "벽지 표면 도장 코팅", d: "벽지 표면에서 유해물질을 흡착 제거하고 빛이 도달하면 유해물질을 지속 제거합니다." },
      { t: "옷장 및 가구 표면 도장 코팅", d: "가구 표면에서 유해물질을 흡착 제거하고 빛이 도달하면 유해물질을 지속 제거합니다." },
      { t: "베란다 및 화장실 도장 코팅", d: "베란다 및 화장실 등 표면에서 유해물질을 흡착 제거하고 빛이 도달하면 유해물질을 지속 제거합니다." },
    ],
    stepsImg: {
      src: "/img/tech-s100-steps.webp",
      w: 1400,
      h: 1063,
      alt: "NST-S100 시공 STEP 1~4 사진: 천장, 벽지, 옷장·가구 표면, 베란다·화장실 표면에 NST-S100을 분사해 도장 코팅하는 모습",
    },
    site: {
      src: "/old/tech-s100-site.webp",
      w: 1600,
      h: 1184,
      alt: "[실제 시공] NST공법 3단계 NST-S100: 시공자들이 아파트 천장과 벽면에 스프레이건으로 NST-S100을 분사하는 현장 사진 모음",
    },
  },
];

/* ── 새집증후군9 (토탈 솔루션) ── */
const TOTAL = [
  { t: "문제 진단 및 분석", d: "시공 현장 상황을 정확히 진단하고, 20년간 현장에서 쌓인 경험과 노하우로 오염원과 문제점을 면밀히 분석합니다." },
  { t: "맞춤형 솔루션 제안", d: "진단 결과를 바탕으로 고객의 환경과 요구에 최적화된 NST공법 공기질 개선 솔루션을 설계하고 제안합니다." },
  { t: "제품 개발 및 생산", d: "엔에스티 자체 독자 기술력으로 개발된 고성능 공기정화 제품을 직접 생산하여 솔루션(NST공법)에 적용합니다." },
  { t: "맞춤형 현장 시공", d: "풍부한 경험을 가진 NST공법 전문 시공팀 등이 각 현장 맞춤형 제품을 시공하고 3단계 기능이 활성화 되도록 만듭니다." },
  { t: "사후 관리 및 유지 보수", d: "NST공법 시공 후, 베이크아웃&환기 보조작업, 실내공기질 유지관리 노하우, 새 가구 시공 서비스 등을 제공해 드립니다." },
];

/* ── 원스톱 시스템 board ── */
const ONESTOP = [
  {
    t: "철저한 제품 품질 관리",
    d: "제품 원료 확보부터 개발, 그리고 생산에 이르기까지 모든 과정을 엔에스티가 직접 관리하여 최고 수준의 품질을 보장합니다. 이는 고객 만족으로 이어지는 핵심적 요소입니다.",
  },
  {
    t: "뛰어난 비용 효율성",
    d: "모든 원료를 직접관리하고 중간 유통 과정 없이 직접 연구개발 및 생산/공급, 불필요한 비용을 절감합니다. 합리적 비용으로 고품질 새집증후군 개선 서비스를 경험하실 수 있습니다.",
  },
  {
    t: "책임감 있는 서비스",
    d: "본사와 직접 계약한 사업자만 NST공법 시공을 하기 때문에 품질 관리가 수월하고 문제 발생 시 신속한 대응이 가능합니다. 제품 개발부터 생산, NST공법 시공으로 고객님의 소중한 공간 ‘내집처럼’ 케어합니다.",
  },
];

/* ── 새집증후군14·15·16 (증명서 모음) ── */
const GALLERY: { n: string; items: string[] }[] = [
  {
    n: "(1)",
    items: [
      "제20회 2025대한민국환경대상 Korea Environmental Awards 환경제품부문 상패 — 엔에스티",
      "서비스표등록증",
      "상표등록증 (2건)",
      "특허증",
      "FITI 확인결과서 (3건)",
    ],
  },
  {
    n: "(2)",
    items: ["특허증 제 10-1032904 호", "안전기준 적합확인 신고증명서 (3건)", "KCL 시험성적서 (4건)"],
  },
  {
    n: "(3)",
    items: [
      "시험성적서 (한국세라믹기술원)",
      "수료증 (제4회 실내환경 관리사 교육, 2011년 10월 6일, 한국실내환경학회장)",
      "경쟁입찰참가자격등록증 (조달청장)",
      "공장등록증명(신청)서 (청주산업단지관리공단 이사장)",
      "사업자등록증 (법인사업자) 등록번호 866-88-03574",
      "사업자등록증 (법인사업자) 등록번호 : 301-86-03073",
      "표창장 (제44754호, 2023년 9월 15일, 환경부장관 한화진)",
      "학위수여증명서 (UST 과학기술연합대학원대학교)",
    ],
  },
];

/* ── 그림25 ── */
const PILLARS = [
  { n: "하나!", k: "기술력", d: "자체 연구·생산·판매", Icon: FlaskConical },
  { n: "둘!!", k: "안전성", d: "검증된 안전성", Icon: ShieldCheck },
  { n: "셋!!!", k: "신뢰성", d: "건설사 실적 보유", Icon: Building2 },
];

/* ── 그림36 ── */
const FLOORPLAN_LABELS = [
  { code: "NST-S100", text: "새집증후군 전문시공품" },
  { code: "NST-S200", text: "새집증후군 전문시공품" },
  { code: "NST-F100", text: "새집증후군 전문시공품", mark: "안전확인 마크" },
];

/* ── 그림31 (특허증) ── */
const PATENTS: { product: string; img: Img; rows: [string, string][]; foot: string }[] = [
  {
    product: "NST-S100 · 고성능 가시광촉매",
    img: {
      src: "/img/proof-patent-1032904.webp",
      w: 880,
      h: 1100,
      alt: "특허증 제10-1032904호 원본. 발명의 명칭: 가시광 활성 티타니아졸의 제조방법. 발명자 개인정보는 흐림 처리",
    },
    rows: [
      ["특허 Patent Number", "제 10-1032904 호"],
      ["출원번호", "제 10-2010-0124712 호"],
      ["출원일", "2010년 12월 08일"],
      ["등록일", "2011년 04월 27일"],
      ["발명의 명칭", "가시광 활성 티타니아졸의 제조방법"],
      ["특허권자", "주식회사 엔에스티(150111-*******)"],
      ["주소", "충청북도 청주시 흥덕구 공단로 134, 1408호 (송정동, 세종테크노밸리)"],
      ["발명자", "윤상범 (생년월일·주소 생략)"],
    ],
    foot: "위의 발명은 「특허법」에 따라 특허원부에 등록되었음을 증명합니다. 2024년 12월 24일 특허청장 김완기 (COMMISSIONER, KOREAN INTELLECTUAL PROPERTY OFFICE)",
  },
  {
    product: "NST-S200 · 가구 유해물질 차단재",
    img: {
      src: "/img/proof-patent-1036607.webp",
      w: 905,
      h: 1100,
      alt: "특허증 제10-1036607호 원본. 발명의 명칭: 천연물질을 이용한 유해물질의 표면 방출 억제제 및 그 제조방법. 발명자 개인정보는 흐림 처리",
    },
    rows: [
      ["특허", "제 10-1036607 호"],
      ["출원번호", "제 10-2010-0124704 호"],
      ["출원일", "2010년 12월 08일"],
      ["등록일", "2011년 05월 17일"],
      ["발명의 명칭", "천연물질을 이용한 유해물질의 표면 방출 억제제 및 그 제조방법"],
      ["특허권자/발명자/주소", "위와 동일"],
    ],
    foot: "2024년 12월 24일, 특허청장 김완기",
  },
];

/* ── 그림33 (FITI 확인결과서 · 안전기준 적합확인 신고증명서) ── */
const FITI_IMGS: Img[] = ["02137", "02138", "02139"].map((no) => ({
  src: `/img/proof-fiti-${no}.webp`,
  w: no === "02137" ? 863 : 867,
  h: 1000,
  alt: `FITI 시험연구원 안전확인대상생활화학제품 확인결과서 발행번호 M287-25-${no} 원본. 담당자 연락처는 흐림 처리`,
}));
const FITI_ROWS: [string, string][] = [
  ["발행번호", "M287-25-02137 · M287-25-02138 · M287-25-02139"],
  [
    "제품",
    "엔에스티-에스 100 탈취제 / 일반용(실내공간용, 물체용) · 엔에스티-에스 200 특수목적코팅제 / 일반용(표면보호용) · 엔에스티-에프 100 탈취제 / 일반용(물체용, 밀폐공간용-옷장, 수납장, 신발장)",
  ],
  ["확인 완료일", "2025년 6월 26일"],
  ["유효기간", "2025년 6월 26일 ~ 2028년 6월 25일"],
  ["상호", "주식회사 엔에스티, 법인등록번호 301-86-03073"],
  ["담당자", "장대규, 전자우편 isnst@naver.com (휴대전화 번호 생략)"],
  ["소재지", "충청북도 청주시 흥덕구 송정동 279-5 세종테크노밸리 1408, 전화 043-222-2322, 팩스 043-222-2321"],
  ["종합판정", "적합"],
  ["작성", "작성자 남태원, 기술책임자 권현욱 · FITI 시험연구원장"],
];

const SAFETY_IMGS: Img[] = [
  { src: "/img/proof-safety-s100.webp", w: 869, h: 1000, alt: "안전기준 적합확인 신고증명서 신고번호 GB25-13-0045호 원본 (엔에스티-에스100)" },
  { src: "/img/proof-safety-s200.webp", w: 865, h: 1000, alt: "안전기준 적합확인 신고증명서 신고번호 GB25-07-0028호 원본 (엔에스티-에스 200)" },
  { src: "/img/proof-safety-f100.webp", w: 874, h: 1000, alt: "안전기준 적합확인 신고증명서 신고번호 GB25-13-0044호 원본 (엔에스티-에프100)" },
];
const SAFETY_ROWS: [string, string][] = [
  ["NST-S100", "신고번호 GB25-13-0045호 · 엔에스티-에스100 · 탈취제 · 보충형 · 1L · 2025년 07월 21일"],
  ["NST-S200", "신고번호 GB25-07-0028호 · 엔에스티-에스 200(NST-S200) · 특수목적코팅제 · 액체형 · 1L · 2025년 07월 25일"],
  ["NST-F100", "신고번호 GB25-13-0044호 · 엔에스티-에프100 · 탈취제 · 보충형 · 1L · 2025년 07월 21일"],
  ["신고인", "주식회사엔에스티, 법인등록번호 3018603073, 0432222322"],
  ["소재지", "(28576)충청북도 청주시 흥덕구 공단로 134 세종테크노밸리 1408호 (송정동)"],
];

/* ── NST공법.jpg (시공 실적 사진) ── */
const PROJECTS: [string, string][] = [
  ["국방과학연구소", "대전시 유성구, 4층 전체"],
  ["동해 엘리시아", "케이디건설(주), 268전세대"],
  ["롯데호텔", "마포시티호텔"],
  ["오산 엘리시아", "케이디건설(주), 275전세대"],
  ["수원특례시의회", "수원특례시 신청사, 11층 전체"],
  ["북문로 한신휴플러스", "한신공영(주), 286세대"],
  ["오송힐데스하임", "(주)원건설, 402세대"],
  ["경성하늘샵(강서지구)", "(주)경상산업개발, 160전세대"],
  ["유성네오미아", "(주)운암건설, 1018전세대"],
];

/* ── 그림34 / NST공법.jpg: 현수막·홍보물 문구 ── */
const BANNERS: { where: string; lines: string[] }[] = [
  { where: "롯데호텔", lines: ["LOTTE CITY HOTEL MAPO"] },
  {
    where: "북문로 한신",
    lines: ["실내공기질(새집증후군) 개선을 위한 NST처리공법 적용", "286 전 세대 시공완료!!", "내 아파트에 숲을 가꾸어 드립니다!", "시공사 엔에스티 T.(043)222-2322"],
  },
  {
    where: "유성네오미아",
    lines: [
      "대전지역 최초 운암건설만의 친환경 프로젝트!!",
      "덕명지구 네오미아만의 또다른 고품격 프리미엄!",
      "실내공기질 개선(새집증후군,아토피, 호흡기질환 등)을 위한 NST처리공법 전세대 적용!!",
      "실내 유해공기 제거제 시공(NST-S100)",
      "가구,목재 유해물질 방출 차단제 시공(NST-S200)",
      "주관사 : (주)운암건설 시공사 : 엔에스티",
    ],
  },
  {
    where: "엘리시아",
    lines: [
      "10월 26일 OPEN",
      "맑고 깨끗한 실내공기를 위한 고객들과 엘리시아의 약속!!",
      "동해·오산 엘리시아에 이은 또 하나의 친 환경 주거명작!",
      "청주시 최초 실내공기질 개선 (새집증후군)을 위한 NST처리공법 전 세대 적용",
      "실내공기질 개선 (새집증후군) 시공장면 / NST-S100 (실내 유해공기정화) / NST-S200 (가구,목재 유해물질차단)",
      "주관사 : KD 케이디건설(주) 시공사 : 엔에스티 TEL.(043)222-2322",
    ],
  },
  {
    where: "경성하늘샵(강서지구)",
    lines: [
      "실내공기질(새집증후군) 개선을 위한 NST처리공법적용",
      "160 전 세대 시공으로 친환경 도시생활주택을 추구하는 경성",
      "주관사: (주)경성산업개발 · 시공사: 엔에스티 T.(043)222-2322",
    ],
  },
  {
    where: "홍보물",
    lines: [
      "새집증후군 개선제품",
      "아무리 비싸고 멋진 집 이라도 가족의 건강과 바꾸시겠습니까?? 침묵의 “암”살자!!!",
      "“새집증후군” 미연에 방지 하는게 최선입니다 ~",
      "엔에스티 TEL.(043) 222-2322",
    ],
  },
];

/* ── 그림35 (상표·서비스표) ── */
const MARKS: { kind: string; rows: [string, string][]; foot: string }[] = [
  {
    kind: "상표등록증 CERTIFICATE OF TRADEMARK REGISTRATION",
    rows: [
      ["등록", "제 40-1241651 호"],
      ["출원번호", "제 40-2016-0006273 호"],
      ["출원일", "2016년 01월 26일"],
      ["등록일", "2017년 03월 23일"],
      ["상표권자", "엔에스티(150111-*******), 충청북도 청주시 흥덕구 공단로 134, 1408호 (송정동, 세중테크노밸리)"],
      ["지정상품", "제 01 류 등 2 개류 가구용 유해물질차단 코팅제등 9건"],
      ["상표", "NST 로고 (NATURAL SCIENCE TECHNOLOGY)"],
    ],
    foot: "2017년 03월 23일 특허청장 최동규",
  },
  {
    kind: "서비스표등록증 CERTIFICATE OF SERVICE MARK REGISTRATION",
    rows: [
      ["등록", "제 41-0375364 호"],
      ["출원번호", "제 41-2016-0002459 호"],
      ["출원일", "2016년 01월 18일"],
      ["등록일", "2016년 10월 21일"],
      ["서비스표를 사용할 서비스업명 및 구분", "제 40 류 공기정화 및 탈취업등 10건"],
    ],
    foot: "2016년 10월 21일 특허청장 최동규",
  },
  {
    kind: "상표등록증",
    rows: [
      ["등록", "제 40-1799007 호"],
      ["출원번호", "제 40-2020-0154631 호"],
      ["출원일", "2020년 09월 02일"],
      ["등록일", "2021년 11월 12일"],
      ["상표권자", "주식회사 엔에스티(150111-*******)"],
      ["지정상품", "제 01 류 오염장소 정화용 화학제등 5건"],
      ["상표", "에어그린"],
    ],
    foot: "2021년 11월 12일 특허청장 김용래",
  },
];

/* ── small local pieces ── */

/** Transcribed certificate text ("서류 내용") — the document's own wording. */
function DocText({ title, rows, foot, className }: { title?: ReactNode; rows: [string, string][]; foot?: string; className?: string }) {
  return (
    <div className={cn("rounded-[1.25rem] border border-hairline bg-white p-5", className)}>
      <p className="text-[12px] font-bold tracking-[0.08em] text-muted-ink">서류 내용</p>
      {title && <p className="mt-1 text-[15px] font-bold leading-[1.5] text-pine">{title}</p>}
      <dl className="mt-3 divide-y divide-hairline text-[14px] leading-[1.6]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-x-3 py-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
            <dt className="font-semibold text-muted-ink">
              <Codes text={k} />
            </dt>
            <dd className="tabular-nums text-ink">
              <Codes text={v} />
            </dd>
          </div>
        ))}
      </dl>
      {foot && <p className="mt-3 border-t border-hairline pt-3 text-[14px] leading-[1.6] text-ink/80">{foot}</p>}
    </div>
  );
}

function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-muted-ink">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((t) => (
          <li key={t} className="rounded-full bg-mint/70 px-2.5 py-1 text-[13px] font-semibold text-pine">
            <Codes text={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pointer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex gap-2.5 rounded-[1.25rem] border-l-4 border-leaf bg-mint/50 px-5 py-4 text-[16px] font-medium leading-[1.7] text-pine", className)}>
      <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-leaf" />
      <span>{children}</span>
    </p>
  );
}

export default function TechnologyPage() {
  return (
    <PageShell
      path={PATH}
      crumbs={[{ label: "기술현황" }]}
      eyebrow="Technology Overview · 엔에스티 기술현황"
      title={
        <>
          지속관리 기술로 유해물질 발생 구조를 안정화 하는
          <br />
          ‘하이앤드 듀얼’ 기술입니다
        </>
      }
      name={TITLE}
      description={DESCRIPTION}
      pageExtra={{ about: { "@id": LD_ID.service } }}
      lead={
        <>
          <p>국내 최초로 대형건설사 아파트 전 세대 일괄시공(1,018세대 외 다수)으로 검증하고 발전시켜 온 20년 노하우 집약 기술입니다.</p>
          <p>보여주기식 퍼포먼스와 단순 탈취가 아닌 과학적 원리에 기반해 새집증후군 유발 물질을 근본적으로 제거합니다.</p>
          <p className="flex gap-2 text-[16px] font-semibold text-pine-2">
            <Award aria-hidden className="mt-1 size-4 shrink-0 text-leaf" />
            <span>환경부 후원 「2025 대한민국환경대상」 환경제품 부문 수상 – 국민 건강 기여와 기술력 공식 인정</span>
          </p>
        </>
      }
      toc={[
        { id: "why", label: "왜 NST공법인가" },
        { id: "knowhow", label: "20년 노하우" },
        { id: "dual", label: "하이앤드 듀얼 3단계" },
        { id: "total", label: "토탈 솔루션" },
        { id: "certs", label: "증명서" },
        { id: "strength", label: "기술력·안전성·신뢰성" },
        { id: "ip", label: "상표·서비스표" },
      ]}
    >
      {/* ── 왜? ── (그림2 · NST공법-3) */}
      <Section
        id="why"
        kicker="왜? NST공법이어야 하나?"
        title="새집증후군 유해물질 5년간 장기간 방출"
        intro={<p>새집증후군 원인물질은 최소 3년 이상 방출, 포름알데히드는 4~5년 이상 관리가 필요합니다.</p>}
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <dl className={cn("space-y-4 rounded-[1.5rem] border border-hairline bg-white p-6 sm:p-7 lg:col-span-6", REVEAL)}>
            <div>
              <dt className="text-[14px] font-bold text-leaf">정의</dt>
              <dd className="mt-1 text-[16px] leading-[1.7] text-ink">새로 지은 집에 입주 하였을 때, 전에 없던 이상 증상들이 몸에 나타나는 것을 통칭</dd>
            </div>
            <div>
              <dt className="text-[14px] font-bold text-leaf">증상</dt>
              <dd className="mt-1 text-[16px] leading-[1.7] text-ink">아토피, 천식, 알레르기, 두드러기, 눈 아픔, 목 따가움, 기침, 두통, 무기력증 등</dd>
            </div>
            <div>
              <dt className="text-[14px] font-bold text-leaf">원인</dt>
              <dd className="mt-1 text-[16px] leading-[1.7] text-ink">
                접착제의 원료(건축, 가구산업), 페인트, 내장재(천장, 벽, 마루의 쿠션, 벽지 등)에 포함된 휘발성 유해화학물질(포름알데히드, BTEX(벤젠, 톨루엔,
                에틸벤젠, 자일렌))
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-bold text-leaf">정부 대책</dt>
              <dd className="mt-1 text-[16px] leading-[1.7] text-ink">
                <ul className="space-y-1">
                  <li>• 실내 오염원 제거(환기)</li>
                  <li>• BAKE-OUT(건식 베이크아웃) : 난방온도 30℃ 이상 유지 후 환기</li>
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-bold text-leaf">문제점</dt>
              <dd className="mt-1 text-[16px] font-semibold leading-[1.7] text-pine">새 집의 유해화학물질은 3~5년 이상 장기간 배출</dd>
            </div>
            <div className="space-y-3 border-t border-hairline pt-4">
              <Chips label="그림 속 증상 표기" items={SYMPTOM_LABELS} />
              <Chips label="그림 속 유해물질 표기" items={SUBSTANCES.split(", ")} />
            </div>
            <SourceNote>출처 : 아산병원</SourceNote>
          </dl>
          <Figure
            className={cn("lg:col-span-6", REVEAL)}
            src="/img/tech-symptoms.webp"
            width={1400}
            height={879}
            zoom
            alt="새집증후군의 정의·증상·원인과 정부 대책을 정리한 자료: 사람 그림에 안구건조증, 천식·기관지염, 두통·현기증·수면장애, 알레르기성 비염, 아토피성 피부염, 폐질환, 암, 생식기능 저하가 표시되어 있음 (내용은 왼쪽에 텍스트로 옮김)"
            caption="새집증후군 정의·증상·원인과 정부 대책 (출처 : 아산병원)"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
          <Figure
            className={cn("lg:col-span-6", REVEAL)}
            src="/img/tech-causes.webp"
            width={1400}
            height={1029}
            zoom
            alt="새집증후군 유발물질 발생 3대 주요 원인(자재, 환경, 거주환경)과 VOC가 누적되는 구조를 그린 자료 (내용은 오른쪽에 텍스트로 옮김)"
          />
          <div className={cn("lg:col-span-6", REVEAL)}>
            <p className="text-[14px] font-bold tracking-[0.06em] text-leaf">새집증후군 문제 원인</p>
            <h3 className={cn(H3, "mt-1 text-pine")}>새집증후군 유발물질 원인</h3>
            <p className="mt-2 text-[16px] leading-[1.7] text-ink/85">새집증후군 유발물질 발생 3대 주요 원인 : ① 자재 | ② 환경 | ③ 거주환경</p>
            <ol className="mt-4 grid gap-3">
              {CAUSES.map((c, i) => (
                <li key={c.k} className="flex items-center gap-4 rounded-[1.25rem] bg-pine p-5 text-white">
                  <span className="font-display text-[1.75rem] font-black leading-none text-glow tabular-nums">{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-bold">
                      {c.k}({c.en})
                    </span>
                    <span className="mt-0.5 block text-[15px] text-white/80">- {c.d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[15px] font-semibold text-pine-2">VOC 누적 → 농도 상승 → 지속적 방출</p>
            <Pointer className="mt-3">3가지 원인이 동시 충족되면, 시간이 지날수록 오히려 공기가 나빠지는 구조가 만들어집니다.</Pointer>
          </div>
        </div>
      </Section>

      {/* ── 20년 노하우 ── (대형배너2026-1) */}
      <Section id="knowhow" tone="white" kicker="20년 노하우" title="NST공법 – 20년 노하우가 집약된 상온경화 코팅 솔루션">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Figure
            className={cn("mx-auto w-full max-w-[26rem] lg:col-span-5", REVEAL)}
            src="/img/tech-banner.webp"
            width={800}
            height={1174}
            zoom
            alt="‘새집증후군 해결! 원조기술!! 검증된 NST공법 20년 노하우’ 배너: 일곱 가지 강점을 나열한 포스터 (내용은 옆에 텍스트로 옮김)"
          />
          <div className={cn("lg:col-span-7", REVEAL)}>
            <p className="text-[15px] font-bold text-leaf">새집증후군 해결! 원조기술!!</p>
            <p className="mt-1 font-display text-[1.75rem] font-extrabold leading-[1.25] tracking-[-0.03em] text-pine sm:text-[2rem]">검증된 NST공법</p>
            <p className="mt-1 text-[17px] font-bold text-pine-2">20년 노하우</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {BANNER.map((b) => (
                <li key={b} className="flex gap-3 rounded-[1.25rem] border border-hairline bg-air px-4 py-3.5">
                  <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-pine text-mint">
                    <Check className="size-3.5" strokeWidth={2.75} />
                  </span>
                  <span className="text-[16px] font-semibold leading-[1.55] text-ink">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── 하이앤드 듀얼 3단계 ── (본문 + NST공법-9/10/11, 14/15/16, 19/20/21) */}
      <Section
        id="dual"
        kicker="NST공법 3단계 친환경 시공기술"
        title="대량발생 → 취약지역 → 일반지역 전 공간 케어"
        intro={
          <p>
            모든 제품은 안전성을 확보하였으며 시공 또한 상온(25~30°C)에서 경화되며 고온처리도 없습니다. NST공법 시공은 아래와 같은 제품 삼총사(NST-S100,
            S200, F100)가 사용되며, 새집증후군 유발물질 방출 환경을 근본적으로 개선합니다.
          </p>
        }
      >
        <ol className="space-y-10 lg:space-y-14">
          {TECH_STEPS.map((s) => (
            <li key={s.slug} className="rounded-[2rem] border border-hairline bg-white p-5 sm:p-8 lg:p-10">
              <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12", REVEAL)}>
                <div className="lg:col-span-5">
                  <p className="text-[14px] font-bold tracking-[0.06em] text-leaf">{s.zone}</p>
                  <h3 className="mt-2 font-display text-[1.375rem] font-extrabold leading-[1.3] tracking-[-0.02em] text-pine sm:text-[1.5rem]">
                    [{s.n}단계] : {s.head}
                    <span className="font-mono text-[0.8em] font-medium">({s.code})</span>
                  </h3>
                  <p className="mt-3 font-display text-[17px] font-bold leading-[1.55] text-pine-2">“{s.quote}”</p>
                  <p className="mt-3 text-[16px] leading-[1.75] text-ink/85">{s.body}</p>
                  <p className="mt-2 text-[16px] leading-[1.75] text-ink/85">→ {s.arrow}</p>
                  <a
                    href={`/products/${s.slug}/`}
                    className={cn("mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-pine/15 px-4 text-[15px] font-semibold text-trust hover:border-trust/40", FOCUS)}
                  >
                    <span className="font-mono">{s.code}</span> 제품 자세히
                    <ArrowRight aria-hidden className="size-4" />
                  </a>
                </div>
                <Figure
                  className="lg:col-span-7"
                  src={s.site.src}
                  width={s.site.w}
                  height={s.site.h}
                  alt={s.site.alt}
                  caption={
                    <>
                      <span className="block font-semibold text-pine">
                        [실제 시공] <Codes text={s.slideTitle} />
                      </span>
                      {SITE_LINE}
                    </>
                  }
                />
              </div>

              <div className="mt-10 border-t border-hairline pt-8">
                <p className="text-[14px] font-bold tracking-[0.06em] text-leaf">20년 노하우 현장 맞춤형 시공</p>
                <h4 className="mt-1 font-display text-[1.25rem] font-extrabold leading-[1.35] tracking-[-0.02em] text-pine">
                  <Codes text={s.slideTitle} />
                </h4>
                <p className="mt-2 text-[16px] leading-[1.75] text-ink/85">
                  <Codes text={s.slideLead} />
                </p>

                <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
                  <Figure className="lg:col-span-6" src={s.principle.src} width={s.principle.w} height={s.principle.h} alt={s.principle.alt} zoom />
                  <div className="lg:col-span-6">
                    <p className="text-[15px] font-semibold text-pine-2">{s.slideSub}</p>
                    <p className="mt-1 text-[18px] font-bold leading-[1.45] text-pine">{s.slideHead}</p>
                    <ol className="mt-4 space-y-3">
                      {s.points.map((pt, i) => (
                        <li key={pt.slice(0, 20)} className="flex gap-3.5">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-pine font-display text-[14px] font-bold text-white tabular-nums">
                            {i + 1}
                          </span>
                          <p className="pt-0.5 text-[15px] leading-[1.7] text-ink/85 sm:text-[16px]">
                            <Codes text={pt} />
                          </p>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-5">
                      <Chips label="도식 표기" items={s.labels} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
                  <div className="lg:col-span-6">
                    <p className="flex gap-2 rounded-[1rem] bg-pine px-4 py-3 text-[15px] font-medium leading-[1.6] text-white">
                      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-mint" />
                      <span>{s.stepsIntro}</span>
                    </p>
                    <ol className="mt-4 grid gap-3">
                      {s.steps.map((st, i) => (
                        <li key={st.t} className="rounded-[1.25rem] border border-hairline bg-air p-4 sm:p-5">
                          <p className="text-[13px] font-bold tracking-[0.06em] text-leaf">STEP {i + 1}.</p>
                          <p className="mt-1 text-[16px] font-bold leading-[1.45] text-pine">{st.t}</p>
                          <p className="mt-1.5 text-[15px] leading-[1.7] text-ink/80">{st.d}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <Figure className="lg:col-span-6" src={s.stepsImg.src} width={s.stepsImg.w} height={s.stepsImg.h} alt={s.stepsImg.alt} zoom />
                </div>

                <Pointer className="mt-8">{PRODUCT_LINE}</Pointer>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── 토탈 솔루션 ── (새집증후군9 · 원래 홈 화면 자료) */}
      <Section
        id="total"
        tone="white"
        kicker="토탈 솔루션"
        title="NST공법 새집증후군 및 실내공기질 개선 - 토탈 솔루션"
        intro={
          <>
            <p>
              엔에스티는 단순한 제품 판매를 넘어, 실내 공기질 문제 진단부터 맞춤형 솔루션 기술보유, 원자재 관리, 제품 개발 및 생산, 현장시공 그리고 사후
              서비스까지 모든 과정을 아우르는 업계 유일 독보적인 ‘토탈 솔루션’을 제공합니다.
            </p>
            <p>고객님의 삶의 질 향상과 건강을 생각하며, 쾌적한 실내 공간에서 생활할 수 있도록 설계하는 20년 경력 노하우를 가진 NST공법만의 차별화된 강점입니다.</p>
          </>
        }
      >
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TOTAL.map((t, i) => (
            <li key={t.t} className={cn("relative rounded-[1.5rem] border border-hairline bg-air p-5", REVEAL)}>
              <span className="grid size-10 place-items-center rounded-full bg-pine font-display text-[16px] font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-[17px] font-bold leading-[1.4] text-pine">{t.t}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-ink/80">{t.d}</p>
            </li>
          ))}
        </ol>
        <Pointer className="mt-6">20년 경력과 노하우로 만들어진 현장 맞춤형 최적화 기술인 NST공법은 새집증후군 개선 지속 효과가 가능한 토탈 관리 시스템입니다.</Pointer>
      </Section>

      {/* ── 증명서로 보는 NST공법 ── (새집증후군14·15·16) */}
      <Section id="certs" kicker="증명서로 보는 NST공법" title="증명서로 보는 NST공법 - 안전성 및 기술력, 신뢰성">
        <div className="grid gap-4 lg:grid-cols-3">
          {GALLERY.map((g) => (
            <article key={g.n} className={cn("rounded-[1.5rem] border border-hairline bg-white p-6", REVEAL)}>
              <h3 className={cn(H3, "text-pine")}>안전성 및 기술력, 신뢰성 {g.n}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-[15px] leading-[1.6] text-ink">
                    <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-leaf" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className={cn("mt-8 grid gap-6 rounded-[1.5rem] bg-white p-6 ring-1 ring-hairline sm:p-8 lg:grid-cols-12 lg:items-center", REVEAL)}>
          <Figure
            className="mx-auto w-full max-w-[16rem] lg:col-span-3"
            src="/img/proof-award.webp"
            width={440}
            height={576}
            alt="제20회 2025대한민국환경대상 환경제품부문 상패"
          />
          <blockquote className="lg:col-span-9">
            <p className="text-[12px] font-bold tracking-[0.08em] text-muted-ink">서류 내용 · 환경대상 상패</p>
            <p className="mt-2 font-display text-[17px] font-bold leading-[1.65] text-pine">
              귀사는 미래지향적인 친환경사회와 지속가능한 국가 발전을 위해 기여한 공이 크므로 제20회 2025대한민국환경대상에 선정되어 이 상을 드립니다.
            </p>
            <footer className="mt-2 text-[14px] text-muted-ink">2025. 7. 18 대한민국환경대상위원회 위원장 이규용</footer>
          </blockquote>
        </div>
        <SourceNote>
          증명서 이미지에 적힌 서류 이름과 발급 기관을 그대로 옮겼습니다. 각 서류 원본은 아래 기술력·안전성 항목과{" "}
          <a href="/evidence/" className={cn(LINK, FOCUS, "rounded")}>
            시험성적서·시공 실적
          </a>
          에서 볼 수 있습니다.
        </SourceNote>
      </Section>

      {/* ── NST공법의 차별성 ── (그림25 · 그림36) */}
      <Section id="strength" tone="mint" kicker="NST공법의 차별성" title="하나! 기술력 · 둘!! 안전성 · 셋!!! 신뢰성">
        <ul className="grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ n, k, d, Icon }) => (
            <li key={k} className={cn("rounded-[1.75rem] bg-white p-6 ring-1 ring-hairline sm:p-7", REVEAL)}>
              <Icon aria-hidden className="size-7 text-leaf" />
              <p className="mt-4 text-[15px] font-bold text-pine-2">
                {n} {k}
              </p>
              <p className={cn(H3, "mt-1 text-pine")}>{d}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[13px] font-bold text-pine">
                <BadgeCheck aria-hidden className="size-3.5" />
                안전기준 확인
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
          <Figure
            className="lg:col-span-7"
            src="/old/tech-floorplan.webp"
            width={1422}
            height={821}
            zoom
            alt="아파트 평면 입체도에 NST-S100(벽·천장 등 실내 표면), NST-S200(가구·수납장), NST-F100(신발장·수납장 내부) 시공 위치를 색으로 표시하고 주변에 각 제품 시공 사진을 배치한 도식"
          />
          <div className="lg:col-span-5">
            <p className="text-[14px] font-bold tracking-[0.06em] text-leaf">실내공기질개선 시공</p>
            <h3 className={cn(H3, "mt-1 text-pine")}>유해공기분해/정화 &amp; 유해물질 방출차단</h3>
            <ul className="mt-4 space-y-3">
              {FLOORPLAN_LABELS.map((l) => (
                <li key={l.code} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[1.25rem] border border-hairline bg-white px-5 py-4">
                  <span className="font-mono text-[16px] font-medium text-pine">{l.code}</span>
                  <span className="text-[15px] text-ink/85">{l.text}</span>
                  {l.mark && <span className="rounded-full bg-mint px-2.5 py-0.5 text-[12px] font-bold text-pine">{l.mark}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] text-muted-ink">NST공법 · www.knst.co.kr</p>
          </div>
        </div>
      </Section>

      {/* ── NST 기술력 ── (그림31 + 원스톱 시스템) */}
      <Section
        id="power"
        kicker="NST 기술력"
        title="제품 자체 연구·생산·판매"
        intro={<p>NST공법 시공 제품의 원천기술을 보유하여 자체 개발·생산 기술력이 있습니다.</p>}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {PATENTS.map((p) => (
            <article key={p.rows[0][1]} className={cn("grid gap-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]", REVEAL)}>
              <Figure src={p.img.src} width={p.img.w} height={p.img.h} alt={p.img.alt} zoom className="max-w-[14rem]" />
              <div>
                <p className="text-[14px] font-bold text-leaf">
                  <Codes text={p.product} />
                </p>
                <DocText className="mt-2" title="특허증 CERTIFICATE OF PATENT" rows={p.rows} foot={p.foot} />
              </div>
            </article>
          ))}
        </div>

        <div className={cn("mt-12 rounded-[1.75rem] bg-pine p-6 text-white sm:p-8", REVEAL)}>
          <p className="text-[14px] font-bold tracking-[0.06em] text-mint">원료관리-연구개발-제품생산 원스톱 시스템</p>
          <p className="mt-2 max-w-[48rem] text-[16px] leading-[1.75] text-white/85">
            엔에스티는 실내공기질 개선을 위한 제품의 원료관리부터 연구개발, 그리고 생산까지 모든 과정을 직접 수행하여 고객에게 최고의 가치를 제공합니다.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {ONESTOP.map((o) => (
              <li key={o.t} className="rounded-[1.25rem] border border-white/10 bg-white/[.05] p-5">
                <h3 className="text-[17px] font-bold text-white">{o.t}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-white/75">{o.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── NST 안전성 ── (그림33) */}
      <Section
        id="safety"
        tone="white"
        kicker="NST 안전성"
        title="정부 시스템으로 검증된 안전성"
        intro={<p>안전확인대상생활화학제품 검사 및 환경부 신고를 완료하는 등 안전성을 확보하였습니다.</p>}
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div className={REVEAL}>
            <h3 className={cn(H3, "text-pine")}>안전확인대상생활화학제품 확인결과서 (FiTi)</h3>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {FITI_IMGS.map((im) => (
                <li key={im.src}>
                  <Figure src={im.src} width={im.w} height={im.h} alt={im.alt} imgClassName="rounded-[0.875rem]" />
                </li>
              ))}
            </ul>
            <DocText className="mt-4" rows={FITI_ROWS} />
            <SourceNote>원본 자료에서 세 발행번호와 제품의 대응이 확인되지 않아 묶어서 적었습니다.</SourceNote>
          </div>
          <div className={REVEAL}>
            <h3 className={cn(H3, "text-pine")}>안전기준 적합확인 신고증명서 (한국환경산업기술원장)</h3>
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {SAFETY_IMGS.map((im) => (
                <li key={im.src}>
                  <Figure src={im.src} width={im.w} height={im.h} alt={im.alt} imgClassName="rounded-[0.875rem]" />
                </li>
              ))}
            </ul>
            <DocText
              className="mt-4"
              rows={SAFETY_ROWS}
              foot="「생활화학제품 및 살생물질의 안전관리에 관한 법률」제10조제4항 및 같은 법 시행규칙 제5조제5항에 따라 안전기준 적합확인 신고증명서를 발급합니다."
            />
          </div>
        </div>
      </Section>

      {/* ── NST 신뢰성 ── (NST공법.jpg · 그림34) */}
      <Section
        id="reliability"
        kicker="NST 신뢰성"
        title="건설사 전세대 시공 실적으로 검증된 성능"
        intro={<p>실내공기질 관련 법적 기준을 충족해야 하는 건설사 전세대(수천세대) 시공 경험으로 신뢰성을 확보하였습니다.</p>}
      >
        <Figure
          className={REVEAL}
          src="/img/tech-projects.webp"
          width={1600}
          height={588}
          zoom
          alt="NST공법 시공 현장 사진 아홉 장: 국방과학연구소, 동해 엘리시아, 롯데호텔, 오산 엘리시아, 수원특례시의회, 북문로 한신휴플러스, 오송힐데스하임, 경성하늘샵(강서지구), 유성네오미아"
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map(([name, d]) => (
            <li key={name} className="rounded-[1.25rem] border border-hairline bg-white px-5 py-4">
              <p className="text-[16px] font-bold text-pine">{name}</p>
              <p className="mt-0.5 text-[15px] tabular-nums text-ink/80">{d}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
          <Figure
            className="lg:col-span-6"
            src="/img/tech-banners.webp"
            width={1600}
            height={746}
            zoom
            alt="롯데시티호텔 마포 입구와 NST처리공법 적용을 알리는 아파트 현수막·홍보물 사진 모음"
          />
          <div className="lg:col-span-6">
            <h3 className={cn(H3, "text-pine")}>현수막·홍보물 문구</h3>
            <dl className="mt-4 space-y-3">
              {BANNERS.map((b) => (
                <div key={b.where} className="rounded-[1.25rem] border border-hairline bg-white px-5 py-4">
                  <dt className="text-[13px] font-bold text-leaf">{b.where}</dt>
                  <dd className="mt-1 space-y-0.5 text-[15px] leading-[1.6] text-ink">
                    {b.lines.map((l) => (
                      <p key={l}>
                        <Codes text={l} />
                      </p>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="/evidence/" className={cn("inline-flex min-h-11 items-center gap-2 text-[16px]", LINK, FOCUS, "rounded")}>
            <Award aria-hidden className="size-4" />
            시험성적서·시공 실적 보기
          </a>
        </div>
      </Section>

      {/* ── 기타 참고자료: 상표·서비스표 ── (그림35) */}
      <Section
        id="ip"
        tone="white"
        kicker="기타 참고자료"
        title="상표등록 및 서비스표 보유 현황"
        intro={<p>본사에서 브랜드 및 상표 관리를 철저히 해 NST공법(새집증후군 예방) 시공 품질을 표준화합니다.</p>}
      >
        <Figure
          className={REVEAL}
          src="/img/tech-marks.webp"
          width={1600}
          height={668}
          zoom
          alt="상표등록증(NST 로고, 제40-1241651호), 서비스표등록증(제41-0375364호), 상표등록증(에어그린, 제40-1799007호) 원본"
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {MARKS.map((m) => (
            <DocText key={m.rows[0][1]} title={m.kind} rows={m.rows} foot={m.foot} />
          ))}
        </div>
        <SourceNote>특허증·상표등록증·서비스표등록증·확인결과서·신고증명서의 글자를 그대로 옮겼습니다. 개인 생년월일·주소, 휴대전화 번호와 일부 개인 성명은 생략했습니다.</SourceNote>
      </Section>

      <PageCTA />
    </PageShell>
  );
}
