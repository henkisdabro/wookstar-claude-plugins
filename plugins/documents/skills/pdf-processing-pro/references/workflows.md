# PDF Processing Workflows and Best Practices

Common workflows, error handling patterns, performance tips, and best practices for PDF processing.

## Common workflows

### Workflow 1: Process form submissions

```bash
# 1. Analyse form structure
python scripts/analyze_form.py template.pdf --output schema.json

# 2. Validate submission data
python scripts/validate_form.py submission.json schema.json

# 3. Fill form
python scripts/fill_form.py template.pdf submission.json completed.pdf

# 4. Validate output
python scripts/validate_pdf.py completed.pdf
```

### Workflow 2: Extract data from reports

```bash
# 1. Extract tables
python scripts/extract_tables.py monthly_report.pdf --output data.csv

# 2. Extract text for analysis
python scripts/extract_text.py monthly_report.pdf --output report.txt
```

### Workflow 3: Batch processing

```python
import glob
from pathlib import Path
import subprocess

# Process all PDFs in directory
for pdf_file in glob.glob("invoices/*.pdf"):
    output_file = Path("processed") / Path(pdf_file).name

    result = subprocess.run([
        "python", "scripts/extract_text.py",
        pdf_file,
        "--output", str(output_file)
    ], capture_output=True)

    if result.returncode == 0:
        print(f"Processed: {pdf_file}")
    else:
        print(f"Failed: {pdf_file} - {result.stderr}")
```

## Error handling

All scripts follow consistent error patterns:

```python
# Exit codes
# 0 - Success
# 1 - File not found
# 2 - Invalid input
# 3 - Processing error
# 4 - Validation error

# Example usage in automation
result = subprocess.run(["python", "scripts/fill_form.py", ...])

if result.returncode == 0:
    print("Success")
elif result.returncode == 4:
    print("Validation failed - check input data")
else:
    print(f"Error occurred: {result.returncode}")
```

## Performance tips

- **Use batch processing** for multiple PDFs
- **Enable multiprocessing** with `--parallel` flag (where supported)
- **Cache extracted data** to avoid re-processing
- **Validate inputs early** to fail fast
- **Use streaming** for large PDFs (>50MB)

## Best practices

1. **Always validate inputs** before processing
2. **Use try-except** in custom scripts
3. **Log all operations** for debugging
4. **Test with sample PDFs** before production
5. **Set timeouts** for long-running operations
6. **Check exit codes** in automation
7. **Back up originals** before modification
