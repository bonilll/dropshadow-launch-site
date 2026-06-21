import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const aiDiscoveryBots = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      },
      ...aiDiscoveryBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"]
      }))
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url
  };
}
