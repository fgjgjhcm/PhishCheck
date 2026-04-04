import Link from "next/link";
import type { ReactNode } from "react";

import type { GuideSlug } from "@/lib/seo/paths";
import { SEO_PATHS } from "@/lib/seo/paths";

const p = "text-[0.9375rem] leading-relaxed text-ph-muted";
const h2 = "mt-10 text-xl font-bold tracking-tight text-ph-text scroll-mt-24";
const h3 = "mt-6 text-lg font-semibold tracking-tight text-ph-text";
const ul = "mt-3 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ph-muted";
const link =
  "font-medium text-ph-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]";

function RelatedBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 rounded-xl border border-ph-border bg-ph-panel-muted/80 p-5 transition-colors duration-200">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ph-muted">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-ph-muted">
        {children}
      </div>
    </section>
  );
}

export function GuideArticleBody({ slug }: { slug: GuideSlug }) {
  switch (slug) {
    case "how-to-tell-if-an-email-is-a-phishing-scam":
      return (
        <>
          <p className={p}>
            Phishing emails are designed to feel ordinary: a shipping update, a
            payroll notice, a security alert. The goal is the same—get you to
            click, log in, call a number, or open an attachment before you have
            time to think. The good news is that most phishing emails still
            leave a trail of inconsistencies once you know what to look for.
          </p>
          <h2 className={h2}>Start with the story, not the logo</h2>
          <p className={p}>
            Attackers borrow brand names and copy legitimate layouts. Treat
            branding as untrusted by default. Ask: does this message{" "}
            <em>need</em> something sensitive from you right now—passwords, MFA
            codes, bank details—or does it push you toward a link that is not
            strictly necessary? Legitimate services rarely need you to &quot;verify
            everything&quot; through a surprise email.
          </p>
          <h2 className={h2}>Inspect the sender carefully</h2>
          <p className={p}>
            Look at the full address, not just the display name. Typos,
            extra words, or domains that are &quot;close enough&quot; to a real
            company are common. Also watch for look‑alike domains (for example,
            extra hyphens, country codes you do not expect, or free email
            providers pretending to be enterprise support).
          </p>
          <h3 className={h3}>Headers can reveal spoofing clues</h3>
          <p className={p}>
            If you have raw email headers (for example{" "}
            <code className="rounded bg-ph-input px-1 py-0.5 font-mono text-xs text-ph-text ring-1 ring-ph-border">
              Authentication-Results
            </code>
            ), they can show whether SPF, DKIM, and DMARC align with the claimed
            sender. PhishCheck accepts optional headers so the model can weigh
            authentication context alongside the message body.
          </p>
          <h2 className={h2}>Links: hover, copy, and compare</h2>
          <p className={p}>
            Before clicking, compare the visible text to the real destination.
            Short links, redirects, and misspelled hostnames are frequent in
            phishing. When in doubt, open the service by typing the known domain
            yourself—or use your password manager&apos;s saved entry, which only
            fills on the real site.
          </p>
          <p className={p}>
            For a structured walkthrough, see our guide on{" "}
            <Link href={SEO_PATHS.guideLinkSafe} className={link}>
              how to check if a link is safe
            </Link>
            .
          </p>
          <h2 className={h2}>Urgency, fear, and &quot;helpful&quot; pressure</h2>
          <p className={p}>
            Phishing thrives on time pressure: &quot;within 24 hours,&quot;
            &quot;your account will be closed,&quot; &quot;unusual login from
            another country.&quot; Slow down. Open the official app or site from a
            bookmark, review notifications there, or call the number printed on
            your card—not the one in the email.
          </p>
          <h2 className={h2}>Attachments and unexpected downloads</h2>
          <p className={p}>
            Unexpected invoices, &quot;secure message&quot; HTML files, and macro
            documents are common malware delivery paths. If you did not expect
            the file, do not open it. Ask the sender through a separate channel
            you already trust.
          </p>
          <h2 className={h2}>When you are unsure, get a second opinion</h2>
          <p className={p}>
            Paste the email (and optional headers) into{" "}
            <Link href={SEO_PATHS.home} className={link}>
              PhishCheck
            </Link>{" "}
            for an AI-assisted triage readout. It is not a guarantee, but it
            can surface risky patterns and give you plain-language questions to
            ask before you act.
          </p>
          <h2 className={h2}>Build a simple verification habit</h2>
          <p className={p}>
            Most successful phishing relies on speed. A repeatable habit beats
            memorizing every attack type: pause, compare the request to how the
            service normally behaves, open the app from a trusted install, and
            only then decide whether the email deserves follow-up. If the message
            references an action you can check independently—payroll, a purchase,
            a login alert—verify that fact through the official interface rather
            than through the email channel.
          </p>
          <p className={p}>
            Over time, you calibrate your instincts without becoming paranoid.
            PhishCheck is there for the edge cases where expertise would help but
            you do not have hours to spare: one paste, a clear risk framing, and
            concrete next checks.
          </p>
          <RelatedBlock title="Related">
            <p>
              <Link href={SEO_PATHS.phishingChecker} className={link}>
                Phishing checker
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.emailScamChecker} className={link}>
                Email scam checker
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.guidePaypal} className={link}>
                PayPal phishing example
              </Link>
            </p>
          </RelatedBlock>
        </>
      );

    case "signs-a-text-message-is-a-scam":
      return (
        <>
          <p className={p}>
            Smishing (SMS phishing) works because texts feel immediate and
            personal. A single message can impersonate your bank, a delivery
            company, or even a coworker. Because SMS is short, attackers rely on
            a handful of repeatable tricks—once you recognize them, most scams
            become easy to spot.
          </p>
          <h2 className={h2}>Unexpected &quot;problems&quot; that need you to tap</h2>
          <p className={p}>
            Fraud texts often claim a package is on hold, a payment failed, or
            your account is restricted. They want you to tap a link before you
            verify the story anywhere else. If you were not expecting the
            message, pause and check inside the official app or website.
          </p>
          <h2 className={h2}>Links that hide the real destination</h2>
          <p className={p}>
            Short URLs and odd domains are common in smishing. Treat every link
            as suspicious unless you can confirm the sender. When possible,
            avoid tapping—navigate to the service yourself.
          </p>
          <h2 className={h2}>Requests for codes, PINs, or &quot;verification&quot;</h2>
          <p className={p}>
            Legitimate banks and apps rarely ask you to text back one-time codes
            or passwords. Messages that ask you to &quot;confirm&quot; sensitive
            data by reply are high risk.
          </p>
          <h2 className={h2}>Pressure and threats</h2>
          <p className={p}>
            &quot;Act now or your account will be closed&quot; is a classic
            pattern. Real fraud departments may contact you, but they will not
            force you through a mystery link in the same breath.
          </p>
          <h2 className={h2}>Wrong details that almost look right</h2>
          <p className={p}>
            Watch for slightly wrong company names, odd punctuation, or
            robotic phrasing. Scammers blast huge volumes; their copy is often
            generic.
          </p>
          <h2 className={h2}>How PhishCheck helps with suspicious texts</h2>
          <p className={p}>
            Copy the SMS—including the link text—and paste it into{" "}
            <Link href={`${SEO_PATHS.home}#phishcheck-tool`} className={link}>
              PhishCheck
            </Link>
            . You will get a structured look at urgency, impersonation patterns,
            and risky language. Pair that with a quick check in your real banking
            or shipping app.
          </p>
          <h2 className={h2}>If you already tapped a link</h2>
          <p className={p}>
            Do not panic, but act deliberately: disconnect from unusually slow
            networks if you suspect a drive-by prompt, close unexpected download
            dialogs, avoid entering credentials, and rotate passwords from a clean
            device if you did enter them. Report the incident through your carrier
            or bank using official support channels, and preserve a screenshot of
            the text for documentation when appropriate.
          </p>
          <RelatedBlock title="Related">
            <p>
              <Link href={SEO_PATHS.textScamChecker} className={link}>
                Text message scam checker
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.guideLinkSafe} className={link}>
                How to check if a link is safe
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
                How to tell if an email is phishing
              </Link>
            </p>
          </RelatedBlock>
        </>
      );

    case "paypal-phishing-email-example":
      return (
        <>
          <p className={p}>
            PayPal-themed phishing is popular because almost everyone recognizes
            the brand—and because account and payment emails are normal. Attackers
            mimic subject lines like &quot;You&apos;ve received a payment,&quot;
            &quot;Unusual activity,&quot; or &quot;Confirm your information.&quot;
            Below are patterns that show up again and again, even when the
            layout looks polished.
          </p>
          <h2 className={h2}>Example subject lines attackers reuse</h2>
          <ul className={ul}>
            <li>&quot;Your account has been limited—verify now&quot;</li>
            <li>&quot;Payment received: open invoice&quot;</li>
            <li>&quot;Security alert: new device sign-in&quot;</li>
            <li>&quot;Action required: confirm tax details&quot;</li>
          </ul>
          <h2 className={h2}>What the body usually asks you to do</h2>
          <p className={p}>
            The email may urge you to click a button to &quot;restore
            access,&quot; &quot;release funds,&quot; or &quot;avoid suspension.&quot;
            The destination is often a look‑alike login page designed to harvest
            credentials and sometimes MFA codes.
          </p>
          <h2 className={h2}>Red flags in PayPal-themed phishing</h2>
          <ul className={ul}>
            <li>
              Generic greeting (&quot;Dear customer&quot;) with high-stakes claims
            </li>
            <li>Links that do not resolve to PayPal&apos;s official domains</li>
            <li>Requests to install remote software or &quot;verify&quot; via a phone call</li>
            <li>Threats that your money will be frozen unless you act immediately</li>
          </ul>
          <h2 className={h2}>How to verify safely</h2>
          <p className={p}>
            Open PayPal directly from an app you installed from an official store,
            or type{" "}
            <span className="font-mono text-ph-text">paypal.com</span> yourself.
            Review notifications and recent activity there—not through the email
            link.
          </p>
          <h2 className={h2}>Sample language (illustrative, not real)</h2>
          <p className={p}>
            &quot;We noticed unusual login attempts. To prevent permanent closure,
            verify your identity here within 12 hours.&quot; That combination of
            fear plus a deadline is a strong phishing signal—especially if the
            link domain is unfamiliar.
          </p>
          <p className={p}>
            Paste suspicious messages into{" "}
            <Link href={SEO_PATHS.phishingChecker} className={link}>
              PhishCheck&apos;s phishing checker
            </Link>{" "}
            for a quick triage summary before you interact with the sender.
          </p>
          <h2 className={h2}>Why PayPal scams stay popular</h2>
          <p className={p}>
            PayPal handles money movement for many people, so a fake notice feels
            plausible even when grammar or logic is slightly off. Attackers also
            know recipients may forward payment emails internally—so one
            convincing template can spread inside small businesses. Train yourself
            to treat every unexpected financial email as untrusted until verified
            in PayPal&apos;s authenticated session.
          </p>
          <RelatedBlock title="Related">
            <p>
              <Link href={SEO_PATHS.guideAmazon} className={link}>
                Amazon scam email example
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.emailScamChecker} className={link}>
                Email scam checker
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
                Email phishing checklist
              </Link>
            </p>
          </RelatedBlock>
        </>
      );

    case "amazon-scam-email-example":
      return (
        <>
          <p className={p}>
            Amazon-branded scams often exploit what you already expect: order
            confirmations, delivery issues, and Prime membership notices. Because
            real Amazon emails are frequent, attackers blend in with plausible
            stories and time-sensitive language.
          </p>
          <h2 className={h2}>Common Amazon phishing narratives</h2>
          <ul className={ul}>
            <li>A large order you did not place—&quot;click to dispute&quot;</li>
            <li>A failed payment that will cancel your account</li>
            <li>A &quot;locked&quot; account that needs immediate verification</li>
            <li>Fake invoices or receipts with malware attachments</li>
          </ul>
          <h2 className={h2}>What attackers want</h2>
          <p className={p}>
            Most Amazon-themed phishing aims for your Amazon password, stored
            payment methods, or a path to social engineering (&quot;call this
            number&quot;). Some campaigns push you to buy gift cards or transfer
            money to &quot;resolve&quot; a fake problem.
          </p>
          <h2 className={h2}>Warning signs</h2>
          <ul className={ul}>
            <li>Links that do not go to Amazon&apos;s official domains</li>
            <li>Emails that demand gift cards or wire transfers</li>
            <li>Pressure to install remote access software</li>
            <li>Requests for banking credentials outside Amazon&apos;s normal flows</li>
          </ul>
          <h2 className={h2}>Verify through Your Orders</h2>
          <p className={p}>
            In the Amazon app or website, open{" "}
            <strong className="font-semibold text-ph-text">Your Orders</strong>{" "}
            and message support from inside the account if something looks wrong.
            Do not use phone numbers or links from the suspicious email.
          </p>
          <h2 className={h2}>Practice with PhishCheck</h2>
          <p className={p}>
            Paste the suspicious email into{" "}
            <Link href={SEO_PATHS.emailScamChecker} className={link}>
              PhishCheck&apos;s email scam checker
            </Link>{" "}
            to highlight impersonation patterns and risky phrasing. Combine that
            with an order check in your real Amazon session.
          </p>
          <h2 className={h2}>Gift cards and refund loops</h2>
          <p className={p}>
            Many Amazon scams pivot to &quot;customer service&quot; instructions
            that involve buying gift cards, sharing card codes, or receiving a
            fake refund then sending money elsewhere. No legitimate retail
            resolution should require those steps. If someone on the phone ties
            urgency to gift cards, end the conversation and contact Amazon
            through official support.
          </p>
          <RelatedBlock title="Related">
            <p>
              <Link href={SEO_PATHS.guidePaypal} className={link}>
                PayPal phishing example
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.guideLinkSafe} className={link}>
                Check if a link is safe
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.phishingChecker} className={link}>
                Phishing checker
              </Link>
            </p>
          </RelatedBlock>
        </>
      );

    case "how-to-check-if-a-link-is-safe":
      return (
        <>
          <p className={p}>
            Links are the hinge point of most phishing: one click can open a
            fake login page, download malware, or send you down a chain of
            redirects. You do not need to be a security expert to apply a few
            habits that eliminate most risky clicks.
          </p>
          <h2 className={h2}>Read the hostname, not the headline</h2>
          <p className={p}>
            Phishers use misleading labels. The visible text may say
            &quot;Amazon,&quot; but the URL might point to an unrelated domain.
            On desktop, hover carefully (or long-press on mobile) to preview the
            destination. If you cannot see the full URL clearly, do not click.
          </p>
          <h2 className={h2}>Watch for look‑alike domains</h2>
          <p className={p}>
            Small edits fool busy readers: extra words, swapped letters,
            hyphens, or plausible subdomains on unrelated roots. Compare against
            the official domain you already know—not against what the email
            claims.
          </p>
          <h2 className={h2}>Short links and redirect chains</h2>
          <p className={p}>
            URL shorteners hide the destination. Treat them as suspicious in any
            unexpected message. If a coworker truly sent a short link, confirm
            through chat or call on a known number.
          </p>
          <h2 className={h2}>Prefer typing the site yourself</h2>
          <p className={p}>
            For banks, email, and shopping, open the service from a bookmark or
            typed domain. Then find the same notification inside the app. This
            bypasses most link tricks entirely.
          </p>
          <h2 className={h2}>When the message is ambiguous, paste it into PhishCheck</h2>
          <p className={p}>
            Copy the full message—including the link text—and run it through{" "}
            <Link href={SEO_PATHS.phishingChecker} className={link}>
              PhishCheck
            </Link>
            . You will get structured guidance on urgency, impersonation, and
            suspicious patterns. It is triage, not a guarantee—but it helps you
            decide whether the link deserves deeper investigation.
          </p>
          <h2 className={h2}>Pair tools with common sense</h2>
          <p className={p}>
            No automated check replaces verifying payments, payroll, or account
            changes through official channels. PhishCheck is built to accelerate
            that first &quot;is this sketchy?&quot; decision so you can act with
            more confidence.
          </p>
          <h2 className={h2}>QR codes and social “special offers”</h2>
          <p className={p}>
            Links are not only in email: QR codes on posters, DMs, and forum posts
            can route to credential traps. Apply the same rule—identify the real
            hostname and compare it to what you expect—before scanning. When the
            context is compressed (a short caption plus a QR), paste any
            accompanying text into PhishCheck if something feels staged or too
            generous to be true.
          </p>
          <RelatedBlock title="Related">
            <p>
              <Link href={SEO_PATHS.guideEmailPhishing} className={link}>
                How to tell if an email is phishing
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.textScamChecker} className={link}>
                Text scam checker
              </Link>{" "}
              ·{" "}
              <Link href={SEO_PATHS.home} className={link}>
                Open the tool
              </Link>
            </p>
          </RelatedBlock>
        </>
      );

    default:
      return null;
  }
}
