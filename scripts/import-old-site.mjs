#!/usr/bin/env node
/**
 * Old knst.co.kr boards → the D1 blog (published posts the admin can edit).
 *
 *   node scripts/import-old-site.mjs                      # python3 on PATH must have Pillow
 *   PYTHON=/usr/bin/python3 node scripts/import-old-site.mjs
 *
 * Reads   docs/reference/old-site/content/*.md   (clean Markdown of every archived page/post)
 *         docs/reference/old-site/images/         (+ docs/reference/assets/images-extra as a fallback)
 * Writes  migrations/0007_import_old_site.sql     (INSERT OR IGNORE, one statement per post)
 *         migrations/0008_restore_board_content.sql (guarded UPDATEs, see "0008" below)
 *         public/old/<name>.webp                  (body images, ≤1600px wide, WebP via python3 + Pillow)
 *         docs/reference/old-site/url-map.json    (old URL → new path, for redirects)
 *
 * Output is deterministic: same archive in → byte-identical SQL out.
 * Bodies go Markdown → HTML (micromark + GFM, raw HTML escaped) → lib/sanitize.ts, i.e. the exact
 * allow-list the admin and the public renderer use. Requires Node ≥ 22.18 (runs the .ts directly).
 *
 * Mapping
 *   공지사항 (KBoard, 19)                 → 'notice', original date
 *   언론동향 (news CPT, 3)                → 'news',   source_url = the press article the item cites
 *   블로그 글, 카테고리 "실내공기질 전문 가이드" → 'guide'; every other blog category → 'column'
 *   NST공법 자료실 pages (12)            → not in 0007 (seeded by 0002/0004 as summaries, same slugs);
 *                                          0008 replaces those summaries with the full old article
 *
 * 0008 (rules "v2"; 0007 keeps the original rules "v1" and stays byte-identical):
 *   - the 12 자료실 rows: old title + full body (with images, and the text inside the images where the
 *     article relies on it — docs/reference/image-text), excerpt = opening of the body, cover = first
 *     image, source_url dropped (it pointed at the old address, which now redirects back here)
 *   - imported posts whose old images were dropped get them back: the "증명 자료" gallery of the
 *     guide template (minus the collage of personal documents), the three product photo tables of
 *     the 11호 칼럼, and the list thumbnail of each 언론동향 item
 *   - every post with an image gets cover_image = its first body image (skipping icon-sized ones)
 *   Each UPDATE only touches a row that still holds exactly what 0002/0004/0007 wrote (never a post
 *   edited in the admin). Re-running is a no-op.
 *
 * Content rules: only what the archive holds. Edits are limited to conversion artefacts, repeated
 * boilerplate and the experience-years rule (see YEAR_FIXES); every one is printed in the report.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { htmlToText, sanitizePostHtml } from "../lib/sanitize.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REF = path.join(ROOT, "docs/reference");
const CONTENT = path.join(REF, "old-site/content");
const IMAGE_DIRS = [path.join(REF, "old-site/images"), path.join(REF, "assets/images-extra"), path.join(REF, "assets/images")];
const OUT_SQL = path.join(ROOT, "migrations/0007_import_old_site.sql");
const OUT_IMG = path.join(ROOT, "public/old");
const OUT_MAP = path.join(REF, "old-site/url-map.json");
const SEED_SQL = path.join(ROOT, "migrations/0002_seed_columns.sql");
const SEED_HTML_SQL = path.join(ROOT, "migrations/0004_convert_seed_to_html.sql");
const OUT_FIX_SQL = path.join(ROOT, "migrations/0008_restore_board_content.sql");
const TRANSCRIPT_FILES = [path.join(REF, "old-site/image-text.md"), ...[1, 2, 3, 4].map((n) => path.join(REF, `image-text/part-${n}.md`))];
const MAX_IMG_WIDTH = 1600;
const D1_MAX_STATEMENT = 100_000; // bytes
/** updated_at of every row whose body 0008 changes (the day the old content was restored). */
const FIX_TIME = "2026-10-29T00:00:00.000Z";

/* ───────────────────────── rules ───────────────────────── */

