import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ORG_NODE, SITE_NODE, abs, breadcrumbNode, graph, ldHtml, LD_ID, type Crumb } from "./seo";

type Props = {
  /** canonical path with trailing slash, e.g. "/about/" */
  path: string;
  /** trail after "홈"; the last crumb is the current page */
  crumbs: Crumb[];
  eyebrow: string;
  /** visible H1 (may contain markup) */
  title: ReactNode;
  /** plain-text page name for structured data */
  name: string;
  description: string;
  lead?: ReactNode;
  aside?: ReactNode;
  /** schema.org WebPage subtype: AboutPage, ContactPage, FAQPage, CollectionPage, ItemPage … */
  pageType?: string;
  /** extra properties merged into the WebPage node (mainEntity, about, …) */
  pageExtra?: Record<string, unknown>;
  /** additional @graph nodes (Product, ItemList …) */
  ld?: object[];
  toc?: { id: string; label: string }[];
  children: ReactNode;
};

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(46rem 30rem at 88% 8%, rgba(205,238,221,.95), rgba(205,238,221,0) 62%)",
            "radial-gradient(30rem 22rem at -6% 90%, rgba(205,238,221,.6), rgba(205,238,221,0) 60%)",
            "linear-gradient(180deg, #f6faf7 0%, #eef8f2 70%, #f6faf7 100%)",
          ].join(","),
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-48 -z-10 size-[30rem] sm:-right-24 lg:-right-10 lg:-top-40 lg:size-[38rem]">
        {[1, 0.76, 0.54, 0.34].map((k, i) => (
          <span
            key={k}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border motion-safe:animate-[breathe_10s_cubic-bezier(.4,0,.2,1)_infinite]"
            style={{
              width: `${k * 100}%`,
              height: `${k * 100}%`,
              borderColor: `rgba(47,143,107,${0.12 + i * 0.05})`,
              animationDelay: `${i * -2}s`,
            }}
          />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-[#f6faf7]/0 to-[#f6faf7]" />
    </>
  );
}

function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="현재 위치">
      <ol className="flex flex-wrap items-center gap-x-1 text-[14px] text-muted-ink">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-x-1">
              {c.href && !last ? (
                <a
                  href={c.href}
                  className="inline-flex min-h-11 items-center rounded-md px-1 font-medium text-pine-2 underline decoration-pine/20 underline-offset-4 outline-none hover:decoration-pine focus-visible:ring-2 focus-visible:ring-trust"
                >
                  {c.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className="truncate px-1">
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-ink/70" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Header + breadcrumb + H1 + footer for every static page, plus WebPage/BreadcrumbList JSON-LD. */
export default function PageShell({
  path,
  crumbs,
  eyebrow,
  title,
  name,
  description,
  lead,
  aside,
  pageType = "WebPage",
  pageExtra,
  ld = [],
  toc,
  children,
}: Props) {
  const trail: Crumb[] = [{ label: "홈", href: "/" }, ...crumbs];
  const url = abs(path);
  const data = graph([
    ORG_NODE,
    SITE_NODE,
    {
      "@type": pageType,
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: "ko-KR",
      isPartOf: { "@id": LD_ID.site },
      publisher: { "@id": LD_ID.org },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...pageExtra,
    },
    breadcrumbNode(path, trail),
    ...ld,
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldHtml(data)} />
      <Header />
      <main id="main">
        <section aria-labelledby="page-title" className="grain relative isolate overflow-hidden">
          <Backdrop />
          <div className="mx-auto max-w-[1240px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
            <Breadcrumbs items={trail} />

            <div className="mt-6 grid gap-8 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="lg:col-span-7">
                <p className="inline-flex items-center gap-2.5 text-[15px] font-bold text-pine-2">
                  <span aria-hidden className="relative inline-block size-3.5">
                    <span className="absolute inset-0 rounded-full border border-leaf" />
                    <span className="absolute inset-[4px] rounded-full bg-leaf" />
                  </span>
                  {eyebrow}
                </p>
                <h1
                  id="page-title"
                  className="mt-4 text-balance font-display text-[clamp(1.9rem,1.2rem+2vw,2.75rem)] font-extrabold leading-[1.18] tracking-[-0.035em] text-pine"
                >
                  {title}
                </h1>
              </div>

              {(lead || aside) && (
                <div className="border-t border-hairline pt-6 lg:col-span-5 lg:mb-1">
                  {lead && (
                    <div className="max-w-[34rem] text-pretty text-[17px] leading-[1.75] text-muted-ink sm:text-[18px] [&>p+p]:mt-3">
                      {lead}
                    </div>
                  )}
                  {aside}
                </div>
              )}
            </div>

            {toc && toc.length > 0 && (
              <nav aria-label="이 페이지 목차" className="mt-10">
                <ul className="flex flex-wrap gap-2">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="inline-flex min-h-11 items-center rounded-full border border-pine/15 bg-white/70 px-4 text-[15px] font-semibold text-pine outline-none transition-colors duration-300 hover:border-pine/40 hover:bg-white focus-visible:ring-2 focus-visible:ring-trust"
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>

        {children}
      </main>
      <Footer />
    </>
  );
}
