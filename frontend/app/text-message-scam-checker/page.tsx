import type { Metadata } from "next";
import Link from "next/link";

import { PhishCheckSeoCta } from "@/components/seo/PhishCheckSeoCta";
import { SeoMarketingLayout } from "@/components/seo/SeoMarketingLayout";
import { absoluteUrl } from "@/lib/site-config";
import { SEO_PATHS } from "@/lib/seo/paths";

const path = SEO_PATHS.textScamChecker;
const url = absoluteUrl(path);
const title = "Text Message Scam Checker & Phishing Text Detector";
const description =
  "Check smishing texts and suspicious SMS for scam patterns. Paste the message into PhishCheck—your text scam checker for fast AI-assisted triage.";

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

export default function TextScamCheckerPage() {
  return (
    <SeoMarketingLayout>
      <article className="isolate overflow-clip rounded-2xl border border-ph-border bg-ph-card p-6 shadow-[var(--ph-shell-card-shadow)] sm:p-8 md:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-ph-text sm:text-3xl md:text-[2rem] md:leading-tight">
          Text message scam checker
        </h1>
        <p className={p}>
          Smishing texts imitate banks, delivery carriers, government agencies,
          and even coworkers—usually with a link or a callback number that moves
          the attack forward. A dedicated{" "}
          <strong className="font-semibold text-ph-text">
            text scam checker
          </strong>{" "}
          gives you a structured read on urgency, impersonation, and risky
          language before you tap anything.
        </p>
        <p className={p}>
          PhishCheck doubles as a{" "}
          <strong className="font-semibold text-ph-text">
            phishing text detector
          </strong>
          : copy the SMS (including the URL as written), paste it into the tool,
          and review the assessment alongside your common sense.
        </p>

        <h2 className={h2}>Why SMS scams work so well</h2>
        <p className={p}>
          Texts feel personal and immediate. Attackers exploit notification
          habits: you might tap a &quot;package on hold&quot; link without thinking.
          PhishCheck slows that reflex by naming the specific patterns that
          commonly appear in smishing.
        </p>

        <h2 className={h2}>Signals a text may be a scam</h2>
        <ul className={ul}>
          <li>Unsolicited &quot;problem&quot; alerts tied to money or accounts</li>
          <li>Links shortened or obscured, or domains you do not recognize</li>
          <li>Requests for PINs, codes, or &quot;verification&quot; by reply</li>
          <li>Threats of closure, legal action, or tax penalties</li>
          <li>Messages that do not match how the company normally contacts you</li>
        </ul>

        <h2 className={h2}>What to do if the text mentions a link</h2>
        <p className={p}>
          Avoid tapping. Open the official app or site directly, or call the
          number on your card—not the one in the SMS. For a deeper walkthrough,
          read{" "}
          <Link href={SEO_PATHS.guideLinkSafe} className={link}>
            how to check if a link is safe
          </Link>
          .
        </p>

        <h2 className={h2}>Guides & related tools</h2>
        <p className={p}>
          Start with{" "}
          <Link href={SEO_PATHS.guideTextScam} className={link}>
            signs a text message is a scam
          </Link>
          , then compare notes with{" "}
          <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
            email phishing red flags
          </Link>{" "}
          (many campaigns run in parallel across channels). When you are ready,
          use the{" "}
          <Link href={SEO_PATHS.phishingChecker} className={link}>
            phishing checker
          </Link>{" "}
          overview or jump to the{" "}
          <Link href={`${SEO_PATHS.home}#phishcheck-tool`} className={link}>
            live tool
          </Link>
          .
        </p>
      </article>
      <PhishCheckSeoCta />
    </SeoMarketingLayout>
  );
}
