from pathlib import Path
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb


DOCUMENTS_FOLDER = Path("documents")
CHROMA_FOLDER = "chroma_db"


def split_text(text, chunk_size=500, overlap=100):
    words = text.split()

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start = end - overlap

    return chunks


def main():
    print("Starting RAG database creation...")

    model = SentenceTransformer("all-MiniLM-L6-v2")

    client = chromadb.PersistentClient(path=CHROMA_FOLDER)

    collection = client.get_or_create_collection(
        name="bis_documents"
    )

    pdf_files = list(DOCUMENTS_FOLDER.glob("*.pdf"))

    print(f"Found {len(pdf_files)} PDF files.")

    total_chunks = 0

    for pdf_path in pdf_files:
        print(f"\nProcessing: {pdf_path.name}")

        reader = PdfReader(pdf_path)

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""

            if not text.strip():
                continue

            chunks = split_text(text)

            for chunk_number, chunk in enumerate(chunks, start=1):

                chunk_id = f"{pdf_path.stem}_page_{page_number}_chunk_{chunk_number}"

                embedding = model.encode(chunk).tolist()

                collection.upsert(
                    ids=[chunk_id],
                    documents=[chunk],
                    embeddings=[embedding],
                    metadatas=[{
                        "document": pdf_path.name,
                        "page": page_number,
                        "chunk_id": chunk_id
                    }]
                )

                total_chunks += 1

    print("\n" + "=" * 60)
    print("RAG DATABASE CREATED SUCCESSFULLY!")
    print(f"Total chunks stored: {total_chunks}")
    print("=" * 60)


if __name__ == "__main__":
    main()
    