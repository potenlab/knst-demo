import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.shortTitle,
    short_name: "NST공법",
    description: SITE.description,
    lang: "ko",
    start_url: "/",
    display: "standalone",
    background_color: "#f6faf7",
    theme_color: "#0e3b32",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
