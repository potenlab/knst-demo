import type { PostStatus } from "@/lib/db";

export default function StatusBadge({ status, className = "" }: { status: PostStatus; className?: string }) {
  const live = status === "published";
  return (
    <span
      className={
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold " +
        (live ? "bg-pine text-white" : "border border-dashed border-pine/35 bg-white text-muted-ink") +
        (className ? ` ${className}` : "")
      }
    >
      <span aria-hidden className={"size-1.5 rounded-full " + (live ? "bg-glow" : "bg-muted-ink/60")} />
      {live ? "발행" : "초안"}
    </span>
  );
}
