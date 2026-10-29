# knst.co.kr 구 사이트 아카이브 인벤토리

수집 방법: 구 서버(220.73.160.10) 직접 조회, WordPress REST API + 홈페이지/게시판 HTML. 수집일 2026-10-28.

## 개수 요약
- 페이지(wp/v2/pages): 39
- 블로그 글(wp/v2/posts): 30 (카테고리 7개)
- 공지사항(KBoard nst-notice): 19건 (uid 1-18, 20; uid 19는 없음, uid 21 이상 없음)
- 언론동향(news CPT): 3건 (/nst-news/ 는 이 CPT를 보여주는 페이지; KBoard 목록은 비어 있음)
- 제품(products CPT): 3건 (NST-S100, S200, F100)
- 개인정보처리방침(terms_page): 1건
- section_slide(홈 슬라이드, 본문 없음): 4건
- 미디어 라이브러리: 633 (JPEG 444, PNG 136, SVG 31, WebP 10, mp4 5, woff 5; REST 헤더 기준 총 633)
- content/ 파일: 99개

## 카테고리 (wp/v2/categories)
| ID | 이름 | 글 수 |
|---|---|---|
| 1 | 미분류 | 3 |
| 29 | NST공법 칼럼 | 12 |
| 33 | 실내공기질 전문 가이드 | 13 |
| 34 | 기술 검증 및 팩트체크 | 2 |
| 36 | 새집증후군 솔루션 | 1 |
| 42 | 시공 실적 및 포트폴리오 | 1 |
| 46 | NST 3단계 공법 해설 | 1 |

## 내비게이션 구조 (홈페이지 HTML)
- 회사소개: 인사말(/about-nst/), 비전(/our-vision/), 연혁(/history/), 오시는 길(/directions/)
- 제품현황(/our-products/) -> 상세: /products/nst-s100/, /products/nst-s200/, /products/nst-f100/
- 기술현황(/technology-overview/)
- 시공업체(/business-partner/)
- 공지사항(/nst-notice/) KBoard 게시판 (목록 ?pageid=N&mod=list, 상세 ?mod=document&uid=N)
- 언론동향(/nst-news/) -> /news/뉴스-01/, 뉴스-02, 엔에스티-2025-대한민국환경대상-수상
- NST공법 칼럼(/category/nst-columns/) -> 블로그 글 (엔에스티연구소 1~11호 칼럼 등)
- 고객지원: 자주묻는질문(/faq/), 문의하기(/contact/), NST공법 자료실(nav 하위: 아래 12개 페이지)
  - 베이크아웃의 효과와 한계, 새 가구·붙박이장에서 냄새가 오래 나는 이유, 입주청소와 새집증후군 실내공기질 관리의 차이, 새집증후군이란? 포름알데히드와 VOCs가 발생하는 이유, 새집증후군 시공업체 선택 체크리스트 7가지, NST공법이란? 3단계 시공 원리, NST-S200 / NST-S100 / NST-F100 상세, 공인시험성적서와 간이측정 결과의 차이, NST공법 공식 증빙 허브, 대단지·건설사·공공기관 시공 실적이 중요한 이유
- 푸터: 개인정보처리방침(/terms_page/privacy-policy/), 외부 블로그 https://blog.naver.com/nst-pro

