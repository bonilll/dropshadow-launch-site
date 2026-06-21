import type { Metadata } from "next";
import "./globals.css";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "DropShadow | Escape the Shadow",
    template: "%s | DropShadow"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "DropShadow", url: siteConfig.url }],
  creator: "DropShadow",
  publisher: "DropShadow",
  category: "game",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1
    }
  },
  openGraph: {
    title: "DropShadow | Every second has weight",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "DropShadow",
    images: [
      {
        url: siteConfig.socialImage,
        width: 1200,
        height: 630,
        alt: "DropShadow gameplay inside a minimalist maze"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DropShadow | Every second has weight",
    description: siteConfig.description,
    images: [siteConfig.socialImage]
  },
  icons: {
    icon: "/assets/app-icon.svg",
    apple: "/assets/app-icon.svg"
  },
  appleWebApp: {
    title: "DropShadow",
    capable: true,
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
