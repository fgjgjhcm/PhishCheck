#!/usr/bin/env python3
"""Summarize recommendation CTA clicks from logs/recommendation_clicks.jsonl."""

from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

LOG_PATH = Path(__file__).resolve().parent / "logs" / "recommendation_clicks.jsonl"


def _parse_day(record: dict) -> str:
    """UTC date as YYYY-MM-DD; prefers ``timestamp_iso``, else numeric or string ``timestamp``."""
    raw_iso = record.get("timestamp_iso")
    if isinstance(raw_iso, str) and raw_iso.strip():
        try:
            return _iso_to_utc_date(raw_iso.strip())
        except ValueError:
            pass

    raw = record.get("timestamp")
    if isinstance(raw, (int, float)):
        # Heuristic: browser often sends Date.now() ms
        ts = float(raw) / 1000.0 if raw > 1e12 else float(raw)
        try:
            return datetime.fromtimestamp(ts, tz=timezone.utc).date().isoformat()
        except (ValueError, OSError):
            pass
    if isinstance(raw, str) and raw.strip():
        try:
            return _iso_to_utc_date(raw.strip())
        except ValueError:
            pass
    return "(no date)"


def _iso_to_utc_date(s: str) -> str:
    normalized = s.replace("Z", "+00:00")
    dt = datetime.fromisoformat(normalized)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).date().isoformat()


def load_records(path: Path) -> tuple[list[dict], list[str], bool]:
    """Return (records, parse_warnings, file_missing)."""
    if not path.is_file():
        return [], [], True

    records: list[dict] = []
    errors: list[str] = []
    with path.open(encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            stripped = line.strip()
            if not stripped:
                continue
            try:
                obj = json.loads(stripped)
            except json.JSONDecodeError as e:
                errors.append(f"Line {lineno}: invalid JSON ({e.msg})")
                continue
            if not isinstance(obj, dict):
                errors.append(f"Line {lineno}: expected object, got {type(obj).__name__}")
                continue
            records.append(obj)
    return records, errors, False


def _print_counter_section(title: str, counter: Counter, *, limit: int | None = None) -> None:
    print(f"\n--- {title} ---")
    if not counter:
        print("  (none)")
        return
    items = counter.most_common() if limit is None else counter.most_common(limit)
    width = max(len(str(c)) for _, c in items)
    for key, count in items:
        print(f"  {str(key)!s:<48}  {count:>{width}d}")


def main() -> int:
    records, load_errors, file_missing = load_records(LOG_PATH)

    print("PhishCheck — recommendation click summary")
    if file_missing:
        print(f"\n--- Note ---")
        print(f"  No log file yet ({LOG_PATH})")
        print(f"\n--- Totals ---")
        print("  Total clicks:  0")
        return 0
    if load_errors:
        print("\n--- Parse warnings ---")
        for msg in load_errors:
            print(f"  {msg}")

    total = len(records)
    print(f"\n--- Totals ---")
    print(f"  Total clicks:  {total}")

    if total == 0:
        print("\n(no click events in log)")
        return 0

    by_tool = Counter(str(r.get("tool_id", "(missing)")) for r in records)
    by_risk = Counter(str(r.get("risk_level", "(missing)")).lower() for r in records)
    by_day = Counter(_parse_day(r) for r in records)
    by_href = Counter(str(r.get("href", "(missing)")) for r in records)

    _print_counter_section("Clicks by tool_id", by_tool)
    _print_counter_section("Clicks by risk_level", by_risk)
    _print_counter_section("Clicks by day (UTC)", by_day)
    _print_counter_section("Top hrefs", by_href)

    print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
