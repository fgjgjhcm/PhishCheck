"use client";

import { redirectToStripeCheckout } from "@/lib/plan";
import { useEffect } from "react";

type PaywallModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PaywallModal({ open, onClose }: PaywallModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-[101] w-full max-w-md overflow-hidden rounded-2xl border border-ph-border bg-ph-card shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45),0_0_0_1px_var(--ph-shell-glow)] transition-[background-color,border-color] duration-200">
        <div className="border-b border-ph-border bg-gradient-to-br from-ph-accent-soft/90 via-ph-card to-ph-panel-muted px-6 py-5 transition-colors duration-200">
          <h2
            id="paywall-title"
            className="text-lg font-bold tracking-tight text-ph-text sm:text-xl"
          >
            Unlock unlimited scans
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ph-muted">
            You&apos;ve used your 3 free scans for today.
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ph-muted">
            Benefits
          </p>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ph-text">
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ph-primary"
                aria-hidden
              />
              Unlimited phishing scans
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ph-primary"
                aria-hidden
              />
              Faster analysis
            </li>
            <li className="flex gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ph-primary"
                aria-hidden
              />
              Stay protected from scams
            </li>
          </ul>
          <div className="mt-6 rounded-xl border border-ph-accent-border bg-ph-accent-soft/50 px-4 py-3 transition-colors duration-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-ph-muted">
              Price
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ph-text">
              $5
              <span className="text-base font-semibold text-ph-muted">
                /month
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => redirectToStripeCheckout()}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-ph-primary px-6 text-sm font-semibold text-white shadow-md shadow-black/15 transition-[background-color,box-shadow,transform] duration-200 hover:bg-ph-primary-hover hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] active:scale-[0.985]"
          >
            Upgrade to Pro
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ph-muted">
            One missed phishing scam can cost far more than a subscription.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full text-center text-sm font-medium text-ph-muted underline-offset-4 transition-colors hover:text-ph-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)]"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
