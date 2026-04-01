import json
from datetime import datetime
from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))
import main
import track_click_log


def test_track_click_accepts_payload_and_appends_jsonl(monkeypatch, tmp_path):
    log_file = tmp_path / "recommendation_clicks.jsonl"
    monkeypatch.setattr(track_click_log, "_LOG_FILE", log_file)
    monkeypatch.setattr(track_click_log, "_LOG_DIR", tmp_path)
    monkeypatch.setattr(main, "settings", None)

    client = TestClient(main.app)
    body = {
        "tool_id": "password_manager",
        "tool_name": "Password manager",
        "risk_level": "high",
        "session_id": "test-session-uuid",
        "page_context": "stay_protected",
        "timestamp": 1_717_200_000_000,
        "href": "https://bitwarden.com/",
    }
    response = client.post("/track-click", json=body)

    assert response.status_code == 200
    assert response.json() == {"ok": True}
    lines = log_file.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 1
    stored = json.loads(lines[0])
    for key, value in body.items():
        assert stored[key] == value
    assert "timestamp_iso" in stored
    assert isinstance(stored["timestamp_iso"], str)
    # e.g. 2026-03-31T12:00:00.123456+00:00
    datetime.fromisoformat(stored["timestamp_iso"])


def test_track_click_rejects_missing_field(monkeypatch):
    monkeypatch.setattr(main, "settings", None)
    client = TestClient(main.app)

    response = client.post(
        "/track-click",
        json={
            "tool_id": "password_manager",
            "tool_name": "Password manager",
            "risk_level": "high",
            "session_id": "x",
            # missing page_context, timestamp, href
        },
    )

    assert response.status_code == 422
