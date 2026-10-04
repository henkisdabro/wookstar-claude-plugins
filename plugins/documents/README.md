# Documents Toolkit

PDF toolkit: fast text extraction, forms, tables, OCR, merging, splitting and validation.

## What's included

- **pdf-extract** - Fast, zero-AI text extraction from text-layer PDFs with pymupdf.
- **pdf-processing-pro** - Scripts for forms (analyse, validate, fill, flatten), table extraction to CSV or Excel, OCR for scans, merge, split and integrity checks.

Both run through [uv](https://docs.astral.sh/uv/): the scripts carry inline dependency metadata, so there is nothing to `pip install`. OCR also needs the `tesseract` binary.

## Installation

```bash
/plugin install documents@wookstar-claude-plugins
```

## Usage

```bash
"Quickly read the content of this PDF"
"Extract the tables from this report into Excel"
"Fill out this PDF form from data.json"
"Run OCR on this scanned document"
"Merge these PDFs into one pack"
```

## When to use which PDF skill

| Use **pdf-extract** | Use **pdf-processing-pro** |
|---|---|
| Digitally created PDF (Word, Typst, LaTeX, wkhtmltopdf, WeasyPrint) | Scanned or image-based PDF |
| You just need raw text - fast, deterministic, zero-AI | You need structured output: tables or forms |
| Bulk batch extraction with no API cost | OCR is required (scans, photos) |
| One short command, `uv run --with pymupdf` | Form filling, validation, merging, splitting |

## Moved to official plugins

The Word (`docx`) and Excel (`xlsx`) skills used to ship here. They are Anthropic's own skills under a proprietary licence, so this plugin no longer redistributes them. Install `document-skills` from the `anthropics/skills` marketplace for Word, Excel, PowerPoint and Anthropic's own PDF skill:

```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```
