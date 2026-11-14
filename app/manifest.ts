import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Highbury",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07080B",
    theme_color: "#07080B",
    icons: [
      {
        src: "/images/logo/highbury-logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
      },
    ],
  };
}
