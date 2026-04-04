import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { PhishCheckSeoCta } from "@/components/seo/PhishCheckSeoCta";
import { SeoMarketingLayout } from "@/components/seo/SeoMarketingLayout";
import { absoluteUrl } from "@/lib/site-config";
import { SEO_PATHS } from "@/lib/seo/paths";

const path = SEO_PATHS.phishingChecker;
const url = absoluteUrl(path);
const title = "Free Phishing Checker & Phishing Detector Online";
const description =
  "Use PhishCheck as your phishing checker and phishing detector: paste suspicious emails, texts, or chats and get AI-assisted risk signals and plain-language explanations in seconds.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    siteName: "PhishCheck",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a phishing checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A phishing checker helps you evaluate whether a message may be a phishing attempt by analyzing wording, urgency, impersonation patterns, and—when you provide them—email authentication headers. PhishCheck is a browser-based phishing detector that returns a structured risk readout without requiring signup.",
      },
    },
    {
      "@type": "Question",
      name: "Can a phishing detector replace common sense?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. PhishCheck is built for triage: it highlights suspicious signals so you can slow down and verify through official channels. Always confirm sensitive requests using contact methods you already trust, not links or phone numbers from the message.",
      },
    },
    {
      "@type": "Question",
      name: "Does PhishCheck store my messages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Data handling depends on how PhishCheck is hosted and configured. Review the privacy policy published for the site you are using for the authoritative answer.",
      },
    },
    {
      "@type": "Question",
      name: "What should I paste into the phishing checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste the full suspicious message, including links as they appear. For email, optionally add raw headers—especially Authentication-Results—so the analysis can weigh SPF, DKIM, and DMARC context alongside the body.",
      },
    },
  ],
};

const p = "mt-4 text-[0.9375rem] leading-relaxed text-ph-muted";
const h2 = "mt-10 text-xl font-bold tracking-tight text-ph-text";
const ul = "mt-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ph-muted";
const link =
  "font-medium text-ph-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]";

export default function PhishingCheckerPage() {
  return (
    <SeoMarketingLayout>
      <JsonLd data={faqJsonLd} />
      <article className="isolate overflow-clip rounded-2xl border border-ph-border bg-ph-card p-6 shadow-[var(--ph-shell-card-shadow)] sm:p-8 md:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-ph-text sm:text-3xl md:text-[2rem] md:leading-tight">
          Phishing checker & phishing detector
        </h1>
        <p className={p}>
          When a message feels wrong—a payroll email, a bank text, a &quot;security
          alert&quot; with a link—you need a fast way to separate noise from real
          risk. PhishCheck is a phishing checker built for that moment: paste the
          content, optionally add email headers, and get an AI-assisted readout
          that explains what looks suspicious and what to verify next.
        </p>
        <p className={p}>
          This page is for people actively searching for a{" "}
          <strong className="font-semibold text-ph-text">phishing detector</strong>{" "}
          or <strong className="font-semibold text-ph-text">phishing checker</strong>{" "}
          they can use immediately. The tool lives on the{" "}
          <Link href={SEO_PATHS.home} className={link}>
            PhishCheck homepage
          </Link>
          ; scroll to the analyzer or use the CTA below.
        </p>

        <h2 className={h2}>How PhishCheck evaluates phishing risk</h2>
        <p className={p}>
          PhishCheck looks for high-risk combinations: impersonation of trusted
          brands, manufactured urgency, credential harvesting language, unsafe
          link patterns, and inconsistencies that are common in social
          engineering. When you include raw headers, the model can incorporate
          authentication signals that often expose spoofed senders.
        </p>

        <h2 className={h2}>Common signs the message may be phishing</h2>
        <ul className={ul}>
          <li>
            A sender that looks &quot;almost&quot; right, with small domain or
            display-name tricks
          </li>
          <li>
            Pressure to act in minutes or hours, especially involving money or
            account access
          </li>
          <li>
            Links that do not match the company you expect, or shortened URLs
            hiding the destination
          </li>
          <li>
            Requests for MFA codes, passwords, or &quot;verification&quot; outside
            normal app flows
          </li>
          <li>
            Unexpected attachments, invoices, or &quot;open this file&quot; prompts
          </li>
        </ul>

        <h2 className={h2}>Phishing checker vs. clicking &quot;Report spam&quot;</h2>
        <p className={p}>
          Reporting is important for providers, but it does not always tell you
          whether <em>this specific</em> message targeted you cleverly. A phishing
          checker helps you learn the &quot;why&quot; behind the suspicion so you can
          make safer decisions the next time something similar arrives.
        </p>

        <h2 className={h2}>Related guides & tools</h2>
        <p className={p}>
          Go deeper with{" "}
          <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
            how to tell if an email is a phishing scam
          </Link>{" "}
          and{" "}
          <Link href={SEO_PATHS.guideLinkSafe} className={link}>
            how to check if a link is safe
          </Link>
          . If the message arrived by SMS, start with{" "}
          <Link href={SEO_PATHS.textScamChecker} className={link}>
            text message scam checker
          </Link>{" "}
          and{" "}
          <Link href={SEO_PATHS.guideTextScam} className={link}>
            signs a text message is a scam
          </Link>
          .
        </p>
      </article>
      <PhishCheckSeoCta />
    </SeoMarketingLayout>
  );
}
