#!/usr/bin/env python3
"""
Google Ads Script Validators

Validation utilities for Google Ads campaigns, bids, budgets, and keywords.
Use these validators before applying changes to ensure data integrity.

Based on Google Ads API specifications and best practices.
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
import re


@dataclass
class ValidationResult:
    """Result of a validation check"""
    is_valid: bool
    errors: List[str]
    warnings: List[str] = None

    def __post_init__(self):
        if self.warnings is None:
            self.warnings = []


class GoogleAdsValidators:
    """Comprehensive validation for Google Ads Script operations"""

    # Constants
    MIN_BUDGET = 0.01  # Minimum $0.01
    MAX_BUDGET = 999999.99  # Practical maximum
    MIN_BID = 0.01  # Minimum $0.01 in currency
    MIN_BID_MICROS = 10000  # Minimum 0.01 in micros
    MICROS_MULTIPLIER = 1000000

    @staticmethod
    def is_campaign_name_valid(name: str) -> Tuple[bool, Optional[str]]:
        """
        Validate campaign name.

        Rules:
        - Must be string
        - Length 1-255 characters

        Returns:
            (is_valid, error_message)
        """
        if not name or not isinstance(name, str):
            return False, "Campaign name must be a non-empty string"

        if len(name) < 1 or len(name) > 255:
            return False, f"Campaign name must be 1-255 characters (got {len(name)})"

        return True, None

    @classmethod
    def is_budget_valid(cls, amount: float) -> Tuple[bool, Optional[str]]:
        """
        Validate budget amount in local currency.

        Args:
            amount: Budget in local currency (e.g., 50.00 for $50)

        Returns:
            (is_valid, error_message)
        """
        if not isinstance(amount, (int, float)):
            return False, "Budget must be a number"

        if amount < cls.MIN_BUDGET:
            return False, f"Budget must be at least {cls.MIN_BUDGET}"

        if amount > cls.MAX_BUDGET:
            return False, f"Budget exceeds maximum of {cls.MAX_BUDGET}"

        return True, None

    @classmethod
    def is_bid_valid(cls, bid: float) -> Tuple[bool, Optional[str]]:
        """
        Validate bid amount in local currency.

        Args:
            bid: Bid in local currency (e.g., 1.50 for $1.50)

        Returns:
            (is_valid, error_message)
        """
        if not isinstance(bid, (int, float)):
            return False, "Bid must be a number"

        if bid < cls.MIN_BID:
            return False, f"Bid must be at least {cls.MIN_BID}"

        return True, None

    @staticmethod
    def is_quality_score_valid(score: Any) -> Tuple[bool, Optional[str]]:
        """
        Validate quality score.

        Args:
            score: Quality score (1-10 or None)

        Returns:
            (is_valid, error_message)
        """
        if score is None:
            return True, None  # Quality score can be null

        if not isinstance(score, int):
            return False, "Quality score must be an integer"

        if score < 1 or score > 10:
            return False, "Quality score must be 1-10"

        return True, None

    @classmethod
    def is_cpc_bid_micros_valid(cls, bid_micros: int, max_bid: float = 10000) -> Tuple[bool, Optional[str]]:
        """
        Validate CPC bid in micros.

        Args:
            bid_micros: Bid in micros (e.g., 50000 for $0.05)
            max_bid: Maximum allowed bid in currency

        Returns:
            (is_valid, error_message)
        """
        if not isinstance(bid_micros, int):
            return False, "Bid (micros) must be an integer"

        if bid_micros < cls.MIN_BID_MICROS:
            return False, f"Bid must be at least {cls.MIN_BID_MICROS} micros ($0.01)"

        max_bid_micros = int(max_bid * cls.MICROS_MULTIPLIER)
        if bid_micros > max_bid_micros:
            return False, f"Bid exceeds maximum of {max_bid_micros} micros (${max_bid})"

        return True, None

    @staticmethod
    def is_campaign_status_valid(status: str) -> Tuple[bool, Optional[str]]:
        """
        Validate campaign status.

        Args:
            status: Campaign status

        Returns:
            (is_valid, error_message)
        """
        valid_statuses = ['ENABLED', 'PAUSED', 'REMOVED']

        if status not in valid_statuses:
            return False, f"Status must be one of {valid_statuses}"

        return True, None

    @staticmethod
    def is_campaign_type_valid(campaign_type: str) -> Tuple[bool, Optional[str]]:
        """
        Validate campaign type.

        Args:
            campaign_type: Campaign type

        Returns:
            (is_valid, error_message)
        """
        valid_types = ['SEARCH', 'DISPLAY', 'SHOPPING', 'VIDEO', 'PERFORMANCE_MAX']

        if campaign_type not in valid_types:
            return False, f"Campaign type must be one of {valid_types}"

        return True, None

    @staticmethod
    def is_keyword_text_valid(text: str) -> Tuple[bool, Optional[str]]:
        """
        Validate keyword text.

        Args:
            text: Keyword text

        Returns:
            (is_valid, error_message)
        """
        if not text or not isinstance(text, str):
            return False, "Keyword text must be a non-empty string"

        if len(text) < 1 or len(text) > 80:
            return False, f"Keyword text must be 1-80 characters (got {len(text)})"

        return True, None

    @staticmethod
    def is_match_type_valid(match_type: str) -> Tuple[bool, Optional[str]]:
        """
        Validate keyword match type.

        Args:
            match_type: Match type

        Returns:
            (is_valid, error_message)
        """
        valid_types = ['BROAD', 'PHRASE', 'EXACT']

        if match_type not in valid_types:
            return False, f"Match type must be one of {valid_types}"

        return True, None

    @classmethod
    def validate_campaign_update(cls, updates: Dict[str, Any]) -> ValidationResult:
        """
        Validate campaign update payload.

        Args:
            updates: Dictionary with campaign update fields

        Returns:
            ValidationResult with is_valid and errors
        """
        errors = []
        warnings = []

        # Validate name
        if 'name' in updates:
            is_valid, error = cls.is_campaign_name_valid(updates['name'])
            if not is_valid:
                errors.append(error)

        # Validate budget
        if 'budget' in updates:
            is_valid, error = cls.is_budget_valid(updates['budget'])
            if not is_valid:
                errors.append(error)

        # Validate status
        if 'status' in updates:
            is_valid, error = cls.is_campaign_status_valid(updates['status'])
            if not is_valid:
                errors.append(error)

        # Validate type
        if 'type' in updates:
            is_valid, error = cls.is_campaign_type_valid(updates['type'])
            if not is_valid:
                errors.append(error)

        # Validate dates
        if 'start_date' in updates and 'end_date' in updates:
            try:
                from datetime import datetime
                start = datetime.fromisoformat(updates['start_date'])
                end = datetime.fromisoformat(updates['end_date'])
                if end <= start:
                    errors.append("End date must be after start date")
            except ValueError:
                errors.append("Invalid date format (use YYYY-MM-DD)")

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )

    @classmethod
    def validate_keyword_update(cls, updates: Dict[str, Any]) -> ValidationResult:
        """
        Validate keyword update payload.

        Args:
            updates: Dictionary with keyword update fields

        Returns:
            ValidationResult with is_valid and errors
        """
        errors = []
        warnings = []

        # Validate keyword text
        if 'text' in updates:
            is_valid, error = cls.is_keyword_text_valid(updates['text'])
            if not is_valid:
                errors.append(error)

        # Validate match type
        if 'match_type' in updates:
            is_valid, error = cls.is_match_type_valid(updates['match_type'])
            if not is_valid:
                errors.append(error)

        # Validate bid (if in currency)
        if 'max_cpc' in updates:
            is_valid, error = cls.is_bid_valid(updates['max_cpc'])
            if not is_valid:
                errors.append(error)

        # Validate bid (if in micros)
        if 'max_cpc_micros' in updates:
            is_valid, error = cls.is_cpc_bid_micros_valid(updates['max_cpc_micros'])
            if not is_valid:
                errors.append(error)

        # Validate status
        if 'status' in updates:
            is_valid, error = cls.is_campaign_status_valid(updates['status'])
            if not is_valid:
                errors.append(error)

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings
        )

    @classmethod
    def validate_quota_remaining(cls, current_cost: int, daily_limit: int, used: int) -> Dict[str, Any]:
        """
        Track API quota consumption.

        Args:
            current_cost: Cost of current operation
            daily_limit: Daily quota limit
            used: Amount of quota already used

        Returns:
            Dictionary with quota status
        """
        remaining = daily_limit - used
        percent_used = (used / daily_limit) * 100 if daily_limit > 0 else 100

        return {
            'remaining': remaining,
            'percent_used': percent_used,
            'is_critical': percent_used > 90,
            'should_throttle': percent_used > 85,
            'can_proceed': (used + current_cost) <= daily_limit
        }


def currency_to_micros(amount: float) -> int:
    """
    Convert currency to micros.

    Args:
        amount: Amount in local currency (e.g., 5.00 for $5)

    Returns:
        Amount in micros (e.g., 5000000)
    """
    return int(amount * GoogleAdsValidators.MICROS_MULTIPLIER)


def micros_to_currency(micros: int) -> float:
    """
    Convert micros to currency.

    Args:
        micros: Amount in micros (e.g., 5000000)

    Returns:
        Amount in local currency (e.g., 5.00)
    """
    return micros / GoogleAdsValidators.MICROS_MULTIPLIER


# Example usage
if __name__ == "__main__":
    validators = GoogleAdsValidators()

    # Test campaign validation
    campaign_data = {
        'name': 'Q4 Sale Campaign',
        'budget': 5000,
        'status': 'ENABLED',
        'type': 'SEARCH'
    }

    result = validators.validate_campaign_update(campaign_data)
    print(f"Campaign validation: {'✅ Valid' if result.is_valid else '❌ Invalid'}")
    if result.errors:
        print(f"Errors: {result.errors}")

    # Test currency conversion
    bid_currency = 1.50
    bid_micros = currency_to_micros(bid_currency)
    print(f"\n${bid_currency} = {bid_micros} micros")
    print(f"{bid_micros} micros = ${micros_to_currency(bid_micros)}")

    # Test keyword validation
    keyword_data = {
        'text': 'running shoes',
        'match_type': 'PHRASE',
        'max_cpc': 2.50
    }

    result = validators.validate_keyword_update(keyword_data)
    print(f"\nKeyword validation: {'✅ Valid' if result.is_valid else '❌ Invalid'}")
    if result.errors:
        print(f"Errors: {result.errors}")
