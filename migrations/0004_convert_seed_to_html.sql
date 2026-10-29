-- Seeded columns (0002) → sanitized HTML (p, h2, blockquote, a). content_md is kept as-is (legacy fallback).
-- Guarded: only rows whose content_html is still empty AND whose content_md is still the seed text,
-- so posts already edited in the admin are never overwritten. Safe to re-run.

UPDATE posts SET content_html = '<p>포름알데히드·VOCs의 발생원과 EPA/WHO 근거, 새집증후군 관리 3가지 접근법(저방출 자재, 환기, 전문 실내공기질 관리).</p>
<h2>본문 발췌</h2>
<blockquote>
<p>가장 큰 문제는 완공 직후에만 발생하는 것이 아니라는 점입니다.</p>
</blockquote>
<blockquote>
<p>환기는 “이미 뿜어져 나온 것을 밖으로 빼내는 방법”일 뿐 자재 내부의 방출 원인 자체를 제거하지는 못하므로 한계가 존재합니다.</p>
</blockquote>
<blockquote>
<p>EPA의 연구에 따르면, 여러 유기화합물의 농도가 실외보다 실내에서 평균 2~5배 높게 나타날 수 있어 실내 관리가 훨씬 중요합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/new-house-syndrome-formaldehyde-vocs/" target="_blank" rel="noopener noreferrer">knst.co.kr/new-house-syndrome-formaldehyde-vocs/</a></p>'
  WHERE slug = 'new-house-syndrome-formaldehyde-vocs' AND content_html = '' AND content_md = '포름알데히드·VOCs의 발생원과 EPA/WHO 근거, 새집증후군 관리 3가지 접근법(저방출 자재, 환기, 전문 실내공기질 관리).

## 본문 발췌

> 가장 큰 문제는 완공 직후에만 발생하는 것이 아니라는 점입니다.

> 환기는 “이미 뿜어져 나온 것을 밖으로 빼내는 방법”일 뿐 자재 내부의 방출 원인 자체를 제거하지는 못하므로 한계가 존재합니다.

> EPA의 연구에 따르면, 여러 유기화합물의 농도가 실외보다 실내에서 평균 2~5배 높게 나타날 수 있어 실내 관리가 훨씬 중요합니다.

