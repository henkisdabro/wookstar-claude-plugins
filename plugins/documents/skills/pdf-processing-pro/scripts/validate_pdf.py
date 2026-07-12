#!/usr/bin/env python3
"""
Validate PDF integrity.

Usage:
    python validate_pdf.py input.pdf

Checks that the file parses as a PDF, reports page count, encryption
status, metadata, and whether a text layer or form fields are present.
Outputs JSON.

Exit codes:
    0 - PDF is valid
    1 - File not found
    2 - Invalid input (not a PDF)
    3 - Processing error
    4 - PDF is corrupt or unreadable
"""

import sys
import json
import logging
import argparse
from pathlib import Path
from typing import Any, Dict

try:
    from pypdf import PdfReader
except ImportError:
    print("Error: pypdf not installed. Run: pip install pypdf", file=sys.stderr)
    sys.exit(3)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def validate_pdf(pdf_path: Path) -> Dict[str, Any]:
    """Parse the PDF and collect integrity information."""
    result: Dict[str, Any] = {
        'file': str(pdf_path),
        'size_bytes': pdf_path.stat().st_size,
        'valid': False,
        'warnings': []
    }

    reader = PdfReader(str(pdf_path))

    result['encrypted'] = bool(reader.is_encrypted)
    if reader.is_encrypted:
        result['warnings'].append('PDF is encrypted - pages may not be readable without a password')
        result['valid'] = True
        return result

    result['pages'] = len(reader.pages)
    if not reader.pages:
        result['warnings'].append('PDF has no pages')

    meta = reader.metadata or {}
    result['metadata'] = {
        'title': str(meta.get('/Title')) if meta.get('/Title') else None,
        'author': str(meta.get('/Author')) if meta.get('/Author') else None,
        'creator': str(meta.get('/Creator')) if meta.get('/Creator') else None,
    }

    result['form_fields'] = len(reader.get_fields() or {})

    pages_with_text = 0
    unreadable_pages = []
    for i, page in enumerate(reader.pages, 1):
        try:
            if (page.extract_text() or '').strip():
                pages_with_text += 1
        except Exception as e:
            unreadable_pages.append(i)
            logger.debug(f"Page {i} unreadable: {e}")

    result['pages_with_text'] = pages_with_text
    if unreadable_pages:
        result['warnings'].append(f"Pages could not be parsed: {unreadable_pages}")
    if result.get('pages') and pages_with_text == 0:
        result['warnings'].append('No text layer found - likely a scanned PDF (see references/ocr.md)')

    result['valid'] = not unreadable_pages
    return result


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Validate PDF integrity',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s input.pdf
  %(prog)s input.pdf --verbose

Exit codes:
  0 - PDF is valid
  1 - File not found
  2 - Invalid input
  3 - Processing error
  4 - PDF is corrupt or unreadable
        '''
    )

    parser.add_argument('input', help='Input PDF file')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    pdf_path = Path(args.input)

    try:
        if not pdf_path.is_file():
            logger.error(f"File not found: {pdf_path}")
            return 1

        if pdf_path.suffix.lower() != '.pdf':
            logger.error(f"Not a PDF file: {pdf_path}")
            return 2

        try:
            result = validate_pdf(pdf_path)
        except Exception as e:
            print(json.dumps({
                'file': str(pdf_path),
                'valid': False,
                'error': str(e)
            }, indent=2))
            return 4

        print(json.dumps(result, indent=2))
        return 0 if result['valid'] else 4

    except Exception as e:
        logger.error(f"Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 3


if __name__ == '__main__':
    sys.exit(main())