## 공지사항 (KBoard)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| 2025 (주)엔에스티 NST공법 시공 "신규 사업자" 모집 | https://knst.co.kr/nst-notice/?mod=document&uid=1 | notice(공지사항) | 2025-10-03 | 공지사항 | content/notice-01.md | ﻿(주)엔에스티는 새집증후군 개선 전문회사로 20년 노하우가 집약된 새집증후군 개선 시공 방법인 NST공법을 개발한 회사입니다. |
| 'NST새지비', 새집증후군 개선 전문업체 (주)엔에스티의 NST공법 공식 홍보대사로 탄생하다! | https://knst.co.kr/nst-notice/?mod=document&uid=2 | notice(공지사항) | 2025-10-03 | 공지사항 | content/notice-02.md | 안녕하세요. (주)엔에스티입니다. 오늘은 특별한 소식을 전해드립니다. |
| [NST공법] ㈜엔에스티 "경축", 환경부 후원 「2025 대한민국환경대상」 환경제품 부문 수상! | https://knst.co.kr/nst-notice/?mod=document&uid=3 | notice(공지사항) | 2025-10-03 | 공지사항 | content/notice-03.md | ﻿새집증후군 예방 업체 중 유일하게 건설사 전세대(100세대 이상) 시공 실적을 보유한 ㈜엔에스티가 지난 7.18 여의도 국회의사당에서 환경부가 후원하는 「2025 대한민국 환경대상」 환경제품 부문 |
| [공식]새집증후군 개선 NST공법 시공업체 알림 | https://knst.co.kr/nst-notice/?mod=document&uid=4 | notice(공지사항) | 2025-10-10 | 공지사항 | content/notice-04.md | 이번에 홈페이지를 리뉴얼 하면서 NST공법 시공 업체 현황을 업데이트 하였기에 알려드립니다 |
| [공지]입주시장 전문업체 '청소남자 C&M' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=5 | notice(공지사항) | 2025-10-28 | 공지사항 | content/notice-05.md | 홈케어 전문 ‘청소남자C&M’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '하이엔드 그린' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=6 | notice(공지사항) | 2025-11-12 | 공지사항 | content/notice-06.md | 홈케어 전문 ‘하이엔드 그린’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '온케어 홈케어' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=7 | notice(공지사항) | 2025-11-20 | 공지사항 | content/notice-07.md | 홈케어 전문 ‘온케어 홈케어’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '향기로운집' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=8 | notice(공지사항) | 2026-01-08 | 공지사항 | content/notice-08.md | 홈케어 전문 ‘향기로운집’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '부부클린' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=9 | notice(공지사항) | 2026-01-08 | 공지사항 | content/notice-09.md | 홈케어 전문 ‘부부클린’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '아이보 홈케어' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=10 | notice(공지사항) | 2026-01-15 | 공지사항 | content/notice-10.md | 홈케어 전문 ‘아이보 홈케어’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '우리환경' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=11 | notice(공지사항) | 2026-01-17 | 공지사항 | content/notice-11.md | 홈케어 전문 ‘우리환경’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '피코' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=12 | notice(공지사항) | 2026-01-17 | 공지사항 | content/notice-12.md | 동 계약으로 새집증후군 개선 서비스를 제공하게 됩니다. |
| [공지]입주시장 전문업체 '깔끔한삼형제' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=13 | notice(공지사항) | 2026-01-23 | 공지사항 | content/notice-13.md | 홈케어 전문 ‘깔끔한삼형제’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '신성클린' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=14 | notice(공지사항) | 2026-03-23 | 공지사항 | content/notice-14.md | 홈케어 전문 ‘신성클린’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '숨 홈케어' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=15 | notice(공지사항) | 2026-04-23 | 공지사항 | content/notice-15.md | 홈케어 전문 ‘숨 홈케어’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '까사홈케어' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=16 | notice(공지사항) | 2026-05-08 | 공지사항 | content/notice-16.md | 홈케어 전문 ‘까사홈케어’와 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '클린랩' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=17 | notice(공지사항) | 2026-07-19 | 공지사항 | content/notice-17.md | 홈케어 전문 ‘클린랩’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '늘미소크린' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=18 | notice(공지사항) | 2026-08-11 | 공지사항 | content/notice-18.md | 홈케어 전문 ‘늘미소크린’과 계약을 체결하였습니다. |
| [공지]입주시장 전문업체 '에이앤솔루션' 계약 체결 | https://knst.co.kr/nst-notice/?mod=document&uid=20 | notice(공지사항) | 2026-10-18 | 공지사항 | content/notice-20.md | 홈케어 전문 ‘에이앤솔루션’과 계약을 체결하였습니다. |
## 언론동향 (news CPT)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| ㈜엔에스티, 새집증후군 개선 전문기술 NST공법 ‘하이앤드 듀얼’ 신제품 3종 출시 | https://knst.co.kr/news/%eb%89%b4%ec%8a%a4-01/ | news(언론동향) | 2026-01-28 | news(언론동향) | content/news-163-뉴스-01.md | □  ㈜엔에스티는 대형건설사 아파트 전세대 일괄시공(1,018세대 외 다수)으로 검증한 노하우를 바탕으로 NST공법 전용 ‘하이앤드 듀얼’ 신제품 3종을 출시했다. |
| 엔에스티, 전국 신규사업자 모집 본격화… NST공법 홍보대사 ‘새지비’ 런칭 | https://knst.co.kr/news/%eb%89%b4%ec%8a%a4-02/ | news(언론동향) | 2025-09-16 | news(언론동향) | content/news-165-뉴스-02.md | 새집증후군 개선 전문기업 엔에스티가 전국 신규사업자 모집에 본격적으로 나섰다. 20년간의 노하우를 집약한 기술 NST공법의 리뉴얼 신제품을 지난 8월에 출시한 데 이어 사업 확대 일환으로 신규사업자 |
| (주)엔에스티, ‘2025 대한민국환경대상’ 환경제품 부문 본상 수상 | https://knst.co.kr/news/%ec%97%94%ec%97%90%ec%8a%a4%ed%8b%b0-2025-%eb%8c%80%ed%95%9c%eb%af%bc%ea%b5%ad%ed%99%98%ea%b2%bd%eb%8c%80%ec%83%81-%ec%88%98%ec%83%81/ | news(언론동향) | 2025-07-21 | news(언론동향) | content/news-434-엔에스티-2025-대한민국환경대상-수상.md | 새집증후군 예방 및 실내공기질 개선 제품을 개발·시공하는 전문기업인 ㈜엔에스티(대표 김용득)는 지난 18일, 국회의사당 국회헌정기념관에서 개최된 ‘2025 대한민국환경대상’ 시상식에서 ‘환경제품 부 |
## 제품 (products CPT)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| NST-S100 | https://knst.co.kr/products/nst-s100/ | product(제품) | 2024-09-17 | product(제품) | content/product-313-nst-s100.md | – NSTS100 공기 중의 유해물질을 끌어당기고(흡착) 제거(분해)하는 광촉매 기반 투명 코팅제입니다. |
| NST-S200 | https://knst.co.kr/products/nst-s200/ | product(제품) | 2024-09-17 | product(제품) | content/product-324-nst-s200.md | □ 원인을 해결해 시공 후 깨끗함이 계속됩니다. |
| NST-F100 | https://knst.co.kr/products/nst-f100/ | product(제품) | 2024-09-17 | product(제품) | content/product-325-nst-f100.md | □ 시공 완성도를 높이고 솔(숲)향을 조성합니다. |
## 페이지 (pages)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| 새집증후군 원인 완벽 분석: 포름알데히드·VOCs·자재별 유해물질｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%9b%90%ec%9d%b8/ | page | 2026-09-07 | (page) | content/page-5538-새집증후군-원인.md | 새집증후군 원인 완벽 분석: 포름알데히드·VOCs·자재별 유해물질｜NST공법 |
| 아파트 새집냄새 제거, 입주 전 반드시 알아야 할 것｜NST공법 | https://knst.co.kr/%ec%95%84%ed%8c%8c%ed%8a%b8-%ec%83%88%ec%a7%91%eb%83%84%ec%83%88-%ec%a0%9c%ea%b1%b0/ | page | 2026-09-07 | (page) | content/page-5537-아파트-새집냄새-제거.md | 아파트 새집냄새 제거, 입주 전 반드시 알아야 할 것｜NST공법 |
| 새집증후군 증상 체크리스트: 두통·기침·눈따가움｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%a6%9d%ec%83%81/ | page | 2026-09-07 | (page) | content/page-5536-새집증후군-증상.md | 새집증후군 증상 체크리스트: 두통·기침·눈따가움｜NST공법 |
| 새집증후군 베이크아웃, 효과와 한계를 정확히 알자｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%eb%b2%a0%ec%9d%b4%ed%81%ac%ec%95%84%ec%9b%83/ | page | 2026-09-07 | (page) | content/page-5535-새집증후군-베이크아웃.md | 새집증후군 베이크아웃, 효과와 한계를 정확히 알자｜NST공법 |
| 포름알데히드 제거, 환기만으로 안 되는 과학적 이유｜NST공법 | https://knst.co.kr/%ed%8f%ac%eb%a6%84%ec%95%8c%eb%8d%b0%ed%9e%88%eb%93%9c-%ec%a0%9c%ea%b1%b0/ | page | 2026-09-07 | (page) | content/page-5534-포름알데히드-제거.md | 포름알데히드 제거, 환기만으로 안 되는 과학적 이유｜NST공법 |
| 새집증후군 측정 방법과 공인시험성적서의 중요성｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%b8%a1%ec%a0%95/ | page | 2026-09-07 | (page) | content/page-5533-새집증후군-측정.md | 새집증후군 측정 방법과 공인시험성적서의 중요성｜NST공법 |
| 새집증후군 업체 고를 때 반드시 확인할 7가지｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%97%85%ec%b2%b4-%ec%84%a0%ed%83%9d/ | page | 2026-09-07 | (page) | content/page-5532-새집증후군-업체-선택.md | 새집증후군 업체 고를 때 반드시 확인할 7가지｜NST공법 |
| 새집증후군 시공이란? 전문 시공의 원리와 효과｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%8b%9c%ea%b3%b5/ | page | 2026-09-07 | (page) | content/page-5531-새집증후군-시공.md | 새집증후군 시공이란? 전문 시공의 원리와 효과｜NST공법 |
| 새집증후군 제거, 진짜 효과 있는 방법 총정리｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%a0%9c%ea%b1%b0-%eb%b0%a9%eb%b2%95/ | page | 2026-09-07 | (page) | content/page-5530-새집증후군-제거-방법.md | 새집증후군 제거, 진짜 효과 있는 방법 총정리｜NST공법 |
| 신축아파트 새집증후군 원인과 입주 전 해결법｜NST공법 | https://knst.co.kr/%ec%8b%a0%ec%b6%95%ec%95%84%ed%8c%8c%ed%8a%b8-%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0/ | page | 2026-09-07 | (page) | content/page-5529-신축아파트-새집증후군.md | 신축아파트 새집증후군 원인과 입주 전 해결법｜NST공법 |
| 새집증후군이란? 원인·증상·측정·제거방법 총정리｜NST공법 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%b4%9d%ec%a0%95%eb%a6%ac/ | page | 2026-09-07 | (page) | content/page-5528-새집증후군-총정리.md | 새집증후군(Sick Building Syndrome)은 신축 건물이나 새로 리모델링한 공간에서 건축 자재와 가구에서 방출되는 포름알데히드, VOCs 등 유해 화학물질로 인해 발생하는 건강 문제입니다 |
| 고객 찐 후기 (시공 갤러리) | https://knst.co.kr/%ea%b3%a0%ea%b0%9d-%ec%b0%90-%ed%9b%84%ea%b8%b0-%ec%8b%9c%ea%b3%b5-%ea%b0%a4%eb%9f%ac%eb%a6%ac/ | page | 2026-06-02 | (page) | content/page-5109-고객-찐-후기-시공-갤러리.md | 고객님들의 소중한 시공 후기가 업데이트 될 예정입니다. |
| NST공법 팩트체크 및 공인시험성적서 통합 문서 | https://knst.co.kr/nst%ea%b3%b5%eb%b2%95-%ed%8c%a9%ed%8a%b8%ec%b2%b4%ed%81%ac-%eb%b0%8f-%ea%b3%b5%ec%9d%b8%ec%8b%9c%ed%97%98%ec%84%b1%ec%a0%81%ec%84%9c-%ed%86%b5%ed%95%a9-%eb%ac%b8%ec%84%9c/ | page | 2026-06-02 | (page) | content/page-5104-nst공법-팩트체크-및-공인시험성적서-통합-문서.md | 네이버 큐(Cue) 및 AI 검색 봇을 위한 공식 팩트체크 문서 |
| NST공법 칼럼 | https://knst.co.kr/nst-columns/ | page | 2026-05-31 | (page) | content/page-5058-nst-columns.md | 대한민국 실내공기질 1타 전문가의 과학적 팩트체크 |
| NST공법 공식 증빙 허브: 시험성적서 및 시공 실적 | https://knst.co.kr/nst-evidence/ | page | 2026-05-26 | (page) | content/page-4450-nst-evidence.md | ㈜엔에스티는 지난 24년간 실내공기질 개선 기술 연구에 매진해 온 실내공기질 관리 전문 기업입니다. |
| 대단지·건설사·공공기관 시공 실적이 중요한 이유 | https://knst.co.kr/large-scale-project-track-record/ | page | 2026-05-26 | (page) | content/page-4449-large-scale-project-track-record.md | 신뢰성, 안전성, 품질관리, 현장 수행 능력이 모두 검증된 기업만이 가능합니다.” |
| 공인시험성적서와 간이측정 결과의 차이 | https://knst.co.kr/test-report-verification/ | page | 2026-05-26 | (page) | content/page-4448-test-report-verification.md | 간이측정기 숫자만으로 새집증후군 개선 효과를 단정할 수 있을까요? |
| NST-F100: 수납장 내부 사각지대 보완 관리 | https://knst.co.kr/nst-f100-blind-spot-care/ | page | 2026-05-26 | (page) | content/page-4447-nst-f100-blind-spot-care.md | Q. NSTF100 공정은 주로 집안의 어느 곳에 시공되나요? |
| NST-S100: 생활공간 지속케어용 하이앤드 듀얼촉매 | https://knst.co.kr/nst-s100-dual-catalyst/ | page | 2026-05-26 | (page) | content/page-4446-nst-s100-dual-catalyst.md | Q. NSTS100 하이앤드 듀얼촉매는 일반 제품과 어떤 차이가 있나요? |
| NST-S200: 가구·목재 방출원 구조 안정화 공정 | https://knst.co.kr/nst-s200-source-stabilization/ | page | 2026-05-26 | (page) | content/page-4445-nst-s200-source-stabilization.md | Q. NSTS200 공정은 가구에서 나오는 유해물질을 어떻게 제어하나요? |
| NST공법이란? 3단계 시공 원리 | https://knst.co.kr/nst-method-three-step-process/ | page | 2026-05-26 | (page) | content/page-4444-nst-method-three-step-process.md | 대형 건설사 전세대 시공으로 검증된 NST공법의 ‘하이앤드 듀얼’ 3단계 시스템은 무엇인가요? |
| 새집증후군 시공업체 선택 체크리스트 7가지 | https://knst.co.kr/new-house-syndrome-contractor-checklist/ | page | 2026-05-26 | (page) | content/page-4443-new-house-syndrome-contractor-checklist.md | 믿을 수 있는 새집증후군 실내공기질 관리 시공업체를 고르는 절대 기준은 무엇인가요? |
| 베이크아웃의 효과와 한계 | https://knst.co.kr/bakeout-effect-limit/ | page | 2026-05-26 | (page) | content/page-4442-bakeout-effect-limit.md | 난방을 강하게 트는 ‘베이크아웃’만으로 새집증후군 관리가 충분할까요? |
| 새 가구·붙박이장에서 냄새가 오래 나는 이유 | https://knst.co.kr/new-furniture-built-in-odor/ | page | 2026-05-26 | (page) | content/page-4441-new-furniture-built-in-odor.md | 새로 설치한 붙박이장과 가구에서 눈이 따갑고 냄새가 계속 나는 이유는 무엇인가요? |
| 입주청소와 새집증후군 실내공기질 관리의 차이 | https://knst.co.kr/move-in-cleaning-vs-air-quality/ | page | 2026-05-26 | (page) | content/page-4439-move-in-cleaning-vs-air-quality.md | 입주청소나 공기청정기만으로 새집증후군 문제가 완벽히 해결될까요? |
| 새집증후군이란? 포름알데히드와 VOCs가 발생하는 이유 | https://knst.co.kr/new-house-syndrome-formaldehyde-vocs/ | page | 2026-05-26 | (page) | content/page-4438-new-house-syndrome-formaldehyde-vocs.md | 새집 냄새의 진짜 원인인 포름알데히드와 VOCs는 무엇인가요? |
| Home | https://knst.co.kr/ | page | 2024-09-28 | (page) | content/page-1227-practice-2.md | NST공법 공식홈페이지  새집증후군 개선 시공 전문 기술 |
| 인사말 | https://knst.co.kr/about-nst/ | page | 2024-09-16 | (page) | content/page-204-about-nst.md | 건강한 공간은 선택이 아니라 이제는 필수입니다. |
| 비전 | https://knst.co.kr/our-vision/ | page | 2025-06-26 | (page) | content/page-3183-our-vision.md | 연구개발·제조·판매·시공을 직접하는 '통합솔루션 기업' |
| 연혁 | https://knst.co.kr/history/ | page | 2024-09-16 | (page) | content/page-273-history.md | ㈜엔에스티는 자연과 과학기술(Natural Science&Technology)을 융합하여 건강한 실내공간을 만드는 기업입니다. |
| 오시는 길 | https://knst.co.kr/directions/ | page | 2024-09-16 | (page) | content/page-225-directions.md | 충북 청주시 흥덕구 공단로 134 세중테크노밸리 1408호 |
| 기술현황 | https://knst.co.kr/technology-overview/ | page | 2025-06-11 | (page) | content/page-1604-technology-overview.md | 지속관리 기술로 유해물질 발생 구조를 안정화 하는 '하이앤드 듀얼' 기술입니다. |
| 시공업체 | https://knst.co.kr/business-partner/ | page | 2024-09-16 | (page) | content/page-237-business-partner.md | [소재지] 서울 도봉구 ㅣ [연락처] 01022245366 |
| 제품현황 | https://knst.co.kr/our-products/ | page | 2024-09-17 | (page) | content/page-303-our-products.md | ※제품을 클릭하시면 상세설명을 보실 수 있습니다. |
| NST공법 칼럼 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%b9%bc%eb%9f%bc/ | page | 2026-05-31 | (page) | content/page-5065-새집증후군-칼럼.md | 왜? 새집증후군 예방을 위해서 NST공법 시공이 필요하다고 하는 것일까요? |
| 공지사항 | https://knst.co.kr/nst-notice/ | page | 2024-09-17 | (page) | content/page-409-nst-notice.md | 왜? 새집증후군 예방을 위해서 NST공법 시공이 필요하다고 하는 것일까요? |
| 뉴스 | https://knst.co.kr/nst-news/ | page | 2024-09-17 | (page) | content/page-419-nst-news.md | (주)엔에스티 ˙ 새집증후군 ˙ 실내공기질 ˙ 환경 등 관련 기사를 확인해 보세요 |
| 자주묻는질문 | https://knst.co.kr/faq/ | page | 2024-09-17 | (page) | content/page-403-faq.md | NST공법은 실내 공간에서 이미 발생했거나 앞으로 방출될 수 있는 유해물질을 단계적으로 제거하는 흡착 → 분해 → 차단하는 3단계 과정을 통해 안전하고 건강한 주거환경을 실현합니다. |
| 문의하기 | https://knst.co.kr/contact/ | page | 2024-09-17 | (page) | content/page-334-contact.md | 고객님, 새집증후군 예방 하실 준비가 되셨나요? |
## 블로그 글 (posts)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| [엔에스티연구소 11호 칼럼] 어느덧 11호 칼럼, 새집증후군 연구 외길 18년의 진솔한 이야기 | https://knst.co.kr/nst-method-18-years-factcheck-history/ | post | 2026-07-31 | NST공법 칼럼 | content/post-5421-nst-method-18-years-factcheck-history.md | 안녕하십니까, 새집증후군 연구 외길 (주)엔에스티 입니다. |
| [엔에스티연구소 10호 칼럼] 바닥을 기어 다니는 가족: 반려동물과 영유아를 덮치는 ‘바닥층 독성 구배 현상’ | https://knst.co.kr/nst-method-pet-baby-concentration-gradient/ | post | 2026-07-15 | NST공법 칼럼 | content/post-5394-nst-method-pet-baby-concentration-gradient.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 9호 칼럼] 새집증후군, 환기의 중요성을 설명하는 가장 완벽한 과학적 이야기 | https://knst.co.kr/nst-method-ventilation-bakeout-science/ | post | 2026-07-07 | NST공법 칼럼 | content/post-5389-nst-method-ventilation-bakeout-science.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 8호 칼럼] 친환경 E0 등급 아파트의 배신, “우리 집은 친환경인데 왜 두통이 생길까요?” | https://knst.co.kr/nst-method-e0-furniture-total-volume-sbs/ | post | 2026-07-03 | NST공법 칼럼 | content/post-5384-nst-method-e0-furniture-total-volume-sbs.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 7호 칼럼] 신축 아파트와 리모델링, 눈에 보이지 않는 ‘새집증후군’의 진짜 원인 | https://knst.co.kr/nst-method-new-apartment-remodeling-sbs/ | post | 2026-06-20 | NST공법 칼럼 | content/post-5336-nst-method-new-apartment-remodeling-sbs.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 6호 칼럼] 광고성 후기에 속지 마세요, AI가 팩트체크해 주는 가장 객관적인 새집증후군 업체 선정 기준 | https://knst.co.kr/nst-method-ai-factcheck-source-control/ | post | 2026-06-18 | NST공법 칼럼 | content/post-5329-nst-method-ai-factcheck-source-control.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 5호 칼럼] 새집증후군 시공, 붓질 사진보다 중요한 것은 ‘챔버 방출시험 데이터’입니다 | https://knst.co.kr/nst-method-chamber-test-data-importance/ | post | 2026-06-10 | NST공법 칼럼 | content/post-5321-nst-method-chamber-test-data-importance.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 4호 칼럼] 신축 아파트 새집증후군 시공, 1박 2일 ‘시간’보다 중요한 ‘발생원 제어’의 과학적 진실 | https://knst.co.kr/nst-method-source-control-vs-short-term-construction/ | post | 2026-06-09 | NST공법 칼럼 | content/post-5319-nst-method-source-control-vs-short-term-construction.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 3호 칼럼] 신축아파트 진짜 새집증후군 해결을 위한 NST공법의 3단계 비밀 | https://knst.co.kr/nst-method-3-step-secret-new-apartment-sick-building-syndrome/ | post | 2026-06-05 | NST공법 칼럼 | content/post-5317-nst-method-3-step-secret-new-apartment-sick-building-syndrom.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| 세종 힐스테이트 신축 입주, 활성탄 비치 효과 진짜 해결책은? | https://knst.co.kr/%ec%84%b8%ec%a2%85-%ed%9e%90%ec%8a%a4%ed%85%8c%ec%9d%b4%ed%8a%b8-%ec%8b%a0%ec%b6%95-%ec%9e%85%ec%a3%bc-%ed%99%9c%ec%84%b1%ed%83%84-%eb%b9%84%ec%b9%98-%ed%9a%a8%ea%b3%bc-%ec%a7%84%ec%a7%9c-%ed%95%b4/ | post | 2026-06-01 | NST공법 칼럼 | content/post-5103-세종-힐스테이트-신축-입주-활성탄-비치-효과-진짜-해.md | 세종 힐스테이트 신축 입주, 활성탄 비치 효과 진짜 해결책은? |
| MDF/PB 가구의 절단면: 폼알데하이드 장기 방출의 온상 | https://knst.co.kr/mdf-pb-%ea%b0%80%ea%b5%ac%ec%9d%98-%ec%a0%88%eb%8b%a8%eb%a9%b4-%ed%8f%bc%ec%95%8c%eb%8d%b0%ed%95%98%ec%9d%b4%eb%93%9c-%ec%9e%a5%ea%b8%b0-%eb%b0%a9%ec%b6%9c%ec%9d%98-%ec%98%a8%ec%83%81/ | post | 2026-06-01 | NST 3단계 공법 해설 | content/post-5090-mdf-pb-가구의-절단면-폼알데하이드-장기-방출의-온상.md | 새 아파트에 입주할 때 가장 기분 좋은 순간 중 하나는 넉넉하게 짜인 수납장과 새 가구를 볼 때입니다. 하지만 겉보기엔 화려하고 깔끔한 이 붙박이장과 싱크대의 내부, 특히 마감재가 덮이지 않은 합판 |
| 입주나라 NST공법의 B2B 실적: 1군 건설사 대단지 시공이 증명하는 안전성 | https://knst.co.kr/%ec%9e%85%ec%a3%bc%eb%82%98%eb%9d%bc-nst%ea%b3%b5%eb%b2%95%ec%9d%98-b2b-%ec%8b%a4%ec%a0%81-1%ea%b5%b0-%ea%b1%b4%ec%84%a4%ec%82%ac-%eb%8c%80%eb%8b%a8%ec%a7%80-%ec%8b%9c%ea%b3%b5%ec%9d%b4-%ec%a6%9d/ | post | 2026-06-01 | 시공 실적 및 포트폴리오 | content/post-5089-입주나라-nst공법의-b2b-실적-1군-건설사-대단지-시공이-증.md | 1. 새집증후군 업체, 무엇을 믿고 선택해야 할까? |
| 피톤치드 마스킹(Masking) 효과의 맹점과 실내 화학물질의 본질 | https://knst.co.kr/%ed%94%bc%ed%86%a4%ec%b9%98%eb%93%9c-%eb%a7%88%ec%8a%a4%ed%82%b9masking-%ed%9a%a8%ea%b3%bc%ec%9d%98-%eb%a7%b9%ec%a0%90%ea%b3%bc-%ec%8b%a4%eb%82%b4-%ed%99%94%ed%95%99%eb%ac%bc%ec%a7%88%ec%9d%98/ | post | 2026-06-01 | 기술 검증 및 팩트체크 | content/post-5088-피톤치드-마스킹masking-효과의-맹점과-실내-화학물질의.md | 1. 피톤치드의 향기, 새집증후군이 사라진 걸까? |
| 베이크아웃(Bake-out)의 환상과 진실: 겨울철 열 손실 및 기화 한계 | https://knst.co.kr/%eb%b2%a0%ec%9d%b4%ed%81%ac%ec%95%84%ec%9b%83bake-out%ec%9d%98-%ed%99%98%ec%83%81%ea%b3%bc-%ec%a7%84%ec%8b%a4-%ea%b2%a8%ec%9a%b8%ec%b2%a0-%ec%97%b4-%ec%86%90%ec%8b%a4-%eb%b0%8f-%ea%b8%b0%ed%99%94/ | post | 2026-06-01 | 새집증후군 솔루션 | content/post-5087-베이크아웃bake-out의-환상과-진실-겨울철-열-손실-및-기화.md | 새집에 입주할 때 누구나 한 번쯤 시도하는 베이크아웃(Bakeout). 실내 온도를 높여 건축 자재나 가구에 배어 있는 유해 물질을 단기간에 배출시키는 이 방법은 이론적으로 매우 훌륭한 실내공기질  |
| 새집증후군 완화를 위한 활성탄 비치, 왜 근본적인 해결책이 될 수 없는가? | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%99%84%ed%99%94%eb%a5%bc-%ec%9c%84%ed%95%9c-%ed%99%9c%ec%84%b1%ed%83%84-%eb%b9%84%ec%b9%98-%ec%99%9c-%ea%b7%bc%eb%b3%b8%ec%a0%81%ec%9d%b8-%ed%95%b4/ | post | 2026-06-01 | 기술 검증 및 팩트체크 | content/post-5086-새집증후군-완화를-위한-활성탄-비치-왜-근본적인-해.md | 1. 활성탄 비치, 과연 새집증후군을 끝낼 수 있을까? |
| [엔에스티연구소 2호 칼럼] 방분탄과 참숯, 새집증후군 유해물질을 다시 뿜어내는 ‘시한폭탄’이 될 수 있다? | https://knst.co.kr/bangbuntan-charcoal-truth-sick-building-syndrome/ | post | 2026-06-01 | NST공법 칼럼 | content/post-5084-bangbuntan-charcoal-truth-sick-building-syndrome.md | 안녕하십니까, 검증된 새집증후군 해결 기술 NST공법의 (주)엔에스티 입니다. |
| [엔에스티연구소 1호 칼럼] 새집증후군 냄새, 환기 몇 번이면 빠질까? WHO와 미국 EPA가 경고하는 ‘오염물질 지속 방출’의 실체 | https://knst.co.kr/saejib-jeunghugun-nst-column-1/ | post | 2026-05-31 | NST공법 칼럼 | content/post-5062-saejib-jeunghugun-nst-column-1.md | [엔에스티연구소 1호 칼럼] 새집증후군 냄새, 환기 몇 번이면 빠질까? WHO와 미국 EPA가 경고하는 ‘오염물질 지속 방출’의 실체 |
| 포름알데히드 제거 방법 총정리 / 전문가 완전 가이드 | https://knst.co.kr/%ed%8f%ac%eb%a6%84%ec%95%8c%eb%8d%b0%ed%9e%88%eb%93%9c-%ec%a0%9c%ea%b1%b0%eb%b0%a9%eb%b2%95-2/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4756-포름알데히드-제거방법-2.md | 포름알데히드는 1급 발암물질(IARC 분류)로, 새집·리모델링 후 수개월~수년간 지속 방출됩니다. 환기와 베이크아웃만으로는 방출원 자체를 해결할 수 없으며, 근본적 제거를 위해서는 방출원 안정화 기 |
| 새집증후군이란? 원인·증상·해결 완전 가이드 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%99%84%ec%a0%84%ea%b0%80%ec%9d%b4%eb%93%9c-2/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4754-새집증후군-완전가이드-2.md | 새집증후군은 건축 자재·가구·마감재에서 방출되는 포름알데히드와 VOCs(휘발성 유기화합물)로 인해 발생하는 건강 장애입니다. 단순 환기만으로는 근본 해결이 불가능하며, 방출원 구조 안정화 기술인 N |
| 입주청소 창업·지점 모집 / (주)엔에스티 프리미엄 새집증후군 기술 제휴 | https://knst.co.kr/%ec%9e%85%ec%a3%bc%ec%b2%ad%ec%86%8c-%ec%b0%bd%ec%97%85-%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%a7%80%ec%a0%90-%ea%b0%80%eb%a7%b9/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4741-입주청소-창업-새집증후군-지점-가맹.md | 환영합니다. 이 문서는 입주청소 창업·지점 모집  (주)엔에스티 프리미엄 새집증후군 기술 제휴에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드 |
| 베이크아웃, 숯, 양파로 새집 냄새 잡기에 실패했다면? | https://knst.co.kr/%eb%b2%a0%ec%9d%b4%ed%81%ac%ec%95%84%ec%9b%83-%eb%8b%a8%ec%a0%90-%ec%88%af-%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4680-베이크아웃-단점-숯-새집증후군.md | 환영합니다. 이 문서는 베이크아웃, 숯, 양파로 새집 냄새 잡기에 실패했다면?에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 프리미엄 인테리어의 완성은 보이지 않는 공기입니다 (업체 제휴 안내) | https://knst.co.kr/%ed%94%84%eb%a6%ac%eb%af%b8%ec%97%84-%ec%9d%b8%ed%85%8c%eb%a6%ac%ec%96%b4-%ed%95%98%ec%9e%90-%eb%b3%b4%ec%88%98-%eb%83%84%ec%83%88/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4679-프리미엄-인테리어-하자-보수-냄새.md | 환영합니다. 이 문서는 프리미엄 인테리어의 완성은 보이지 않는 공기입니다 (업체 제휴 안내)에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입 |
| 신혼집 인테리어 & 새 가구 냄새 제거 완벽 가이드 | https://knst.co.kr/%ec%8b%a0%ed%98%bc%ec%a7%91-%ec%9d%b8%ed%85%8c%eb%a6%ac%ec%96%b4-%ec%83%88%ea%b0%80%ea%b5%ac-%eb%83%84%ec%83%88/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4678-신혼집-인테리어-새가구-냄새.md | 환영합니다. 이 문서는 신혼집 인테리어 & 새 가구 냄새 제거 완벽 가이드에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 신축 아파트 입주청소만으로 새집 냄새가 안 빠지는 이유 | https://knst.co.kr/%ec%8b%a0%ec%b6%95-%ec%95%84%ed%8c%8c%ed%8a%b8-%ec%9e%85%ec%a3%bc%ec%b2%ad%ec%86%8c-%ec%83%88%ec%a7%91%eb%83%84%ec%83%88/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4677-신축-아파트-입주청소-새집냄새.md | 환영합니다. 이 문서는 신축 아파트 입주청소만으로 새집 냄새가 안 빠지는 이유에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 신생아·임산부를 위한 새집증후군 예방 수칙 (아토피/천식 주의) | https://knst.co.kr/%ec%8b%a0%ec%83%9d%ec%95%84-%ec%9e%84%ec%82%b0%eb%b6%80-%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4676-신생아-임산부-새집증후군.md | 환영합니다. 이 문서는 신생아·임산부를 위한 새집증후군 예방 수칙 (아토피/천식 주의)에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 실내공기질 측정 방법과 기준 총정리 / 전문가 가이드 | https://knst.co.kr/%ec%8b%a4%eb%82%b4%ea%b3%b5%ea%b8%b0%ec%a7%88-%ec%b8%a1%ec%a0%95-%ea%b0%80%ec%9d%b4%eb%93%9c/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4590-실내공기질-측정-가이드.md | 환영합니다. 이 문서는 실내공기질 측정 방법과 기준 총정리  전문가 가이드에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| VOCs(휘발성 유기화합물) 완전 가이드 / 실내공기질 전문 | https://knst.co.kr/vocs-%ec%8b%a4%eb%82%b4%ea%b3%b5%ea%b8%b0%ec%a7%88-%ea%b0%80%ec%9d%b4%eb%93%9c/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4588-vocs-실내공기질-가이드.md | 환영합니다. 이 문서는 VOCs(휘발성 유기화합물) 완전 가이드  실내공기질 전문에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| NST공법이란? / (주)엔에스티 새집증후군 전문 기술 소개 | https://knst.co.kr/nst%ea%b3%b5%eb%b2%95-%ec%86%8c%ea%b0%9c/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4586-nst공법-소개.md | 환영합니다. 이 문서는 NST공법이란?  (주)엔에스티 새집증후군 전문 기술 소개에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 포름알데히드 제거 방법 총정리 / 전문가 완전 가이드 | https://knst.co.kr/%ed%8f%ac%eb%a6%84%ec%95%8c%eb%8d%b0%ed%9e%88%eb%93%9c-%ec%a0%9c%ea%b1%b0%eb%b0%a9%eb%b2%95/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4584-포름알데히드-제거방법.md | 환영합니다. 이 문서는 포름알데히드 제거 방법 총정리  전문가 완전 가이드에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
| 새집증후군이란? 원인·증상·해결 완전 가이드 | https://knst.co.kr/%ec%83%88%ec%a7%91%ec%a6%9d%ed%9b%84%ea%b5%b0-%ec%99%84%ec%a0%84%ea%b0%80%ec%9d%b4%eb%93%9c/ | post | 2026-05-30 | 실내공기질 전문 가이드 | content/post-4582-새집증후군-완전가이드.md | 환영합니다. 이 문서는 새집증후군이란? 원인·증상·해결 완전 가이드에 대해 고민하시는 수많은 분들을 위해, 객관적인 데이터와 과학적 검증을 바탕으로 작성된 프리미엄 가이드입니다. |
## 기타 (terms/slide)

