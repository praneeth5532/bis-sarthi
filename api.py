import os
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import chromadb
from google import genai

app = FastAPI()

# Load RAG components
model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection(
    name="bis_documents"
)

# Gemini
gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class Question(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "BIS Sarathi API is working!"}


@app.post("/ask")
def ask_question(data: Question):

    question = data.question

    # Convert question into embedding
    question_embedding = model.encode(question).tolist()

    # Search RAG database
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    # Prepare context
    context = ""

    sources = []

    for i in range(len(results["documents"][0])):

        document = results["documents"][0][i]
        metadata = results["metadatas"][0][i]

        context += f"""
Document: {metadata['document']}
Page: {metadata['page']}

Content:
{document}

-------------------------
"""

        sources.append({
            "document": metadata["document"],
            "page": metadata["page"]
        })

    # Ask Gemini
    prompt = f"""
You are BIS Sarathi, an AI assistant for the Bureau of Indian Standards (BIS).

Answer the user's question ONLY using the BIS document content provided below.

If the answer cannot be found in the provided documents, say:
"I could not find this information in the available BIS documents."

Do not invent standards, numbers, requirements, or facts.

Always mention the relevant document name and page number.

USER QUESTION:
{question}

BIS DOCUMENT CONTEXT:
{context}
"""

    interaction = gemini_client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    answer = interaction.output_text

    return {
        "question": question,
        "answer": answer,
        "sources": sources
    }
    
