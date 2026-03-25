# Vantage FM (Python + React in browser)

This version runs with a Python backend and does not require manual copy/paste into Claude.

## 1) Setup

```powershell
cd "C:\Users\Bolto\OneDrive\Desktop\Vantage FM\vantage-fm-python"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 2) Configure API key

Create `.env` in the project root and add:

```env
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

## Demo mode (no credits needed)

Add this line to use a built-in sample report instead of calling Anthropic:

```env
DEMO_MODE=true
```

When `DEMO_MODE=true`, the API key is not required. Set `DEMO_MODE=false` when you want live AI responses.

## 3) Run locally

```powershell
py app.py
```

Open: <http://127.0.0.1:5000>

## Notes

- API key stays on backend only.
- Frontend calls `POST /api/claude`.
- This is an MVP integration scaffold and can be expanded to your full UI/styles.

## Deploy online (easiest: Render, demo only)

Use this when you want buyers to open the app in a browser. **Demo only** — no Anthropic bill.

1. Push this whole folder **`Vantage FM`** (or at minimum `vantage-fm-python` plus root `render.yaml`) to **GitHub**.
2. Go to [render.com](https://render.com) → sign up → **New** → **Blueprint**.
3. Connect your GitHub repo and select the one that contains `render.yaml` at the **top level**.
4. Confirm the service uses **`rootDir: vantage-fm-python`** and env **`DEMO_MODE=true`** / **`DEMO_ONLY=true`** (already in `render.yaml`).
5. Click deploy. When it finishes, open the **`.onrender.com`** URL Render shows.

`DEMO_ONLY=true` on the server means **Anthropic is never called**, even if someone adds an API key in the dashboard.

**Manual Web Service** (if you skip Blueprint): create a Python Web Service, set **Root Directory** to `vantage-fm-python`, build `pip install -r requirements.txt`, start command `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1`, and add environment variables `DEMO_MODE=true` and `DEMO_ONLY=true`.

