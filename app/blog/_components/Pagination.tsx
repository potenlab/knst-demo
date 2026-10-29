import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageList(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set([1, totalPages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= totalPages));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => {
    if (i && n - sorted[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/** Numbered pager for list pages (/blog/, /notices/, /news/). Server component; `hrefFor` builds each page's URL. */
export default function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (n: number) => string }) {
  const btn =
    "inline-flex size-11 items-center justify-center rounded-full border text-[15px] font-semibold tabular-nums outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2 focus-visible:ring-offset-air";
  return (
    <nav aria-label="페이지 이동" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={cn(btn, "w-auto gap-1.5 border-hairline bg-white/70 px-4 text-pine hover:border-pine/50")}>
          <ArrowLeft aria-hidden className="size-4" />
          이전
        </Link>
      ) : (
        <span aria-hidden className={cn(btn, "w-auto gap-1.5 border-transparent px-4 text-muted-ink/50")}>
          <ArrowLeft className="size-4" />
          이전
        </span>
      )}
      <ol className="flex items-center gap-1.5">
        {pageList(page, totalPages).map((n, i) =>
          n === "…" ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 text-muted-ink">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={hrefFor(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`${n}페이지`}
                className={cn(btn, n === page ? "border-pine bg-pine text-white" : "border-hairline bg-white/70 text-ink hover:border-pine/50")}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={cn(btn, "w-auto gap-1.5 border-hairline bg-white/70 px-4 text-pine hover:border-pine/50")}>
          다음
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      ) : (
        <span aria-hidden className={cn(btn, "w-auto gap-1.5 border-transparent px-4 text-muted-ink/50")}>
          다음
          <ArrowRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
