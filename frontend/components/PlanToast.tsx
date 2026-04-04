"use client";

import { useEffect, useRef } from "react";

type PlanToastProps = {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
};

export function PlanToast({
  message,
  onDismiss,
  durationMs = 4500,
}: PlanToastProps) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    const t = window.setTimeout(() => onDismissRef.current(), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[110] w-[min(100%-2rem,22rem)] -translate-x-1/2 rounded-xl border border-ph-accent-border bg-ph-card px-4 py-3 text-center text-sm font-semibold text-ph-text shadow-lg shadow-black/20 transition-[background-color,border-color] duration-200"
    >
      {message}
    </div>
  );
}
