from pathlib import Path

from sentence_transformers import SentenceTransformer
import chromadb


CHROMA_FOLDER = Path(__file__).resolve().parent / "chroma_db"


def main():
    print("Loading RAG database...")

    model = SentenceTransformer("all-MiniLM-L6-v2")

    client = chromadb.PersistentClient(path=CHROMA_FOLDER)

    collection = client.get_collection(
        name="bis_documents"
    )

    question = input("\nAsk a question about BIS documents: ")

    question_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    print("\n" + "=" * 60)
    print("MOST RELEVANT INFORMATION")
    print("=" * 60)

    for i in range(len(results["documents"][0])):
        document = results["documents"][0][i]
        metadata = results["metadatas"][0][i]

        print(f"\nResult {i + 1}")
        print(f"Document: {metadata['document']}")
        print(f"Page: {metadata['page']}")
        print("\nText:")
        print(document[:1000])
        print("-" * 60)


if __name__ == "__main__":
    main()
    