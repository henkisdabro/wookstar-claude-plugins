#!/usr/bin/env python3
"""
Merge multiple PDFs into one.

Usage:
    python merge_pdfs.py file1.pdf file2.pdf [file3.pdf ...] --output merged.pdf

Files are merged in the order given on the command line.

Exit codes:
    0 - Success
    1 - File not found
    2 - Invalid input (fewer than two inputs, unreadable PDF)
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


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Merge multiple PDFs into one',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s file1.pdf file2.pdf --output merged.pdf
  %(prog)s chapters/*.pdf --output book.pdf

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
        '''
    )

    parser.add_argument('inputs', nargs='+', help='Input PDF files, in merge order')
    parser.add_argument('--output', '-o', required=True, help='Output PDF file')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    try:
        if len(args.inputs) < 2:
            logger.error("Need at least two input PDFs to merge")
            return 2

        paths = [Path(p) for p in args.inputs]
        for path in paths:
            if not path.is_file():
                logger.error(f"File not found: {path}")
                return 1

        writer = PdfWriter()
        total_pages = 0
        for path in paths:
            reader = PdfReader(str(path))
            writer.append(reader)
            total_pages += len(reader.pages)
            logger.info(f"Added {path} ({len(reader.pages)} pages)")

        with open(args.output, 'wb') as f:
            writer.write(f)

        print(json.dumps({
            'status': 'success',
            'files_merged': len(paths),
            'total_pages': total_pages,
            'output': args.output
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
