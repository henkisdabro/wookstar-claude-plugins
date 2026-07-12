#!/usr/bin/env python3
"""
Validate form data against a schema produced by analyze_form.py.

Usage:
    python validate_form.py data.json schema.json

schema.json is the output of:
    python analyze_form.py template.pdf --output schema.json

Checks performed:
    - Required fields are present and non-empty
    - Values do not exceed a field's max_length
    - Choice-field values are one of the field's options
    - Unknown field names are reported

Exit codes:
    0 - Data is valid
    1 - File not found
    2 - Invalid input (bad JSON)
    3 - Processing error
    4 - Validation failed
"""

import sys
import json
import logging
import argparse
from pathlib import Path
from typing import Any, Dict, List

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_json(path: Path) -> Dict[str, Any]:
    """Load a JSON object from a file."""
    with open(path, encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def validate(data: Dict[str, Any], schema: Dict[str, Any]) -> List[str]:
    """Validate form data against the field schema. Returns a list of errors."""
    errors = []

    for name in data:
        if name not in schema:
            errors.append(f"Unknown field: {name}")

    for name, field in schema.items():
        value = data.get(name)

        if field.get('required') and (value is None or str(value).strip() == ''):
            errors.append(f"Missing required field: {name}")
            continue

        if value is None:
            continue

        max_length = field.get('max_length')
        if max_length and len(str(value)) > int(max_length):
            errors.append(f"Field {name} exceeds max length {max_length}")

        options = field.get('options')
        if options and str(value) not in [str(opt) for opt in options]:
            errors.append(f"Field {name} value {value!r} not in options: {options}")

        if field.get('readonly') and name in data:
            errors.append(f"Field {name} is read-only and cannot be filled")

    return errors


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Validate form data against an analyze_form.py schema',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s data.json schema.json
  %(prog)s data.json schema.json --verbose

Exit codes:
  0 - Data is valid
  1 - File not found
  2 - Invalid input
  3 - Processing error
  4 - Validation failed
        '''
    )

    parser.add_argument('data', help='JSON file mapping field names to values')
    parser.add_argument('schema', help='Schema JSON from analyze_form.py')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()
    logger.setLevel(logging.DEBUG if args.verbose else logging.WARNING)

    data_path = Path(args.data)
    schema_path = Path(args.schema)

    try:
        for path in (data_path, schema_path):
            if not path.is_file():
                logger.error(f"File not found: {path}")
                return 1

        errors = validate(load_json(data_path), load_json(schema_path))

        result = {
            'status': 'valid' if not errors else 'invalid',
            'errors': errors
        }
        print(json.dumps(result, indent=2))

        return 0 if not errors else 4

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON: {e}")
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
