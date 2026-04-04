"use client";

import { useCallback, useEffect, useState } from "react";

import { generateShareText } from "@/lib/generate-share-text";
import type { AnalyzeResponse } from "@/lib/phishcheck-types";

const TOAST_MS = 2500;

type ShareResultButtonProps = {
  result: AnalyzeResponse;
};

export function ShareResultButton({ result }: ShareResultButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const text = generateShareText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [result]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), TOAST_MS);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div className="mt-3 w-full max-w-md space-y-1.5">
      <button
        type="button"
        onClick={() => void handleShare()}
        className="w-full rounded-xl bg-[var(--ph-share-btn-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--ph-share-btn-fg)] shadow-sm shadow-black/15 transition-[background-color,color,transform,box-shadow] duration-200 hover:bg-[var(--ph-share-btn-hover)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-card)] motion-reduce:active:scale-100"
      >
        Share result
      </button>
      {copied ? (
        <p
          className="text-center text-xs font-medium text-[var(--ph-share-toast)]"
          role="status"
          aria-live="polite"
        >
          Copied to clipboard
        </p>
      ) : null}
      <p className="text-center text-[0.6875rem] leading-snug text-ph-muted">
        Share this result to warn others
      </p>
    </div>
  );
}
