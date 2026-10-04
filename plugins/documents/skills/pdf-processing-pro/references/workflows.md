# Batch and automation workflows

## Exit codes

Every script uses the same codes, so a shell loop or CI step can branch on them:

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Input file not found |
| 2 | Invalid input (bad JSON, not a PDF, no form fields) |
| 3 | Processing error (re-run with `--verbose` for a traceback) |
| 4 | Validation failed, or nothing found (no tables, no text) |

Exit 4 from `extract_text.py` on a file means it needs OCR - see [ocr.md](ocr.md).

## Process a folder

```bash
mkdir -p out
for pdf in invoices/*.pdf; do
  name=$(basename "$pdf" .pdf)
  uv run scripts/extract_tables.py "$pdf" --output "out/$name.csv"
  case $? in
    0) ;;
    4) echo "NO TABLES: $pdf" ;;
    *) echo "FAILED: $pdf" ;;
  esac
done
```

Done when every input has an output file or a logged reason it has none.

## Report data pull

```bash
uv run scripts/extract_tables.py report.pdf --format excel --output report.xlsx
uv run scripts/extract_text.py report.pdf --preserve-formatting --output report.txt
```

## Assemble a document pack

```bash
uv run scripts/merge_pdfs.py cover.pdf filled.pdf appendix.pdf --output pack.pdf
uv run scripts/validate_pdf.py pack.pdf
```

For a form-filling pipeline, follow the steps in [forms.md](forms.md).
