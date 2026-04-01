from pathlib import Path
import sys

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))
import main


def test_analyze_returns_structured_payload(monkeypatch):
    class DummySettings:
        pass

    def fake_analyze(_settings, message_text, message_headers=None):
        assert message_text == "Please verify your account"
        assert message_headers == "Authentication-Results: dkim=pass spf=fail dmarc=pass"
        return {
            "risk_level": "High",
            "confidence_score": 91,
            "red_flags": ["Urgency"],
            "detected_indicators": ["Credential or sensitive data request"],
            "suspicious_links": ["http://1.2.3.4/login"],
            "sender_signals": ["SPF=fail"],
            "analysis_method": "Heuristic+LLM",
            "explanation": "The text pressures the recipient to act quickly.",
            "recommendation": "Do not click links and verify through official channels.",
        }

    monkeypatch.setattr(main, "settings", DummySettings())
    monkeypatch.setattr(main, "analyze_message_text", fake_analyze)
    client = TestClient(main.app)

    response = client.post(
        "/analyze",
        json={
            "message_text": "Please verify your account",
            "message_headers": "Authentication-Results: dkim=pass spf=fail dmarc=pass",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["risk_level"] == "High"
    assert body["analysis_method"] == "Heuristic+LLM"
    assert isinstance(body["detected_indicators"], list)
    assert isinstance(body["suspicious_links"], list)
    assert isinstance(body["sender_signals"], list)


def test_analyze_empty_message_rejected(monkeypatch):
    class DummySettings:
        pass

    monkeypatch.setattr(main, "settings", DummySettings())
    client = TestClient(main.app)

    response = client.post("/analyze", json={"message_text": "   "})
    assert response.status_code == 400
