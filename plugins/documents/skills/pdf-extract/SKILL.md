---
name: pdf-extract
description: Fast, zero-AI text extraction from PDFs that have a text layer (digitally created PDFs from Word, Typst, WeasyPrint, wkhtmltopdf, LaTeX, etc). Uses pymupdf (fitz) - instant and deterministic. Use when you need to quickly pull raw text from a known text-layer PDF, e.g. "extract text from this PDF", "read this PDF", "get the content of", "what does this PDF say", "quickly read this PDF". Do NOT use for scanned/image PDFs or when you need structured output (tables, headings, OCR, AI analysis) - use the pdf-processing-pro skill in this plugin for those cases.
allowed-tools: Bash, Read, Write
---

# PDF Text Extraction

Extract text from PDF files using pymupdf via `uv run --with pymupdf`.

## Prerequisites

- `uv` installed - see <https://docs.astral.sh/uv/getting-started/installation/>
- No venv or pre-installation needed - `uv run --with` handles caching automatically

## Extract text from a single PDF

```bash
uv run --with pymupdf python3 -c "
import fitz
doc = fitz.open('/path/to/file.pdf')
for page in doc:
    text = page.get_text().strip()
    if text:
        print(text)
        print()
"
```

## Extract and save to file

```bash
uv run --with pymupdf python3 -c "
import fitz

doc = fitz.open('/path/to/file.pdf')
pages = []
for page in doc:
    text = page.get_text().strip()
    if text:
        pages.append(text)

with open('/path/to/output.txt', 'w') as f:
    f.write('\n\n'.join(pages))

print(f'Extracted {len(pages)} pages')
"
```

## Extract specific pages

```bash
uv run --with pymupdf python3 -c "
import fitz

doc = fitz.open('/path/to/file.pdf')
# Pages are 0-indexed
for i in range(2, 5):  # Pages 3-5
    text = doc[i].get_text().strip()
    if text:
        print(text)
"
```

## Batch extract from multiple PDFs

```bash
uv run --with pymupdf python3 -c "
import fitz
import glob
import os

for pdf_path in glob.glob('/path/to/folder/*.pdf'):
    doc = fitz.open(pdf_path)
    text = '\n\n'.join(p.get_text().strip() for p in doc if p.get_text().strip())
    out_path = pdf_path.rsplit('.', 1)[0] + '.txt'
    with open(out_path, 'w') as f:
        f.write(text)
    print(f'{os.path.basename(pdf_path)}: {len(doc)} pages extracted')
"
```

## Get PDF metadata

```bash
uv run --with pymupdf python3 -c "
import fitz
doc = fitz.open('/path/to/file.pdf')
meta = doc.metadata
print(f'Title: {meta.get(\"title\", \"N/A\")}')
print(f'Author: {meta.get(\"author\", \"N/A\")}')
print(f'Pages: {len(doc)}')
print(f'Creator: {meta.get(\"creator\", \"N/A\")}')
"
```

## Key notes

- pymupdf is imported as `fitz` (legacy naming from the MuPDF library)
- Pages are 0-indexed: `doc[0]` is the first page
- `get_text()` returns plain text; use `get_text("blocks")` for positioned blocks
- `get_text("html")` returns HTML with formatting preserved
- The package caches after the first `uv run --with pymupdf` invocation - subsequent runs are instant

## When to use this vs pdf-processing-pro

| Use pdf-extract | Use pdf-processing-pro |
|---|---|
| PDF created digitally (Word, Typst, LaTeX, wkhtmltopdf, WeasyPrint) | Scanned or image-based PDF (photo, fax, scan) |
| Need raw text quickly - less than a second | Need structured output: tables, headings, forms |
| Bulk/batch extraction without AI cost | OCR required (scanned documents) |
| Offline, no API key, no extra dependencies | Form filling, validation, batch workflows |
| Simple text content, no tables needed | Tables or structured layout are important |
