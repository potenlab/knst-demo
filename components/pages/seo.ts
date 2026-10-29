import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/** Shared metadata + JSON-LD builders for the static pages. @ids match components/JsonLd.tsx (home graph). */

export const LD_ID = {
  org: `${SITE.url}/#organization`,
  site: `${SITE.url}/#website`,
  service: `${SITE.url}/#service`,
};

export const abs = (path: string) => `${SITE.url}${path}`;

const OG_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "(주)엔에스티 NST공법" };

export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  const full = `${title} | (주)엔에스티`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: path,
      siteName: "(주)엔에스티 NST공법",
      title: full,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}

/** Organization node repeated on each page so `{ "@id": LD_ID.org }` resolves locally. Facts: lib/site.ts. */
export const ORG_NODE = {
  "@type": ["Organization", "HomeAndConstructionBusiness"],
  "@id": LD_ID.org,
  name: SITE.name,
  alternateName: [SITE.nameEn, SITE.brand],
  url: SITE.url,
  logo: { "@type": "ImageObject", url: `${SITE.url}/img/logo-color.webp`, width: 500, height: 336 },
  telephone: [SITE.phone, SITE.phone2],
  faxNumber: SITE.fax,
  email: SITE.email,
  address: { "@type": "PostalAddress", ...SITE.address },
  foundingDate: SITE.foundingDate,
};

export const SITE_NODE = {
  "@type": "WebSite",
  "@id": LD_ID.site,
  url: SITE.url,
  name: SITE.shortTitle,
  inLanguage: "ko-KR",
  publisher: { "@id": LD_ID.org },
};

export type Crumb = { label: string; href?: string };

export function breadcrumbNode(path: string, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: abs(c.href ?? path),
    })),
  };
}

export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function ldHtml(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
