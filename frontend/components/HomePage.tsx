"use client";

import Link from "next/link";

import { AnalysisResult } from "@/components/AnalysisResult";
import { PaywallModal } from "@/components/PaywallModal";
import { PhishCheckLogoMark } from "@/components/PhishCheckLogoMark";
import { PlanDevTools } from "@/components/PlanDevTools";
import { PlanToast } from "@/components/PlanToast";
import { StayProtectedSection } from "@/components/StayProtectedSection";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { formatReport } from "@/lib/format-report";
import {
  getRemainingScans,
  incrementScanUsage,
  isProUser,
  isScanAllowed,
  unlockPro,
} from "@/lib/plan";
import { getOrCreateSessionId } from "@/lib/phishcheck-session";
import type { AnalyzeResponse } from "@/lib/phishcheck-types";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const EXAMPLES = {
  phishing: {
    label: "Phishing-style",
    text: `Subject: ACTION REQUIRED: Verify payroll deposit

Dear Employee,

Our records show your direct deposit failed. You must verify your banking details within 24 hours or your pay will be delayed.

Click here now: http://198.51.100.77/secure-payroll-update

Urgent — IT Payroll`,
    headers: "",
  },
  benign: {
    label: "Benign",
    text: `Hi team,

Reminder: lunch is at noon tomorrow at the usual spot. No links or attachments—just a heads-up.

Thanks,
Alex`,
    headers: "",
  },
  withHeaders: {
    label: "With headers",
    text: `We detected unusual sign-in activity on your account. Please confirm your identity at https://login.microsoft-verify.example.net/signin within 1 hour.

— Microsoft Security`,
    headers: `Authentication-Results: mx.example.com; dkim=fail (body hash did not verify) header.d=corp-outbound.net; spf=pass; dmarc=pass
Received: from mail-notify.example.net ([203.0.113.50])
From: "Microsoft 365 Security" <security-alert@microsoft365-verify.net>
Return-Path: <bounces@microsoft365-verify.net>`,
  },
} as const;

const inputClass =
  "w-full resize-y rounded-xl border border-ph-border bg-ph-input px-4 py-3 text-sm leading-relaxed text-ph-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] outline-none ring-offset-2 ring-offset-[var(--ph-page-bg)] transition-[background-color,border-color,color,box-shadow] duration-200 placeholder:text-ph-muted/75 hover:border-ph-border-subtle focus:border-ph-primary focus:ring-2 focus:ring-ph-primary/25 focus-visible:outline-none disabled:opacity-60";

const secondaryBtnClass =
  "inline-flex h-11 min-w-[6.5rem] items-center justify-center rounded-xl border border-ph-border bg-ph-card px-5 text-sm font-semibold text-ph-text shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:border-ph-primary/35 hover:bg-ph-accent-soft active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100";

const primaryBtnClass =
  "inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-ph-primary px-6 text-sm font-semibold text-white shadow-md shadow-black/15 transition-[background-color,box-shadow,transform] duration-200 hover:bg-ph-primary-hover hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-md disabled:hover:bg-ph-primary disabled:active:scale-100 sm:flex-none sm:min-w-[11rem]";

const exampleChipBtnClass =
  "rounded-lg border border-ph-border bg-ph-card px-3 py-1.5 text-xs font-semibold text-ph-text shadow-sm transition-[background-color,border-color,transform] duration-200 hover:border-ph-accent-border hover:bg-ph-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ph-page-bg)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

/** Stable on server + first client paint; avoids hydration mismatch with localStorage / date. */
const SCAN_STATUS_SSR_FALLBACK = "3 free scans per day";

function ResultsEmptyState({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ph-accent-border bg-gradient-to-b from-ph-accent-soft/80 via-ph-card/50 to-ph-panel-muted px-6 py-10 text-center shadow-sm transition-[background-color,border-color] duration-200 motion-safe:animate-result-reveal motion-reduce:animate-none">
        <span
          className="relative h-8 w-8 rounded-full border-2 border-ph-primary/25 border-t-ph-primary motion-safe:animate-spin motion-reduce:animate-none"
          aria-hidden
        />
        <p className="mt-4 text-sm font-semibold tracking-tight text-ph-text">
          Running analysis…
        </p>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ph-muted">
          This usually takes a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-ph-border bg-ph-card/80 px-6 py-10 text-center shadow-sm transition-[background-color,border-color] duration-200">
      <p className="text-[0.9375rem] font-semibold tracking-tight text-ph-text">
        No analysis yet
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ph-muted">
        Paste a message, then run{" "}
        <span className="font-medium text-ph-text">Analyze message</span> to
        see risk level, signals, and guidance—without leaving this view.
      </p>
    </div>
  );
}

