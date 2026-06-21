import { HomePage } from "@/components/HomePage";
import { campaignVideoLibrary, media, posterForVideo, siteConfig } from "@/lib/site";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: "DropShadow",
      url: siteConfig.url,
      email: siteConfig.contactEmail,
      logo: absoluteUrl(media.appIcon)
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: "DropShadow",
      url: siteConfig.url,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en"
    },
    {
      "@type": ["VideoGame", "SoftwareApplication"],
      "@id": `${siteConfig.url}/#game`,
      name: "DropShadow",
      url: siteConfig.url,
      image: absoluteUrl(siteConfig.socialImage),
      description: siteConfig.description,
      applicationCategory: "GameApplication",
      operatingSystem: "iOS",
      gamePlatform: ["iPhone", "iPad", "iOS"],
      genre: ["Survival", "Maze", "Arcade", "Puzzle"],
      publisher: { "@id": `${siteConfig.url}/#organization` },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/PreOrder",
        url: `${siteConfig.url}/#signup`
      }
    },
    ...campaignVideoLibrary.map((video) => ({
      "@type": "VideoObject",
      "@id": `${siteConfig.url}/#video-${video.slug}`,
      name: video.name,
      description: video.description,
      thumbnailUrl: [absoluteUrl(posterForVideo(video.src))],
      uploadDate: "2026-06-21",
      duration: video.duration,
      contentUrl: absoluteUrl(video.src),
      embedUrl: absoluteUrl(video.src),
      publisher: { "@id": `${siteConfig.url}/#organization` }
    }))
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
