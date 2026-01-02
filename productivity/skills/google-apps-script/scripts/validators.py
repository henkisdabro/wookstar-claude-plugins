#!/usr/bin/env python3
"""
Google Apps Script Validators

Validation utilities for Google Sheets operations, range notations, cell values,
and data structures. Use these validators before executing Apps Script operations.

Based on Google Apps Script API specifications and best practices.
"""

from typing import Any, List, Tuple, Optional, Dict
from dataclasses import dataclass
import re
from datetime import datetime


@dataclass
class ValidationResult:
    """Result of a validation check"""
    is_valid: bool
    errors: List[str]
    warnings: List[str] = None

    def __post_init__(self):
        if self.warnings is None:
            self.warnings = []


class GoogleAppsScriptValidators:
    """Comprehensive validation for Google Apps Script operations"""

    # Spreadsheet limits
    MAX_ROWS = 1000000  # 1 million rows
    MAX_COLS = 18278    # Maximum columns (ZZZ in A1 notation)
    MAX_CELL_CHARS = 50000  # Maximum characters per cell

    @staticmethod
    def is_valid_spreadsheet_id(sheet_id: str) -> Tuple[bool, Optional[str]]:
        """
        Validate Google Sheets ID format.

        Google Sheets IDs are 44-character alphanumeric strings.

        Args:
            sheet_id: The spreadsheet ID

        Returns:
            (is_valid, error_message)
        """
        if not sheet_id or not isinstance(sheet_id, str):
            return False, "Spreadsheet ID must be a non-empty string"

        if len(sheet_id) != 44:
            return False, f"Spreadsheet ID must be 44 characters (got {len(sheet_id)})"

        if not re.match(r'^[a-zA-Z0-9_-]{44}$', sheet_id):
            return False, "Spreadsheet ID contains invalid characters"

        return True, None

    @staticmethod
    def is_valid_a1_notation(notation: str) -> Tuple[bool, Optional[str]]:
        """
        Validate A1 notation format.

        Valid formats:
        - A1 (single cell)
        - A1:B10 (range)
        - Sheet1!A1 (sheet-qualified cell)
        - Sheet1!A1:B10 (sheet-qualified range)

        Args:
            notation: The A1 notation string

        Returns:
            (is_valid, error_message)
        """
        if not notation or not isinstance(notation, str):
            return False, "A1 notation must be a non-empty string"

        # Pattern for A1 notation
        # Supports: A1, A1:B10, Sheet1!A1, 'Sheet Name'!A1:B10
        pattern = r"^(?:'?[\w\s]+'?!)?[A-Z]+\d+(?::[A-Z]+\d+)?$"

        if not re.match(pattern, notation):
            return False, f"Invalid A1 notation: {notation}"

        return True, None

    @classmethod
    def is_valid_range_size(cls, rows: int, cols: int) -> Tuple[bool, Optional[str]]:
        """
        Validate range dimensions against Google Sheets limits.

        Args:
            rows: Number of rows
            cols: Number of columns

        Returns:
            (is_valid, error_message)
        """
        if not isinstance(rows, int) or not isinstance(cols, int):
            return False, "Rows and columns must be integers"

        if rows < 1 or rows > cls.MAX_ROWS:
            return False, f"Rows must be 1-{cls.MAX_ROWS} (got {rows})"

        if cols < 1 or cols > cls.MAX_COLS:
            return False, f"Columns must be 1-{cls.MAX_COLS} (got {cols})"

        return True, None

    @classmethod
    def is_valid_cell_value(cls, value: Any) -> Tuple[bool, Optional[str]]:
        """
        Validate cell value type and size.

        Args:
            value: The cell value

        Returns:
            (is_valid, error_message)
        """
        # None is valid (empty cell)
        if value is None:
            return True, None

        # Valid primitive types
        if isinstance(value, (str, int, float, bool)):
            if isinstance(value, str) and len(value) > cls.MAX_CELL_CHARS:
                return False, f"Cell value exceeds {cls.MAX_CELL_CHARS} characters"
            return True, None

        # Datetime is valid
        if isinstance(value, datetime):
            return True, None

        return False, f"Invalid cell value type: {type(value).__name__}"

    @staticmethod
    def is_valid_sheet_name(name: str) -> Tuple[bool, Optional[str]]:
        """
        Validate sheet name.

        Args:
            name: The sheet name

        Returns:
            (is_valid, error_message)
        """
        if not name or not isinstance(name, str):
            return False, "Sheet name must be a non-empty string"

        if len(name) > 100:
            return False, f"Sheet name must be ≤100 characters (got {len(name)})"

        # Sheet names cannot contain: [ ] * ? : / \
        invalid_chars = r'[\[\]\*\?:/\\]'
        if re.search(invalid_chars, name):
            return False, "Sheet name contains invalid characters: [ ] * ? : / \\"

        return True, None

    @classmethod
    def validate_spreadsheet_operation(cls, operation: Dict[str, Any]) -> ValidationResult:
        """
        Validate a spreadsheet operation payload.

        Args:
            operation: Dictionary with operation parameters

        Returns:
            ValidationResult with is_valid and errors
        """
        errors = []
        warnings = []

        # Validate spreadsheet ID
        if 'spreadsheet_id' in operation:
            is_valid, error = cls.is_valid_spreadsheet_id(operation['spreadsheet_id'])
            if not is_valid:
                errors.append(error)

        # Validate sheet name
        if 'sheet_name' in operation:
            is_valid, error = cls.is_valid_sheet_name(operation['sheet_name'])
            if not is_valid:
                errors.append(error)

        # Validate range notation
        if 'range_notation' in operation:
            is_valid, error = cls.is_valid_a1_notation(operation['range_notation'])
            if not is_valid:
                errors.append(error)

        # Validate values (2D array)
        if 'values' in operation:
            values = operation['values']
            if not isinstance(values, list):
                errors.append("Values must be a 2D array (list of lists)")
            else:
                for row_idx, row in enumerate(values):
                    if not isinstance(row, list):
                        errors.append(f"Row {row_idx} must be a list")
                        continue

                    for col_idx, cell in enumerate(row):
                        is_valid, error = cls.is_valid_cell_value(cell)
                        if not is_valid:
                            errors.append(f"Cell [{row_idx}][{col_idx}]: {error}")

                # Check dimensions
                if len(values) > 0:
                    rows = len(values)
                    cols = max(len(row) for row in values) if values else 0
                    is_valid, error = cls.is_valid_range_size(rows, cols)
                    if not is_valid:
                        errors.append(error)

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )

    @staticmethod
    def is_valid_email(email: str) -> Tuple[bool, Optional[str]]:
        """
        Validate email address format.

        Args:
            email: Email address

        Returns:
            (is_valid, error_message)
        """
        if not email or not isinstance(email, str):
            return False, "Email must be a non-empty string"

        # Basic email validation pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if not re.match(pattern, email):
            return False, f"Invalid email format: {email}"

        return True, None

    @staticmethod
    def is_valid_drive_file_id(file_id: str) -> Tuple[bool, Optional[str]]:
        """
        Validate Google Drive file ID format.

        Args:
            file_id: The Drive file ID

        Returns:
            (is_valid, error_message)
        """
        if not file_id or not isinstance(file_id, str):
            return False, "File ID must be a non-empty string"

        # Drive file IDs are typically 25-33 characters, alphanumeric with _ and -
        if not re.match(r'^[a-zA-Z0-9_-]{25,44}$', file_id):
            return False, "Invalid Drive file ID format"

        return True, None

    @staticmethod
    def parse_a1_notation(notation: str) -> Optional[Dict[str, Any]]:
        """
        Parse A1 notation into components.

        Args:
            notation: A1 notation string (e.g., "Sheet1!A1:B10")

        Returns:
            Dictionary with parsed components or None if invalid
        """
        # Match pattern: [Sheet!]A1[:B10]
        pattern = r"^(?:(?P<sheet>'?[\w\s]+'?)!)?(?P<start>[A-Z]+\d+)(?::(?P<end>[A-Z]+\d+))?$"
        match = re.match(pattern, notation)

        if not match:
            return None

        components = {
            'sheet': match.group('sheet').strip("'") if match.group('sheet') else None,
            'start_cell': match.group('start'),
            'end_cell': match.group('end') if match.group('end') else match.group('start'),
            'is_range': match.group('end') is not None
        }

        return components

    @staticmethod
    def column_letter_to_number(letter: str) -> int:
        """
        Convert column letter to number (A=1, B=2, Z=26, AA=27, etc.).

        Args:
            letter: Column letter(s)

        Returns:
            Column number (1-indexed)
        """
        result = 0
        for char in letter.upper():
            result = result * 26 + (ord(char) - ord('A') + 1)
        return result

    @staticmethod
    def column_number_to_letter(number: int) -> str:
        """
        Convert column number to letter (1=A, 2=B, 26=Z, 27=AA, etc.).

        Args:
            number: Column number (1-indexed)

        Returns:
            Column letter(s)
        """
        result = ""
        while number > 0:
            number -= 1
            result = chr(number % 26 + ord('A')) + result
            number //= 26
        return result