/** Same as lib/db.ts `slugify` (keep in sync). */
function slugify(input) {
  return input
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "NST공법 자료실" pages — all twelve are the columns seeded in 0002 (same slug). */
const LIBRARY_PAGE_IDS = new Set([4438, 4439, 4441, 4442, 4443, 4444, 4445, 4446, 4447, 4448, 4449, 4450]);

/**
 * Same-title duplicates: the earlier post is the shared guide template, the later "-2" post (same
 * title, same day) is the full article. Only the later one is imported; links to either go to it.
 */
const DUPLICATE_OF = { 4582: 4754, 4584: 4756 };

/**
 * Experience years: the company states 20년 (lib/site.ts experienceYears). Dated history ("2008년부터")
 * stays as written; an undated "N년" experience claim that is not 20 becomes 20.
 */
const YEAR_FIXES = [
  { id: 5421, field: "title", from: "연구 외길 18년의 진솔한 이야기", to: "연구 외길 20년의 진솔한 이야기" },
  { id: 5421, field: "body", from: "반면, 18년간 축적된 NST 전문 시공은", to: "반면, 20년간 축적된 NST 전문 시공은" },
  { id: 5421, field: "slug", from: "nst-method-18-years-factcheck-history", to: "nst-method-20-years-factcheck-history" },
  // 자료실 "NST공법 공식 증빙 허브" (0008)
  { id: 4450, field: "body", from: "지난 24년간 실내공기질", to: "지난 20년간 실내공기질" },
  { id: 4450, field: "body", from: "지난 17년간 실내공기질", to: "지난 20년간 실내공기질" },
];

/** Old-site pages rebuilt as static routes on the new site (other lane) — internal links are pointed there. */
const STATIC_PATHS = {
  "": "/",
  contact: "/contact/",
  faq: "/faq/",
  "business-partner": "/partners/",
  "technology-overview": "/technology/",
  "our-products": "/products/",
  "about-nst": "/about/",
  "nst-notice": "/notices/",
  "nst-news": "/news/",
  "nst-columns": "/blog/",
  "category/nst-columns": "/blog/",
};

/** The "NST공법 제품 신제품 출시" poster (two prints of it on the old site). */
const LAUNCH_POSTER_TEXT =
  "<p>NST공법 제품 신제품 출시 — NST-S100 하이앤드 듀얼촉매(지속제거) · NST-S200 하이앤드 듀얼정착(구조 안정화) · NST-F100 하이앤드 듀얼케어(지속제거 보조)</p>";

/** The NST공법 3-step diagram (two copies of the same image on the old site). */
const THREE_STEP_TEXT = [
  "<p>대량발생 → 취약지역 → 일반지역 전 공간 케어</p>",
  "<ol>",
  "<li>NST-S200 [1단계] 제거/차단 — VOCs 원천봉쇄: 자재·가구에서 나오는 대량방출 원인제거</li>",
  "<li>NST-F100 [2단계] 흡착/탈취 — VOCs 제거보조: S200 시공 사각지대 제거보조·숲향 제공</li>",
  "<li>NST-S100 [3단계] 흡착/제거 — VOCs 지속제거: 빛이 있는 조건에서 효과지속(반영구)</li>",
  "</ol>",
].join("\n");

/**
 * Per-image facts from docs/reference/old-site/image-text.md. `alt` replaces an empty/garbled alt;
 * `after` is the image's own text, folded into the post as real HTML right after the image.
 */
const IMAGE_NOTES = {
  "68fdcbc3003ef5404575.png": {
    alt: "2025 전국 신규 사업자 모집 포스터 — NST공법 홍보대사 새지비, 대한민국 환경대상 환경제품 부문 수상(2025년)",
    after: [
      "<p><strong>포스터 내용</strong> — 새집증후군 개선 시공 전문업체 · 2025 전국 신규 사업자 모집 · NST공법 20년 경력 노하우!</p>",
      "<ul>",
      "<li>모집부문(물품공급계약): 새집증후군 개선 “NST공법” 시공 업체</li>",
      "<li>신청자격(우대): 입주시장 3년 이상 경력 업체 · 다(多) 품목(입주청소, 줄눈, 나노코팅, 방충망, 커튼 등) ‘종합업체’ · 입주박람회 참여 업체</li>",
      "<li>신청방법: ① 이메일 문의 isnst@naver.com ② 카카오톡 1:1 채팅(QR 스캔 → 가입문의) ③ 전화문의 (043)222-2322</li>",
      "</ul>",
    ].join("\n"),
  },
  "68dfa6ae26a4c8931131.png": { alt: "NST공법 공식 홍보대사 새지비 — 집 모양 지붕을 쓴 부엉이 캐릭터" },
  "새지비(최종).png": { alt: "새지비 캐릭터" },
  "68dfa994f326f2046374.jpg": { alt: "2025 대한민국환경대상 시상식 — 상장과 꽃다발을 든 수상 사진" },
  "notice-04-inline-1.jpg": {
    alt: "NST공법 시공 업체 현황 지도 (25.10.28 기준)",
    after: [
      "<h3>NST공법 시공 업체 현황 (지도 표기 25.10.28)</h3>",
      "<ul>",
      "<li><strong>서울(4)</strong>: 네오하우스 · 도봉구 / 이온크린 · 용산구 / 이삭엔에스티 · 송파구 / 파란공간 · 강남구</li>",
      "<li><strong>경기(8)</strong>: NST힐링하우스 · 남양주 / THE CLASS · 시흥시 / 성실깔끄미 · 김포시 / 숲속이야기(경기) · 파주시 / 청소남자(신규) · 파주시 / 스토리샵 · 남양주 / 아이앤아이 · 오산시 / ㈜영우 · 의정부시</li>",
      "<li><strong>인천(2)</strong>: PK CLASS · 서구 / 감성홈케어 · 서구</li>",
      "<li><strong>충북/충남/세종/대전(5)</strong>: 네오그린 · 충북 청주시 / 슈퍼빗자루 · 충북 청주시 / 에코그린 · 세종시 / 청소PRO · 대전시 / 별별청소 · 충남 서산시</li>",
      "<li><strong>경북/대구/울산(2)</strong>: 숲속이야기 · 경북 구미 / 클린868 · 대구 달서구</li>",
      "<li><strong>전북/전남/광주(1)</strong>: 태양홈케어 · 전북 군산시</li>",
      "<li><strong>강원 · 경남/부산 · 제주</strong>: 모집중</li>",
      "</ul>",
    ].join("\n"),
  },
  "media__1780398236114.jpg": { after: THREE_STEP_TEXT },
  // the same diagram on the 자료실 page "NST공법 공식 증빙 허브" (0008)
  "media__1780388543486-3.jpg": { after: THREE_STEP_TEXT },
  "media_factory_cert_edited.jpg": {
    after: "<p>공장등록증명서 — 회사명 (주)엔에스티, 공장등록일 2011-05-13, 청주산업단지관리공단 이사장 증명(2011년 05월 15일)</p>",
  },
  "media__1785428456545-2.jpg": {
    after:
      "<p>제20회 2025대한민국환경대상 환경제품부문 (주)엔에스티 대표 김용득 — “귀 사는 미래지향적인 친환경사회와 지속가능한 국가 발전을 위해 기여한 공이 크므로 제20회 2025대한민국환경대상에 선정되어 이 상을 드립니다.” 2025. 7. 18 대한민국환경대상위원회</p>",
  },
  "media__1785428387600-3.png": { after: LAUNCH_POSTER_TEXT },
  // 언론동향 list thumbnail of the 신제품 3종 출시 item (0008): the same poster
  "새집증후군2.png": { after: LAUNCH_POSTER_TEXT },
  // 언론동향 list thumbnail of the 신규사업자 모집 item (0008): the other print of the 68fdcbc3… poster
  "지점모집공고.png": {
    after: [
      "<p><strong>포스터 내용</strong> — 새집증후군 개선 시공 전문업체 · 2025 전국 신규 사업자 모집 · NST공법 20년 경력 노하우!</p>",
      "<ul>",
      "<li>모집부문(물품공급계약): 새집증후군 개선 “NST공법” 시공 업체</li>",
      "<li>신청자격(우대): 입주시장 5년 이상 경력 업체 · 다(多) 품목(입주청소, 줄눈, 나노코팅, 방충망, 커튼 등) ‘종합업체’ · 입주박람회 참여 업체</li>",
      "<li>신청방법: ① 이메일 문의 isnst@naver.com ② 카카오톡 1:1 채팅(QR 스캔 → 가입문의) ③ 전화문의 (043)222-2322</li>",
      "</ul>",
    ].join("\n"),
  },
  "media__1785426576312-8.jpg": {
    after: "<p>새집증후군 해결 기술 선택하기: Step 1 홍보 내용을 캡쳐하거나 저장한다 → 챗GPT에 물어본다 → Step 3 결과를 확인한다</p>",
  },
  "media__1785426515967-8.jpg": {
    after: [
      "<ul>",
      "<li>공인 시험기관 안전성 검증 완료</li>",
      "<li>대형 건설사 전 세대 일괄 시공 실적</li>",
      "<li>환경부 후원, 2025 대한민국환경대상 수상</li>",
      "<li>원료 관리부터 생산·공급까지 직접 수행</li>",
      "<li>20년 이상 현장에서 다듬어온 기술력</li>",
      "<li>현장 시공, 고객 직접 참관 가능한 투명성</li>",
      "<li>새집증후군 개선 전용 특허·전용 기술</li>",
      "</ul>",
    ].join("\n"),
  },
};

/** Images that are not site content (hosting-console screenshots) or carry third-party personal documents. */
const EXCLUDED_IMAGE = /^ceo_proof_media_|^media_36fa28f8-9405-4d17-92f6-b365b9fc86c8_/;

/* ───────────────────────── 0008 rules (v2) ───────────────────────── */

/**
 * v2 keeps the guide template's "증명 자료" gallery: five of its six images are the company's own
 * material (intro, one-stop production, strengths, certificates/patents, test reports). The sixth
 * (…_1779973500250) is a collage of personal documents — individuals' business registrations, a
 * training certificate, a commendation and a degree certificate — and stays out, as do the hosting
 * screenshots (ceo_proof_media_…).
 */
const EXCLUDED_IMAGE_V2 = /^ceo_proof_media_|^media_36fa28f8-9405-4d17-92f6-b365b9fc86c8_1779973500250/;

/** Gallery alts: the old ones were "증명 자료 1…6"; these are the headings printed in each image. */
const PROOF = "media_36fa28f8-9405-4d17-92f6-b365b9fc86c8_";
const PROOF_ALT = {
  [`${PROOF}1779973464671-scaled.jpg`]: "20년 축적된 노하우, 대형 건설사가 직접 검증하고 선택! 친환경 NST공법",
  [`${PROOF}1779973470956-scaled.jpg`]: "원료관리-연구개발-제품생산 원스톱 시스템",
  [`${PROOF}1779973476750-scaled.jpg`]: "키워드로 보는 NST공법 - 압도적인 강점",
  [`${PROOF}1779973483722-scaled.jpg`]:
    "증명서로 보는 NST공법 - 안전성 및 기술력, 신뢰성 (1): 2025 대한민국환경대상, 서비스표·상표 등록증, 특허증, FITI 안전확인대상생활화학제품 확인결과서",
  [`${PROOF}1779973491043-scaled.jpg`]:
    "증명서로 보는 NST공법 - 안전성 및 기술력, 신뢰성 (2): 특허증, 안전기준 적합확인 신고증명서, KCL 시험성적서",
};

/**
 * 11호 칼럼 (post 5421): the three "[TABLE]" blocks of "NST공법 3단계 안심 방어막" were image tables
 * (product photo + application photo) that the archive could not keep; their files are the last six
 * entries of the post's 본문 이미지 URL list, in this order.
 */
const TABLE_FILLS = {
  5421: [
    [
      { file: "media__1785426473817-8.jpg", alt: "NST-S100 제품 사진 (새집증후군 전문시공용)" },
      { file: "nst_exact_model_s100_hat_1783328042095-9.jpg", alt: "NST-S100을 벽면에 분사 시공하는 모습" },
    ],
    [
      { file: "media__1785426486157-8.jpg", alt: "NST-S200 제품 사진 (새집증후군 전문시공용)" },
      { file: "nst_model_s200_1781750725814-10.jpg", alt: "가구 내부 절단면에 NST-S200을 시공하는 모습" },
    ],
    [
      { file: "media__1785426483229-8.jpg", alt: "NST-F100 제품 사진 (새집증후군 전문시공용)" },
      { file: "nst_exact_model_f100_handspray_hat_1783328308851-9.jpg", alt: "손분무기로 NST-F100을 분사 시공하는 모습" },
    ],
  ],
};

/** 언론동향: the thumbnail each item had on the old list page (/nst-news/), shown at the top of the item. */
const NEWS_LEAD = {
  163: { file: "새집증후군2.png", alt: "NST공법 제품 신제품 출시 포스터 — NST-S100·S200·F100 하이앤드 듀얼 3종" },
  165: { file: "지점모집공고.png", alt: "2025 전국 신규 사업자 모집 포스터 — NST공법 20년 경력 노하우" },
  434: { file: "B20250721111928727.jpg", alt: "2025 대한민국환경대상 시상식 — 상장과 꽃다발을 든 수상 사진" },
};

/**
 * v2: the text printed inside these images (verbatim transcriptions in docs/reference/image-text),
 * added as HTML right after the image. Key = archive file name; `src` = transcription entry (default
 * images-extra/<name>); `drop` = lines left out (layout residue, uncertain reads, personal names);
 * `edit` = [from, to] fixes (a sentence split over two press-release pages). Lines already in the
 * article, repeated slide headers/footers (unless `keepRepeats`) and the transcriber's descriptions are skipped.
 */
const LABEL_SRC = "images/2025.07.29-엔에스티-NST-유포라벨-3종-2_대지-1";
const LABEL_DROP = [/^\[사용상 주의사항\]/, /^\[응급처치\]/];
const LABEL_EDIT = [[" (안전기준확인 mark)", ""]];
const PRESS_HEAD = [/^2026\. 2\. 20\./, /^이 보도 자료는/, /^동행·매력 특별시 서울$/, /^보도 자료$/, /^생활환경연구부장 /, /^실내환경팀장 /, /^관련 누리집/, /^사진 없음/];
const V2_FOLDS = {
  // 새 가구·붙박이장에서 냄새가 오래 나는 이유
  "furniture_odor_policy_2.jpg": { drop: [/^WHO \.\.\. EPA$/] },
  "furniture_odor_policy_4.jpg": {},
  "limit_image_1.jpg": {},
  "limit_image_2.jpg": {},
  "furniture_odor_policy_5.jpg": {},
  // 베이크아웃의 효과와 한계 — 서울시 보도자료 (2026. 2. 20.)
  "seoul_bakeout_slide_1.jpg": { drop: PRESS_HEAD },
  "seoul_bakeout_slide_2.jpg": {},
  "seoul_bakeout_slide_3.jpg": { edit: [["3회 이상 반복하는 것", "3회 이상 반복하는 것이 효과적인 베이크아웃 방법이라고 설명했다."]] },
  "seoul_bakeout_slide_4.jpg": { drop: [/^이 효과적인 베이크아웃 방법이라고 설명했다\.$/] },
  "seoul_bakeout_slide_5.jpg": {},
  "seoul_bakeout_slide_6.jpg": {},
  "seoul_bakeout_slide_7.jpg": {},
  // NST-S200 / S100 / F100 현장 시공 갤러리
  "s200_img_9-scaled.jpg": {},
  "s200_img_10-scaled.jpg": {},
  "s200_img_11-scaled.jpg": {},
  "s200_img_12-scaled.jpg": { edit: [["Right chart: ", ""]] }, // keep the chart title over its table
  "s100_img_19-scaled.jpg": {},
  "s100_img_20-scaled.jpg": {},
  "s100_img_21-scaled.jpg": {},
  "s100_img_22-scaled.jpg": { edit: [["Right chart: ", ""]], drop: [/^농도 \(ppm\)$/] },
  "s100_img_23-scaled.jpg": { drop: [/^실내 LED 조명 \(주광색 6400K\)$/, /^NST-S100 처리 MB 용액/, /^초기 \/ 3시간 \/ 7시간$/] },
  "f100_img_14-scaled.jpg": {},
  "f100_img_15-scaled.jpg": {},
  "f100_img_16-scaled.jpg": {},
  "f100_img_17-scaled.jpg": {},
  // (공인시험성적서와 간이측정 결과의 차이: sungjukseo3-scaled.png is a collage whose small print is
  // mostly unreadable; its caption already names it, so no text is added.)
  // 대단지·건설사·공공기관 시공 실적이 중요한 이유
  "large_project_1-scaled.jpg": {},
  "large_project_2-scaled.jpg": { drop: [/^실내공기질개선 시공 \/ NST공법/] },
  // (NST공법 공식 증빙 허브: media__1780388543486-3.jpg, and the 언론동향 thumbnails, use IMAGE_NOTES like
  // their twins elsewhere on the old site)
  // 11호 칼럼 product photos: the label artwork transcriptions (the photo reads are approximate)
  // (each label is shown whole: lines it shares with the other labels are kept)
  "media__1785426473817-8.jpg": { src: `${LABEL_SRC}.jpg`, drop: LABEL_DROP, edit: LABEL_EDIT, keepRepeats: true },
  "media__1785426486157-8.jpg": { src: `${LABEL_SRC}-사본.jpg`, drop: LABEL_DROP, edit: LABEL_EDIT, keepRepeats: true },
  "media__1785426483229-8.jpg": { src: `${LABEL_SRC}-사본-2.jpg`, drop: LABEL_DROP, edit: LABEL_EDIT, keepRepeats: true },
};

/** Transcription lines that describe the image instead of quoting it. */
const NOT_TEXT =
  /^(?:Diagram labels|Map labels|Labels?\b|Left\b|Right\b|Chart\b|Arrows\b|Legend\b|Shirt print|Banner text|Building banners|Other in-photo|Thumbnail|Bottle side|NATURAL SCIENCE TECHNOLOGY|World Health Organization|NST \(|\((?:labels|right photos|worker shirts|illustration labels|on |bottle)|- \d+ -$)|\((?:logo|shirt logo|jar label|on shirt|on cap)\)$|\[\?\]|unreadable|legible/i;

/** v2 links to old pages that were merged into static pages on the new site (same as lib/old-redirects.json). */
const STATIC_PATHS_V2 = {
  "고객-찐-후기-시공-갤러리": "/evidence/",
  "nst공법-팩트체크-및-공인시험성적서-통합-문서": "/evidence/",
};

/** Base for image URLs written into v2 Markdown (only the file name is used to find the archived file). */
const ARCHIVE_URL = "https://knst.co.kr/wp-content/uploads/";

/* ───────────────────────── archive ───────────────────────── */

const report = { skipped: [], changes: [], links: [], images: [], unresolved: [] };
const nfc = (s) => s.normalize("NFC");

function parseFile(file) {
  const raw = nfc(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  const meta = (k) => new RegExp(`^- ${k}: (.*)$`, "m").exec(raw)?.[1]?.trim() ?? "";
  const start = raw.indexOf("\n---\n");
  let body = start >= 0 ? raw.slice(start + 5) : "";
  body = body.replace(/\n-{3}\s*\n+## 본문 이미지 URL[\s\S]*$/, "");
  const id = Number(/^(?:post|page|news|product)-(\d+)/.exec(file)?.[1] ?? /^notice-(\d+)/.exec(file)?.[1] ?? 0);
  return { file, id, title: meta("제목"), date: meta("날짜"), url: meta("URL"), oldCategory: meta("카테고리"), body };
}

/** Last path segment of an old-site URL, decoded (Hangul slugs are percent-encoded). */
function oldSlug(url) {
  try {
    const u = new URL(url);
    return nfc(decodeURIComponent(u.pathname)).replace(/^\/+|\/+$/g, "");
  } catch {
    return "";
  }
}

const normTitle = (t) => nfc(t).replace(/[\s\p{P}\p{S}]+/gu, "").toLowerCase();

function seededPosts() {
  const sql = nfc(fs.readFileSync(SEED_SQL, "utf8"));
  return [...sql.matchAll(/^\s*\('([^']+)', '((?:[^']|'')*)'/gm)].map((m) => ({ slug: m[1], title: m[2].replace(/''/g, "'") }));
}

/** One SQL VALUES tuple of string/NULL literals starting at `i` (the "("). → [values, index after ")"]. */
function readTuple(sql, i) {
  if (sql[i] !== "(") throw new Error(`readTuple: "(" expected at ${i}`);
  const vals = [];
  i++;
  for (;;) {
    while (/\s/.test(sql[i])) i++;
    if (sql.startsWith("NULL", i)) {
      vals.push(null);
      i += 4;
    } else if (sql[i] === "'") {
      let s = "";
      let j = i + 1;
      for (;;) {
        const k = sql.indexOf("'", j);
        if (k < 0) throw new Error("readTuple: unterminated string");
        if (sql[k + 1] === "'") {
          s += sql.slice(j, k + 1);
          j = k + 2;
        } else {
          s += sql.slice(j, k);
          i = k + 1;
          break;
        }
      }
      vals.push(s);
    } else throw new Error(`readTuple: unexpected "${sql.slice(i, i + 20)}"`);
    while (/\s/.test(sql[i])) i++;
    if (sql[i] === ",") i++;
    else if (sql[i] === ")") return [vals, i + 1];
    else throw new Error(`readTuple: "," or ")" expected at ${i}`);
  }
}

/** The 자료실 rows exactly as 0002 + 0004 wrote them (the guard of their 0008 UPDATE). */
function seededRows() {
  const sql = nfc(fs.readFileSync(SEED_SQL, "utf8"));
  const cols = ["slug", "title", "excerpt", "content_md", "cover_image", "category", "status", "source_url", "published_at", "created_at", "updated_at"];
  const rows = new Map();
  let i = sql.indexOf("VALUES") + 6;
  while ((i = sql.indexOf("(", i)) >= 0) {
    const [vals, end] = readTuple(sql, i);
    if (vals.length !== cols.length) throw new Error("0002: unexpected column count");
    const row = Object.fromEntries(cols.map((c, n) => [c, vals[n]]));
    rows.set(row.slug, row);
    i = end;
  }
  const html = nfc(fs.readFileSync(SEED_HTML_SQL, "utf8"));
  for (const m of html.matchAll(/UPDATE posts SET content_html = '((?:[^']|'')*)'\n  WHERE slug = '([^']+)' AND content_html = '' AND content_md = /g)) {
    const row = rows.get(m[2]);
    if (!row) throw new Error(`0004: unknown slug ${m[2]}`);
    row.content_html = m[1].replace(/''/g, "'");
  }
  for (const r of rows.values()) if (r.content_html == null) throw new Error(`0004: no HTML for ${r.slug}`);
  return rows;
}

/* ───────────────────────── image text (v2) ───────────────────────── */

const normText = (t) => nfc(t).toLowerCase().replace(/[^0-9a-z가-힣]/g, "");

let transcriptCache;
/** "images/<file>" | "images-extra/<file>" → the transcription's quoted lines ("" = blank quote line). */
function transcripts() {
  if (transcriptCache) return transcriptCache;
  transcriptCache = new Map();
  for (const file of TRANSCRIPT_FILES) {
    let cur = null;
    for (const line of nfc(fs.readFileSync(file, "utf8")).split("\n")) {
      const h = /^## (images(?:-extra)?\/.+?)\s*$/.exec(line);
      if (h) {
        cur = transcriptCache.has(h[1]) ? null : [];
        if (cur) transcriptCache.set(h[1], cur);
        continue;
      }
      if (/^## /.test(line)) cur = null;
      const q = /^\s*>\s?(.*)$/.exec(line);
      if (cur && q) cur.push(q[1].trimEnd());
    }
  }
  return transcriptCache;
}

const escMd = (t) =>
  t
    .replace(/[\\`*_[\]<>~|]/g, "\\$&")
    .replace(/^([#+=-])/, "\\$1")
    .replace(/^(\d+)([.)])/, "$1\\$2");

/** Transcribed lines → Markdown: tables stay tables, "1. 2. 3." runs and "• " runs become lists, STEP lines bold. */
function foldMarkdown(lines) {
  const blocks = [];
  const NUM = /^(\d+)([.)]) (.*)$/;
  const BULLET = /^[•▪-] /;
  for (let i = 0; i < lines.length; ) {
    const t = lines[i];
    if (!t) {
      i++;
      continue;
    }
    if (/^\|.*\|$/.test(t)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i])) rows.push(lines[i++]);
      blocks.push(
        rows
          .map((r) => (/^\|[\s|:-]+\|$/.test(r) ? r : `| ${r.slice(1, -1).split("|").map((c) => escMd(c.trim())).join(" | ")} |`))
          .join("\n"),
      );
      continue;
    }
    const num = NUM.exec(t);
    if (num?.[1] === "1") {
      const run = [];
      for (let n = 1; i + run.length < lines.length; n++) {
        const m = NUM.exec(lines[i + run.length]);
        if (!m || Number(m[1]) !== n || m[2] !== num[2]) break;
        run.push(`${n}${m[2]} ${escMd(m[3])}`);
      }
      if (run.length >= 2) {
        blocks.push(run.join("\n"));
        i += run.length;
        continue;
      }
    }
    if (BULLET.test(t)) {
      const run = [];
      while (i < lines.length && BULLET.test(lines[i])) run.push(`- ${escMd(lines[i++].replace(BULLET, ""))}`);
      blocks.push(run.join("\n"));
      continue;
    }
    blocks.push(/^STEP \d+\. /.test(t) ? `${STRONG_OPEN}${escMd(t)}${STRONG_CLOSE}` : escMd(t));
    i++;
  }
  return blocks.join("\n\n");
}

/**
 * HTML of the text printed in `image` (V2_FOLDS), minus lines the article already has (`bodyNorm`) or
 * that an earlier image of the same article already added (`seen`). Every `drop`/`edit` must apply.
 */
function foldHtml(image, seen, bodyNorm, entry) {
  const cfg = V2_FOLDS[image];
  const key = cfg.src ?? `images-extra/${image}`;
  const raw = transcripts().get(key);
  if (!raw) throw new Error(`${entry.file}: no transcription "${key}"`);
  const usedDrop = new Set();
  const usedEdit = new Set();
  const lines = [];
  for (const line of raw) {
    let t = line.trim();
    if (!t) {
      lines.push("");
      continue;
    }
    for (const [n, [from, to]] of (cfg.edit ?? []).entries()) {
      if (t.includes(from)) {
        t = t.split(from).join(to);
        usedEdit.add(n);
      }
    }
    t = t.replace(/\s*\[cite: \d+\]/g, "").trim();
    const drop = (cfg.drop ?? []).findIndex((re) => re.test(t));
    if (drop >= 0) {
      usedDrop.add(drop);
      continue;
    }
    if (NOT_TEXT.test(t)) continue;
    if (!/^\|/.test(t)) {
      const n = normText(t);
      if ((seen.has(n) && !cfg.keepRepeats) || (n.length >= 8 && bodyNorm.includes(n))) continue;
      seen.add(n);
    }
    lines.push(t);
  }
  if (usedDrop.size !== (cfg.drop ?? []).length || usedEdit.size !== (cfg.edit ?? []).length) {
    throw new Error(`${entry.file}: V2_FOLDS["${image}"] has a drop/edit rule that matched nothing`);
  }
  const md = foldMarkdown(lines);
  if (!md) return "";
  return micromark(md, { allowDangerousHtml: false, extensions: [gfm()], htmlExtensions: [gfmHtml()] })
    .replaceAll(STRONG_OPEN, "<strong>")
    .replaceAll(STRONG_CLOSE, "</strong>")
    .trim();
}

/* ───────────────────────── images ───────────────────────── */

const imageIndex = new Map();
for (const dir of IMAGE_DIRS) {
  for (const f of fs.readdirSync(dir).sort()) {
    const k = nfc(f);
    if (!imageIndex.has(k)) imageIndex.set(k, path.join(dir, f));
  }
}

/** Local copy of an image URL's file: exact name first, then the same name without WordPress's "-N" duplicate suffix. */
function findImage(base) {
  if (imageIndex.has(base)) return { name: base, file: imageIndex.get(base) };
  const stem = (n) => n.replace(/\.[a-z0-9]+$/i, "").replace(/-\d+$/, "");
  const ext = (n) => /\.([a-z0-9]+)$/i.exec(n)?.[1]?.toLowerCase();
  const hit = [...imageIndex.keys()].sort().find((k) => stem(k) === stem(base) && ext(k) === ext(base));
  return hit ? { name: hit, file: imageIndex.get(hit) } : null;
}

/** public/old file name: ASCII stems kept (lower-case, dashes); others get a stable hash. */
function outName(srcName) {
  const stem = srcName.replace(/\.[^.]+$/, "");
  const ascii = /^[\x20-\x7e]+$/.test(stem);
  const base = ascii
    ? stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : `img-${crypto.createHash("sha1").update(stem).digest("hex").slice(0, 10)}`;
  return `${base}.webp`;
}

const imageJobs = new Map(); // out name → source file

/** Convert every queued image once (python3 + Pillow), returning { name → {width,height} }. */
function convertImages() {
  fs.mkdirSync(OUT_IMG, { recursive: true });
  const jobs = [...imageJobs.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, src]) => ({ src, dest: path.join(OUT_IMG, name), name }));
  const py = `
import json, sys
from PIL import Image, ImageOps
out = {}
for j in json.load(sys.stdin):
    im = Image.open(j["src"])
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if ("A" in im.mode or im.mode == "P") else "RGB")
    w, h = im.size
    if w > ${MAX_IMG_WIDTH}:
        im = im.resize((${MAX_IMG_WIDTH}, round(h * ${MAX_IMG_WIDTH} / w)), Image.LANCZOS)
    im.save(j["dest"], "WEBP", quality=80, method=6)
    out[j["name"]] = {"width": im.size[0], "height": im.size[1]}
print(json.dumps(out))
`;
  // -E: ignore PYTHON* env vars. Pillow often lives in the user site-packages, so no -I; cwd is our
  // own output folder, so nothing foreign is importable from the current directory.
  const res = spawnSync(process.env.PYTHON || "python3", ["-E", "-c", py], {
    cwd: OUT_IMG,
    input: JSON.stringify(jobs),
    encoding: "utf8",
    maxBuffer: 1 << 24,
  });
  if (res.status !== 0) throw new Error(`image conversion failed (needs python3 + Pillow):\n${res.stderr}`);
  return JSON.parse(res.stdout);
}

/* ───────────────────────── markdown clean-up ───────────────────────── */

const STRONG_OPEN = "\uE000";
const STRONG_CLOSE = "\uE001";
const imgMd = String.raw`!\[[^\]]*\]\((?:[^()\s]|\([^()\s]*\))+\)`;

/** 자료실 pages (v2): residue of the page builder they were made with. */
function libraryMarkdown(md) {
  let s = md;
  s = s.replace(/^n[ \t]*$/gm, ""); // a lost "\n" printed between FAQ items
  s = s.replace(/^👈 좌우로 스크롤하여 확인하세요[ \t]*$/gm, ""); // hint for the old sideways gallery (images now stack)
  s = s.replace(/^- • /gm, "- "); // a bullet typed into a list item
  const lines = s.split("\n");
  const blank = (i) => !(lines[i] ?? "").trim();
  // card label + card title, each its own paragraph → one h4 ("FACT 1 · 물리적 오염 : 공사 분진과 미세먼지")
  const LABEL = /^(?:원인 \d+|위험성|\d+단계|FACT \d+|SOLUTION|CHECK \d+|STEP \d+)$/;
  for (let i = 0; i < lines.length; i++) {
    if (!LABEL.test(lines[i].trim()) || !blank(i - 1) || !blank(i + 1)) continue;
    const title = (lines[i + 2] ?? "").trim();
    if (!title || /^[#!>|*\d-]/.test(title) || !blank(i + 3)) continue;
    lines.splice(i, 3, `#### ${lines[i].trim()} · ${title}`);
  }
  // FAQ questions standing alone → bold
  for (let i = 0; i < lines.length; i++) {
    if (/^Q\. \S/.test(lines[i]) && blank(i - 1) && blank(i + 1)) lines[i] = `**${lines[i].trim()}**`;
  }
  return lines.join("\n");
}

function cleanMarkdown(md, entry) {
  const v2 = entry.mode === "v2";
  let s = md.replace(/\r\n/g, "\n").replace(/[﻿​]/g, "");

  // pandoc's empty paragraphs: a line that is only a hard-break backslash (sometimes bolded)
  s = s.replace(/^[ \t]*(?:\*\*)?\\(?:\*\*)?[ \t]*$/gm, "");
  // WordPress emoji images → the emoji itself
  s = s.replace(/!\[([^\]]*)\]\(https:\/\/s\.w\.org\/images\/core\/emoji\/[^)\s]+\)/g, "$1");
  if (v2) {
    // image tables the archive could not keep → their images, one per paragraph
    const fills = [...(TABLE_FILLS[entry.id] ?? [])];
    s = s.replace(/^[ \t]*\[TABLE\][ \t]*$/gm, (m) => {
      const imgs = fills.shift();
      return imgs ? imgs.map((i) => `![${i.alt}](${ARCHIVE_URL}${encodeURIComponent(i.file)})`).join("\n\n") : m;
    });
    if (fills.length) throw new Error(`${entry.file}: TABLE_FILLS has more tables than the post`);
    // 언론동향: the item's list thumbnail goes first
    const lead = entry.kind === "news" ? NEWS_LEAD[entry.id] : undefined;
    if (lead) s = `![${lead.alt}](${ARCHIVE_URL}${encodeURIComponent(lead.file)})\n\n${s}`;
    // an image wrapped in a link across hard breaks: [\ ![alt](src)\ ](href)
    s = s.replace(new RegExp(String.raw`\[\\\n(${imgMd})\\\n\]\(`, "g"), "[$1](");
    // galleries (images side by side, or split by hard breaks) → one image per paragraph, so the
    // text of each image can follow it (only in bodies that get images back — others stay as in 0007)
    if (entry.kind === "library" || lead || TABLE_FILLS[entry.id] || s.includes(PROOF)) {
      s = s.replace(new RegExp(String.raw`(${imgMd})(?:[ \t]*\\?\n|[ \t]*)(?=!\[)`, "g"), "$1\n\n");
    }
    if (entry.kind === "library") s = libraryMarkdown(s);
  }
  // tables the archive could not keep
  s = s.replace(/^[ \t]*\[TABLE\][ \t]*$/gm, "");
  // literal markdown emphasis typed into the old editor (shown as asterisks there)
  s = s.replace(/\\\*\\\*(.+?)\\\*\\\*/g, "**$1**").replace(/\\\*(?=\S)([^*\n]+?)(?<=\S)\\\*/g, "*$1*");
  s = s.replace(/\*{4}([^*\n]+?)\*{4}/g, "**$1**");
  // an empty quoted name left by the old template: **‘’**
  s = s.replace(/[ \t]*\*\*‘’\*\*[ \t]*/g, " ");
  // link text wrapped in hard breaks: [\ text \ ](url)
  s = s.replace(/\[\\\n([^\]]*?)\\\n\]\(/g, (_m, t) => `[${t.trim()}](`);
  // "\u00A0- item" paragraphs (KBoard) → a real list
  s = s.replace(/^[ \u00A0]+- (?=\S)/gm, "- ").replace(/^(- .*)\n\n(?=- )/gm, "$1\n");

  // repeated guide-template boilerplate
  s = s.replace(/^🏆 2025 대한민국환경대상 본상 수상 기업[ \t]*$/gm, "");
  s = s.replace(/^환영합니다\. 이 문서는 .*프리미엄 가이드입니다\.[ \t]*$/gm, "");
  s = s.replace(/^#{2,6} 🎥 \(주\)엔에스티 공식 영상 레퍼런스[ \t]*$/gm, ""); // video embeds were not archived
  // v1 dropped the "증명 자료" gallery with its heading; v2 keeps it (see EXCLUDED_IMAGE_V2)
  if (!v2) s = s.replace(new RegExp(String.raw`^#{2,6} 🏆 조작할 수 없는 객관적 증명 자료[ \t]*\n+(?:(?:${imgMd})+\\?[ \t]*\n?)+`, "gm"), "");
  s = s.replace(new RegExp(String.raw`^(?:(?:${imgMd})+\\?[ \t]*\n?)+`, "gm"), (block) =>
    /ceo_proof_media_/.test(block) ? "" : block,
  );

  // a first line that repeats the title
  const lines = s.split("\n");
  const first = lines.findIndex((l) => l.trim());
  if (first >= 0) {
    const plain = lines[first].replace(/^#+\s*/, "").replace(/\\/g, "").replace(/\*\*/g, "");
    if (normTitle(plain) === normTitle(entry.title)) lines.splice(first, 1);
  }

  // headings: the page title is the h1, and the editor/sanitizer keep h2–h4
  for (let i = 0; i < lines.length; i++) {
    const h = /^(#{1,6})(\s.*)$/.exec(lines[i]);
    if (h) lines[i] = `${"#".repeat(Math.min(4, Math.max(2, h[1].length)))}${h[2]}`;
  }

  // columns: "1\. 제목" / " 2. 제목" standing alone between blank lines are section headings
  if (entry.kind === "post") {
    for (let i = 0; i < lines.length; i++) {
      const m = /^[  ]?(\d{1,2})\\?\.[  ](\S.{0,88})$/.exec(lines[i]);
      if (m && !(lines[i - 1] ?? "").trim() && !(lines[i + 1] ?? "").trim() && !/\\$/.test(lines[i])) {
        lines[i] = `### ${m[1]}. ${m[2].trim()}`;
      }
    }
  }
  s = lines.join("\n");

  for (const fx of YEAR_FIXES.filter((f) => f.id === entry.id && f.field === "body")) s = applyFix(s, fx, entry);

  // **bold** next to Hangul (e.g. "**NST공법(…)**으로") fails CommonMark's flanking rules and would
  // print the asterisks — mark the pairs here and turn them into <strong> after micromark.
  s = s.replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g, `${STRONG_OPEN}$1${STRONG_CLOSE}`);
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

function applyFix(text, fx, entry) {
  if (!text.includes(fx.from)) throw new Error(`YEAR_FIXES: "${fx.from}" not found in ${entry.file}`);
  (entry.report ?? report).changes.push(`${entry.file} (${fx.field}): "${fx.from}" → "${fx.to}"`);
  return text.split(fx.from).join(fx.to);
}

/* ───────────────────────── HTML post-processing ───────────────────────── */

const decodeAttr = (v) => v.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const escAttr = (v) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function toHtml(md, entry, ctx) {
  const v2 = entry.mode === "v2";
  const rep = entry.report ?? report;
  let html = micromark(md, { allowDangerousHtml: false, extensions: [gfm()], htmlExtensions: [gfmHtml()] })
    .replaceAll(STRONG_OPEN, "<strong>")
    .replaceAll(STRONG_CLOSE, "</strong>");

  // images → /old/<name>.webp (or dropped)
  const folds = [];
  html = html.replace(/<img\b([^>]*?)\s*\/?>/g, (_tag, attrs) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], decodeAttr(m[2])]));
    let base = "";
    try {
      base = nfc(decodeURIComponent(new URL(a.src ?? "", "https://knst.co.kr/").pathname.split("/").pop() ?? ""));
    } catch {
      /* unparsable src */
    }
    if ((v2 ? EXCLUDED_IMAGE_V2 : EXCLUDED_IMAGE).test(base)) {
      rep.images.push(`${entry.file}: dropped ${base} (not site content / personal documents)`);
      return "";
    }
    const hit = base && findImage(base);
    if (!hit) {
      rep.unresolved.push(`${entry.file}: image not in archive → dropped: ${a.src}`);
      return "";
    }
    const name = outName(hit.name);
    imageJobs.set(name, hit.file);
    const note = IMAGE_NOTES[hit.name] ?? IMAGE_NOTES[base];
    const garbled = !a.alt || /^[\w+/=]{1,6}$/.test(a.alt.trim());
    let alt = note?.alt && garbled ? note.alt : (a.alt ?? "").trim();
    if (v2 && PROOF_ALT[hit.name]) alt = PROOF_ALT[hit.name];
    if (note?.after) folds.push({ name, after: note.after });
    else if (v2 && V2_FOLDS[hit.name]) folds.push({ name, image: hit.name });
    return `<img src="/old/${name}" alt="${escAttr(alt)}" data-old="${name}">`;
  });

  // fold image text in right after the paragraph holding the image
  // the article's text per block (inline tags removed), so a match never spans two blocks
  const bodyNorm = v2
    ? html
        .replace(/<\/?(?:strong|em|b|i|a|span|mark|u|s|del|sub|sup|small|code)\b[^>]*>/g, "")
        .split(/<[^>]+>/)
        .map((t) => normText(decodeAttr(t)))
        .filter(Boolean)
        .join("|")
    : "";
  const seen = new Set();
  for (const { name, after, image } of folds) {
    const at = html.indexOf(`data-old="${name}"`);
    const close = html.indexOf("</p>", at);
    if (at < 0) continue;
    const pos = close >= 0 ? close + 4 : html.length;
    let text = after;
    if (image) {
      // v2: one image per paragraph, each image once — so every text lands right under its own image
      const para = html.slice(html.lastIndexOf("<p>", at), close);
      const others = [...para.matchAll(/data-old="([^"]+)"/g)].filter((m) => m[1] !== name && folds.some((f) => f.name === m[1]));
      if (others.length || html.indexOf(`data-old="${name}"`, at + 1) >= 0) throw new Error(`${entry.file}: image text of ${image} has no paragraph of its own`);
      text = foldHtml(image, seen, bodyNorm, entry);
      if (!text) continue;
      rep.images.push(`${entry.file}: text of ${image} added after the image`);
    }
    html = `${html.slice(0, pos)}\n${text}\n${html.slice(pos)}`;
  }

  // links: old-site URLs → new paths (or plain text); external links open in a new tab
  html = html.replace(/<a href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (_m, rawHref, rest, inner) => {
    const href = decodeAttr(rawHref);
    const mapped = rewriteOldLink(href, ctx, v2);
    if (mapped === undefined) {
      if (/^https?:\/\//i.test(href)) return `<a href="${escAttr(href)}" target="_blank" rel="noopener noreferrer"${rest}>${inner}</a>`;
      return `<a href="${escAttr(href)}"${rest}>${inner}</a>`;
    }
    if (mapped === null) {
      rep.links.push(`${entry.file}: unlinked (no new page) ${href}`);
      return inner;
    }
    rep.links.push(`${entry.file}: ${href} → ${mapped}`);
    // a bare old URL shown as the link text becomes the new address
    const shown = decodeAttr(inner).trim().replace(/\/$/, "");
    const label = shown === href.replace(/\/$/, "") ? escAttr(`knst.co.kr${decodeURI(mapped)}`) : inner;
    return `<a href="${escAttr(mapped)}"${rest}>${label}</a>`;
  });

  // tidy: empty paragraphs/headings, breaks at paragraph edges, our temporary marker
  html = html
    .replace(/ data-old="[^"]*"/g, "")
    .replace(/<p>(?:\s*<br \/>)+/g, "<p>")
    .replace(/(?:<br \/>\s*)+<\/p>/g, "</p>")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<h([2-4])>\s*<\/h\1>/g, "");

  const clean = sanitizePostHtml(html).replace(/\n{2,}/g, "\n").trim();
  return clean;
}

/**
 * undefined → not an old-site link (leave it); null → old-site page with no counterpart (unlink);
 * string → new site path. v2 also maps site-relative old links ("/nst-method-three-step-process/") and
 * the old pages merged into /evidence/; a relative link with no counterpart is left as it is.
 */
function rewriteOldLink(href, ctx, v2 = false) {
  const relative = v2 && /^\/(?!\/)/.test(href);
  let u;
  try {
    u = relative ? new URL(href, "https://knst.co.kr/") : new URL(href);
  } catch {
    return undefined;
  }
  if (!/^(www\.)?knst\.co\.kr$/i.test(u.hostname)) return undefined;
  const p = nfc(decodeURIComponent(u.pathname)).replace(/^\/+|\/+$/g, "");
  if (p in STATIC_PATHS) return STATIC_PATHS[p];
  if (v2 && p in STATIC_PATHS_V2) return STATIC_PATHS_V2[p];
  const last = p.split("/").pop() ?? "";
  return ctx.slugMap.get(p) ?? ctx.slugMap.get(last) ?? (relative ? undefined : null);
}

/* ───────────────────────── excerpt ───────────────────────── */

/** Opening of the body as plain text, greetings skipped, cut at a sentence end near `max` chars. */
function excerptOf(html, max = 150) {
  const paras = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((m) => htmlToText(m[1].replace(/<\/?(?:strong|em|b|i|a|span|mark|u|s|del)\b[^>]*>/g, "")).replace(/^□\s*/, ""))
    .filter((t) => t.length >= 8 && !/^(안녕하십니까|안녕하세요)/.test(t) && !/^\[?참고 문헌/.test(t));
  let text = "";
  for (const t of paras) {
    text = text ? `${text} ${t}` : t;
    if (text.length >= 60) break;
  }
  if (text.length <= max) return text;
  const head = text.slice(0, max + 1);
  const ends = [...head.matchAll(/[.!?。](?=\s|$)/g)];
  const last = ends.at(-1);
  if (last && last.index + 1 >= max * 0.45) return head.slice(0, last.index + 1).trim();
  const sp = head.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? head.slice(0, sp) : head.slice(0, max)).replace(/[\s,·:;(\[-]+$/, "")}…`;
}

/* ───────────────────────── build ───────────────────────── */

const files = fs.readdirSync(CONTENT).map(nfc).sort();
const seeded = seededPosts();
const seededSlugs = new Set(seeded.map((p) => p.slug));
const seededTitles = new Set(seeded.map((p) => normTitle(p.title)));

const entries = [];
for (const file of files) {
  const e = parseFile(file);
  if (file.startsWith("notice-")) entries.push({ ...e, kind: "notice", category: "notice" });
  else if (file.startsWith("news-")) entries.push({ ...e, kind: "news", category: "news" });
  else if (file.startsWith("post-")) entries.push({ ...e, kind: "post", category: e.oldCategory === "실내공기질 전문 가이드" ? "guide" : "column" });
  else if (file.startsWith("page-") && LIBRARY_PAGE_IDS.has(e.id)) {
    const slug = oldSlug(e.url);
    if (!seededSlugs.has(slug)) throw new Error(`${file}: library page "${slug}" is not in 0002 — import it instead`);
    report.skipped.push(`${file} — 자료실 page already seeded as /blog/${slug}/ (0002/0004)`);
    entries.push({ ...e, kind: "seeded", newPath: `/blog/${slug}/` });
  }
}

// slugs + old → new map
const slugMap = new Map(); // old slug / old URL → new path
const usedSlugs = new Set(seededSlugs);
const imports = [];
for (const e of entries) {
  if (e.kind === "seeded") {
    slugMap.set(oldSlug(e.url), e.newPath);
    continue;
  }
  if (e.kind === "post" && DUPLICATE_OF[e.id]) continue; // mapped after the kept one has a slug
  if (seededTitles.has(normTitle(e.title))) {
    report.skipped.push(`${e.file} — same title as a seeded column`);
    continue;
  }
  let title = e.title;
  for (const fx of YEAR_FIXES.filter((f) => f.id === e.id && f.field === "title")) title = applyFix(title, fx, e);
  const old = oldSlug(e.url);
  let slug = e.kind === "post" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(old) ? old : slugify(title);
  for (const fx of YEAR_FIXES.filter((f) => f.id === e.id && f.field === "slug")) slug = applyFix(slug, fx, e);
  let unique = slug;
  for (let n = 2; usedSlugs.has(unique); n++) unique = `${slug.slice(0, 77)}-${n}`;
  usedSlugs.add(unique);
  const newPath = `${e.category === "notice" ? "/notices/" : e.category === "news" ? "/news/" : "/blog/"}${encodeURIComponent(unique)}/`;
  const item = { ...e, title, slug: unique, newPath };
  imports.push(item);
  if (e.kind === "post" || e.kind === "news") slugMap.set(old, newPath);
}
for (const [dup, kept] of Object.entries(DUPLICATE_OF)) {
  const d = entries.find((e) => e.kind === "post" && e.id === Number(dup));
  const k = imports.find((e) => e.kind === "post" && e.id === kept);
  if (!d || !k) throw new Error(`DUPLICATE_OF ${dup} → ${kept}: post missing`);
  if (normTitle(d.title) !== normTitle(k.title)) throw new Error(`DUPLICATE_OF ${dup} → ${kept}: titles differ`);
  slugMap.set(oldSlug(d.url), k.newPath);
  report.skipped.push(`${d.file} — same title as ${k.file} (earlier guide-template version); links point to ${k.newPath}`);
}

// bodies
const ctx = { slugMap };
for (const item of imports) {
  const md = cleanMarkdown(item.body, item);
  item.html = toHtml(md, item, ctx);
  item.excerpt = excerptOf(item.html);
  const artefact = /.{0,60}(?:\[TABLE\]|knst\.co\.kr\/wp-content|\\\n|\*\*).{0,60}/.exec(item.html);
  if (artefact) throw new Error(`${item.file}: conversion left an artefact: ${artefact[0]}`);
  if (!htmlToText(item.html)) throw new Error(`${item.file}: empty body`);
  // press source for news items: the first external article the item cites
  item.sourceUrl = item.kind === "news" ? (/<a href="(https?:\/\/(?!(?:www\.)?knst\.co\.kr)[^"]+)"/.exec(item.html)?.[1] ?? null) : null;
  if (item.sourceUrl) item.sourceUrl = decodeAttr(item.sourceUrl);
}

// 0008 (v2): the 자료실 pages in full, and every imported post again under the v2 rules
const fixReport = { changes: [], links: [], images: [], unresolved: [] };
const v2Scratch = { changes: [], links: [], images: [], unresolved: [] }; // v2 re-renders repeat v1's report lines
const checkArtefacts = (item, html) => {
  const artefact = /.{0,60}(?:\[TABLE\]|knst\.co\.kr\/wp-content|\\\n|\*\*).{0,60}/.exec(html);
  if (artefact) throw new Error(`${item.file}: conversion left an artefact: ${artefact[0]}`);
  if (!htmlToText(html)) throw new Error(`${item.file}: empty body`);
};
const library = entries
  .filter((e) => e.kind === "seeded")
  .map((e) => {
    const item = { ...e, kind: "library", mode: "v2", slug: oldSlug(e.url), report: fixReport };
    item.html = toHtml(cleanMarkdown(item.body, item), item, ctx);
    item.excerpt = excerptOf(item.html);
    checkArtefacts(item, item.html);
    return item;
  });
for (const item of imports) {
  const v2item = { ...item, mode: "v2", report: v2Scratch };
  item.html2 = toHtml(cleanMarkdown(item.body, v2item), v2item, ctx);
  checkArtefacts(item, item.html2);
}

// images (writes public/old) → width/height on every <img>
const dims = convertImages();
const withDims = (item, html) => {
  const out = html.replace(/<img src="\/old\/([^"]+)"([^>]*)>/g, (m, name, rest) => {
    const d = dims[name];
    return d ? `<img src="/old/${name}"${rest} width="${d.width}" height="${d.height}">` : m;
  });
  if (sanitizePostHtml(out) !== out) throw new Error(`${item.file}: HTML changes when re-sanitized`);
  return out;
};
for (const item of imports) {
  item.html = withDims(item, item.html);
  item.html2 = withDims(item, item.html2);
}
for (const item of library) item.html = withDims(item, item.html);
for (const [name, src] of [...imageJobs.entries()].sort()) report.images.push(`public/old/${name} ← ${path.relative(ROOT, src)}`);

/* ───────────────────────── SQL ───────────────────────── */

const order = { notice: 0, news: 1, guide: 2, column: 3 };
imports.sort((a, b) => order[a.category] - order[b.category] || a.date.localeCompare(b.date) || a.id - b.id);

const q = (v) => (v == null ? "NULL" : `'${String(v).replace(/\u0000/g, "").replace(/'/g, "''")}'`);
const iso = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`bad date ${date}`);
  return `${date}T00:00:00.000Z`; // 09:00 KST on the original date
};

