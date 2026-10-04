# OCR for scanned PDFs

`validate_pdf.py` warns "No text layer found" when a PDF needs OCR.

## Prerequisites

Tesseract is a system binary, not a Python package:

- macOS: `brew install tesseract` (add `tesseract-lang` for languages other than English)
- Debian/Ubuntu: `sudo apt-get install tesseract-ocr` (plus e.g. `tesseract-ocr-spa`)
- Windows: the UB Mannheim build - <https://github.com/UB-Mannheim/tesseract/wiki>

Done when `tesseract --version` prints a version.

## OCR a PDF to text

Pages are rendered with pymupdf, so no Poppler install is needed. Save as `ocr.py` and run `uv run --with pymupdf --with pytesseract --with pillow python ocr.py scanned.pdf out.txt`:

```python
import sys
import pymupdf
import pytesseract
from PIL import Image, ImageFilter, ImageOps

src, dst = sys.argv[1], sys.argv[2]
pages = []
for i, page in enumerate(pymupdf.open(src), 1):
    pix = page.get_pixmap(dpi=300)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img = ImageOps.autocontrast(img.convert("L")).filter(ImageFilter.MedianFilter())
    pages.append(f"--- Page {i} ---\n" + pytesseract.image_to_string(img, lang="eng"))

with open(dst, "w", encoding="utf-8") as f:
    f.write("\n".join(pages))
```

Done when `out.txt` has text for every page and a spot-check of one page reads correctly.

## Tuning

- **Language**: `lang="eng+spa"` combines models; each needs its language pack installed.
- **Accuracy**: 300 DPI is the usual sweet spot. Grey-scale, autocontrast and a median filter (as above) help faint or noisy scans; skip them for clean scans if they make results worse.
- **Confidence**: `pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)` returns per-word `conf` values - flag words below about 60 for review.
- **Searchable PDF instead of text**: `pytesseract.image_to_pdf_or_hocr(img, extension="pdf")` returns a one-page PDF with an invisible text layer; merge the pages with `scripts/merge_pdfs.py`.
