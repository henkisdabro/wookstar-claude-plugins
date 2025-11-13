#!/usr/bin/env python3
"""Convert time between timezones."""

import sys
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


def convert_time(source_tz: str, time_str: str, target_tz: str) -> None:
    """Convert time from source timezone to target timezone.

    Args:
        source_tz: Source IANA timezone name (e.g., 'America/New_York')
        time_str: Time to convert in 24-hour format (HH:MM)
        target_tz: Target IANA timezone name (e.g., 'Australia/Perth')
    """
    try:
        # Parse timezone names
        source_timezone = ZoneInfo(source_tz)
        target_timezone = ZoneInfo(target_tz)

        # Parse time string
        try:
            parsed_time = datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            print(f"Error: Invalid time format '{time_str}'", file=sys.stderr)
            print("Expected format: HH:MM (24-hour, e.g., '14:30')", file=sys.stderr)
            sys.exit(1)

        # Create datetime for today in source timezone
        now = datetime.now(source_timezone)
        source_time = datetime(
            now.year,
            now.month,
            now.day,
            parsed_time.hour,
            parsed_time.minute,
            tzinfo=source_timezone,
        )

        # Convert to target timezone
        target_time = source_time.astimezone(target_timezone)

        # Calculate time difference
        source_offset = source_time.utcoffset() or timedelta()
        target_offset = target_time.utcoffset() or timedelta()
        hours_difference = (target_offset - source_offset).total_seconds() / 3600

        # Format time difference (handle fractional hours like Nepal's +5:45)
        if hours_difference.is_integer():
            time_diff_str = f"{hours_difference:+.1f}h"
        else:
            time_diff_str = f"{hours_difference:+.2f}".rstrip("0").rstrip(".") + "h"

        # Check DST status
        source_dst = source_time.dst() is not None and source_time.dst().total_seconds() != 0
        target_dst = target_time.dst() is not None and target_time.dst().total_seconds() != 0

        # Output formatted information
        print(f"Source: {source_tz} - {source_time.isoformat(timespec='seconds')} "
              f"({source_time.strftime('%A')}, DST: {'Yes' if source_dst else 'No'})")
        print(f"Target: {target_tz} - {target_time.isoformat(timespec='seconds')} "
              f"({target_time.strftime('%A')}, DST: {'Yes' if target_dst else 'No'})")
        print(f"Time difference: {time_diff_str}")

    except Exception as e:
        if "ZoneInfo" in str(type(e).__name__):
            print(f"Error: Invalid timezone", file=sys.stderr)
        else:
            print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


def main():
    if len(sys.argv) != 4:
        print("Usage: python convert_time.py <source_tz> <time> <target_tz>", file=sys.stderr)
        print("Example: python convert_time.py 'America/New_York' '14:30' 'Australia/Perth'",
              file=sys.stderr)
        sys.exit(1)

    source_tz = sys.argv[1]
    time_str = sys.argv[2]
    target_tz = sys.argv[3]

    convert_time(source_tz, time_str, target_tz)


if __name__ == "__main__":
    main()
