# PDF Processing Troubleshooting

Common issues and solutions for PDF processing scripts.

## Common issues

### "Module not found" errors

```bash
pip install -r requirements.txt
```

### Tesseract not found

```bash
# Install tesseract system package (see Dependencies in SKILL.md)
```

### Memory errors with large PDFs

```python
# Process page by page instead of loading entire PDF
with pdfplumber.open("large.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        # Process page immediately
```

### Permission errors

```bash
chmod +x scripts/*.py
```

## Getting help

All scripts support `--help`:

```bash
python scripts/analyze_form.py --help
python scripts/extract_tables.py --help
```

For detailed documentation on specific topics, see:

- [forms.md](forms.md) - Complete form processing guide
- [tables.md](tables.md) - Advanced table extraction
- [ocr.md](ocr.md) - Scanned PDF processing
- [workflows.md](workflows.md) - Common workflows and best practices
