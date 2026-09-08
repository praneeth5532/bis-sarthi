from pathlib import Path
from pypdf import PdfReader

DOCUMENTS_FOLDER = Path("documents")


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
    pdf_files = list(DOCUMENTS_FOLDER.glob("*.pdf"))

    if not pdf_files:
        print("No PDF files found!")
        return

    print(f"Found {len(pdf_files)} PDF files.")

    for pdf in pdf_files:
        read_pdf(pdf)


if __name__ == "__main__":
    main()
    