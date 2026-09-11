import os
from functools import lru_cache
from pathlib import Path

import chromadb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google import genai
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent
CHROMA_FOLDER = BASE_DIR / "chroma_db"
DIST_FOLDER = BASE_DIR / "dist"
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

app = FastAPI(title="BIS Sarthi API")
allowed_origins = [origin.strip() for origin in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins,
                   allow_credentials=False, allow_methods=["GET", "POST", "OPTIONS"],
                   allow_headers=["Content-Type"])


class Question(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


@lru_cache
def get_embedding_model():
    """Load the model created during indexing without a runtime network check."""
    return SentenceTransformer(EMBEDDING_MODEL, local_files_only=True)


@lru_cache
def get_collection():
    try:
        client = chromadb.PersistentClient(path=str(CHROMA_FOLDER))
        return client.get_collection(name="bis_documents")
    except Exception as error:
        raise RuntimeError("The BIS search index is missing. Run: python build_rag.py") from error


def retrieve(question: str):
    try:
        embedding = get_embedding_model().encode(question).tolist()
        results = get_collection().query(query_embeddings=[embedding], n_results=3,
                                         include=["documents", "metadatas"])
    except Exception as error:
        raise HTTPException(status_code=503, detail=f"Retrieval is unavailable: {error}") from error

    documents = results.get("documents", [[]])[0]
    metadata_list = results.get("metadatas", [[]])[0]
    if not documents:
        raise HTTPException(status_code=404, detail="No BIS source material is available in the search index.")

    sources, context_parts = [], []
    for document, metadata in zip(documents, metadata_list):
        source = {"document": metadata["document"], "page": metadata["page"]}
        if source not in sources:
            sources.append(source)
        context_parts.append(f"Document: {source['document']}\nPage: {source['page']}\n\nContent:\n{document}")
    return "\n\n-------------------------\n\n".join(context_parts), sources


def generate_answer(question: str, context: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY is not configured on the backend.")

    prompt = f"""You are BIS Sarthi, an assistant for Bureau of Indian Standards documents.

Answer ONLY from the retrieved BIS document context below. If the context does not clearly support an answer, reply exactly: "I could not find this information in the available BIS documents." Do not invent standards, numbers, requirements, or facts. Keep the answer concise. The application will display the source document and page.

USER QUESTION:
{question}

BIS DOCUMENT CONTEXT:
{context}
"""
    try:
        response = genai.Client(api_key=api_key).models.generate_content(model=GEMINI_MODEL, contents=prompt)
        return response.text or "I could not find this information in the available BIS documents."
    except Exception as error:
        raise HTTPException(status_code=502, detail="The Gemini service did not return an answer. Check GEMINI_API_KEY and GEMINI_MODEL.") from error


@app.get("/api/health")
def health():
    try:
        index_chunks = get_collection().count()
    except RuntimeError:
        index_chunks = 0
    return {"status": "ok", "index_chunks": index_chunks,
            "gemini_configured": bool(os.getenv("GEMINI_API_KEY"))}


@app.post("/api/ask")
def ask_question(data: Question):
    question = data.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Question cannot be empty.")
    context, sources = retrieve(question)
    return {"question": question, "answer": generate_answer(question, context), "sources": sources}


# Keep the old endpoint available for existing local callers.
app.post("/ask")(ask_question)

if DIST_FOLDER.exists():
    app.mount("/", StaticFiles(directory=DIST_FOLDER, html=True), name="frontend")
else:
    @app.get("/")
    def home():
        return {"message": "BIS Sarthi API is running. Start the Vite frontend with npm run dev."}
