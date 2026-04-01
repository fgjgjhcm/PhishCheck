import type { RiskLevel } from "@/lib/phishcheck-types";

/**
 * Stay protected recommendation cards — swap `href` (or map `id` → env-driven URLs) for production affiliates.
 */
export type StayProtectedItem = {
  /** Stable id for analytics and future config mapping */
  id: string;
  category: string;
  /** Ties the tool to phishing risk (shown on the card) */
  rationale: string;
  ctaLabel: string;
  /**
   * Outbound URL — replace with partner/affiliate URLs when ready.
   * Placeholders point at well-known vendors (no tracking params).
   */
  href: string;
  /** Reserved: e.g. env key or network id for future link builders */
  affiliatePlaceholderKey?: string;
  emphasized?: boolean;
};

export const STAY_PROTECTED_ITEMS: StayProtectedItem[] = [
  {
    id: "password_manager",
    category: "Password manager",
    rationale:
      "Phishing often leads to stolen passwords. A manager limits reuse and caps damage if one site is compromised.",
    ctaLabel: "Protect your accounts",
    href: "https://bitwarden.com/",
    affiliatePlaceholderKey: "AFFILIATE_PASSWORD_MANAGER_URL",
    emphasized: true,
  },
  {
    id: "vpn",
    category: "VPN / secure browsing",
    rationale:
      "Clicking risky links on public or untrusted networks can expose traffic. A VPN adds encryption when you’re away from a known-safe connection.",
    ctaLabel: "Secure your browsing",
    href: "https://protonvpn.com/",
    affiliatePlaceholderKey: "AFFILIATE_VPN_URL",
  },
];

export type StayProtectedSectionMeta = {
  title: string;
  subtitle: string;
};

/** Shown only for High and Medium risk; Low returns null (section hidden). */
export function stayProtectedSectionMeta(
  risk: RiskLevel
): StayProtectedSectionMeta | null {
  switch (risk) {
    case "High":
      return {
        title: "This looks like a phishing attempt — protect yourself",
        subtitle:
          "These are practical safeguards that limit what an attacker can do next—without replacing official verification steps.",
      };
    case "Medium":
      return {
        title: "This might be suspicious — here’s how to stay safe",
        subtitle:
          "Until you’ve confirmed the message through a separate, trusted channel, reducing exposure is worthwhile.",
      };
    default:
      return null;
  }
}
