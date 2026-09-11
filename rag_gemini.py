import os
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from google import genai


CHROMA_FOLDER = Path(__file__).resolve().parent / "chroma_db"


def main():
    print("Loading RAG database...")

    # Load embedding model
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # Connect to ChromaDB
    client = chromadb.PersistentClient(path=CHROMA_FOLDER)

    collection = client.get_collection(
        name="bis_documents"
    )

    # Get question from user
    question = input("\nAsk a question about BIS documents: ")

    # Convert question into embedding
    question_embedding = model.encode(question).tolist()

    # Search relevant BIS information
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    # Prepare context for Gemini
    context = ""

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

    # Connect to Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    gemini_client = genai.Client(api_key=api_key)

    # Prompt Gemini to answer ONLY from retrieved BIS documents
    prompt = f"""
You are an AI assistant for BIS (Bureau of Indian Standards).

Answer the user's question ONLY using the BIS document content provided below.

If the answer cannot be found in the provided documents, say:
"I could not find this information in the available BIS documents."

Do not invent standards, numbers, requirements, or facts.

Always mention the relevant document name and page number when answering.

USER QUESTION:
{question}

BIS DOCUMENT CONTEXT:
{context}
"""

    print("\nGenerating answer...")

    interaction = gemini_client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt
    )

    print("\n" + "=" * 60)
    print("BIS SARATHI ANSWER")
    print("=" * 60)

    print(interaction.output_text)

    print("=" * 60)


if __name__ == "__main__":
    main()
    