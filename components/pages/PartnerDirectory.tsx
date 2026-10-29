"use client";

import { useId, useMemo, useState } from "react";
import { MapPin, Phone, Search, X } from "lucide-react";
import { PARTNERS, ZONES, type Partner, type Region } from "@/components/pages/partners-data";
import { cn } from "@/lib/utils";

/** Searchable / filterable list of 공식 시공업체. The unfiltered list is server-rendered (grouped by 권역). */

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-trust focus-visible:ring-offset-2";
const ALL = "전체";

const norm = (s: string) => s.toLowerCase().replace(/[\s·()\-]/g, "");
const zoneOf = (r: Region) => ZONES.find((z) => z.regions.includes(r))?.zone ?? "";
const haystack = (p: Partner) =>
  norm([p.name, p.alias, p.rep, p.area, p.region, zoneOf(p.region), p.items.join(" "), p.badge, p.note, ...p.phones].join(" "));

const DT = "pt-[3px] text-[13px] font-semibold text-muted-ink";

/** One installer, in the old list's order: [업체명] ㅣ [대표자] / [소재지] ㅣ [연락처] / [품목]. */
function Card({ p }: { p: Partner }) {
  return (
    <li className="flex flex-col rounded-[1.25rem] border border-hairline bg-white p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="text-[17px] font-bold leading-[1.35] text-ink">
          <span className="sr-only">업체명 </span>
          {p.name}
        </p>
        {p.badge && <span className="rounded-full bg-pine px-2.5 py-0.5 text-[12px] font-bold text-white">{p.badge}</span>}
      </div>
      {p.rep && (
        <p className="mt-1 text-[14px] text-muted-ink">
          {p.repLabel ?? "대표자"} <span className="font-semibold text-ink">{p.rep}</span>
        </p>
      )}
      <dl className="mt-3 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2 gap-y-2.5 border-t border-hairline pt-3">
        <dt className={DT}>소재지</dt>
        <dd className="flex items-center gap-1.5 text-[15px] text-ink">
          <MapPin aria-hidden className="size-3.5 shrink-0 text-leaf" />
          {p.area}
        </dd>
        <dt className={cn(DT, "pt-3")}>연락처</dt>
        <dd className="flex flex-wrap gap-2">
          {p.phones.map((ph) => (
            <a
              key={ph}
              href={`tel:${ph.replace(/-/g, "")}`}
              aria-label={`${p.name} 전화 ${ph}`}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border border-pine/15 bg-air px-4 text-[15px] font-semibold tabular-nums text-pine transition-colors hover:border-pine/40 hover:bg-mint/40",
                FOCUS,
              )}
            >
              <Phone aria-hidden className="size-4 text-leaf" />
              {ph}
            </a>
          ))}
        </dd>
        <dt className={DT}>품목</dt>
        <dd>
          <ul className="flex flex-wrap gap-1.5">
            {p.items.map((it) => (
              <li key={it} className="rounded-full bg-mint/60 px-2.5 py-0.5 text-[13px] font-medium text-pine">
                {it}
              </li>
            ))}
          </ul>
          {p.note && <p className="mt-2 text-[13px] font-semibold text-pine-2">/ {p.note}</p>}
        </dd>
      </dl>
    </li>
  );
}

export default function PartnerDirectory() {
  const [region, setRegion] = useState<Region | typeof ALL>(ALL);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const statusId = useId();

  const counts = useMemo(() => {
    const m = new Map<Region, number>();
    PARTNERS.forEach((p) => m.set(p.region, (m.get(p.region) ?? 0) + 1));
    return m;
  }, []);

  const q = norm(query.trim());
  const filtered = PARTNERS.filter((p) => (region === ALL || p.region === region) && (!q || haystack(p).includes(q)));
  const grouped = region === ALL && !q;

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] font-semibold transition-colors duration-300",
      active ? "border-pine bg-pine text-white" : "border-pine/15 bg-white text-pine hover:border-pine/40",
      FOCUS,
    );

  return (
    <div>
      <div className="rounded-[1.5rem] border border-hairline bg-white/70 p-4 sm:p-5">
        <label htmlFor={searchId} className="text-[14px] font-bold text-pine-2">
          업체명·대표자·지역·품목으로 찾기
        </label>
        <div className="relative mt-2">
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-ink" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 파주, 줄눈, 청주"
            autoComplete="off"
            aria-describedby={statusId}
            className={cn(
              "h-12 w-full rounded-full border border-hairline bg-white pl-12 pr-12 text-[16px] text-ink placeholder:text-muted-ink/70",
              "outline-none focus-visible:border-trust focus-visible:ring-2 focus-visible:ring-trust/30",
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className={cn("absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-ink hover:bg-air", FOCUS)}
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>

        <div role="group" aria-label="지역 선택" className="mt-4 flex flex-wrap gap-2">
          <button type="button" aria-pressed={region === ALL} onClick={() => setRegion(ALL)} className={chip(region === ALL)}>
            전체 <span className="tabular-nums opacity-70">{PARTNERS.length}</span>
          </button>
          {ZONES.flatMap((z) => z.regions).map((r) => (
            <button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)} className={chip(region === r)}>
              {r} <span className="tabular-nums opacity-70">{counts.get(r) ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <p id={statusId} aria-live="polite" className="mt-6 text-[15px] font-semibold text-pine-2">
        {region === ALL ? "전국" : region}
        {q ? ` · ‘${query.trim()}’ 검색` : ""} · <span className="tabular-nums">{filtered.length}</span>곳
      </p>

      {filtered.length === 0 ? (
        <p className="mt-4 rounded-[1.25rem] border border-dashed border-hairline bg-white px-5 py-8 text-center text-[16px] leading-[1.7] text-muted-ink">
          조건에 맞는 업체가 없습니다. 본사{" "}
          <a href="tel:0432222322" className={cn("font-semibold text-trust underline underline-offset-4", FOCUS)}>
            043-222-2322
          </a>
          로 문의해 주세요.
        </p>
      ) : grouped ? (
        <div className="mt-4 space-y-10">
          {ZONES.map((z) => {
            const list = PARTNERS.filter((p) => z.regions.includes(p.region));
            return (
              <section key={z.zone} aria-labelledby={`zone-${z.zone}`}>
                <h3 id={`zone-${z.zone}`} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-pine pb-3 font-display text-[1.25rem] font-bold text-pine">
                  {z.title}
                  <span className="font-sans text-[14px] font-semibold text-muted-ink">
                    <span className="tabular-nums">{list.length}</span>곳
                  </span>
                </h3>
                {z.regions.map((r) => {
                  const inRegion = list.filter((p) => p.region === r);
                  return (
                    <div key={r} className="mt-5">
                      <h4 className="text-[16px] font-bold text-pine-2">
                        {r} <span className="text-[14px] font-semibold tabular-nums text-muted-ink">{inRegion.length}</span>
                      </h4>
                      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {inRegion.map((p) => (
                          <Card key={p.name} p={p} />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.name} p={p} />
          ))}
        </ul>
      )}
    </div>
  );
}
