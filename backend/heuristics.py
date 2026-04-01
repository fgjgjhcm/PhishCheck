from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse


URL_REGEX = re.compile(r"(https?://[^\s<>\"]+|www\.[^\s<>\"]+)", re.IGNORECASE)
IP_HOST_REGEX = re.compile(r"^\d{1,3}(?:\.\d{1,3}){3}$")
URGENT_REGEX = re.compile(
    r"\b(urgent|immediately|asap|within\s+\d+\s*(hours?|minutes?)|final\s+notice|account\s+suspended|act\s+now)\b",
    re.IGNORECASE,
)
CREDS_REGEX = re.compile(
    r"\b(password|passcode|otp|one[- ]?time code|verification code|ssn|social security|bank account|credit card)\b",
    re.IGNORECASE,
)
ACTION_REGEX = re.compile(
    r"\b(click|verify|update|confirm|login|sign in|reset|download|open attachment)\b",
    re.IGNORECASE,
)
FINANCE_REGEX = re.compile(
    r"\b(wire transfer|gift card|crypto|bitcoin|payment|invoice|refund)\b",
    re.IGNORECASE,
)
SPOOF_REGEX = re.compile(
    r"\b(ceo|cfo|it support|help desk|microsoft|google|apple|amazon|bank|paypal)\b",
    re.IGNORECASE,
)
AUTH_RESULTS_REGEX = re.compile(
    r"\b(dkim|spf|dmarc)\s*=\s*(pass|fail|softfail|neutral|none|temperror|permerror)\b",
    re.IGNORECASE,
)


@dataclass
class HeuristicSignals:
    score: int
    risk_level: str
    red_flags: list[str]
    detected_indicators: list[str]
    suspicious_links: list[str]
    sender_signals: list[str]


def _normalize_url(raw: str) -> str:
    return raw if raw.lower().startswith(("http://", "https://")) else f"http://{raw}"


def analyze_heuristics(message_text: str, message_headers: str | None = None) -> HeuristicSignals:
    score = 0
    red_flags: list[str] = []
    indicators: list[str] = []
    suspicious_links: list[str] = []
    sender_signals: list[str] = []

    urls = URL_REGEX.findall(message_text)
    if urls:
        indicators.append("Contains URLs")
        score += 10
        for raw in urls:
            parsed = urlparse(_normalize_url(raw))
            host = (parsed.hostname or "").strip(".")
            if not host:
                continue
            if IP_HOST_REGEX.match(host):
                suspicious_links.append(raw)
                red_flags.append("Link uses an IP address instead of a normal domain")
                score += 20
            if host.count("-") >= 2 or len(host) > 45:
                suspicious_links.append(raw)
                red_flags.append("Link domain appears unusually complex")
                score += 8
            if "@" in raw:
                suspicious_links.append(raw)
                red_flags.append("Link contains obfuscation characters")
                score += 10

    if URGENT_REGEX.search(message_text):
        indicators.append("Urgency language")
        red_flags.append("Creates urgency or pressure to act quickly")
        score += 18

    if CREDS_REGEX.search(message_text):
        indicators.append("Credential or sensitive data request")
        red_flags.append("Requests passwords, codes, or sensitive personal data")
        score += 20

    if ACTION_REGEX.search(message_text):
        indicators.append("Call-to-action language")
        score += 10

    if FINANCE_REGEX.search(message_text):
        indicators.append("Financial trigger terms")
        red_flags.append("Mentions payment transfer or refund scenarios")
        score += 14

    spoof_hits = SPOOF_REGEX.findall(message_text)
    if spoof_hits:
        sender_signals = sorted({h.lower() for h in spoof_hits})[:5]
        indicators.append("Brand or authority impersonation cues")
        score += 10

    if message_headers:
        auth_pairs = AUTH_RESULTS_REGEX.findall(message_headers)
        if auth_pairs:
            indicators.append("Email authentication results present")
        for method, status in auth_pairs:
            method_l = method.lower()
            status_l = status.lower()
            sender_signals.append(f"{method_l.upper()}={status_l}")
            if status_l in {"fail", "softfail", "permerror"}:
                red_flags.append(f"{method_l.upper()} authentication did not pass")
                score += 18
            elif status_l == "pass":
                score = max(0, score - 6)

    # Keep duplicates out and cap score.
    red_flags = list(dict.fromkeys(red_flags))[:8]
    indicators = list(dict.fromkeys(indicators))
    suspicious_links = list(dict.fromkeys(suspicious_links))[:8]
    score = max(0, min(100, score))

    if score >= 70:
        risk_level = "High"
    elif score >= 35:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return HeuristicSignals(
        score=score,
        risk_level=risk_level,
        red_flags=red_flags,
        detected_indicators=indicators,
        suspicious_links=suspicious_links,
        sender_signals=sender_signals,
    )
