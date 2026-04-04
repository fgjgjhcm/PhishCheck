import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideArticleBody } from "@/components/seo/GuideArticleBody";
import { JsonLd } from "@/components/JsonLd";
import { PhishCheckSeoCta } from "@/components/seo/PhishCheckSeoCta";
import { SeoMarketingLayout } from "@/components/seo/SeoMarketingLayout";
import { GUIDE_META } from "@/lib/seo/guides-meta";
import { absoluteUrl, getSiteUrl } from "@/lib/site-config";
import type { GuideSlug } from "@/lib/seo/paths";
import { GUIDE_SLUGS, SEO_PATHS } from "@/lib/seo/paths";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) {
    return {};
  }
  const meta = GUIDE_META[slug as GuideSlug];
  const url = absoluteUrl(`${SEO_PATHS.guidesIndex}/${slug}`);
  const site = getSiteUrl();
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      publishedTime: meta.datePublished,
      modifiedTime: meta.dateModified ?? meta.datePublished,
      siteName: "PhishCheck",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) {
    notFound();
  }
  const guideSlug = slug as GuideSlug;
  const meta = GUIDE_META[guideSlug];
  const url = absoluteUrl(`${SEO_PATHS.guidesIndex}/${slug}`);
  const site = getSiteUrl();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified ?? meta.datePublished,
    author: {
      "@type": "Organization",
      name: "PhishCheck",
      url: site,
    },
    publisher: {
      "@type": "Organization",
      name: "PhishCheck",
      url: site,
      logo: {
        "@type": "ImageObject",
        url: `${site}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <SeoMarketingLayout>
      <JsonLd data={articleJsonLd} />
      <article className="isolate overflow-clip rounded-2xl border border-ph-border bg-ph-card p-6 shadow-[var(--ph-shell-card-shadow)] sm:p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-ph-muted">
          <Link
            href={SEO_PATHS.guidesIndex}
            className="text-ph-primary underline-offset-2 hover:underline"
          >
            Guides
          </Link>
          <span className="text-ph-muted"> / </span>
          <span className="text-ph-text">Article</span>
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ph-text sm:text-3xl md:text-[2rem] md:leading-tight">
          {meta.title}
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ph-muted">
          {meta.description}
        </p>
        <div className="mt-8">
          <GuideArticleBody slug={guideSlug} />
        </div>
        <p className="mt-10 text-sm leading-relaxed text-ph-muted">
          Next: run the message through{" "}
          <Link
            href={SEO_PATHS.phishingChecker}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            PhishCheck&apos;s phishing checker
          </Link>{" "}
          or jump straight to the{" "}
          <Link
            href={`${SEO_PATHS.home}#phishcheck-tool`}
            className="font-medium text-ph-primary underline-offset-2 hover:underline"
          >
            analysis tool
          </Link>
          .
        </p>
      </article>
      <PhishCheckSeoCta />
    </SeoMarketingLayout>
  );
}
