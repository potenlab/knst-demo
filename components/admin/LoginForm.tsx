"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleAlert, LoaderCircle, Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { btn, field } from "./styles";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const inputRef = useRef<HTMLInputElement>(null);

  // after a failed attempt: put the cursor back in the (cleared) field
  useEffect(() => {
    if (state.error) inputRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="mt-8" noValidate>
      <label htmlFor="admin-password" className={field.label}>
        관리자 비밀번호
      </label>
      <input
        ref={inputRef}
        id="admin-password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        maxLength={256}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "admin-password-error" : undefined}
        className={field.input}
      />
      <div aria-live="polite" aria-atomic="true">
        {state.error && !pending ? (
          <p id="admin-password-error" className={field.error}>
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}
      </div>
      <button type="submit" disabled={pending} aria-busy={pending || undefined} className={`${btn.primary} mt-6 w-full`}>
        {pending ? <LoaderCircle aria-hidden className="animate-spin" /> : <Lock aria-hidden />}
        {pending ? "확인하는 중…" : "로그인"}
      </button>
    </form>
  );
}
