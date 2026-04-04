import type { Metadata } from "next";
import Link from "next/link";

import { SeoMarketingLayout } from "@/components/seo/SeoMarketingLayout";
import { GUIDE_META } from "@/lib/seo/guides-meta";
import { absoluteUrl } from "@/lib/site-config";
import type { GuideSlug } from "@/lib/seo/paths";
import { GUIDE_SLUGS, SEO_PATHS } from "@/lib/seo/paths";

const url = absoluteUrl(SEO_PATHS.guidesIndex);

export const metadata: Metadata = {
  title: "Phishing & Scam Guides",
  description:
    "Practical guides on phishing emails, smishing texts, fake links, and brand impersonation—written to help you verify safely and use PhishCheck with confidence.",
  alternates: { canonical: url },
  openGraph: {
    title: "Phishing & scam guides | PhishCheck",
    description:
      "Step-by-step guidance on spotting phishing, smishing, and unsafe links.",
    url,
    type: "website",
  },
};

const linkClass =
  "group block rounded-xl border border-ph-border bg-ph-card p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:border-ph-accent-border hover:shadow-[var(--ph-shell-card-shadow)]";

export default function GuidesIndexPage() {
  return (
    <SeoMarketingLayout>
      <article className="isolate overflow-clip rounded-2xl border border-ph-border bg-ph-card p-6 shadow-[var(--ph-shell-card-shadow)] sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-ph-text sm:text-3xl">
          Guides
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ph-muted">
          Clear, high-intent references you can use when something feels off.
          Each guide ends with a path back to the{" "}
          <Link
            href={`${SEO_PATHS.home}#phishcheck-tool`}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            PhishCheck tool
          </Link>{" "}
          for a fast second opinion.
        </p>
        <ul className="mt-8 space-y-3">
          {GUIDE_SLUGS.map((slug) => {
            const meta = GUIDE_META[slug as GuideSlug];
            return (
              <li key={slug}>
                <Link href={`${SEO_PATHS.guidesIndex}/${slug}`} className={linkClass}>
                  <span className="text-base font-semibold text-ph-text group-hover:text-ph-primary">
                    {meta.title}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-ph-muted">
                    {meta.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-sm text-ph-muted">
          <Link
            href={SEO_PATHS.phishingChecker}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            Phishing checker
          </Link>
          {" · "}
          <Link
            href={SEO_PATHS.emailScamChecker}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            Email scam checker
          </Link>
          {" · "}
          <Link
            href={SEO_PATHS.textScamChecker}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            Text scam checker
          </Link>
        </p>
      </article>
    </SeoMarketingLayout>
  );
}