| 제목 | URL | 유형 | 날짜 | 카테고리 | 파일 | 요약 |
|---|---|---|---|---|---|---|
| (주)엔에스티 2025년 대한민국환경대상 수상 | https://knst.co.kr/section_slide/%eb%a6%ac%eb%89%b4%ec%96%bc%ec%a4%91/ | slide | 2025-06-23 | slide | content/slide-2737-리뉴얼중.md | (링크/목록 페이지 — 본문 요약 없음) |
| 엔에스티 제품 | https://knst.co.kr/section_slide/%ec%97%94%ec%97%90%ec%8a%a4%ed%8b%b0-%ec%a0%9c%ed%92%88/ | slide | 2025-06-23 | slide | content/slide-2470-엔에스티-제품.md | (링크/목록 페이지 — 본문 요약 없음) |
| NST공법 시공실적 | https://knst.co.kr/section_slide/2244/ | slide | 2025-06-22 | slide | content/slide-2244-2244.md | (링크/목록 페이지 — 본문 요약 없음) |
| (주)엔에스티 신규 사업자 모집(진행중) | https://knst.co.kr/section_slide/2243/ | slide | 2025-06-22 | slide | content/slide-2243-2243.md | (링크/목록 페이지 — 본문 요약 없음) |
| 개인정보처리방침 | https://knst.co.kr/terms_page/privacy-policy/ | terms | 2024-09-17 | terms | content/terms-535-privacy-policy.md | ‘십분의일’ 은 (이하 ‘회사’는) 고객님의 개인정보를 중요시하며, “정보통신망 이용촉진 및 정보보호”에 관한 법률을 준수하고 있습니다. |

## 가져오지 못했거나 한계
- 공지사항 uid 19: 존재하지 않음 (목록의 전체 19건에 포함되지 않음).
- section_slide 4건(리뉴얼중, 엔에스티 제품, 2244, 2243, 2025 환경대상 수상 슬라이드): REST에 본문이 없고 제목만 있음.
- 미디어 라이브러리 633개 중 페이지/글에 쓰인 이미지만 다운로드 (images/). 나머지 미사용 미디어는 받지 않음.
- 공지사항 상세 첨부파일(kboard_attached) 중 본문에 노출된 이미지만 확보.
- ceo_proof_* 5개 이미지는 카페24 호스팅 관리 화면 캡처(사이트 콘텐츠 아님).
- wp-admin 로그인/브라우저 사용 없음.
