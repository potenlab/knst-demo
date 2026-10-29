# NST landing — design brief ("맑은 숨 / Clear Breath")

Follows the landing-page-guide-v2 skill: 11 essential elements + a bold, committed aesthetic. Stack: Next.js 16 (static export), TypeScript, Tailwind v4, shadcn/ui (customised heavily), `motion` (Framer Motion successor) optional.

## Subject
(주)엔에스티 — NST공법, a 3-step new-house-syndrome (VOC / formaldehyde) treatment. Audience: (a) Korean families moving into new apartments (often 30–50s, reading on phones), (b) regional contractors who might become 시공 partners. Page job: get a consultation call/inquiry (primary) + partner applications (secondary).

## Aesthetic direction: Organic & Editorial — "air you can see"
Fresh, airy, trustworthy-scientific, not clinical. Soft mint-air gradients and paper grain on light sections; deep pine sections for weight. Oversized serif-display Korean type breaking the grid, asymmetric compositions, overlapping photo/cards, soft rounded shapes (pills, large radii, arches), concentric "breath" rings (see `breathe` keyframe) as the one recurring graphic motif. NOT: neon, purple gradients, generic 3-column icon grids, stock-laptop imagery, default yellow stars.

## Tokens (already in app/globals.css as Tailwind theme colours)
`pine #0e3b32` (dominant ~60%) · `pine-2 #14503f` · `leaf #2f8f6b` · `mint #cdeedd` · `air #f6faf7` (page bg) · `trust #00479c` (brand blue, links/secondary) · `sunrise #ff6a2b` (ONLY primary CTAs/hot accents, ≤10%) · `ink #10231e` · `muted-ink #52665f` · `hairline #d5e4dc`.
Use as `bg-pine text-white`, `text-sunrise`, `border-hairline`, etc.
Fonts: `font-display` = Hahmlet (headlines, big numerals; weights 700–900, tight tracking -0.03em, line-height 1.1–1.2) · `font-sans` = Pretendard (body; 17–18px min on mobile 16px; line-height 1.7; `word-break: keep-all` already global) · `font-mono` = IBM Plex Mono (product codes NST-S100 etc. only; it has no Hangul — never use for Korean).
Radius: generous (`rounded-3xl`, arches `rounded-t-[999px]`). Easing: `cubic-bezier(.4,0,.2,1)`. Utilities available: `.grain` (needs `relative` parent), `.rise` (entrance anim, combine with inline `animationDelay`), `@keyframes breathe`.

## Motion
One orchestrated hero entrance (staggered `.rise`, title words 0/100/200ms, subtitle 300, CTA 500). Scroll reveals via `components/Reveal.tsx` pattern (IntersectionObserver adds `.in` to `.reveal`; you may instead use `motion`'s `whileInView`). Only transform/opacity. Count-up numbers via `components/CountUp.tsx` (renders `<dd>`). Respect `prefers-reduced-motion` (global rule exists).

## Content rules (HARD)
- Use ONLY real content: `docs/reference/README.md`, `docs/reference/content.md` and `content/knst-content.json` (written by a research agent; may appear a few minutes after you start — check for it, use it if present). Never invent customer names, reviews, ratings, certificates, numbers, dates, awards. Real facts you may use: 누적 시공 60,000건+, 전국 지점 30개+, 경력·노하우 20년(회사 이미지 표기; 설립 2009-07), 대형건설사 아파트 전세대 일괄시공 실적, 생활화학제품 안전성 합격·환경부 신고 완료, 자체생산 원스톱, 3단계 (1 NST-S200 침투·차단 → 2 NST-F100 흡착·탈취(지속제거 보조) → 3 NST-S100 분해·흡착(지속제거)) + 현장진단, 시공 후 2~3일 베이크아웃 권장, 시공 현장 방문 확인 가능/문자·카카오톡 실시간 안내.
- Contacts: T 043-222-2322 · 070-4270-7346 · F 043-222-2321 · isnst@naver.com · 청주시 흥덕구 공단로 134 세중테크노밸리 1408호 · 대표 김용득 · 사업자등록번호 301-86-03073. Online inquiry: https://knst.co.kr/contact/ (external). Partner recruitment 2026: 울산/경북/경남/부산/광주/전북/전남; 자격: 입주시장 5년 이상 경력 업체, 다품목(입주청소·줄눈·나노코팅·방충망·커튼) 종합업체, 입주박람회 참여 업체; 신청: 이메일/카카오톡 1:1/전화.
- Korean copy: plain, specific, benefit-first, verbs on buttons ("무료 상담 신청", not "제출"). Sentence-level honesty: no "100% 제거", no medical claims beyond the sources.

## Assets (all under /public/img, WebP; reference as `/img/<name>.webp`; use plain `<img>` or `next/image` with `unoptimized` — export is static)
hero (generated bright apartment interior 601×752) · proc-diagnosis, proc-s200, proc-f100, proc-s100 (900×600 painted site photos of each stage) · consult (meeting photo 1600w) · earth (dark globe network) · g-recruit (recruitment poster 900w) · g-1, g-2, g-3 (product/intro boards 16:9-ish) · logo-color (784×527 on transparent-ish white) · logo-white (actually a white-background logo; wrap in a white pill on dark) · mascot (owl 256²) · icon-onestop, icon-apartment, icon-steps, icon-inhouse, icon-safety, icon-proof (256² line icons, transparent). Originals of the big infographics: /docs/reference/assets/images (copy+convert if you need one, via PIL). Extra research assets may appear in docs/reference/assets/images-extra/.
Need a new icon/illustration/photo? Generate with the Higgsfield CLI: `higgsfield generate create gpt_image_2 --prompt "..." --aspect_ratio 1:1 --quality medium --resolution 1k --wait --json` (→ JSON, `[0].result_url` is the PNG). Match style: flat green (#1F5E4B) rounded line icons with one small mint/sunrise accent; photoreal for scenes. Remove near-white backgrounds with PIL if you need transparency, save as WebP into public/img.

## Repo rules for parallel agents
- Each agent owns ONLY the files named in its task; do not edit app/page.tsx, app/layout.tsx, app/globals.css (ask the lead via your final report if you need a token/utility added). Exception: you may add NEW keyframes/utilities in a component-local `<style>`-free way (Tailwind arbitrary values/inline style) — prefer that.
- Components: `components/<Name>.tsx`, default export, a Server Component unless it needs state/effects ("use client"). shadcn primitives live in `components/ui/*` — import and restyle via className (don't rewrite the shared ui files).
- Do NOT run `next build`/`next dev` (shared `.next`/`out`). Type-check with `npx tsc --noEmit`. The lead builds and screenshots.
- Mobile-first; ≥44px touch targets; semantic HTML (one h1 on the page — only the Hero has it); alt text; visible focus; AA contrast.
