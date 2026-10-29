import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Hahmlet, IBM_Plex_Mono } from "next/font/google";
import KakaoFloat from "@/components/KakaoFloat";
import { SITE } from "@/lib/site";
import "./globals.css";

const body = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-body",
  weight: "45 920",
  display: "swap",
});
const display = Hahmlet({
  variable: "--font-display",
  weight: ["500", "700", "800", "900"],
  display: "swap",
  preload: false,
});
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | 엔에스티" },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: "NST공법",
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "home improvement",
  alternates: { canonical: "/", languages: { "ko-KR": "/" } },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "엔에스티 NST공법",
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  other: { "geo.region": "KR-43", "geo.placename": "청주시 흥덕구" },
};
export const viewport: Viewport = { themeColor: "#0e3b32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body className="bg-air font-sans text-ink antialiased">
        {children}
        {/* sitewide KakaoTalk chat button (renders nothing under /admin) */}
        <KakaoFloat />
      </body>
    </html>
  );
}