const counts = imports.reduce((acc, i) => ((acc[i.category] = (acc[i.category] ?? 0) + 1), acc), {});
const out = [
  "-- Old knst.co.kr boards → posts. GENERATED by scripts/import-old-site.mjs from docs/reference/old-site — do not edit by",
  "-- hand; change the script and re-run it. Bodies: archived Markdown → HTML through lib/sanitize.ts; images in public/old/.",
  `-- notice ${counts.notice ?? 0} · news ${counts.news ?? 0} · guide ${counts.guide ?? 0} · column ${counts.column ?? 0}. Dates are the original post dates (09:00 KST).`,
  "-- INSERT OR IGNORE: a slug that already exists (e.g. a post edited in the admin) is never overwritten. Safe to re-run.",
  "",
];
for (const i of imports) {
  const t = iso(i.date);
  const stmt =
    `INSERT OR IGNORE INTO posts (slug, title, excerpt, content_md, content_html, cover_image, category, status, source_url, published_at, created_at, updated_at) VALUES\n` +
    `  (${q(i.slug)}, ${q(i.title)}, ${q(i.excerpt)}, '', ${q(i.html)}, NULL, ${q(i.category)}, 'published', ${q(i.sourceUrl)}, ${q(t)}, ${q(t)}, ${q(t)});`;
  if (Buffer.byteLength(stmt) > D1_MAX_STATEMENT) throw new Error(`${i.file}: statement exceeds D1's 100 KB limit`);
  out.push(`-- ${i.file} (${i.url})`, stmt, "");
}
fs.writeFileSync(OUT_SQL, out.join("\n"));

