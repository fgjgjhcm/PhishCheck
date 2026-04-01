"""Append recommendation CTA events to a local JSONL file (no DB)."""

from __future__ import annotations

import json
from pathlib import Path

# Resolved relative to this package so it stays under backend/logs/
_LOG_DIR = Path(__file__).resolve().parent / "logs"
_LOG_FILE = _LOG_DIR / "recommendation_clicks.jsonl"


def append_recommendation_click_event(record: dict) -> None:
    """Write one JSON object per line; creates ``logs/`` when missing."""
    _LOG_DIR.mkdir(parents=True, exist_ok=True)
    line = json.dumps(record, ensure_ascii=False, default=str) + "\n"
    with _LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line)
