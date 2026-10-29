import type { Metadata, Viewport } from "next";

// Private CMS: never index, never cache, never prerender.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "관리자", template: "%s | NST 관리자" },
  description: undefined,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export const viewport: Viewport = { themeColor: "#0e3b32" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-air text-ink">{children}</div>;
}
