import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { JsonLd } from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/site-config";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  THEMES,
} from "@/lib/theme-constants";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PhishCheck",
    template: "%s | PhishCheck",
  },
  description:
    "AI-assisted phishing and scam detection for emails, texts, and links. Paste a suspicious message and get clear risk signals in seconds.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  verification: {
    google: "PU5cMC5J7oBxsdVRGNhGF_clv6aJQVaN4sEZ_ld_wdo",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhishCheck",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PhishCheck",
  url: siteUrl,
  description:
    "PhishCheck helps people check suspicious emails, text messages, and links for phishing and scams using AI-assisted analysis.",
  logo: `${siteUrl}/favicon.svg`,
};

const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);var a=['${THEMES.join("','")}'];var th=a.indexOf(t)>=0?t:'${DEFAULT_THEME}';document.documentElement.setAttribute('data-theme',th);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-ph-page font-sans text-ph-text antialiased transition-[background-color,color] duration-200`}
      >
        <JsonLd data={organizationJsonLd} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
