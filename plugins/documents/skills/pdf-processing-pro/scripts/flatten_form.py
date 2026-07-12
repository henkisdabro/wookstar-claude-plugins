#!/usr/bin/env python3
"""
Flatten a filled PDF form by making all fields read-only.

Usage:
    python flatten_form.py filled.pdf final.pdf

Filled values remain visible but fields can no longer be edited in
PDF viewers.

Exit codes:
    0 - Success
    1 - File not found
    2 - Invalid input (no form fields)
    3 - Processing error
"""

import sys
import json
import logging
import argparse
from pathlib import Path

try:
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import NameObject, NumberObject
except ImportError:
    print("Error: pypdf not installed. Run: pip install pypdf", file=sys.stderr)
    sys.exit(3)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def flatten(input_path: Path, output_path: Path) -> int:
    """Set the read-only flag (bit 1 of /Ff) on every field. Returns field count."""
    reader = PdfReader(str(input_path))

    if not (reader.get_fields() or {}):
        raise ValueError(f"PDF has no form fields: {input_path}")

    writer = PdfWriter()
    writer.append(reader)

    acro_form = writer._root_object.get('/AcroForm')
    count = 0
    for field_ref in (acro_form.get('/Fields', []) if acro_form else []):
        field = field_ref.get_object()
        flags = int(field.get('/Ff', 0) or 0)
        field[NameObject('/Ff')] = NumberObject(flags | 1)
        count += 1

    with open(output_path, 'wb') as f:
        writer.write(f)

    return count


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Flatten a filled PDF form (make fields read-only)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s filled.pdf final.pdf

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
        '''
    )

    parser.add_argument('input', help='Filled PDF form')
    parser.add_argument('output', help='Output PDF file')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    input_path = Path(args.input)

    try:
        if not input_path.is_file():
            logger.error(f"File not found: {input_path}")
            return 1

        count = flatten(input_path, Path(args.output))
        print(json.dumps({
            'status': 'success',
            'fields_flattened': count,
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
