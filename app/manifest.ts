import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Minimal PWA manifest so the gift can be "added to home screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Happy Birthday, ${site.recipient}`,
    short_name: site.recipient,
    description: site.subtitle,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
