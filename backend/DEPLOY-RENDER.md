# Deploy PhishCheck API on Render

## What Render runs

- **Root directory:** `backend` (set in the service or via `render.yaml` at repo root).
- **Build:** `pip install -r requirements.txt`
- **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT` (also in `Procfile`).
- **Python version:** `runtime.txt` (3.11.11) and/or `PYTHON_VERSION` in Render.

## Dashboard steps (manual Web Service)

1. In [Render](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure:
   - **Name:** e.g. `phishcheck-api`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Select instance type (e.g. Free).
5. Under **Environment**, add:
   - **`OPENAI_API_KEY`** — required; your OpenAI secret.
   - **`CORS_ORIGINS`** — comma-separated allowed browser origins, **no spaces** after commas unless you strip them (the app trims each segment). Include your Vercel production URL, e.g.  
     `https://your-app.vercel.app,http://localhost:3000`  
     Add extra origins for preview deployments if you use them (each full origin must be listed; wildcards are not supported by default CORS).
   - Optional: **`OPENAI_MODEL`** — defaults to `gpt-4o-mini`.
   - Python version comes from **`backend/runtime.txt`** (Render reads it when using the Python native runtime).
6. Optional: **Health Check Path** → `/health` (returns 503 until `OPENAI_API_KEY` is valid; once configured, returns 200).
7. Deploy. Copy the service URL (e.g. `https://phishcheck-api.onrender.com`).

## Frontend (Vercel)

In Vercel project settings → **Environment Variables**, set:

- **`NEXT_PUBLIC_API_URL`** = your Render URL **without** a trailing slash, e.g. `https://phishcheck-api.onrender.com`

Redeploy the frontend after changing this.

## Blueprint (optional)

From the repo root, `render.yaml` defines the same service. Use **New → Blueprint** and point at the repository; then set **OPENAI_API_KEY** and **CORS_ORIGINS** when prompted (secret / sync).

## Notes

- **JSONL logs** (`logs/recommendation_clicks.jsonl`) live on the instance’s ephemeral disk; they reset on redeploy. For durable analytics, export or add storage later.
- Render free tier **spins down** after idle; first request after sleep can be slow.
- **`/health`** with missing/invalid config returns **503** — expected until secrets are set.
