"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

const campaignParams = ["src", "utm_source", "utm_medium", "utm_campaign"];

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url, window.location.origin);
    const search = new URLSearchParams();

    campaignParams.forEach((key) => {
      const value = url.searchParams.get(key);
      if (value) {
        search.set(key, value.slice(0, 80));
      }
    });

    url.search = search.toString();
    url.hash = "";

    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

export function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