/* ───────────────────────── SQL: 0008 ───────────────────────── */

const imgSrcs = (html) => [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
/** cover_image: the first body image that is big enough for a card / share image (≥ 300 px wide), else the first. */
const coverOf = (html) => {
  const imgs = [...html.matchAll(/<img src="([^"]+)"[^>]*? width="(\d+)"/g)];
  return (imgs.find((m) => Number(m[2]) >= 300) ?? imgs[0])?.[1] ?? null;
};
const seedRows = seededRows();
const seedOrder = [...seedRows.keys()];
library.sort((a, b) => seedOrder.indexOf(a.slug) - seedOrder.indexOf(b.slug));
const fix = [
  "-- Board content restore (0008). GENERATED by scripts/import-old-site.mjs (rules \"v2\") from docs/reference — do not",
  "-- edit by hand; change the script and re-run it. Bodies: archived Markdown → HTML through lib/sanitize.ts.",
  "-- 1) The 12 NST공법 자료실 rows, seeded by 0002/0004 as short summaries: old title and full old body (images, and the",
  "--    text printed inside the images where the article relies on it), excerpt = opening of the body, cover = first",
  "--    body image, source_url dropped (it pointed at the old address, which now redirects to the post). Slug, category,",
  "--    published_at unchanged.",
  "-- 2) Imported posts (0007): images the import had dropped come back; cover_image = first body image (≥ 300 px wide).",
  "-- Every UPDATE is guarded — it only matches a row that still holds exactly what 0002/0004/0007 wrote — so a post edited",
  "-- in the admin is never overwritten and re-running is a no-op. The images live in public/old/: deploy them first.",
  "",
];
const fixLog = [];
const pushFix = (label, stmt) => {
  if (Buffer.byteLength(stmt) > D1_MAX_STATEMENT) throw new Error(`0008 ${label}: statement exceeds D1's 100 KB limit`);
  fix.push(`-- ${label}`, stmt, "");
};
for (const item of library) {
  const seed = seedRows.get(item.slug);
  if (!seed) throw new Error(`${item.file}: slug ${item.slug} not seeded`);
  const imgs = imgSrcs(item.html);
  const cover = coverOf(item.html) ?? seed.cover_image;
  pushFix(
    `${item.file} (${item.url}) → /blog/${item.slug}/`,
    `UPDATE posts SET title = ${q(item.title)}, excerpt = ${q(item.excerpt)}, content_md = '', content_html = ${q(item.html)}, cover_image = ${q(cover)}, source_url = NULL, updated_at = ${q(FIX_TIME)}\n` +
      `  WHERE slug = ${q(item.slug)} AND updated_at = ${q(seed.updated_at)} AND content_md = ${q(seed.content_md)} AND content_html = ${q(seed.content_html)};`,
  );
  fixLog.push(
    `자료실 /blog/${item.slug}/  "${seed.title}" → "${item.title}"  ${htmlToText(seed.content_html).length} → ${htmlToText(item.html).length} chars, ${imgs.length} images, cover ${cover ?? "none"}`,
  );
}
for (const i of imports) {
  const before = imgSrcs(i.html);
  const after = imgSrcs(i.html2);
  const cover = coverOf(i.html2);
  const changed = i.html2 !== i.html;
  if (!changed && !cover) continue;
  const t = iso(i.date);
  const set = changed ? `content_html = ${q(i.html2)}, cover_image = ${q(cover)}, updated_at = ${q(FIX_TIME)}` : `cover_image = ${q(cover)}`;
  pushFix(
    `${i.file} → ${decodeURI(i.newPath)}`,
    `UPDATE posts SET ${set}\n  WHERE slug = ${q(i.slug)} AND updated_at = ${q(t)} AND cover_image IS NULL AND content_html = ${q(i.html)};`,
  );
  const added = after.filter((s) => !before.includes(s));
  fixLog.push(
    `[${i.category}] ${decodeURI(i.newPath)}  ${changed ? `body: ${before.length} → ${after.length} images${added.length ? ` (+ ${added.join(", ")})` : ""}${htmlToText(i.html2) !== htmlToText(i.html) ? `, text ${htmlToText(i.html).length} → ${htmlToText(i.html2).length} chars` : ""}; ` : ""}cover ${cover}`,
  );
}
fs.writeFileSync(OUT_FIX_SQL, fix.join("\n"));

// old URL → new path (for redirects)
const urlMap = {};
for (const e of entries) {
  const kept = e.kind === "seeded" ? e.newPath : (imports.find((i) => i.file === e.file)?.newPath ?? slugMap.get(oldSlug(e.url)));
  if (e.url && kept) urlMap[e.url] = kept;
}
fs.writeFileSync(OUT_MAP, `${JSON.stringify(Object.fromEntries(Object.entries(urlMap).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`);

/* ───────────────────────── report ───────────────────────── */

console.log(`wrote ${path.relative(ROOT, OUT_SQL)} — ${imports.length} posts`, counts);
console.log(`wrote ${Object.keys(dims).length} images to ${path.relative(ROOT, OUT_IMG)}/, ${Object.keys(urlMap).length} URLs to ${path.relative(ROOT, OUT_MAP)}`);
for (const [k, v] of Object.entries(report)) {
  if (!v.length) continue;
  console.log(`\n## ${k} (${v.length})`);
  for (const line of v) console.log(`- ${line}`);
}
console.log("\n## posts");
for (const i of imports) console.log(`- [${i.category}] ${i.date} ${i.newPath}  ${i.title}${i.sourceUrl ? `  ⟶ ${i.sourceUrl}` : ""}`);

console.log(`\n# ${path.relative(ROOT, OUT_FIX_SQL)} — ${fixLog.length} UPDATEs`);
for (const [k, v] of Object.entries(fixReport)) {
  if (!v.length) continue;
  console.log(`\n## 0008 ${k} (${v.length})`);
  for (const line of v) console.log(`- ${line}`);
}
console.log("\n## 0008 rows");
for (const line of fixLog) console.log(`- ${line}`);
