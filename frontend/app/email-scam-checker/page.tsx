import type { Metadata } from "next";
import Link from "next/link";

import { PhishCheckSeoCta } from "@/components/seo/PhishCheckSeoCta";
import { SeoMarketingLayout } from "@/components/seo/SeoMarketingLayout";
import { absoluteUrl } from "@/lib/site-config";
import { SEO_PATHS } from "@/lib/seo/paths";

const path = SEO_PATHS.emailScamChecker;
const url = absoluteUrl(path);
const title = "Email Scam Checker & Phishing Email Checker";
const description =
  "Check suspicious emails for scam and phishing patterns. Paste the message and optional headers into PhishCheck for AI-assisted analysis, risk signals, and safer next steps.";

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

const p = "mt-4 text-[0.9375rem] leading-relaxed text-ph-muted";
const h2 = "mt-10 text-xl font-bold tracking-tight text-ph-text";
const ul = "mt-4 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ph-muted";
const link =
  "font-medium text-ph-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]";

export default function EmailScamCheckerPage() {
  return (
    <SeoMarketingLayout>
      <article className="isolate overflow-clip rounded-2xl border border-ph-border bg-ph-card p-6 shadow-[var(--ph-shell-card-shadow)] sm:p-8 md:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-ph-text sm:text-3xl md:text-[2rem] md:leading-tight">
          Email scam checker & phishing email checker
        </h1>
        <p className={p}>
          Email is still the #1 delivery channel for scams: fake invoices, payroll
          fraud, account lockouts, and spear-phishing that references real names
          and projects. An{" "}
          <strong className="font-semibold text-ph-text">email scam checker</strong>{" "}
          helps you respond with evidence instead of panic—especially when the
          message is convincing enough to pass a quick glance.
        </p>
        <p className={p}>
          PhishCheck works as a{" "}
          <strong className="font-semibold text-ph-text">
            phishing email checker
          </strong>
          : paste the full email text, add optional raw headers when you have
          them, and review a structured assessment in seconds.
        </p>

        <h2 className={h2}>What to paste for the best results</h2>
        <p className={p}>
          Include the subject line, salutation, body, and signature. If you can
          export headers from your mail client, add{" "}
          <code className="rounded bg-ph-input px-1 py-0.5 font-mono text-xs text-ph-text ring-1 ring-ph-border">
            Authentication-Results
          </code>{" "}
          and routing fields—those details help distinguish spoofing from
          legitimate mail.
        </p>

        <h2 className={h2}>Email scam patterns PhishCheck is built to catch</h2>
        <ul className={ul}>
          <li>Brand impersonation with high-stakes claims (HR, IT, finance)</li>
          <li>Credential harvesting and fake login flows</li>
          <li>Malicious attachments disguised as documents or invoices</li>
          <li>BEC-style requests to change payment details or buy gift cards</li>
          <li>Urgent callbacks to unknown phone numbers</li>
        </ul>

        <h2 className={h2}>After you run the email scam checker</h2>
        <p className={p}>
          Treat the output as triage, not a court verdict. If the message
          involves money movement, access changes, or personal data, confirm
          through a channel you already trust—company directory, app support chat,
          or a known-good phone number.
        </p>

        <h2 className={h2}>Learn more, then check the message</h2>
        <p className={p}>
          Read{" "}
          <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
            how to tell if an email is a phishing scam
          </Link>{" "}
          for a practical checklist. For brand-themed examples, see{" "}
          <Link href={SEO_PATHS.guidePaypal} className={link}>
            PayPal phishing examples
          </Link>{" "}
          and{" "}
          <Link href={SEO_PATHS.guideAmazon} className={link}>
            Amazon scam email examples
          </Link>
          . Then open the{" "}
          <Link href={`${SEO_PATHS.home}#phishcheck-tool`} className={link}>
            PhishCheck analyzer
          </Link>
          .
        </p>
        <p className={p}>
          Prefer a broader entry point? Use the{" "}
          <Link href={SEO_PATHS.phishingChecker} className={link}>
            phishing checker
          </Link>{" "}
          landing page for terminology and FAQs.
        </p>
      </article>
      <PhishCheckSeoCta />
    </SeoMarketingLayout>
  );
}
