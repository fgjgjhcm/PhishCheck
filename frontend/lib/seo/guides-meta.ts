import type { GuideSlug } from "@/lib/seo/paths";

export type GuideMeta = {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
};

export const GUIDE_META: Record<GuideSlug, GuideMeta> = {
  "how-to-tell-if-an-email-is-a-phishing-scam": {
    title: "How to Tell If an Email Is a Phishing Scam (Practical Checklist)",
    description:
      "Learn how to spot phishing emails: red flags in sender, links, urgency, and attachments—plus how to verify safely and use PhishCheck for a second opinion.",
    datePublished: "2025-01-15",
    dateModified: "2026-04-04",
  },
  "signs-a-text-message-is-a-scam": {
    title: "Signs a Text Message Is a Scam (Smishing Red Flags)",
    description:
      "Smishing texts imitate banks, carriers, and delivery companies. Here are the clearest warning signs—and how to check suspicious SMS copy with PhishCheck.",
    datePublished: "2025-01-20",
    dateModified: "2026-04-04",
  },
  "paypal-phishing-email-example": {
    title: "PayPal Phishing Email Example: What It Looks Like",
    description:
      "Realistic PayPal phishing patterns, sample language attackers use, and how to tell a fake notice from a legitimate account message.",
    datePublished: "2025-02-01",
    dateModified: "2026-04-04",
  },
  "amazon-scam-email-example": {
    title: "Amazon Scam Email Example: Orders, Locked Accounts & Fake Invoices",
    description:
      "How Amazon-themed phishing emails pressure you to act fast—and how to verify purchases and sign-ins without clicking risky links.",
    datePublished: "2025-02-05",
    dateModified: "2026-04-04",
  },
  "how-to-check-if-a-link-is-safe": {
    title: "How to Check If a Link Is Safe Before You Click",
    description:
      "Inspect URLs, use safer verification habits, and understand what a suspicious link can hide—then paste context into PhishCheck when you are unsure.",
    datePublished: "2025-02-10",
    dateModified: "2026-04-04",
  },
};
