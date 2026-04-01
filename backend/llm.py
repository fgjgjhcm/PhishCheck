from __future__ import annotations

import json
from openai import OpenAI

from heuristics import analyze_heuristics
from models import AnalyzeResponse
from settings import Settings


ANALYSIS_JSON_SCHEMA = {
    "name": "phish_analysis",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "risk_level": {"type": "string", "enum": ["Low", "Medium", "High"]},
            "confidence_score": {"type": "integer", "minimum": 0, "maximum": 100},
            "red_flags": {"type": "array", "items": {"type": "string"}},
            "detected_indicators": {"type": "array", "items": {"type": "string"}},
            "suspicious_links": {"type": "array", "items": {"type": "string"}},
            "sender_signals": {"type": "array", "items": {"type": "string"}},
            "explanation": {"type": "string"},
            "recommendation": {"type": "string"},
        },
        "required": [
            "risk_level",
            "confidence_score",
            "red_flags",
            "detected_indicators",
            "suspicious_links",
            "sender_signals",
            "explanation",
            "recommendation",
        ],
        "additionalProperties": False,
    },
}


def _risk_rank(level: str) -> int:
    return {"Low": 1, "Medium": 2, "High": 3}[level]


def _risk_from_rank(rank: int) -> str:
    return {1: "Low", 2: "Medium", 3: "High"}[rank]


def analyze_message_text(settings: Settings, message_text: str, message_headers: str | None = None) -> AnalyzeResponse:
    client = OpenAI(api_key=settings.openai_api_key)
    heuristic = analyze_heuristics(message_text, message_headers)
    system = """You are a security analyst assistant. Analyze pasted email or message text for signs of phishing or social engineering.

Rules:
- Output ONLY valid JSON matching the requested schema (no markdown, no preamble).
- risk_level must be exactly one of: Low, Medium, High.
- confidence_score is 0-100 (how confident you are in the assessment).
- red_flags: short bullet phrases (0–8 items) highlighting specific suspicious elements; empty list if none.
- detected_indicators: concrete indicators present in the text, concise phrases.
- suspicious_links: URL strings that appear suspicious (empty if none).
- sender_signals: sender or impersonation clues inferred from message text only (empty if none).
- explanation: 2–5 sentences plain language for a non-expert.
- recommendation: 1–3 sentences on what the user should do next (verify via official channel, don't click links, report to IT, etc.).
- If the message is benign marketing or clearly legitimate, use Low risk and explain why."""

    user_payload = message_text
    if message_headers:
        user_payload = (
            f"Message body:\n{message_text}\n\n"
            f"Optional email headers:\n{message_headers}\n\n"
            "If headers are present, use them as additional evidence."
        )

    completion = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_payload},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": ANALYSIS_JSON_SCHEMA,
        },
    )

    raw = completion.choices[0].message.content
    if not raw:
        raise ValueError("Empty model response")

    data = json.loads(raw)
    llm_response = AnalyzeResponse.model_validate(
        {
            **data,
            "analysis_method": "LLM",
        }
    )

    merged_rank = max(_risk_rank(llm_response.risk_level), _risk_rank(heuristic.risk_level))
    merged_confidence = int(round((llm_response.confidence_score * 0.7) + (heuristic.score * 0.3)))

    merged = AnalyzeResponse(
        risk_level=_risk_from_rank(merged_rank),
        confidence_score=max(0, min(100, merged_confidence)),
        red_flags=list(dict.fromkeys([*llm_response.red_flags, *heuristic.red_flags]))[:10],
        detected_indicators=list(
            dict.fromkeys([*llm_response.detected_indicators, *heuristic.detected_indicators])
        )[:12],
        suspicious_links=list(
            dict.fromkeys([*llm_response.suspicious_links, *heuristic.suspicious_links])
        )[:10],
        sender_signals=list(dict.fromkeys([*llm_response.sender_signals, *heuristic.sender_signals]))[:10],
        analysis_method="Heuristic+LLM",
        explanation=llm_response.explanation,
        recommendation=llm_response.recommendation,
    )
    return merged
