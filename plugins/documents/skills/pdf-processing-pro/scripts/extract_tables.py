#!/usr/bin/env python3
"""
Extract tables from a PDF to CSV or Excel.

Usage:
    python extract_tables.py input.pdf [--output tables.csv] [--format csv|excel] [--pages 1-5]

CSV output writes all tables to one file, separated by blank lines.
Excel output writes one sheet per table (requires openpyxl).

Exit codes:
    0 - Success (one or more tables extracted)
    1 - File not found
    2 - Invalid input
    3 - Processing error
    4 - No tables found
"""

import sys
import json
import logging
import argparse
from pathlib import Path
from typing import List, Optional

try:
    import pdfplumber
    import pandas as pd
except ImportError as e:
    print(f"Error: missing dependency ({e.name}). Run: pip install pdfplumber pandas",
          file=sys.stderr)
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


def extract_tables(pdf_path: Path, pages: Optional[str]) -> List['pd.DataFrame']:
    """Extract all tables as DataFrames, first row used as header."""
    frames = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        indices = parse_page_range(pages, len(pdf.pages))
        for i in indices:
            page = pdf.pages[i]
            for table in page.extract_tables():
                if not table or len(table) < 2:
                    continue
                df = pd.DataFrame(table[1:], columns=table[0])
                frames.append(df)
                logger.info(f"Page {i + 1}: table with {len(df)} rows, {len(df.columns)} columns")
    return frames


def write_output(frames: List['pd.DataFrame'], output: Optional[str], fmt: str) -> None:
    """Write extracted tables to CSV (stdout or file) or Excel."""
    if fmt == 'excel':
        if not output:
            raise ValueError("--output is required with --format excel")
        with pd.ExcelWriter(output) as writer:
            for i, df in enumerate(frames, 1):
                df.to_excel(writer, sheet_name=f'Table{i}', index=False)
        return

    csv_parts = [df.to_csv(index=False) for df in frames]
    csv_text = '\n'.join(csv_parts)

    if output:
        with open(output, 'w', encoding='utf-8') as f:
            f.write(csv_text)
    else:
        print(csv_text, end='')


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Extract tables from a PDF to CSV or Excel',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s report.pdf
  %(prog)s report.pdf --output tables.csv
  %(prog)s report.pdf --output tables.xlsx --format excel
  %(prog)s report.pdf --pages 2-4 --output tables.csv

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
  4 - No tables found
        '''
    )

    parser.add_argument('input', help='Input PDF file')
    parser.add_argument('--output', '-o', help='Output file (default: CSV to stdout)')
    parser.add_argument('--format', '-f', choices=['csv', 'excel'], default='csv',
                        help='Output format (default: csv)')
    parser.add_argument('--pages', '-p', help='1-based page or range, e.g. 3 or 1-5')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    pdf_path = Path(args.input)

    try:
        if not pdf_path.is_file():
            logger.error(f"File not found: {pdf_path}")
            return 1

        frames = extract_tables(pdf_path, args.pages)

        if not frames:
            logger.warning("No tables found")
            print(json.dumps({'status': 'no_tables_found', 'tables': 0}), file=sys.stderr)
            return 4

        write_output(frames, args.output, args.format)

        if args.output:
            print(json.dumps({
                'status': 'success',
                'tables': len(frames),
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
