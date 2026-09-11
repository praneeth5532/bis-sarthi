from pathlib import Path
import sys

from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DOCUMENTS_FOLDER = BASE_DIR / "documents"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def read_pdf(pdf_path):
    reader = PdfReader(pdf_path)

    print(f"\n{'=' * 60}")
    print(f"Document: {pdf_path.name}")
    print(f"Pages: {len(reader.pages)}")
    print(f"{'=' * 60}")

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        print(f"\n--- Page {page_number} ---")
        print(text[:500])


def main():
    pdf_files = sorted(DOCUMENTS_FOLDER.rglob("*.pdf"))

    if not pdf_files:
        print("No PDF files found!")
        return

    print(f"Found {len(pdf_files)} PDF files.")

    for pdf in pdf_files:
        read_pdf(pdf)


if __name__ == "__main__":
    main()
    