"use client";

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

/**
 * One-shot notice that came in via a query param (e.g. `?notice=deleted`).
 * Announces itself (role=status) and removes the param from the address bar so a refresh doesn't repeat it.
 */
export default function Flash({ message, tone = "ok", param }: { message: string; tone?: "ok" | "warn"; param: string }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(param)) return;
    url.searchParams.delete(param);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [param]);

  if (!open) return null;
  const warn = tone === "warn";
  return (
    <div
      role="status"
      className={
        "mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[15px] font-medium " +
        (warn ? "border-[#b42318]/25 bg-[#fff4f2] text-[#8a1c13]" : "border-leaf/30 bg-mint/60 text-pine")
      }
    >
      {warn ? <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" /> : <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0" />}
      <p className="flex-1 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="-my-1.5 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full outline-none hover:bg-black/5 focus-visible:ring-3 focus-visible:ring-action/40"
      >
        <X aria-hidden className="size-4" />
        <span className="sr-only">알림 닫기</span>
      </button>
    </div>
  );
}
