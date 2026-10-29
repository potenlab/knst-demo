"use client";

import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** KakaoTalk speech-bubble symbol (brand mark, drawn in currentColor). */
export function KakaoSymbol({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 3.2c-5.3 0-9.6 3.38-9.6 7.55 0 2.7 1.8 5.07 4.5 6.4l-.92 3.37c-.08.3.26.55.52.37l4.03-2.66c.48.06.97.09 1.47.09 5.3 0 9.6-3.38 9.6-7.57S17.3 3.2 12 3.2Z"
      />
    </svg>
  );
}

/**
 * Sitewide floating "카카오톡 상담" link (KakaoTalk channel, new tab). Mounted once in app/layout.tsx;
 * hidden under /admin. Icon-only circle on phones, pill with label from `sm`. Sits below the sticky
 * header/mobile sheet (z-40 < z-50), clears iOS/Android safe-area insets, hidden in print.
 */
export default function KakaoFloat() {
  const pathname = usePathname() ?? "/";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  return (
    <a
      href={SITE.kakao}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 상담 (새 창에서 열림)"
      className={cn(
        "fixed z-40 inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[#191919] print:hidden",
        "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] right-[max(1rem,calc(env(safe-area-inset-right)+0.75rem))]",
        "size-14 sm:size-auto sm:h-14 sm:pl-4 sm:pr-5 lg:bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] lg:right-[max(1.5rem,calc(env(safe-area-inset-right)+1rem))]",
        "shadow-[0_14px_30px_-12px_rgba(16,35,30,.55),0_0_0_1px_rgba(16,35,30,.08)] outline-none",
        "transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(.4,0,.2,1)] motion-safe:hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(16,35,30,.6),0_0_0_1px_rgba(16,35,30,.1)]",
        "focus-visible:ring-4 focus-visible:ring-trust/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
      )}
    >
      <KakaoSymbol className="size-7 shrink-0 sm:size-6" />
      <span aria-hidden="true" className="hidden text-[15px] font-bold tracking-[-0.01em] sm:inline">
        카카오톡 상담
      </span>
    </a>
  );
}
