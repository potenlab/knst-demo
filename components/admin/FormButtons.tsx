"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  pendingLabel?: string;
  /** When set, the browser asks this question first and only submits on OK. */
  confirmMessage?: string;
};

/** Submit button for server-action forms: shows a spinner while pending, optional confirm(). */
export function SubmitButton({ children, pendingLabel, confirmMessage, onClick, disabled, ...rest }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      onClick={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    >
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="animate-spin" />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
