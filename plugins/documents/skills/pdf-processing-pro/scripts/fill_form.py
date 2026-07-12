#!/usr/bin/env python3
"""
Fill PDF form fields from a JSON data file.

Usage:
    python fill_form.py input.pdf data.json output.pdf [--validate] [--flatten]

data.json maps field names to values:
    {"full_name": "John Doe", "agree_to_terms": true, "country": "Canada"}

Booleans are converted to checkbox values ("/Yes" / "/Off"). All other
values are written as strings.

Exit codes:
    0 - Success
    1 - File not found
    2 - Invalid input (bad JSON, not a PDF, no form fields)
    3 - Processing error
    4 - Validation failed (--validate only)
"""

import sys
import json
import logging
import argparse
from pathlib import Path
from typing import Any, Dict, List

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


def load_data(data_path: Path) -> Dict[str, Any]:
    """Load and type-check the JSON data file."""
    with open(data_path, encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, dict):
        raise ValueError("data.json must contain a JSON object mapping field names to values")
    return data


def normalise_values(data: Dict[str, Any]) -> Dict[str, str]:
    """Convert JSON values to the strings pypdf expects."""
    normalised = {}
    for name, value in data.items():
        if isinstance(value, bool):
            normalised[name] = '/Yes' if value else '/Off'
        else:
            normalised[name] = str(value)
    return normalised


def validate_data(reader: PdfReader, data: Dict[str, Any]) -> List[str]:
    """Check data against the form's actual fields before filling."""
    errors = []
    fields = reader.get_fields() or {}

    for name in data:
        if name not in fields:
            errors.append(f"Unknown field: {name}")

    for name, field in fields.items():
        flags = field.get('/Ff', 0) or 0
        if flags & 2 and not str(data.get(name, '') or ''):
            errors.append(f"Missing required field: {name}")

        max_len = field.get('/MaxLen')
        value = data.get(name)
        if value is not None and max_len and len(str(value)) > int(max_len):
            errors.append(f"Field {name} exceeds max length {max_len}")

    return errors


def fill_form(input_path: Path, data: Dict[str, Any], output_path: Path,
              flatten: bool = False) -> int:
    """Fill the form and write the result. Returns the number of fields written."""
    reader = PdfReader(str(input_path))

    if not (reader.get_fields() or {}):
        raise ValueError(f"PDF has no form fields: {input_path}")

    writer = PdfWriter()
    writer.append(reader)

    values = normalise_values(data)
    for page in writer.pages:
        writer.update_page_form_field_values(page, values, auto_regenerate=False)

    if flatten:
        _set_fields_readonly(writer)

    with open(output_path, 'wb') as f:
        writer.write(f)

    return len(values)


def _set_fields_readonly(writer: PdfWriter) -> None:
    """Set the read-only flag on every form field (bit 1 of /Ff)."""
    from pypdf.generic import NameObject, NumberObject

    root = writer._root_object
    acro_form = root.get('/AcroForm')
    if acro_form is None:
        return

    for field_ref in acro_form.get('/Fields', []):
        field = field_ref.get_object()
        flags = int(field.get('/Ff', 0) or 0)
        field[NameObject('/Ff')] = NumberObject(flags | 1)


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Fill PDF form fields from a JSON data file',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s template.pdf data.json filled.pdf
  %(prog)s template.pdf data.json filled.pdf --validate
  %(prog)s template.pdf data.json filled.pdf --validate --flatten

Exit codes:
  0 - Success
  1 - File not found
  2 - Invalid input
  3 - Processing error
  4 - Validation failed
        '''
    )

    parser.add_argument('input', help='Input PDF form (template)')
    parser.add_argument('data', help='JSON file mapping field names to values')
    parser.add_argument('output', help='Output PDF file')
    parser.add_argument('--validate', action='store_true',
                        help='Validate data against the form fields before filling')
    parser.add_argument('--flatten', action='store_true',
                        help='Make all fields read-only after filling')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    input_path = Path(args.input)
    data_path = Path(args.data)

    try:
        for path in (input_path, data_path):
            if not path.is_file():
                logger.error(f"File not found: {path}")
                return 1

        data = load_data(data_path)

        if args.validate:
            errors = validate_data(PdfReader(str(input_path)), data)
            if errors:
                print("Validation errors:", file=sys.stderr)
                for error in errors:
                    print(f"  - {error}", file=sys.stderr)
                return 4

        count = fill_form(input_path, data, Path(args.output), flatten=args.flatten)
        print(json.dumps({
            'status': 'success',
            'fields_written': count,
            'output': str(args.output)
        }, indent=2))
        return 0

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {data_path}: {e}")
        return 2

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
