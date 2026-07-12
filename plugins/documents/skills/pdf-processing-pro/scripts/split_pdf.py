#!/usr/bin/env python3
"""
Split a PDF into one file per page.

Usage:
    python split_pdf.py input.pdf [--output-dir pages/]

Output files are named <stem>_page_001.pdf, <stem>_page_002.pdf, ...
inside the output directory (created if missing).

Exit codes:
    0 - Success
    1 - File not found
    2 - Invalid input
    3 - Processing error
"""

import sys
import json
import logging
import argparse
from pathlib import Path

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    print("Error: pypdf not installed. Run: pip install pypdf", file=sys.stderr)
    sys.exit(3)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def split_pdf(pdf_path: Path, output_dir: Path) -> int:
    """Write one PDF per page. Returns the number of pages written."""
    reader = PdfReader(str(pdf_path))
    if not reader.pages:
        raise ValueError(f"PDF has no pages: {pdf_path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    for i, page in enumerate(reader.pages, 1):
        writer = PdfWriter()
        writer.add_page(page)
        out_path = output_dir / f"{pdf_path.stem}_page_{i:03d}.pdf"
        with open(out_path, 'wb') as f:
            writer.write(f)
        logger.info(f"Wrote {out_path}")

    return len(reader.pages)


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Split a PDF into one file per page',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s input.pdf
  %(prog)s input.pdf --output-dir pages/

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
        '''
    )

    parser.add_argument('input', help='Input PDF file')
    parser.add_argument('--output-dir', '-d', default='pages',
                        help='Directory for the page files (default: pages/)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    pdf_path = Path(args.input)

    try:
        if not pdf_path.is_file():
            logger.error(f"File not found: {pdf_path}")
            return 1

        count = split_pdf(pdf_path, Path(args.output_dir))
        print(json.dumps({
            'status': 'success',
            'pages_written': count,
            'output_dir': args.output_dir
        }, indent=2))
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