# Convenience functions
def validate_spreadsheet_id(sheet_id: str) -> bool:
    """Quick validation for spreadsheet ID"""
    is_valid, _ = GoogleAppsScriptValidators.is_valid_spreadsheet_id(sheet_id)
    return is_valid


def validate_a1_notation(notation: str) -> bool:
    """Quick validation for A1 notation"""
    is_valid, _ = GoogleAppsScriptValidators.is_valid_a1_notation(notation)
    return is_valid


def validate_email(email: str) -> bool:
    """Quick validation for email"""
    is_valid, _ = GoogleAppsScriptValidators.is_valid_email(email)
    return is_valid


# Example usage
if __name__ == "__main__":
    validators = GoogleAppsScriptValidators()

    # Test spreadsheet operation
    operation = {
        'spreadsheet_id': '1BxiMVs0XRA5nFMKUVfIZ-QcubIYvWXQfB9IHUZpLMGk',
        'sheet_name': 'Sheet1',
        'range_notation': 'A1:C10',
        'values': [
            ['Header 1', 'Header 2', 'Header 3'],
            ['Value 1', 'Value 2', 'Value 3'],
            ['Value 4', 'Value 5', 'Value 6']
        ]
    }

    result = validators.validate_spreadsheet_operation(operation)
    print(f"Operation validation: {'✅ Valid' if result.is_valid else '❌ Invalid'}")
    if result.errors:
        print(f"Errors: {result.errors}")

    # Test A1 notation parsing
    notations = [
        'A1',
        'A1:B10',
        'Sheet1!A1',
        "'My Sheet'!A1:C5"
    ]

    print("\nA1 Notation Parsing:")
    for notation in notations:
        parsed = validators.parse_a1_notation(notation)
        print(f"{notation:25} -> {parsed}")

    # Test column conversions
    print("\nColumn Conversions:")
    letters = ['A', 'Z', 'AA', 'AB', 'ZZ', 'AAA']
    for letter in letters:
        number = validators.column_letter_to_number(letter)
        back_to_letter = validators.column_number_to_letter(number)
        print(f"{letter:5} -> {number:5} -> {back_to_letter}")

    # Test email validation
    emails = [
        'user@example.com',
        'test.user+tag@domain.co.uk',
        'invalid@',
        '@invalid.com'
    ]

    print("\nEmail Validation:")
    for email in emails:
        is_valid = validate_email(email)
        print(f"{email:30} -> {'✅ Valid' if is_valid else '❌ Invalid'}")
