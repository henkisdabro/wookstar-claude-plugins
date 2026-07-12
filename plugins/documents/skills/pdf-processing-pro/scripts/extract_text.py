#!/usr/bin/env python3
"""
Extract text from a PDF using pdfplumber.

Usage:
    python extract_text.py input.pdf [--output text.txt] [--preserve-formatting] [--pages 1-5]

--preserve-formatting keeps the visual layout (column positions, spacing)
instead of returning flowed text.

Exit codes:
    0 - Success
    1 - File not found
    2 - Invalid input
    3 - Processing error
    4 - No text found (likely a scanned PDF - use OCR, see references/ocr.md)
"""

import sys
import logging
import argparse
from pathlib import Path
from typing import List, Optional

try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber not installed. Run: pip install pdfplumber", file=sys.stderr)
    sys.exit(3)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def parse_page_range(pages: Optional[str], total: int) -> List[int]:
    """Parse a 1-based page range like '3' or '1-5' into 0-based indices."""
    if not pages:
        return list(range(total))

    if '-' in pages:
        start, end = pages.split('-', 1)
        first, last = int(start), int(end)
    else:
        first = last = int(pages)

    if first < 1 or last > total or first > last:
        raise ValueError(f"Page range {pages} outside document (1-{total})")
    return list(range(first - 1, last))


def extract_text(pdf_path: Path, pages: Optional[str], preserve_formatting: bool) -> str:
    """Extract text from the PDF, one section per page."""
    sections = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        indices = parse_page_range(pages, len(pdf.pages))
        for i in indices:
            page = pdf.pages[i]
            text = page.extract_text(layout=preserve_formatting) or ''
            text = text.strip('\n')
            if text.strip():
                sections.append(text)
            logger.info(f"Page {i + 1}: {len(text)} characters")
    return '\n\n'.join(sections)


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Extract text from a PDF',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s document.pdf
  %(prog)s document.pdf --output text.txt
  %(prog)s document.pdf --preserve-formatting
  %(prog)s document.pdf --pages 2-4 --output text.txt

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
  4 - No text found (scanned PDF? See references/ocr.md)
        '''
    )

    parser.add_argument('input', help='Input PDF file')
    parser.add_argument('--output', '-o', help='Output text file (default: stdout)')
    parser.add_argument('--preserve-formatting', action='store_true',
                        help='Keep visual layout instead of flowed text')
    parser.add_argument('--pages', '-p', help='1-based page or range, e.g. 3 or 1-5')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    pdf_path = Path(args.input)

    try:
        if not pdf_path.is_file():
            logger.error(f"File not found: {pdf_path}")
            return 1

        text = extract_text(pdf_path, args.pages, args.preserve_formatting)

        if not text.strip():
            logger.warning("No text found - the PDF may be scanned. See references/ocr.md")
            return 4

        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(text + '\n')
            logger.info(f"Saved to {args.output}")
        else:
            print(text)
        return 0

    except ValueError as e:
        logger.error(f"Invalid input: {e}")
        return 2

    except Exception as e:
        logger.error(f"Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 3


if __name__ == '__main__':
    sys.exit(main())
