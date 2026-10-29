import type { NextConfig } from "next";
import oldRedirects from "./lib/old-redirects.json";

// Old WordPress (knst.co.kr) paths → their new pages, so old links and search rankings keep working.
// Sources are decoded paths; path-to-regexp control characters are escaped.
const esc = (s: string) => s.replace(/([()[\]{}:*+?\\])/g, "\\$1");

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return Object.entries(oldRedirects as Record<string, string>).map(([from, to]) => ({
      source: esc(from),
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
