# Troubleshooting

## "not installed" or ModuleNotFoundError

The script was run with plain `python`. Run it with `uv run scripts/<name>.py` so uv reads the script's inline dependency block. For ad-hoc snippets, pass each package: `uv run --with pdfplumber python snippet.py`.

## `uv: command not found`

Install uv - <https://docs.astral.sh/uv/getting-started/installation/>.

## Tesseract not found

`pytesseract` wraps the `tesseract` binary, which must be installed separately - see [ocr.md](ocr.md).

## Empty text or no tables on a PDF that clearly has content

The pages are images. `validate_pdf.py` reports `pages_with_text: 0`. Use [ocr.md](ocr.md).

## Encrypted PDF

`validate_pdf.py` reports `"encrypted": true`. Decrypt with the password first:

```bash
uv run --with pypdf python -c "
from pypdf import PdfReader, PdfWriter
r = PdfReader('locked.pdf'); r.decrypt('PASSWORD')
w = PdfWriter(clone_from=r); w.write('unlocked.pdf')"
```

## Memory pressure on very large PDFs

Pass `--pages` to `extract_text.py` or `extract_tables.py` and process the document in ranges.

## Any other failure

Re-run with `--verbose` for the traceback, and `--help` for the exact arguments.
