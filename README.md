# BIS Sarthi

BIS Sarthi is a small RAG demo that answers questions using the BIS PDFs stored in `documents/`. It returns the document name and page for every answer.

## What happens when a user asks a question

```text
Browser → React website → FastAPI /api/ask
        → all-MiniLM-L6-v2 embedding → Chroma search index
        → top 3 BIS PDF chunks → Gemini → answer + source pages → browser
```

The search index is generated from the tracked PDFs by `build_rag.py`. It is deliberately not committed; this keeps generated database files out of Git and lets deployments build a matching index.

## Included source material

`documents/HELMETS/` contains the helmet material used for the demo, including the Product Manual, Quality Control Order, helmet safety article, and grant-of-licence guidelines. The repository also contains flask/bottle PDFs; these are included in the index as an additional category.

## Fastest local startup (Windows)

1. Install Node.js 22+ and Python 3.11 (Python 3.12 also works; 3.11 is used in Docker).
2. Get a Gemini API key and, in Command Prompt, run `set GEMINI_API_KEY=your_key_here`.
3. Double-click `start.bat` from Command Prompt, or run it there.
4. Open the Vite URL it prints (normally `http://localhost:5173`).

The first run downloads the embedding model and builds the local index, so allow a few minutes and an internet connection. Never put the key in source code, a committed `.env`, or a frontend `VITE_` variable.

## Manual local startup

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python build_rag.py
$env:GEMINI_API_KEY = "your_key_here"
python -m uvicorn api:app --reload --port 8000
```

In a second terminal:

```powershell
npm ci
npm run dev
```

The Vite development server calls `http://localhost:8000/api`. For a separately hosted frontend, set `VITE_API_BASE_URL=https://your-api.example/api` during its build and set `CORS_ORIGINS` on the API to that frontend origin.

## One-URL deployment (recommended)

Deploy the repository as a Docker service on Render, Railway, or another Docker host. The included `Dockerfile` builds the frontend and serves it from FastAPI, so the judge opens one service URL.

1. Create a new Docker web service from this repository.
2. Add a secret environment variable: `GEMINI_API_KEY`.
3. Optional: set `GEMINI_MODEL` if your key uses a different Gemini model.
4. Deploy. The Docker build creates the Chroma index from `documents/`; the first build needs internet access and can take several minutes.
5. Open `https://your-service-url/api/health`. It should return an index chunk count and `gemini_configured: true`.
6. Open the root service URL and test a prepared question.

Do not set `VITE_API_BASE_URL` for this one-container deployment: the browser should use the same origin’s `/api` route.

## Pre-judging checklist

1. Confirm the deployed `/api/health` shows a non-zero `index_chunks` count and `gemini_configured: true`.
2. Ask “What standard applies to helmets?” and confirm a page source appears.
3. Ask one other prepared question below.
4. Keep the deployed URL and a terminal with the API key ready.
5. If the hosted version fails, use the local backup steps below.

## Safe demo questions

- What standard applies to two-wheeler helmets?
- What is IS 4151?
- What information does the helmet product manual provide?
- Is BIS certification required for helmets under the Quality Control Order?
- What should a consumer check when choosing a helmet?
- What is the BIS grant-of-licence process for helmet manufacturers?

The model is instructed to say it could not find the information when the retrieved source chunks do not support a question. Still, this is a demo: verify important compliance decisions against the original BIS document.

## 2-minute judge script

**Introduction (30 seconds):** “BIS Sarthi makes long BIS reference documents easier to search. Instead of manually scanning PDFs, a user asks a plain-language question and sees a grounded answer with its source page.”

**Live demo (1 minute):** Ask “What standard applies to two-wheeler helmets?” Point out the answer, then the source list beneath it. Ask a second prepared question. For an unsupported question, explain that the assistant should say the available BIS documents do not contain the answer rather than inventing one.

**Technical explanation (30 seconds):** “The React page sends the question to FastAPI. The backend converts it to an embedding, retrieves the three closest chunks from our BIS PDF index, and gives only that context to Gemini. The returned source pages are displayed in the UI.”

**Impact (30 seconds):** “This lets consumers and students find relevant standards information quickly while retaining a path back to the official source.”

## Backup plan

Primary: use the hosted one-URL deployment. Backup: on a laptop with Node, Python, internet, and a valid key, set `GEMINI_API_KEY` and run `start.bat`. If no internet is available, the app cannot generate a real Gemini response; do not present placeholder text as AI output.

## API

- `GET /api/health` — setup status; does not call Gemini.
- `POST /api/ask` with `{ "question": "..." }` — answer and `sources`.

Errors are shown in the page instead of being replaced with a fake answer. A missing index or API key returns a clear `503` response.
