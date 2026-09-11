from pathlib import Path
from pypdf import PdfReader
import json

data_folder = Path(__file__).resolve().parent.parent / "data" / "helmets"

pdf_files = list(data_folder.glob("*.pdf"))

if not pdf_files:
    print("No PDF files found.")
    raise SystemExit(1)

for pdf_path in pdf_files:
    try:
        reader = PdfReader(str(pdf_path))

        print(f"\n✅ {pdf_path.name}")
        print(f"   Pages: {len(reader.pages)}")

        chunks = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            chunk_size = 500
            overlap = 100

            for i in range(0, len(text), chunk_size - overlap):
                chunk = text[i:i + chunk_size]

                print(chunk)
                print("-----")

                chunks.append({
                    "document": pdf_path.name,
                    "page": page_number,
                    "text": chunk
                })
        print(f"   Chunks created: {len(chunks)}")
        print(f"   Characters extracted: {sum(len(c['text']) for c in chunks)}")


    except Exception as error:
        print(f"\n❌ {pdf_path.name}")
        print(f"   Error: {error}")