export function HomePage() {
  const [text, setText] = useState("");
  const [headers, setHeaders] = useState("");
  const [headersOpen, setHeadersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy report");
  const [resultRevealNonce, setResultRevealNonce] = useState(0);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, bumpPlanUi] = useState(0);
  const [planUiReady, setPlanUiReady] = useState(false);

  const refreshPlanUi = useCallback(() => {
    bumpPlanUi((n) => n + 1);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const loadExample = useCallback((key: keyof typeof EXAMPLES) => {
    const ex = EXAMPLES[key];
    setText(ex.text);
    setHeaders(ex.headers);
    setHeadersOpen(Boolean(ex.headers));
    setError(null);
    setResult(null);
    setCopyLabel("Copy report");
  }, []);

  const clearAll = useCallback(() => {
    setText("");
    setHeaders("");
    setHeadersOpen(false);
    setError(null);
    setResult(null);
    setCopyLabel("Copy report");
  }, []);

  const analyze = useCallback(async () => {
    setError(null);
    setResult(null);
    setCopyLabel("Copy report");
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Paste a message to analyze.");
      return;
    }

    if (!isScanAllowed()) {
      setPaywallOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message_text: trimmed,
          message_headers: headers.trim() || undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | AnalyzeResponse
        | { detail?: string | unknown }
        | null;

      if (!res.ok) {
        const detail =
          data && typeof data === "object" && "detail" in data
            ? data.detail
            : null;
        const msg =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail
                  .map((d) =>
                    typeof d === "object" && d && "msg" in d
                      ? String((d as { msg: unknown }).msg)
                      : String(d)
                  )
                  .join("; ")
              : `Request failed (${res.status})`;
        throw new Error(msg);
      }

      incrementScanUsage();
      setResult(data as AnalyzeResponse);
      setResultRevealNonce((n) => n + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [headers, text]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key !== "Enter") {
        return;
      }
      e.preventDefault();
      if (!loading) {
        void analyze();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [analyze, loading]);

  useEffect(() => {
    getOrCreateSessionId();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") !== "true") {
      return;
    }

    const alreadyPro = isProUser();
    if (!alreadyPro) {
      unlockPro();
      setToastMessage("PhishCheck Pro unlocked");
    }

    params.delete("success");
    const next = params.toString();
    const path = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", path);
    refreshPlanUi();
  }, [refreshPlanUi]);

  useEffect(() => {
    setPlanUiReady(true);
  }, []);

  const copyReport = useCallback(async () => {
    if (!result) {
      return;
    }
    const body = formatReport(text, headers, result);
    try {
      await navigator.clipboard.writeText(body);
      setCopyLabel("Copied!");
      window.setTimeout(() => setCopyLabel("Copy report"), 2000);
    } catch {
      setError("Could not copy to clipboard. Try selecting and copying manually.");
    }
  }, [headers, result, text]);

  const scanStatusLine = planUiReady
    ? isProUser()
      ? "Unlimited scans (Pro)"
      : (() => {
          const remaining = getRemainingScans();
          const r = remaining === "unlimited" ? 0 : remaining;
          const left =
            r === 0
              ? "No free scans left today"
              : `${r} free scan${r === 1 ? "" : "s"} left today`;
          return `3 free scans per day · ${left}`;
        })()
    : SCAN_STATUS_SSR_FALLBACK;

  const showProBadge = planUiReady && isProUser();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-ph-page via-ph-panel-muted to-ph-page transition-[background] duration-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,var(--ph-shell-glow),transparent_45%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1180px] px-3 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-5">
        <header className="mb-4 flex flex-col gap-4 sm:mb-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ph-accent-border bg-ph-accent-soft px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ph-text">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[var(--ph-success-dot)]"
                  aria-hidden
                />
                Private triage · No signup
              </span>
              {showProBadge ? (
                <span className="inline-flex items-center rounded-full border border-ph-method-badge-border bg-ph-method-badge-bg px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ph-method-badge-text">
                  Pro
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex items-center justify-center gap-3 sm:gap-3.5 lg:justify-start">
              <PhishCheckLogoMark
                framed
                className="h-5 w-5 text-ph-primary sm:h-6 sm:w-6"
                decorative
              />
              <p className="text-[1.625rem] font-bold tracking-tighter text-ph-text sm:text-[1.875rem]">
                PhishCheck
              </p>
            </div>
            <h1 className="mx-auto mt-3 max-w-2xl text-center text-[1.5rem] font-bold leading-tight tracking-tight text-ph-text sm:text-[1.75rem] lg:mx-0 lg:text-left">
              Check suspicious emails, texts, and links for phishing—in seconds
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-ph-muted sm:text-[0.9375rem] lg:mx-0 lg:text-left">
              AI-powered phishing checker: paste a message, add optional email
              headers for stronger signals, and get a clear risk readout with
              warning signs you can act on.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-center text-xs font-normal leading-relaxed text-ph-muted lg:mx-0 lg:text-left sm:text-sm">
              <Link
                href="#phishcheck-tool"
                className="font-semibold text-ph-primary underline-offset-2 hover:underline"
              >
                Jump to the tool
              </Link>
              <span className="text-ph-muted"> · </span>
              Paste-only workflow. Optional raw headers for DKIM, SPF, and
              DMARC context.{" "}
              <kbd className="rounded border border-ph-border bg-[var(--ph-kbd-bg)] px-1 py-0.5 font-mono text-[0.65rem] text-ph-text transition-colors duration-200">
                ⌘
              </kbd>
              +
              <kbd className="rounded border border-ph-border bg-[var(--ph-kbd-bg)] px-1 py-0.5 font-mono text-[0.65rem] text-ph-text transition-colors duration-200">
                Enter
              </kbd>{" "}
              to analyze.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-xs font-medium leading-relaxed text-ph-text/90 lg:mx-0 sm:text-sm">
              {scanStatusLine}
            </p>
          </div>
          <ThemeSwitcher />
        </header>

        <div
          id="phishcheck-tool"
          className="isolate overflow-clip scroll-mt-6 rounded-3xl border border-ph-border bg-ph-card shadow-[var(--ph-shell-card-shadow)] transition-[background-color,border-color,box-shadow] duration-200"
        >
          {error ? (
            <div
              role="alert"
              className="border-b border-[var(--ph-error-border)] bg-[var(--ph-error-bg)] px-4 py-3 text-sm text-[var(--ph-error-text)] sm:px-6"
            >
              <span className="font-semibold">Something went wrong. </span>
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 items-stretch lg:grid-cols-2 lg:items-start">
            {/* Input column — grows with page; no fixed height / no inner scroll trap */}
            <div className="flex min-w-0 flex-col border-ph-border bg-ph-card lg:border-r lg:border-ph-border transition-[background-color,border-color] duration-200">
              <div className="shrink-0 border-b border-ph-border bg-ph-panel px-5 py-3.5 transition-colors duration-200">
                <h2 className="text-xs font-semibold uppercase tracking-[0.07em] text-ph-muted">
                  Input
                </h2>
                <p className="mt-1 text-xs font-normal leading-relaxed text-ph-muted">
                  Message body and optional raw headers
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-ph-accent-border bg-ph-accent-soft/60 p-4 shadow-sm transition-[background-color,border-color] duration-200">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ph-muted">
                      Try an example
                    </p>
                    <p className="mt-1.5 text-xs font-normal leading-relaxed text-ph-muted">
                      Load a sample to preview the output structure.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(Object.keys(EXAMPLES) as (keyof typeof EXAMPLES)[]).map(
                        (key) => (
                          <button
                            key={key}
                            type="button"
                            disabled={loading}
                            onClick={() => loadExample(key)}
                            className={exampleChipBtnClass}
                          >
                            {EXAMPLES[key].label}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-semibold tracking-tight text-ph-text"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste the full message here…"
                      rows={9}
                      disabled={loading}
                      className={`${inputClass} mt-2 min-h-[200px]`}
                    />
                  </div>

                  <details
                    open={headersOpen}
                    onToggle={(e) =>
                      setHeadersOpen((e.target as HTMLDetailsElement).open)
                    }
                    className="rounded-xl border border-ph-border bg-ph-panel-muted transition-[background-color,border-color] duration-200 hover:border-ph-accent-border/80"
                  >
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold tracking-tight text-ph-text outline-none transition-colors hover:text-ph-text [&::-webkit-details-marker]:hidden focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ph-primary/25">
                      <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span>Optional: raw email headers</span>
                        <span className="text-xs font-medium text-ph-primary">
                          DKIM · SPF · DMARC
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-ph-border px-4 pb-4 pt-2">
                      <p className="text-xs text-ph-muted">
                        Include{" "}
                        <code className="rounded bg-ph-input px-1 py-0.5 font-mono text-[0.65rem] text-ph-text ring-1 ring-ph-border transition-colors duration-200">
                          Authentication-Results
                        </code>{" "}
                        when available.
                      </p>
                      <textarea
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        placeholder="Authentication-Results: ..."
                        rows={4}
                        disabled={loading}
                        className={`${inputClass} mt-2`}
                      />
                    </div>
                  </details>

                  <div className="flex flex-col gap-2 border-t border-ph-border pt-4 sm:flex-row sm:flex-wrap sm:items-stretch">
                    <button
                      type="button"
                      onClick={analyze}
                      disabled={loading}
                      className={primaryBtnClass}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white"
                            aria-hidden
                          />
                          Analyzing…
                        </span>
                      ) : (
                        "Analyze message"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={clearAll}
                      disabled={loading}
                      className={secondaryBtnClass}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => void copyReport()}
                      disabled={!result || loading}
                      className={secondaryBtnClass}
                    >
                      {copyLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results column — desktop: sticky + bounded height + inner scroll only here */}
            <div className="flex min-w-0 flex-col border-t border-ph-border bg-ph-panel-muted lg:sticky lg:top-4 lg:z-10 lg:max-h-[calc(100dvh-2rem)] lg:min-h-0 lg:self-start lg:flex lg:flex-col lg:overflow-hidden lg:border-t-0 lg:border-l lg:border-ph-border transition-[background-color,border-color] duration-200">
              <div className="shrink-0 border-b border-ph-border bg-ph-card px-5 py-3.5 transition-colors duration-200">
                <h2 className="text-xs font-semibold uppercase tracking-[0.07em] text-ph-muted">
                  Results
                </h2>
                <p className="mt-1 text-xs font-normal leading-relaxed text-ph-muted">
                  Long output scrolls inside this panel on desktop
                </p>
              </div>
              <div className="p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
                {result ? (
                  <>
                    <AnalysisResult
                      key={resultRevealNonce}
                      result={result}
                    />
                    <StayProtectedSection riskLevel={result.risk_level} />
                  </>
                ) : (
                  <ResultsEmptyState loading={loading} />
                )}
              </div>
            </div>
          </div>

          <footer className="border-t border-ph-border bg-ph-panel px-5 py-4 transition-colors duration-200 sm:px-6">
            <p className="text-center text-xs font-normal leading-relaxed text-ph-muted sm:text-sm">
              <span className="font-semibold text-ph-text">Important.</span>{" "}
              PhishCheck provides an AI-generated assessment for triage only—not a
              guarantee of safety. Confirm sensitive requests through official
              channels.
            </p>
            <nav
              aria-label="Learn more"
              className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-medium text-ph-muted"
            >
              <Link
                href="/guides"
                className="text-ph-primary underline-offset-2 hover:underline"
              >
                Guides
              </Link>
              <span aria-hidden className="text-ph-border">
                ·
              </span>
              <Link
                href="/phishing-checker"
                className="text-ph-primary underline-offset-2 hover:underline"
              >
                Phishing checker
              </Link>
              <span aria-hidden className="text-ph-border">
                ·
              </span>
              <Link
                href="/email-scam-checker"
                className="text-ph-primary underline-offset-2 hover:underline"
              >
                Email scam checker
              </Link>
              <span aria-hidden className="text-ph-border">
                ·
              </span>
              <Link
                href="/text-message-scam-checker"
                className="text-ph-primary underline-offset-2 hover:underline"
              >
                Text scam checker
              </Link>
            </nav>
          </footer>
        </div>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      {toastMessage ? (
        <PlanToast message={toastMessage} onDismiss={dismissToast} />
      ) : null}
      <PlanDevTools onPlanChanged={refreshPlanUi} />
    </main>
  );
}
