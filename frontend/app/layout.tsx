import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
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

export const metadata: Metadata = {
  title: "PhishCheck",
  description: "AI-assisted phishing risk assessment for suspicious messages",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  verification: {
    google: "PU5cMC5J7oBxsdVRGNhGF_clv6aJQVaN4sEZ_ld_wdo",
  },
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
