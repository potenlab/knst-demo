import ProductDetail from "@/components/pages/ProductDetail";
import { PRODUCTS } from "@/components/pages/products-data";
import { pageMetadata } from "@/components/pages/seo";

const P = PRODUCTS["nst-f100"];

export const metadata = pageMetadata({
  path: "/products/nst-f100/",
  title: `NST-F100 ${P.dual} · ${P.stepLabel}`,
  description: `${P.summary} 유해물질 제거 원리, 시공 방법, 제거 효과, 제품 설명서(안전기준 신고 ${P.label.rows.find(([k]) => k === "신고번호")?.[1]}).`,
});

export default function Page() {
  return <ProductDetail slug="nst-f100" />;
}
