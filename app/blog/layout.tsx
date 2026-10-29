import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { RSS_ALTERNATE } from "./_lib/blog";

export const metadata: Metadata = {
  alternates: { types: RSS_ALTERNATE },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
