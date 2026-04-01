"use client";

import { AnalysisResult } from "@/components/AnalysisResult";
import { PhishCheckLogoMark } from "@/components/PhishCheckLogoMark";
import { StayProtectedSection } from "@/components/StayProtectedSection";
import { formatReport } from "@/lib/format-report";
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
  "w-full resize-y rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm leading-relaxed text-[#0F172A] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none ring-offset-2 transition duration-150 placeholder:text-slate-400 hover:border-slate-300/90 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus-visible:outline-none disabled:opacity-60";

const secondaryBtnClass =
  "inline-flex h-11 min-w-[6.5rem] items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0F172A] shadow-sm shadow-slate-900/[0.04] transition duration-150 hover:border-slate-300 hover:bg-slate-50/90 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100";

const primaryBtnClass =
  "inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-md shadow-[#2563EB]/22 transition duration-150 hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-[#2563EB]/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-md disabled:hover:bg-[#2563EB] disabled:hover:shadow-md disabled:active:scale-100 sm:flex-none sm:min-w-[11rem]";

const exampleChipBtnClass =
  "rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-sm transition duration-150 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

function ResultsEmptyState({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#BFDBFE] bg-gradient-to-b from-[#EFF6FF]/45 via-white/50 to-[#F8FAFC]/80 px-6 py-10 text-center shadow-sm shadow-blue-900/[0.03] motion-safe:animate-result-reveal motion-reduce:animate-none">
        <span
          className="relative h-8 w-8 rounded-full border-2 border-[#2563EB]/18 border-t-[#2563EB] motion-safe:animate-spin motion-reduce:animate-none"
          aria-hidden
        />
        <p className="mt-4 text-sm font-semibold tracking-tight text-slate-800">
          Running analysis…
        </p>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-500">
          This usually takes a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white/80 px-6 py-10 text-center shadow-sm shadow-slate-900/[0.02]">
      <p className="text-[0.9375rem] font-semibold tracking-tight text-slate-800">
        No analysis yet
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Paste a message, then run{" "}
        <span className="font-medium text-[#0F172A]">Analyze message</span> to
        see risk level, signals, and guidance—without leaving this view.
      </p>
    </div>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [headers, setHeaders] = useState("");
  const [headersOpen, setHeadersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy report");
  const [resultRevealNonce, setResultRevealNonce] = useState(0);

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

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-200/40 via-[#E8EDF4] to-[#F1F5F9]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(37,99,235,0.09),transparent_45%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1180px] px-3 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-5">
        <header className="mb-4 flex flex-col gap-3 sm:mb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-blue-950/85">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#059669]"
                  aria-hidden
                />
                Private triage · No signup
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-3 sm:gap-3.5 lg:justify-start">
              <PhishCheckLogoMark
                framed
                className="h-5 w-5 text-[#1D4ED8] sm:h-6 sm:w-6"
                decorative
              />
              <h1 className="text-[1.625rem] font-bold tracking-tighter text-slate-900 sm:text-[1.875rem]">
                PhishCheck
              </h1>
            </div>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-snug text-slate-700 sm:text-[0.9375rem]">
              Clear phishing risk checks for everyday messages
            </p>
            <p className="mx-auto mt-2 max-w-lg text-xs font-normal leading-relaxed text-slate-500 lg:mx-0 sm:text-sm">
              Paste-only workflow. Optional headers for authentication context.{" "}
              <kbd className="rounded border border-[#E2E8F0] bg-white px-1 py-0.5 font-mono text-[0.65rem]">
                ⌘
              </kbd>
              +
              <kbd className="rounded border border-[#E2E8F0] bg-white px-1 py-0.5 font-mono text-[0.65rem]">
                Enter
              </kbd>{" "}
              to analyze.
            </p>
          </div>
        </header>

        <div className="rounded-3xl border border-[#CBD5E1]/90 bg-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.22),0_12px_32px_-12px_rgba(37,99,235,0.06),0_0_0_1px_rgba(255,255,255,0.6)_inset]">
          {error ? (
            <div
              role="alert"
              className="border-b border-red-200/90 bg-red-50 px-4 py-3 text-sm text-red-900 sm:px-6"
            >
              <span className="font-semibold">Something went wrong. </span>
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 items-stretch lg:grid-cols-2 lg:items-start">
            {/* Input column — grows with page; no fixed height / no inner scroll trap */}
            <div className="flex min-w-0 flex-col border-[#E2E8F0] bg-white lg:border-r">
              <div className="shrink-0 border-b border-[#E2E8F0] bg-[#FAFBFC] px-5 py-3.5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">
                  Input
                </h2>
                <p className="mt-1 text-xs font-normal leading-relaxed text-slate-500">
                  Message body and optional raw headers
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl border border-[#BFDBFE]/80 bg-[#EFF6FF]/50 p-4 shadow-sm shadow-slate-900/[0.02]">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-slate-500">
                      Try an example
                    </p>
                    <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-500">
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
                      className="text-sm font-semibold tracking-tight text-slate-800"
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
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] transition duration-150 hover:border-[#BFDBFE]/70"
                  >
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold tracking-tight text-slate-800 outline-none transition hover:text-slate-900 [&::-webkit-details-marker]:hidden focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/20">
                      <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span>Optional: raw email headers</span>
                        <span className="text-xs font-medium text-[#2563EB]">
                          DKIM · SPF · DMARC
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-[#E2E8F0] px-4 pb-4 pt-2">
                      <p className="text-xs text-[#475569]">
                        Include{" "}
                        <code className="rounded bg-white px-1 py-0.5 font-mono text-[0.65rem] ring-1 ring-[#E2E8F0]">
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

                  <div className="flex flex-col gap-2 border-t border-[#E2E8F0] pt-4 sm:flex-row sm:flex-wrap sm:items-stretch">
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
            <div className="flex min-w-0 flex-col border-t border-[#E2E8F0] bg-[#F8FAFC]/85 lg:sticky lg:top-4 lg:z-10 lg:max-h-[calc(100dvh-2rem)] lg:min-h-0 lg:self-start lg:flex lg:flex-col lg:overflow-hidden lg:border-t-0">
              <div className="shrink-0 border-b border-[#E2E8F0] bg-white/90 px-5 py-3.5 backdrop-blur-sm">
                <h2 className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-500">
                  Results
                </h2>
                <p className="mt-1 text-xs font-normal leading-relaxed text-slate-500">
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

          <footer className="border-t border-[#E2E8F0] bg-[#FAFBFC] px-5 py-4 sm:px-6">
            <p className="text-center text-xs font-normal leading-relaxed text-slate-500 sm:text-sm">
              <span className="font-semibold text-slate-800">Important.</span>{" "}
              PhishCheck provides an AI-generated assessment for triage only—not a
              guarantee of safety. Confirm sensitive requests through official
              channels.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