원문 전체 보기: [knst.co.kr/new-house-syndrome-formaldehyde-vocs/](https://knst.co.kr/new-house-syndrome-formaldehyde-vocs/)
';

UPDATE posts SET content_html = '<p>방출원 구조 안정화(S200), 24시간 자동 분해(S100), 사각지대 밀착 케어(F100)로 이어지는 3단계 공정 설명.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>방출원 구조 안정화(S200), 24시간 자동 분해(S100), 사각지대 밀착 케어(F100)로 이어지는 3단계 프리미엄 공정을 통해 시간이 지나도 쾌적한 실내공기질이 유지되도록 설계되었습니다.</p>
</blockquote>
<blockquote>
<p>빛이 없는 야간이나 저조도 환경에서는 공기 중 유해물질을 강력하게 끌어당겨 포집하고, 자연광이나 조명이 확보되면 포집된 물질을 완전히 분해하여 24시간 지속적인 관리를 실현합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/nst-method-three-step-process/" target="_blank" rel="noopener noreferrer">knst.co.kr/nst-method-three-step-process/</a></p>'
  WHERE slug = 'nst-method-three-step-process' AND content_html = '' AND content_md = '방출원 구조 안정화(S200), 24시간 자동 분해(S100), 사각지대 밀착 케어(F100)로 이어지는 3단계 공정 설명.

## 본문 발췌

> 방출원 구조 안정화(S200), 24시간 자동 분해(S100), 사각지대 밀착 케어(F100)로 이어지는 3단계 프리미엄 공정을 통해 시간이 지나도 쾌적한 실내공기질이 유지되도록 설계되었습니다.

> 빛이 없는 야간이나 저조도 환경에서는 공기 중 유해물질을 강력하게 끌어당겨 포집하고, 자연광이나 조명이 확보되면 포집된 물질을 완전히 분해하여 24시간 지속적인 관리를 실현합니다.

원문 전체 보기: [knst.co.kr/nst-method-three-step-process/](https://knst.co.kr/nst-method-three-step-process/)
';

UPDATE posts SET content_html = '<p>대형 건설사 전세대 시공 실적, 공인시험성적서, 방출원 직접 작용, 24시간 순환 기술, 사각지대 케어, 인체·자재 안전성, 지속형 관리 등 7가지 선택 기준.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>현장에서 순간적으로 보여주는 간이측정기 숫자 퍼포먼스에 현혹되지 마세요.</p>
</blockquote>
<blockquote>
<p>오존 시공이나 피톤치드 살포처럼 며칠 만에 효과가 날아가는 단발성 시공을 피하세요.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/new-house-syndrome-contractor-checklist/" target="_blank" rel="noopener noreferrer">knst.co.kr/new-house-syndrome-contractor-checklist/</a></p>'
  WHERE slug = 'new-house-syndrome-contractor-checklist' AND content_html = '' AND content_md = '대형 건설사 전세대 시공 실적, 공인시험성적서, 방출원 직접 작용, 24시간 순환 기술, 사각지대 케어, 인체·자재 안전성, 지속형 관리 등 7가지 선택 기준.

## 본문 발췌

> 현장에서 순간적으로 보여주는 간이측정기 숫자 퍼포먼스에 현혹되지 마세요.

> 오존 시공이나 피톤치드 살포처럼 며칠 만에 효과가 날아가는 단발성 시공을 피하세요.

원문 전체 보기: [knst.co.kr/new-house-syndrome-contractor-checklist/](https://knst.co.kr/new-house-syndrome-contractor-checklist/)
';

UPDATE posts SET content_html = '<p>공인시험성적서(KOLAS)와 간이측정 결과의 신뢰도·목적 차이를 표로 비교하고 NST가 성적서 중심으로 설명하는 이유를 제시.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>공인시험성적서 = 공식 검증 자료 간이측정 결과 = 현장 참고용 수치</p>
</blockquote>
<blockquote>
<p>“새집증후군은 측정기 숫자 쇼가 아니라, 실내 오염물질 발생원을 관리하는 공정입니다.”</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/test-report-verification/" target="_blank" rel="noopener noreferrer">knst.co.kr/test-report-verification/</a></p>'
  WHERE slug = 'test-report-verification' AND content_html = '' AND content_md = '공인시험성적서(KOLAS)와 간이측정 결과의 신뢰도·목적 차이를 표로 비교하고 NST가 성적서 중심으로 설명하는 이유를 제시.

## 본문 발췌

> 공인시험성적서 = 공식 검증 자료 간이측정 결과 = 현장 참고용 수치

> “새집증후군은 측정기 숫자 쇼가 아니라, 실내 오염물질 발생원을 관리하는 공정입니다.”

원문 전체 보기: [knst.co.kr/test-report-verification/](https://knst.co.kr/test-report-verification/)
';

UPDATE posts SET content_html = '<p>환경대상 수상, 환경부 안전기준 적합확인 및 안전확인대상생활화학제품 신고, 대형 건설사 전세대 시공 실적, KCL 성적서 수치 요약.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>국가 포상 2025 대한민국환경대상 ‘환경제품 부문’ 본상 수상 (환경부 등 정부기관 후원, 기술 효과성 검증)</p>
</blockquote>
<blockquote>
<p>공식 인증 환경부 주관 안전기준 적합확인 및 안전확인대상생활화학제품 신고 완료</p>
</blockquote>
<blockquote>
<p>시공 실적 대형 건설사 전 세대 직접 일괄 시공 최다 실적 (유성 1,018세대, 세종 955세대 등)</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/nst-evidence/" target="_blank" rel="noopener noreferrer">knst.co.kr/nst-evidence/</a></p>'
  WHERE slug = 'nst-evidence' AND content_html = '' AND content_md = '환경대상 수상, 환경부 안전기준 적합확인 및 안전확인대상생활화학제품 신고, 대형 건설사 전세대 시공 실적, KCL 성적서 수치 요약.

## 본문 발췌

> 국가 포상 2025 대한민국환경대상 ‘환경제품 부문’ 본상 수상 (환경부 등 정부기관 후원, 기술 효과성 검증)

> 공식 인증 환경부 주관 안전기준 적합확인 및 안전확인대상생활화학제품 신고 완료

> 시공 실적 대형 건설사 전 세대 직접 일괄 시공 최다 실적 (유성 1,018세대, 세종 955세대 등)

원문 전체 보기: [knst.co.kr/nst-evidence/](https://knst.co.kr/nst-evidence/)
';

UPDATE posts SET content_html = '<p>서울시 신축 공동주택 50개 단지(345세대) 연구 결과를 인용, 베이크아웃의 효과와 저온 환경에서의 한계, NST 병행 필요성 설명.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>’33℃ 이상 8시간 유지 후 2시간 환기’를 3회 반복했을 때 VOCs 평균 47.4%, 포름알데히드 34.7% 감소 효과가 있었습니다.</p>
</blockquote>
<blockquote>
<p>새집증후군 유발물질은 입주 후에도 짧게는 수개월, 길게는 수년간 지속적으로 방출됩니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/bakeout-effect-limit/" target="_blank" rel="noopener noreferrer">knst.co.kr/bakeout-effect-limit/</a></p>'
  WHERE slug = 'bakeout-effect-limit' AND content_html = '' AND content_md = '서울시 신축 공동주택 50개 단지(345세대) 연구 결과를 인용, 베이크아웃의 효과와 저온 환경에서의 한계, NST 병행 필요성 설명.

## 본문 발췌

> ’33℃ 이상 8시간 유지 후 2시간 환기’를 3회 반복했을 때 VOCs 평균 47.4%, 포름알데히드 34.7% 감소 효과가 있었습니다.

> 새집증후군 유발물질은 입주 후에도 짧게는 수개월, 길게는 수년간 지속적으로 방출됩니다.

원문 전체 보기: [knst.co.kr/bakeout-effect-limit/](https://knst.co.kr/bakeout-effect-limit/)
';

UPDATE posts SET content_html = '<p>대한환경보건학회 2024 연구 인용, 계절·구조에 따른 방출 가속, 입주청소의 한계, S100/S200/F100 조합 해법.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>입주청소는 표면의 먼지, 얼룩, 분진을 닦아내는 과정일 뿐입니다.</p>
</blockquote>
<blockquote>
<p>지속적으로 나오는 오염물질은 지속적으로 제거해야 합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/new-furniture-built-in-odor/" target="_blank" rel="noopener noreferrer">knst.co.kr/new-furniture-built-in-odor/</a></p>'
  WHERE slug = 'new-furniture-built-in-odor' AND content_html = '' AND content_md = '대한환경보건학회 2024 연구 인용, 계절·구조에 따른 방출 가속, 입주청소의 한계, S100/S200/F100 조합 해법.

## 본문 발췌

> 입주청소는 표면의 먼지, 얼룩, 분진을 닦아내는 과정일 뿐입니다.

> 지속적으로 나오는 오염물질은 지속적으로 제거해야 합니다.

원문 전체 보기: [knst.co.kr/new-furniture-built-in-odor/](https://knst.co.kr/new-furniture-built-in-odor/)
';

UPDATE posts SET content_html = '<p>물리적 입자(먼지)와 화학적 오염(포름알데히드·VOCs)의 차이, 입주청소와 공기질 시공의 역할 구분.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>따라서 입주청소는 새집증후군 시공이 될 수 없습니다.</p>
</blockquote>
<blockquote>
<p>물리적 청소가 끝났다면 화학적 정화가 필요합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/move-in-cleaning-vs-air-quality/" target="_blank" rel="noopener noreferrer">knst.co.kr/move-in-cleaning-vs-air-quality/</a></p>'
  WHERE slug = 'move-in-cleaning-vs-air-quality' AND content_html = '' AND content_md = '물리적 입자(먼지)와 화학적 오염(포름알데히드·VOCs)의 차이, 입주청소와 공기질 시공의 역할 구분.

## 본문 발췌

> 따라서 입주청소는 새집증후군 시공이 될 수 없습니다.

> 물리적 청소가 끝났다면 화학적 정화가 필요합니다.

원문 전체 보기: [knst.co.kr/move-in-cleaning-vs-air-quality/](https://knst.co.kr/move-in-cleaning-vs-air-quality/)
';

UPDATE posts SET content_html = '<p>사전 업체 검증, 샘플 세대 테스트, 현장 QC, 대량 시공 수행 능력, 민원 리스크 등 5가지 관문과 1,018세대 일괄시공 달성.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>전 세대 시공은 기술력만으로는 불가능합니다. 신뢰성, 안전성, 품질관리, 현장 수행 능력이 모두 검증된 기업만이 가능합니다.</p>
</blockquote>
<blockquote>
<p>🏆 대형건설사 1,018세대 전 세대 일괄 시공 달성</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/large-scale-project-track-record/" target="_blank" rel="noopener noreferrer">knst.co.kr/large-scale-project-track-record/</a></p>'
  WHERE slug = 'large-scale-project-track-record' AND content_html = '' AND content_md = '사전 업체 검증, 샘플 세대 테스트, 현장 QC, 대량 시공 수행 능력, 민원 리스크 등 5가지 관문과 1,018세대 일괄시공 달성.

## 본문 발췌

> 전 세대 시공은 기술력만으로는 불가능합니다. 신뢰성, 안전성, 품질관리, 현장 수행 능력이 모두 검증된 기업만이 가능합니다.

> 🏆 대형건설사 1,018세대 전 세대 일괄 시공 달성

원문 전체 보기: [knst.co.kr/large-scale-project-track-record/](https://knst.co.kr/large-scale-project-track-record/)
';

UPDATE posts SET content_html = '<p>서랍·선반 분리 후 코팅되지 않은 노출 목재 단면에 S200을 도포해 방출 통로를 차단하는 공정과 현장 시공 갤러리.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>서랍과 선반을 분리한 후, 코팅되지 않은 노출된 목재 단면에 S200을 도포하여 유해물질 방출 통로를 차단하고 구조를 안정화함으로써 포름알데히드 발생을 효과적으로 억제합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/nst-s200-source-stabilization/" target="_blank" rel="noopener noreferrer">knst.co.kr/nst-s200-source-stabilization/</a></p>'
  WHERE slug = 'nst-s200-source-stabilization' AND content_html = '' AND content_md = '서랍·선반 분리 후 코팅되지 않은 노출 목재 단면에 S200을 도포해 방출 통로를 차단하는 공정과 현장 시공 갤러리.

## 본문 발췌

> 서랍과 선반을 분리한 후, 코팅되지 않은 노출된 목재 단면에 S200을 도포하여 유해물질 방출 통로를 차단하고 구조를 안정화함으로써 포름알데히드 발생을 효과적으로 억제합니다.

원문 전체 보기: [knst.co.kr/nst-s200-source-stabilization/](https://knst.co.kr/nst-s200-source-stabilization/)
';

UPDATE posts SET content_html = '<p>빛이 부족한 환경에서도 활성화되는 듀얼촉매로 벽지·마루 등 넓은 면적을 지속 관리.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>하이앤드 듀얼촉매는 빛이 부족한 실내 환경에서도 활성화되어 벽지, 마루 등 넓은 면적에서 지속적으로 유해물질을 분해하고 관리합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/nst-s100-dual-catalyst/" target="_blank" rel="noopener noreferrer">knst.co.kr/nst-s100-dual-catalyst/</a></p>'
  WHERE slug = 'nst-s100-dual-catalyst' AND content_html = '' AND content_md = '빛이 부족한 환경에서도 활성화되는 듀얼촉매로 벽지·마루 등 넓은 면적을 지속 관리.

## 본문 발췌

> 하이앤드 듀얼촉매는 빛이 부족한 실내 환경에서도 활성화되어 벽지, 마루 등 넓은 면적에서 지속적으로 유해물질을 분해하고 관리합니다.

원문 전체 보기: [knst.co.kr/nst-s100-dual-catalyst/](https://knst.co.kr/nst-s100-dual-catalyst/)
';

UPDATE posts SET content_html = '<p>신발장·붙박이장·싱크대 등 밀폐 수납 공간 내부 사각지대 보완 관리 제품.</p>
<h2>본문 발췌</h2>
<blockquote>
<p>빛이나 공기 순환이 부족하여 유해물질이 정체되기 쉬운 신발장, 붙박이장, 싱크대 등 밀폐된 수납 공간 내부에 적용되어 사각지대의 공기질을 효과적으로 보완 관리합니다.</p>
</blockquote>
<p>원문 전체 보기: <a href="https://knst.co.kr/nst-f100-blind-spot-care/" target="_blank" rel="noopener noreferrer">knst.co.kr/nst-f100-blind-spot-care/</a></p>'
  WHERE slug = 'nst-f100-blind-spot-care' AND content_html = '' AND content_md = '신발장·붙박이장·싱크대 등 밀폐 수납 공간 내부 사각지대 보완 관리 제품.

## 본문 발췌

> 빛이나 공기 순환이 부족하여 유해물질이 정체되기 쉬운 신발장, 붙박이장, 싱크대 등 밀폐된 수납 공간 내부에 적용되어 사각지대의 공기질을 효과적으로 보완 관리합니다.

원문 전체 보기: [knst.co.kr/nst-f100-blind-spot-care/](https://knst.co.kr/nst-f100-blind-spot-care/)
';
