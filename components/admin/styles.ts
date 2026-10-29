/** Shared class strings for the admin UI (brand: pine / mint / air, action-blue primary). */

const base =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold whitespace-nowrap " +
  "transition-colors duration-200 ease-[cubic-bezier(.4,0,.2,1)] outline-none select-none " +
  "focus-visible:ring-3 focus-visible:ring-action/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:size-[18px] [&_svg]:shrink-0";

export const btn = {
  /** One per view: the main forward action. */
  primary: `${base} bg-action text-white shadow-[0_10px_24px_-14px_rgba(0,71,156,.8)] hover:bg-action-hover`,
  /** Pine outline: secondary actions. */
  secondary: `${base} border border-pine/25 bg-white text-pine hover:border-pine/50 hover:bg-mint/40`,
  /** Mint fill: tertiary / navigation. */
  soft: `${base} bg-mint text-pine hover:bg-[#bfe7d3]`,
  /** Destructive. */
  danger: `${base} border border-[#b42318]/30 bg-white text-[#b42318] hover:border-[#b42318]/60 hover:bg-[#fff4f2]`,
  ghost: `${base} text-pine hover:bg-mint/50`,
  /** Compact row action (still ≥44px tall). */
  row: `${base} min-h-11 px-3.5 text-[14px] border border-hairline bg-white text-pine hover:border-pine/40 hover:bg-mint/40`,
  rowDanger: `${base} min-h-11 px-3.5 text-[14px] border border-hairline bg-white text-[#b42318] hover:border-[#b42318]/50 hover:bg-[#fff4f2]`,
};

export const field = {
  label: "block text-[15px] font-semibold text-ink",
  hint: "mt-1.5 text-[13.5px] leading-relaxed text-muted-ink",
  error: "mt-1.5 flex items-start gap-1.5 text-[14px] font-medium leading-relaxed text-[#b42318]",
  input:
    "mt-2 block min-h-12 w-full rounded-2xl border border-hairline bg-white px-4 py-2.5 text-[16px] text-ink " +
    "placeholder:text-muted-ink/70 outline-none transition-[border-color,box-shadow] duration-200 " +
    "hover:border-pine/30 focus-visible:border-action focus-visible:ring-3 focus-visible:ring-action/25 " +
    "aria-invalid:border-[#b42318] aria-invalid:ring-3 aria-invalid:ring-[#b42318]/15",
};

export const card = "rounded-3xl border border-hairline bg-white shadow-[0_20px_50px_-40px_rgba(14,59,50,.55)]";
