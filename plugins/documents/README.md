# Documents Toolkit

Professional document processing for Word, Excel, and PDF files.

## What's Included

### Skills (4)
- **docx** - Word document creation, editing, tracked changes, comments
- **xlsx** - Excel spreadsheet creation, formulas, formatting, data analysis
- **pdf-extract** - Fast, zero-AI text extraction from text-layer PDFs (pymupdf). Pairs with `pdf-processing-pro` for the heavy cases.
- **pdf-processing-pro** - PDF forms, tables, OCR, validation, batch operations

## Installation

```bash
/plugin install documents@wookstar-claude-plugins
```

## Usage Examples

```bash
# Word documents
"Create a professional proposal document"
"Edit this Word file with tracked changes"

# Excel spreadsheets
"Create a budget spreadsheet with formulas"
"Analyse this sales data in Excel"

# PDF processing
"Extract text from this PDF"
"Quickly read the content of this PDF"
"Extract tables from this PDF"
"Fill out this PDF form"
"Run OCR on this scanned document"
```

## Features

### DOCX
- Create new Word documents
- Edit with tracked changes (redlining)
- Add comments and annotations
- Preserve formatting
- Text extraction and analysis

### XLSX
- Create spreadsheets with formulas
- Advanced formatting
- Data analysis
- Charts and visualisations
- Multiple sheets

### PDF
- Fast text extraction from text-layer PDFs (pdf-extract, pymupdf, zero-AI)
- Form filling (pdf-processing-pro)
- Table extraction (pdf-processing-pro)
- OCR (text recognition) (pdf-processing-pro)
- Validation
- Batch operations

## When to use which PDF skill

For PDF work, choose based on what the source PDF is and what you need out of it.

| Use **pdf-extract** | Use **pdf-processing-pro** |
|---|---|
| Digitally created PDF (Word, Typst, LaTeX, wkhtmltopdf, WeasyPrint) | Scanned or image-based PDF |
| You just need raw text - fast, deterministic, zero-AI | You need structured output: tables, headings, forms |
| Bulk batch extraction with no API cost | OCR is required (scans, photos) |
| One short command, `uv run --with pymupdf` | Form filling, validation, batch workflows |

## When to Use

This toolkit is ideal for:
- Business document creation and editing
- Financial reporting and analysis
- Contract management with tracked changes
- Form processing
- Data extraction from PDFs
- Spreadsheet automation
