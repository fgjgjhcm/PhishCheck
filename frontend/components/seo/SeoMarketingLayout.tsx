import type { ReactNode } from "react";

import { SeoSiteHeader } from "@/components/seo/SeoSiteHeader";

type SeoMarketingLayoutProps = {
  children: ReactNode;
};

export function SeoMarketingLayout({ children }: SeoMarketingLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-ph-page via-ph-panel-muted to-ph-page transition-[background] duration-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,var(--ph-shell-glow),transparent_45%)]"
        aria-hidden
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-ph-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ph-text focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:max-w-[44rem]">
        <SeoSiteHeader />
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
