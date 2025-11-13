#!/usr/bin/env python3
"""Get current time in a specific timezone."""

import sys
from datetime import datetime
from zoneinfo import ZoneInfo


def get_current_time(timezone_name: str) -> None:
    """Get and display current time in specified timezone.

    Args:
        timezone_name: IANA timezone name (e.g., 'America/New_York')
    """
    try:
        timezone = ZoneInfo(timezone_name)
        current_time = datetime.now(timezone)

        # Check if DST is active
        is_dst = current_time.dst() is not None and current_time.dst().total_seconds() != 0

        # Output formatted information
        print(f"Timezone: {timezone_name}")
        print(f"Current time: {current_time.isoformat(timespec='seconds')}")
        print(f"Day: {current_time.strftime('%A')}")
        print(f"DST: {'Yes' if is_dst else 'No'}")

    except Exception as e:
        print(f"Error: Invalid timezone '{timezone_name}'", file=sys.stderr)
        print(f"Details: {str(e)}", file=sys.stderr)
        sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("Usage: python get_time.py <timezone>", file=sys.stderr)
        print("Example: python get_time.py 'America/New_York'", file=sys.stderr)
        sys.exit(1)

    timezone_name = sys.argv[1]
    get_current_time(timezone_name)


if __name__ == "__main__":
    main()
