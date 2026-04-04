import Link from "next/link";

import { SEO_PATHS } from "@/lib/seo/paths";

type PhishCheckSeoCtaProps = {
  variant?: "default" | "compact";
};

export function PhishCheckSeoCta({ variant = "default" }: PhishCheckSeoCtaProps) {
  if (variant === "compact") {
    return (
      <p className="rounded-xl border border-ph-accent-border bg-ph-accent-soft/60 px-4 py-3 text-sm leading-relaxed text-ph-text transition-colors duration-200">
        Want to check a suspicious message right now?{" "}
        <Link
          href={`${SEO_PATHS.home}#phishcheck-tool`}
          className="font-semibold text-ph-primary underline-offset-2 hover:underline"
        >
          Use PhishCheck
        </Link>
        .
      </p>
    );
  }

  return (
    <section
      aria-labelledby="seo-cta-heading"
      className="mt-10 rounded-2xl border border-ph-border bg-ph-panel px-6 py-8 text-center shadow-[var(--ph-shell-card-shadow)] transition-colors duration-200 sm:px-8"
    >
      <h2
        id="seo-cta-heading"
        className="text-lg font-bold tracking-tight text-ph-text sm:text-xl"
      >
        Check a suspicious message now
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ph-muted sm:text-[0.9375rem]">
        Want to check a suspicious message right now? Paste it into PhishCheck
        for an AI-assisted phishing risk assessment in seconds—no signup
        required.
      </p>
      <Link
        href={`${SEO_PATHS.home}#phishcheck-tool`}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-ph-primary px-8 text-sm font-semibold text-white shadow-md shadow-black/15 transition-[background-color,box-shadow,transform] duration-200 hover:bg-ph-primary-hover hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] active:scale-[0.985]"
      >
        Open PhishCheck
      </Link>
    </section>
  );
}
