# PDF tables

Start with `uv run scripts/extract_tables.py input.pdf --output tables.csv`. It uses pdfplumber's default detection and the first row of each table as the header. Reach for the code below only when its output is missing tables or splits columns wrongly. Run snippets with `uv run --with pdfplumber python snippet.py` (add `--with pandas` where used).

## 1. See what pdfplumber sees

Render the detected table lines over the page before tuning anything:

```python
import pdfplumber

with pdfplumber.open("report.pdf") as pdf:
    pdf.pages[0].to_image(resolution=150).debug_tablefinder().save("debug.png")
```

Done when you have looked at `debug.png` and know whether the table has ruled lines, whitespace-only columns, or no detection at all. No text on the page at all means a scan - go to [ocr.md](ocr.md).

## 2. Choose a detection strategy

```python
# Ruled tables (visible borders) - the default
settings = {"vertical_strategy": "lines", "horizontal_strategy": "lines"}

# Borderless tables aligned by whitespace
settings = {"vertical_strategy": "text", "horizontal_strategy": "text"}

# Irregular layouts - give column and row edges in PDF points
settings = {
    "vertical_strategy": "explicit",
    "horizontal_strategy": "explicit",
    "explicit_vertical_lines": [50, 150, 250, 350, 450, 550],
    "explicit_horizontal_lines": [100, 130, 160, 190, 220],
}

tables = page.extract_tables(table_settings=settings)
```

If cells split or merge wrongly, adjust `snap_tolerance`, `join_tolerance` and `intersection_tolerance` (all default 3). To ignore headers and footers, crop first: `page.within_bbox((x0, top, x1, bottom)).extract_tables()`.

Done when `debug_tablefinder()` with your settings outlines every cell you need.

## 3. Clean up the rows

```python
def tidy(table):
    """Pad ragged rows and fill merged cells from the left."""
    width = max(len(r) for r in table)
    out = []
    for row in table:
        row = list(row) + [None] * (width - len(row))
        last = None
        for i, cell in enumerate(row):
            if cell in (None, ""):
                row[i] = last
            else:
                last = cell
        out.append(row)
    return out
```

Filling merged cells from the left is a guess - check it against the source for vertically merged cells, which pdfplumber reports as `None` in the rows below.

## 4. Tables that span pages

```python
def multipage(pdf_path, first, last):
    """Join the first table on each page (0-based, end-exclusive), dropping repeated headers."""
    rows, header = [], None
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages[first:last]:
            tables = page.extract_tables()
            if not tables:
                continue
            table = tables[0]
            if header is None:
                header, table = table[0], table[1:]
            elif table[0] == header:
                table = table[1:]
            rows.extend(table)
    return [header] + rows
```

## 5. Numbers

pdfplumber returns strings. For financial tables, convert after loading into pandas:

```python
import pandas as pd

df = pd.DataFrame(rows[1:], columns=rows[0])
df["Amount"] = pd.to_numeric(
    df["Amount"].str.replace(r"[$,]", "", regex=True).str.replace(r"^\((.*)\)$", r"-\1", regex=True),
    errors="coerce",
)
```

The second replace turns accounting negatives like `(1,200)` into `-1200`. Done when no value in a numeric column became `NaN` that was not blank in the source.
