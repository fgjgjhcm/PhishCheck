import Link from "next/link";

import { PhishCheckLogoMark } from "@/components/PhishCheckLogoMark";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SEO_PATHS } from "@/lib/seo/paths";

const navLinkClass =
  "rounded-lg px-2 py-1.5 text-sm font-medium text-ph-muted transition-colors hover:bg-ph-accent-soft hover:text-ph-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]";

export function SeoSiteHeader() {
  return (
    <header className="mb-10 flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href={SEO_PATHS.home}
          className="group flex items-center gap-2.5"
        >
          <PhishCheckLogoMark
            framed
            className="h-8 w-8 text-ph-primary transition-transform duration-200 group-hover:scale-[1.02]"
            decorative
          />
          <span className="text-lg font-bold tracking-tight text-ph-text">
            PhishCheck
          </span>
        </Link>
        <ThemeSwitcher />
      </div>
      <nav
        aria-label="Site"
        className="flex flex-wrap gap-1 border-b border-ph-border pb-4"
      >
        <Link href={SEO_PATHS.home} className={navLinkClass}>
          Tool
        </Link>
        <Link href={SEO_PATHS.phishingChecker} className={navLinkClass}>
          Phishing checker
        </Link>
        <Link href={SEO_PATHS.emailScamChecker} className={navLinkClass}>
          Email scams
        </Link>
        <Link href={SEO_PATHS.textScamChecker} className={navLinkClass}>
          Text scams
        </Link>
        <Link href={SEO_PATHS.guidesIndex} className={navLinkClass}>
          Guides
        </Link>
      </nav>
    </header>
  );
}
