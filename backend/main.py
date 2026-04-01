from __future__ import annotations

import json
import logging
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from llm import analyze_message_text
from models import AnalyzeRequest, AnalyzeResponse, TrackClickRequest, TrackClickResponse
from settings import Settings
from track_click_log import append_recommendation_click_event

_settings_error: str | None = None
try:
    settings = Settings()
except Exception as e:
    settings = None
    _settings_error = str(e)

logger = logging.getLogger(__name__)

app = FastAPI(title="PhishCheck API", version="1.0.0")

if settings:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health")
def health():
    if not settings:
        return JSONResponse(
            status_code=503,
            content={"status": "unconfigured", "detail": _settings_error or "unknown error"},
        )
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    if not settings:
        raise HTTPException(status_code=503, detail="Server missing configuration. Set OPENAI_API_KEY in .env")

    text = body.message_text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="message_text cannot be empty")

    try:
        return analyze_message_text(settings, text, body.message_headers)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Analysis failed: {e!s}") from e


@app.post("/track-click", response_model=TrackClickResponse, tags=["analytics"])
def track_click(body: TrackClickRequest):
    """Log recommendation CTA clicks to stderr and ``logs/recommendation_clicks.jsonl``."""
    record = body.model_dump()
    # Server receipt time (human-readable); client ``timestamp`` unchanged
    record["timestamp_iso"] = datetime.now(timezone.utc).isoformat()
    logger.info("track_click %s", json.dumps(record, ensure_ascii=False, default=str))
    try:
        append_recommendation_click_event(record)
    except OSError as e:
        # Still return 200 so the client can open the destination; surface error in logs
        logger.warning("track_click file append failed: %s", e)
    return TrackClickResponse()
