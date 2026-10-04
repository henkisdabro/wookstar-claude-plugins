---
name: pdf-processing-pro
description: PDF toolkit of uv-runnable scripts for forms, tables, merging, splitting and validation. Use when filling a PDF form from data, reading a form's fields, extracting tables to CSV or Excel, merging or splitting PDFs, checking a PDF is valid, or batch-processing a folder of PDFs through those steps. Do NOT use for a quick read of a text-layer PDF - use pdf-extract; for making a scanned PDF searchable - use ocr; for headings, layout or AI parsing of complex documents - use document-parse; for Word, Excel or PowerPoint files - use document-parse to read them or the document-skills plugin to author them.
---

# PDF Processing Pro

Every script carries PEP 723 inline metadata, so `uv run "${CLAUDE_SKILL_DIR}/scripts/<name>.py"` installs its dependencies on first run. All scripts take `--help` and share exit codes: 0 success, 1 file not found, 2 invalid input, 3 processing error, 4 validation failed or nothing found.

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| analyze_form.py | Form fields, types, options, positions as JSON | `uv run "${CLAUDE_SKILL_DIR}/scripts/analyze_form.py" input.pdf [--output schema.json] [--summary]` |
| validate_form.py | Check data JSON against an analyze_form schema | `uv run "${CLAUDE_SKILL_DIR}/scripts/validate_form.py" data.json schema.json` |
| fill_form.py | Fill a form from data JSON | `uv run "${CLAUDE_SKILL_DIR}/scripts/fill_form.py" input.pdf data.json output.pdf [--validate] [--flatten]` |
| flatten_form.py | Make filled fields read-only | `uv run "${CLAUDE_SKILL_DIR}/scripts/flatten_form.py" filled.pdf final.pdf` |
| extract_tables.py | Tables to CSV or one Excel sheet per table | `uv run "${CLAUDE_SKILL_DIR}/scripts/extract_tables.py" input.pdf [--output tables.csv] [--format csv\|excel] [--pages 1-5]` |
| extract_text.py | Text, optionally layout-preserving | `uv run "${CLAUDE_SKILL_DIR}/scripts/extract_text.py" input.pdf [--output text.txt] [--preserve-formatting] [--pages 1-5]` |
| merge_pdfs.py | Merge in argument order | `uv run "${CLAUDE_SKILL_DIR}/scripts/merge_pdfs.py" a.pdf b.pdf --output merged.pdf` |
| split_pdf.py | One file per page | `uv run "${CLAUDE_SKILL_DIR}/scripts/split_pdf.py" input.pdf --output-dir pages/` |
| validate_pdf.py | Integrity, encryption, text layer, form-field count | `uv run "${CLAUDE_SKILL_DIR}/scripts/validate_pdf.py" input.pdf` |

## Workflow

1. **Triage** - run `validate_pdf.py` on the input. Done when you know whether it is encrypted, has a text layer and has form fields. No text layer means a scan: run the ocr skill on it first, then come back with its output.
2. **Pick the branch** and read its reference before writing any custom code:
   - Filling or reading a form - [references/forms.md](references/forms.md)
   - Tables that `extract_tables.py` misses or mangles - [references/tables.md](references/tables.md)
   - Scanned pages that need a script-level OCR loop rather than the ocr skill - [references/ocr.md](references/ocr.md)
   - A folder of PDFs, or chaining scripts in automation - [references/workflows.md](references/workflows.md)
3. **Run** the script for the branch. Done when it exits 0 and the output file exists.
4. **Verify** - re-run `validate_pdf.py` on any PDF you wrote, and open or spot-check the CSV/text output against a page of the source. Done when the output matches the source on that spot-check.

If a script fails, check [references/troubleshooting.md](references/troubleshooting.md) before patching it.
