---
name: pdf-processing-pro
description: PDF toolkit of uv-runnable scripts for forms, tables, OCR, merging, splitting and validation. Use when filling a PDF form from data, reading a form's fields, extracting tables to CSV or Excel, running OCR on a scanned PDF, merging or splitting PDFs, checking a PDF is valid, or batch-processing a folder of PDFs. Do NOT use for a quick read of a text-layer PDF - use pdf-extract; do NOT use for Word, Excel or PowerPoint files - use the document-skills plugin.
---

# PDF Processing Pro

Every script carries PEP 723 inline metadata, so `uv run scripts/<name>.py` installs its dependencies on first run. Paths are relative to this skill's directory. All scripts take `--help` and share exit codes: 0 success, 1 file not found, 2 invalid input, 3 processing error, 4 validation failed or nothing found.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| analyze_form.py | Form fields, types, options, positions as JSON | `uv run scripts/analyze_form.py input.pdf [--output schema.json] [--summary]` |
| validate_form.py | Check data JSON against an analyze_form schema | `uv run scripts/validate_form.py data.json schema.json` |
| fill_form.py | Fill a form from data JSON | `uv run scripts/fill_form.py input.pdf data.json output.pdf [--validate] [--flatten]` |
| flatten_form.py | Make filled fields read-only | `uv run scripts/flatten_form.py filled.pdf final.pdf` |
| extract_tables.py | Tables to CSV or one Excel sheet per table | `uv run scripts/extract_tables.py input.pdf [--output tables.csv] [--format csv\|excel] [--pages 1-5]` |
| extract_text.py | Text, optionally layout-preserving | `uv run scripts/extract_text.py input.pdf [--output text.txt] [--preserve-formatting] [--pages 1-5]` |
| merge_pdfs.py | Merge in argument order | `uv run scripts/merge_pdfs.py a.pdf b.pdf --output merged.pdf` |
| split_pdf.py | One file per page | `uv run scripts/split_pdf.py input.pdf --output-dir pages/` |
| validate_pdf.py | Integrity, encryption, text layer, form-field count | `uv run scripts/validate_pdf.py input.pdf` |

## Workflow

1. **Triage** - run `validate_pdf.py` on the input. Done when you know whether it is encrypted, has a text layer and has form fields. No text layer means a scan: go to step 3 with OCR.
2. **Pick the branch** and read its reference before writing any custom code:
   - Filling or reading a form - [references/forms.md](references/forms.md)
   - Tables that `extract_tables.py` misses or mangles - [references/tables.md](references/tables.md)
   - Scanned or image-only pages - [references/ocr.md](references/ocr.md)
   - A folder of PDFs, or chaining scripts in automation - [references/workflows.md](references/workflows.md)
3. **Run** the script for the branch. Done when it exits 0 and the output file exists.
4. **Verify** - re-run `validate_pdf.py` on any PDF you wrote, and open or spot-check the CSV/text output against a page of the source. Done when the output matches the source on that spot-check.

If a script fails, check [references/troubleshooting.md](references/troubleshooting.md) before patching it.
