import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import { card } from "@/components/admin/styles";

export const metadata: Metadata = { title: "로그인" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/");

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      {/* breath rings */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="size-[720px] rounded-full border border-leaf/15" />
        <div className="absolute inset-[90px] rounded-full border border-leaf/20" />
        <div className="absolute inset-[190px] rounded-full bg-mint/50 blur-2xl" />
      </div>

      <div className={`${card} relative w-full max-w-[420px] p-7 sm:p-10`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center rounded-full bg-white p-1 ring-1 ring-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-white.webp" alt="" width={300} height={300} className="size-11 rounded-full object-contain" />
          </span>
          <div className="leading-tight">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-leaf">NST CMS</p>
            <p className="font-display text-[17px] font-bold text-pine">엔에스티</p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-pine">관리자 로그인</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-ink">블로그 글을 쓰고 발행하는 곳입니다. 비밀번호를 넣으면 12시간 동안 로그인이 유지됩니다.</p>

        <LoginForm />

        <p className="mt-6 text-[13.5px] leading-relaxed text-muted-ink">비밀번호를 모르면 사이트 운영 담당자에게 문의해 주세요.</p>
      </div>

      <a
        href="/"
        className="absolute left-4 top-4 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-pine outline-none hover:bg-mint/60 focus-visible:ring-3 focus-visible:ring-action/40 sm:left-6 sm:top-6"
      >
        <ArrowLeft aria-hidden className="size-4" />
        사이트로 돌아가기
      </a>
    </main>
  );
}
