---
name: pdf-extract
description: Fast, zero-AI text extraction from PDFs that have a text layer (digitally created PDFs from Word, Typst, WeasyPrint, wkhtmltopdf, LaTeX, etc) with pymupdf - instant and deterministic. Use when the user wants to read a PDF or asks what it says, extract its text to a file, read specific pages, batch-extract a folder of PDFs, or get PDF metadata (title, author, page count). Do NOT use for scanned or image-only PDFs, or when this returns blank text - use ocr; for headings, tables, layout blocks or AI analysis of complex layouts - use document-parse; for forms, merging, splitting or table export to CSV/Excel - use pdf-processing-pro.
allowed-tools: Bash, Read, Write
---

# PDF text extraction

pymupdf through `uv run --with pymupdf` - it needs only [uv](https://docs.astral.sh/uv/getting-started/installation/), and the package is cached after the first run.

## 1. Extract

```bash
uv run --with pymupdf python3 -c "
import pymupdf
doc = pymupdf.open('/path/to/file.pdf')
for page in doc:
    text = page.get_text().strip()
    if text:
        print(text)
        print()
"
```

Adapt that loop to the request:

- **Save to file** - collect the page texts and write them joined with `'\n\n'`.
- **Specific pages** - index the document; pages are 0-indexed, so `doc[2]` to `doc[4]` are pages 3-5.
- **A folder** - loop over `glob.glob('/path/to/folder/*.pdf')` in one `uv run` and write a `.txt` beside each PDF.
- **Metadata** - `doc.metadata` holds `title`, `author` and `creator`; `len(doc)` is the page count.
- **Positioned or formatted text** - `get_text("blocks")` returns positioned blocks, `get_text("html")` returns HTML with formatting preserved.

Import the module as `pymupdf`. The old `fitz` alias still works but is deprecated and will be removed.

## 2. Check the output

Done when every requested page returned text. Blank or near-empty output means the PDF is a scan - hand it to the ocr skill.
