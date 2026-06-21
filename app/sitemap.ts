import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const lastModified = new Date("2026-06-21T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/notify`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/support`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
