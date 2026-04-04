"use client";

import { clearPro, unlockPro } from "@/lib/plan";
import { useCallback, useState } from "react";

type PlanDevToolsProps = {
  onPlanChanged?: () => void;
};

/**
 * Development-only helpers. Hidden until expanded; does not ship meaningful UI in production.
 */
export function PlanDevTools({ onPlanChanged }: PlanDevToolsProps) {
  const [open, setOpen] = useState(false);

  const notify = useCallback(() => {
    onPlanChanged?.();
  }, [onPlanChanged]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 z-[105] flex flex-col items-end gap-1">
      {open ? (
        <div className="mb-1 w-48 rounded-lg border border-ph-border bg-ph-card/95 p-2 text-[0.65rem] shadow-md backdrop-blur-sm transition-colors duration-200">
          <p className="mb-1.5 font-semibold uppercase tracking-wide text-ph-muted">
            Plan (dev)
          </p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="rounded-md bg-ph-accent-soft px-2 py-1.5 text-left font-medium text-ph-text hover:bg-ph-panel-muted"
              onClick={() => {
                unlockPro();
                notify();
              }}
            >
              Simulate Pro
            </button>
            <button
              type="button"
              className="rounded-md bg-ph-panel-muted px-2 py-1.5 text-left font-medium text-ph-text hover:bg-ph-accent-soft"
              onClick={() => {
                clearPro();
                notify();
              }}
            >
              Clear Pro
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        title="Plan dev tools"
        aria-label="Toggle plan dev tools"
        onClick={() => setOpen((o) => !o)}
        className="h-2 w-2 rounded-full bg-ph-muted/40 opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-primary/40"
      />
    </div>
  );
}
