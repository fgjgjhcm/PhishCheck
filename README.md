# PhishCheck

MVP web app: paste suspicious email or message text and receive an AI-generated phishing risk assessment.

- **Frontend:** Next.js (TypeScript), `frontend/`
- **Backend:** FastAPI (Python), `backend/`

No authentication, database, file uploads, or extensions.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- An [OpenAI](https://platform.openai.com/) API key

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
# Edit .env: set OPENAI_API_KEY (required). Optionally OPENAI_MODEL, CORS_ORIGINS.
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Health check: `GET http://localhost:8000/health`
- Analyze: `POST http://localhost:8000/analyze`
  - Required body field: `message_text`
  - Optional body field: `message_headers` (raw email headers for DKIM/SPF/DMARC signal extraction)

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Ensure NEXT_PUBLIC_API_URL matches the backend (default http://localhost:8000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Location | Variable | Description |
|----------|----------|-------------|
| `backend/.env` | `OPENAI_API_KEY` | Required for LLM analysis |
| `backend/.env` | `OPENAI_MODEL` | Optional; default `gpt-4o-mini` |
| `backend/.env` | `CORS_ORIGINS` | Optional; comma-separated origins, default `http://localhost:3000` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | Public API base URL (no trailing slash) |

## Production notes

- Serve the backend over HTTPS and restrict `CORS_ORIGINS` to your frontend origin(s).
- Set `NEXT_PUBLIC_API_URL` to your deployed API URL.
- Never commit `.env` or `.env.local`; use secrets management in your host.
- **Render:** see `backend/DEPLOY-RENDER.md` and repo root `render.yaml`.

## Analyze response

`POST /analyze` returns:

- `risk_level`: `Low | Medium | High`
- `confidence_score`: `0-100`
- `red_flags`: string[]
- `detected_indicators`: string[]
- `suspicious_links`: string[]
- `sender_signals`: string[] (includes parsed `DKIM/SPF/DMARC` outcomes when headers are provided)
- `analysis_method`: `LLM` or `Heuristic+LLM`
- `explanation`: string
- `recommendation`: string

## Run tests

```bash
cd backend
source .venv/bin/activate
pytest
```

## Disclaimer

This tool provides an AI-generated risk assessment and should not be the sole basis for security decisions.
