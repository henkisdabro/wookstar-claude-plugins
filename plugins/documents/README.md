# Documents Toolkit

Fast PDF text extraction, OCR for scans, structured parsing of PDFs and office files, and scripts for forms, tables, merging, splitting and validation.

## What's included

- **pdf-extract** - Fast, zero-AI text extraction from text-layer PDFs with pymupdf.
- **ocr** - Adds a searchable text layer to scanned or image-only PDFs with [OCRmyPDF](https://github.com/ocrmypdf/OCRmyPDF) and Tesseract, with an optional plain-text sidecar.
- **document-parse** - Structured JSON and markdown from complex documents: [LiteParse](https://github.com/run-llama/liteparse) (`lit`) for PDFs and images, [AILANG Parse](https://github.com/sunholo-data/ailang-parse) (`docparse`) for DOCX, PPTX, XLSX, ODF, EPUB and email files, format conversion, and opt-in AI parsing of charts and images.
- **pdf-processing-pro** - Scripts for forms (analyse, validate, fill, flatten), table extraction to CSV or Excel, merge, split and integrity checks.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) for every skill: scripts carry inline dependency metadata and tools run through `uvx`, so there is nothing to `pip install`.
- **ocr** needs Tesseract and Ghostscript (`brew install ocrmypdf` or `sudo apt install ocrmypdf unpaper` brings both); the skill lists Fedora and Windows too.
- **document-parse** runs LiteParse through `uvx` with no further setup. `docparse` installs with its upstream script (see the skill); PDFs through `docparse` also need Poppler, and its AI features need Google Application Default Credentials.

## Installation

```bash
/plugin install documents@wookstar-claude-plugins
```

## Usage

```bash
"Quickly read the content of this PDF"
"OCR this scanned book and make it searchable"
"Parse this annual report into markdown with its tables and headings"
"What changed in the tracked changes of this DOCX?"
"Convert notes.md to a Word document"
"Extract the tables from this report into Excel"
"Fill out this PDF form from data.json"
"Merge these PDFs into one pack"
```

## When to use which skill

| Situation | Skill |
|---|---|
| Digitally created PDF, raw text needed fast | **pdf-extract** |
| Scanned or image-only PDF, or pdf-extract came back blank | **ocr** |
| Headings, tables, reading order or layout from a complex PDF; any DOCX, PPTX, XLSX, EPUB or email file; charts or handwriting needing AI; format conversion | **document-parse** |
| Forms, tables to CSV/Excel, merging, splitting, validation | **pdf-processing-pro** |

## Moved to official plugins

The Word (`docx`) and Excel (`xlsx`) skills used to ship here. They are Anthropic's own skills, whose licence reserves all rights, so this plugin no longer redistributes them. Install `document-skills` from the `anthropics/skills` marketplace for Word, Excel, PowerPoint and Anthropic's own PDF skill:

```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```
