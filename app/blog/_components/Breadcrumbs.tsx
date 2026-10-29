import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail; the last crumb is the current page. Mirrors the BreadcrumbList JSON-LD. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="현재 위치">
      <ol className="flex flex-wrap items-center gap-x-1 text-[14px] text-muted-ink">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-x-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="inline-flex min-h-11 items-center rounded-md px-1 font-medium text-pine-2 underline decoration-pine/20 underline-offset-4 outline-none hover:decoration-pine focus-visible:ring-2 focus-visible:ring-trust"
                >
                  {c.label}
                </Link>
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
