import { BASE_URL } from "@/constants/env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    host: BASE_URL,
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
