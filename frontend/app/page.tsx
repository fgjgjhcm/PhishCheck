import type { Metadata } from "next";

import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site-config";

const SITE = getSiteUrl();
const title =
  "Phishing Checker – Detect Scam Emails, Texts & Links Instantly";
const description =
  "Check if an email, text, or message is a phishing scam. PhishCheck uses AI to detect suspicious messages and explain the warning signs in seconds.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: SITE },
  openGraph: {
    title,
    description,
    url: SITE,
    siteName: "PhishCheck",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "PhishCheck",
      url: SITE,
      description,
    },
    {
      "@type": "SoftwareApplication",
      name: "PhishCheck",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      description,
      url: SITE,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HomePage />
    </>
  );
}
