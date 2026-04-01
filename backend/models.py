from __future__ import annotations

from typing import Optional, Union

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    message_text: str = Field(..., min_length=1, max_length=100_000)
    message_headers: Optional[str] = Field(default=None, max_length=100_000)


class AnalyzeResponse(BaseModel):
    risk_level: str = Field(..., pattern=r"^(Low|Medium|High)$")
    confidence_score: int = Field(..., ge=0, le=100)
    red_flags: list[str]
    detected_indicators: list[str]
    suspicious_links: list[str]
    sender_signals: list[str]
    analysis_method: str = Field(..., pattern=r"^(LLM|Heuristic\+LLM)$")
    explanation: str
    recommendation: str


class TrackClickRequest(BaseModel):
    """Recommendation / affiliate CTA telemetry (console + JSONL only for now).

    Ingest adds ``timestamp_iso`` (UTC) when writing logs; not part of the request body.
    """

    tool_id: str = Field(..., min_length=1, max_length=128)
    tool_name: str = Field(..., min_length=1, max_length=256)
    risk_level: str = Field(..., min_length=1, max_length=32)
    session_id: str = Field(..., min_length=1, max_length=128)
    page_context: str = Field(..., min_length=1, max_length=64)
    timestamp: Union[int, str] = Field(..., description="Unix ms or ISO string from client")
    href: str = Field(..., min_length=1, max_length=2048)


class TrackClickResponse(BaseModel):
    ok: bool = True
