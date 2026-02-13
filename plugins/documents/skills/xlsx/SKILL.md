---
name: xlsx
description: Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualisation. Use when working with spreadsheets (.xlsx, .xlsm, .csv, .tsv) for creating new spreadsheets with formulas and formatting, reading or analysing data, modifying existing spreadsheets while preserving formulas, data analysis and visualisation, or recalculating formulas.
---

# Requirements for Outputs

## All Excel Files

### Zero Formula Errors

- Every Excel model MUST be delivered with ZERO formula errors (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)

### Preserve Existing Templates (when updating templates)

- Study and EXACTLY match existing format, style, and conventions when modifying files
- Never impose standardised formatting on files with established patterns
- Existing template conventions ALWAYS override these guidelines

## Financial Models

For financial models, DCFs, and valuations - read `references/financial-model-standards.md` for colour coding, number formatting, formula construction rules, and documentation requirements.

# XLSX Creation, Editing, and Analysis

## Overview

A user may ask you to create, edit, or analyse the contents of an .xlsx file. You have different tools and workflows available for different tasks.

## Important Requirements

**LibreOffice Required for Formula Recalculation**: You can assume LibreOffice is installed for recalculating formula values using the `recalc.py` script. The script automatically configures LibreOffice on first run.

## Reading and Analysing Data

### Data analysis with pandas

For data analysis, visualisation, and basic operations, use **pandas** which provides powerful data manipulation capabilities:

```python
import pandas as pd

# Read Excel
df = pd.read_excel('file.xlsx')  # Default: first sheet
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # All sheets as dict

# Analyse
df.head()      # Preview data
df.info()      # Column info
df.describe()  # Statistics

# Write Excel
df.to_excel('output.xlsx', index=False)
```

## CRITICAL: Use Formulas, Not Hardcoded Values

**Always use Excel formulas instead of calculating values in Python and hardcoding them.** This ensures the spreadsheet remains dynamic and updateable.

### Bad - Hardcoding Calculated Values

```python
# Bad: Calculating in Python and hardcoding result
total = df['Sales'].sum()
sheet['B10'] = total  # Hardcodes 5000

# Bad: Computing growth rate in Python
growth = (df.iloc[-1]['Revenue'] - df.iloc[0]['Revenue']) / df.iloc[0]['Revenue']
sheet['C5'] = growth  # Hardcodes 0.15

# Bad: Python calculation for average
avg = sum(values) / len(values)
sheet['D20'] = avg  # Hardcodes 42.5
```

### Correct - Using Excel Formulas

```python
# Good: Let Excel calculate the sum
sheet['B10'] = '=SUM(B2:B9)'

# Good: Growth rate as Excel formula
sheet['C5'] = '=(C4-C2)/C2'

# Good: Average using Excel function
sheet['D20'] = '=AVERAGE(D2:D19)'
```

This applies to ALL calculations - totals, percentages, ratios, differences, etc. The spreadsheet should be able to recalculate when source data changes.

## Common Workflow

1. **Choose tool**: pandas for data, openpyxl for formulas/formatting
2. **Create/Load**: Create new workbook or load existing file
3. **Modify**: Add/edit data, formulas, and formatting
4. **Save**: Write to file
5. **Recalculate formulas (MANDATORY IF USING FORMULAS)**: Use the recalc.py script
   ```bash
   python recalc.py output.xlsx
   ```
6. **Verify and fix any errors**:
   - The script returns JSON with error details
   - If `status` is `errors_found`, check `error_summary` for specific error types and locations
   - Fix the identified errors and recalculate again
   - Common errors to fix:
     - `#REF!`: Invalid cell references
     - `#DIV/0!`: Division by zero
     - `#VALUE!`: Wrong data type in formula
     - `#NAME?`: Unrecognised formula name

For detailed code examples (creating/editing files), read `references/openpyxl-patterns.md`.

## Recalculating Formulas

Excel files created or modified by openpyxl contain formulas as strings but not calculated values. Use the provided `recalc.py` script to recalculate:

```bash
python recalc.py <excel_file> [timeout_seconds]
```

Example:

```bash
python recalc.py output.xlsx 30
```

The script:

- Automatically sets up LibreOffice macro on first run
- Recalculates all formulas in all sheets
- Scans ALL cells for Excel errors (#REF!, #DIV/0!, etc.)
- Returns JSON with detailed error locations and counts
- Works on both Linux and macOS

For the formula verification checklist and recalc.py output interpretation, read `references/formula-verification.md`.

## Code Style Guidelines

**IMPORTANT**: When generating Python code for Excel operations:

- Write minimal, concise Python code without unnecessary comments
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

**For Excel files themselves**:

- Add comments to cells with complex formulas or important assumptions
- Document data sources for hardcoded values
- Include notes for key calculations and model sections

## References

- `references/financial-model-standards.md` - Colour coding, number formatting, formula construction rules, documentation requirements for financial models
- `references/openpyxl-patterns.md` - Code examples for creating/editing files, library selection guide, openpyxl and pandas tips
- `references/formula-verification.md` - Verification checklist, common pitfalls, recalc.py output interpretation
