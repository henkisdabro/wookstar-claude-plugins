---
name: ocr
description: Adds a searchable text layer to scanned or image-only PDFs with OCRmyPDF (Tesseract) - local, free, deterministic, no AI tokens. Use when a PDF has no text layer, when the user says "OCR this", "make this searchable", "extract text from a scan" or "digitise this book", when pdf-extract returned blank output, for large scanned books or batches of scans, or when OCR must stay offline and cost-free. Do NOT use for PDFs that already have a text layer - use pdf-extract; for tables, headings or structured output from complex layouts, handwriting or charts - use document-parse; for forms, merging or splitting - use pdf-processing-pro.
allowed-tools: Bash, Read, Write
---

# OCR - scanned PDFs

[OCRmyPDF](https://github.com/ocrmypdf/OCRmyPDF) (MPL-2.0) rasterises each page, runs Tesseract on it and writes a new PDF with an invisible text layer over the original image. Run it as `uvx ocrmypdf ...`, or as plain `ocrmypdf` when it is already on PATH (`uv tool install ocrmypdf`, `brew install ocrmypdf` or `apt install ocrmypdf`).

## 1. Check prerequisites

OCRmyPDF needs two system programs that `uvx` cannot install: **Tesseract** and **Ghostscript**. `--clean` also needs **unpaper**.

```bash
tesseract --version && gs --version && uvx ocrmypdf --version
```

Done when all three print a version. If one is missing, install it for the OS:

| OS | Command |
|----|---------|
| macOS (Homebrew) | `brew install ocrmypdf` (brings Tesseract, Ghostscript, unpaper); extra languages: `brew install tesseract-lang` |
| Debian / Ubuntu / WSL | `sudo apt install ocrmypdf unpaper`; extra languages: `tesseract-ocr-<lang>` e.g. `tesseract-ocr-deu` |
| Fedora | `sudo dnf install ocrmypdf tesseract-osd`; languages: `tesseract-langpack-<lang>` |
| Windows (native) | `winget install -e --id tesseract-ocr.tesseract`, plus Ghostscript 64-bit from ghostscript.com |

The distro package can lag behind PyPI; `uvx ocrmypdf` always runs the current release against the system Tesseract. Full matrix: <https://ocrmypdf.readthedocs.io/en/latest/installation.html>.

## 2. Pick the flags

| Situation | Flags |
|-----------|-------|
| Clean, straight scan | none |
| Pages slightly tilted | `--deskew` |
| Speckles or scanner noise | `--clean` (needs unpaper) |
| Book scan, one page per image | `--deskew --clean --unpaper-args "--layout single"` |
| Pages upside down or sideways | `--rotate-pages` |
| Many pages, want it faster | `--jobs N` (defaults to all cores) |
| Want plain text as well | `--sidecar out.txt` |
| Only some pages | `--pages 1-10,15` |
| Some pages already have text | `--skip-text` |
| Existing OCR layer is poor | `--redo-ocr` |
| Not English | `-l deu`, or `-l eng+deu` for mixed (language pack must be installed) |

## 3. Trial run, then full run

On anything over a few dozen pages, trial the flags on a short range first:

```bash
uvx ocrmypdf --deskew --clean --pages 1-5 --sidecar trial.txt input.pdf trial.pdf
```

Read `trial.txt`. Done when the text matches the source page for page; if it does not, adjust the flags from step 2 and rerun. Then the full run:

```bash
uvx ocrmypdf --deskew --clean --sidecar output.txt input.pdf output.pdf
```

Done when the command exits 0 and `output.pdf` exists. Exit code 6 means the PDF already has text - use pdf-extract, or add `--skip-text` / `--redo-ocr`.

For a folder, loop over the files and write `"${f%.pdf}_ocr.pdf"` beside each one.

## 4. Get the text

The sidecar holds the plain text. For per-page text from the OCR'd PDF, run the pdf-extract skill on `output.pdf` - it now has a text layer.

## 5. Escalate the pages Tesseract cannot read

Handwriting, unusual fonts, dense tables, equations and charts come out poorly. Spot-check the sidecar, note the bad page numbers, and send only those pages to the document-parse skill (its AI path). OCR the bulk here and pay for AI on the few pages that need it.
