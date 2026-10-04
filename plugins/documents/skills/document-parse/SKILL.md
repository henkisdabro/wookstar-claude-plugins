---
name: document-parse
description: Structured parsing of complex documents into JSON and LLM-ready markdown with two local engines - LiteParse `lit` for PDFs and images (layout blocks, markdown, built-in OCR) and AILANG Parse `docparse` for office, email and e-book formats plus AI parsing of charts and images. Use when the user needs headings, tables, reading order or layout blocks out of a PDF, wants to read or parse a DOCX, PPTX, XLSX, ODT, EPUB, EML or MBOX file, needs track changes, comments or speaker notes, wants a chart, diagram, photo or handwritten page interpreted, or wants a file converted between formats ("turn this markdown into a DOCX"). Do NOT use for a quick plain-text read of a text-layer PDF - use pdf-extract; for making a scanned PDF searchable or bulk OCR - use ocr; for filling forms, merging, splitting or table export to CSV/Excel - use pdf-processing-pro; for authoring Word, Excel or PowerPoint files from scratch - use the document-skills plugin.
allowed-tools: Bash, Read, Write
---

# Document parse

Two local engines, picked by input format. Both are deterministic unless an AI model is asked for.

- **LiteParse** - [run-llama/liteparse](https://github.com/run-llama/liteparse), Apache-2.0. Rust core, PDFium renderer, bundled Tesseract. Command: `lit`.
- **AILANG Parse** - [sunholo-data/ailang-parse](https://github.com/sunholo-data/ailang-parse), Apache-2.0. Parses Office/ODF XML directly and runs on the [AILANG](https://github.com/sunholo-data/ailang) runtime. Command: `docparse`.

## 1. Pick the engine

| Input | Engine | Command |
|---|---|---|
| PDF, text layer or scanned | lit | `uvx --from liteparse lit parse file.pdf --format markdown -o out.md` |
| PDF where the visual carries meaning (charts, diagrams, handwriting) | docparse | `docparse file.pdf --pdf-backend ai` |
| Photo or scan image (JPG, PNG, TIFF...) needing plain text | lit | `uvx --from liteparse lit parse photo.png -o out.txt` |
| Image needing interpretation | docparse | `docparse photo.png` (AI switches on automatically) |
| DOCX, PPTX, XLSX, ODT, ODP, ODS | docparse | `docparse report.docx` |
| HTML, Markdown, CSV, TEX, RTF, EPUB, EML, MBOX | docparse | `docparse book.epub` |
| Convert between formats | docparse | `docparse notes.md --convert report.docx` |

Done when you have one engine and one command for each input file.

## 2. Make sure the engine is installed

**lit** - run it through `uvx --from liteparse lit`, which needs nothing installed beyond uv. For repeated use, `uv tool install liteparse` puts `lit` on PATH. A bare `lit` on PATH may be LLVM's test runner instead - `lit --help` from LiteParse opens with "OSS document parsing tool"; `uvx --from liteparse lit` sidesteps the clash.

**docparse** - check with `docparse --help`. If it is missing:

```bash
curl -fsSL https://www.sunholo.com/ailang-parse/install.sh | sh   # installs the AILANG runtime and links docparse into ~/.local/bin
```

PDF input through docparse also needs Poppler (`brew install poppler` / `apt install poppler-utils`) and its local backends (`docparse --install-backends`). AI features authenticate with Google Application Default Credentials (`gcloud auth application-default login`). The `ailang-parse` package on PyPI and npm is a client for the hosted API, not this local CLI.

Done when the command for step 1 prints help without error.

## 3. Parse

### PDFs and images with lit

```bash
uvx --from liteparse lit parse file.pdf --format markdown -o out.md
uvx --from liteparse lit parse file.pdf --format json --extract-blocks -o out.json   # headings, tables, lists with bounding boxes
uvx --from liteparse lit parse file.pdf --target-pages "1-5,10" -o out.md
uvx --from liteparse lit parse scan.pdf --ocr-language eng --dpi 300 -o out.md       # OCR engages on pages with no text
uvx --from liteparse lit batch-parse ./in ./out --recursive --extension pdf
uvx --from liteparse lit screenshot file.pdf -o ./shots --target-pages "1,3"        # page images to look at
```

`--format` takes `text` (default), `json` or `markdown`. Other options that matter: `--no-ocr` (faster on known text-layer PDFs), `--password`, `--num-workers N`, `--extract-form-fields`, `--extract-annotations`, `--keep-headers-footers`. Full list: `lit parse --help`.

### Office, e-book and email files with docparse

```bash
docparse report.docx                         # writes <name>.json and <name>.md where you ran it
docparse *.eml --output-dir parsed/          # several files or a folder in one call compiles once - much faster than a loop
docparse slides.pptx --describe              # AI descriptions of embedded images
docparse report.docx --summarize             # AI summary
docparse file.pdf --pdf-backend ai --ai MODEL   # multimodal AI parse; default model gemini-2.5-flash
docparse in.docx --convert out.html          # targets: html docx pptx xlsx odt odp ods md qmd
docparse notes.md --convert offer.docx --reference-doc letterhead.docx
```

The JSON holds typed blocks (tables with merged cells, track changes, comments, headers and footers, speaker notes, one block set per sheet); the markdown is the LLM-ready rendering. Full option list: `docparse --help`.

AI paths send the document to an external model and cost money - confirm with the user before running `--pdf-backend ai`, `--describe`, `--summarize` or an image parse on anything sensitive.

Done when the output file exists and is non-empty.

## 4. Verify

Read the markdown (or the JSON blocks you need) and compare one table and one heading against the source page, using `lit screenshot` to view the page when needed. Done when the spot-check matches. If a scanned page reads badly in lit, re-run just that page with `docparse --pdf-backend ai`.
