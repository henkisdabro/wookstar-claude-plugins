---
name: PDF Processing Pro
description: Production-ready PDF processing with forms, tables, OCR, validation, and batch operations. Use when working with complex PDF workflows in production environments, processing large volumes of PDFs, or requiring robust error handling and validation. Do NOT use for simple text extraction - use pdf-extract for quick reads.
---

# PDF Processing Pro

Production-ready PDF processing toolkit with pre-built scripts, comprehensive error handling, and support for complex workflows.

## Quick start

### Extract text from PDF

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
    print(text)
```

### Analyse PDF form (using included script)

```bash
python scripts/analyze_form.py input.pdf --output fields.json
# Returns: JSON with all form fields, types, and positions
```

### Fill PDF form with validation

```bash
python scripts/fill_form.py input.pdf data.json output.pdf
# Validates all fields before filling, includes error reporting
```

### Extract tables from PDF

```bash
python scripts/extract_tables.py report.pdf --output tables.csv
# Extracts all tables with automatic column detection
```

## Features

### Production-ready scripts

- Error handling with detailed messages and proper exit codes
- Input validation, type checking, and configurable logging
- Full type annotations and CLI interface (`--help` on all scripts)

### Comprehensive workflows

- PDF forms, table extraction, OCR processing
- Batch operations, pre/post-processing validation

## Advanced topics

### PDF form processing

Complete form workflows including field analysis, dynamic filling, validation rules, multi-page forms, and checkbox/radio handling. See [references/forms.md](references/forms.md).

### Table extraction

Complex table extraction including multi-page tables, merged cells, nested tables, custom detection, and CSV/Excel export. See [references/tables.md](references/tables.md).

### OCR processing

Scanned PDFs and image-based documents including Tesseract integration, language support, image preprocessing, and confidence scoring. See [references/ocr.md](references/ocr.md).

## Included scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| analyze_form.py | Extract form field info | `python scripts/analyze_form.py input.pdf [--output fields.json] [--verbose]` |
| fill_form.py | Fill PDF forms with data | `python scripts/fill_form.py input.pdf data.json output.pdf [--validate]` |
| validate_form.py | Validate form data before filling | `python scripts/validate_form.py data.json schema.json` |
| extract_tables.py | Extract tables to CSV/Excel | `python scripts/extract_tables.py input.pdf [--output tables.csv] [--format csv\|excel]` |
| extract_text.py | Extract text with formatting | `python scripts/extract_text.py input.pdf [--output text.txt] [--preserve-formatting]` |
| merge_pdfs.py | Merge multiple PDFs | `python scripts/merge_pdfs.py file1.pdf file2.pdf --output merged.pdf` |
| split_pdf.py | Split PDF into pages | `python scripts/split_pdf.py input.pdf --output-dir pages/` |
| validate_pdf.py | Validate PDF integrity | `python scripts/validate_pdf.py input.pdf` |

## Dependencies

All scripts require:

```bash
pip install pdfplumber pypdf pillow pytesseract pandas
```

Optional for OCR:

```bash
# macOS: brew install tesseract
# Ubuntu: apt-get install tesseract-ocr
# Windows: Download from GitHub releases
```

## References

| File | Contents |
|------|----------|
| [references/forms.md](references/forms.md) | Complete form processing guide |
| [references/tables.md](references/tables.md) | Advanced table extraction |
| [references/ocr.md](references/ocr.md) | Scanned PDF processing |
| [references/workflows.md](references/workflows.md) | Common workflows, error handling, performance tips, best practices |
| [references/troubleshooting.md](references/troubleshooting.md) | Troubleshooting common issues and getting help |
