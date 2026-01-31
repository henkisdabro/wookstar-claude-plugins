#!/usr/bin/env python3
"""Search for IANA timezone names."""

import sys
from zoneinfo import available_timezones


def list_timezones(search_term: str = "") -> None:
    """List timezone names matching the search term.

    Args:
        search_term: Optional search term to filter timezone names (case-insensitive)
    """
    try:
        all_timezones = sorted(available_timezones())

        if search_term:
            # Case-insensitive search
            search_lower = search_term.lower()
            matching = [tz for tz in all_timezones if search_lower in tz.lower()]

            if matching:
                print(f"Timezones matching '{search_term}':")
                for tz in matching:
                    print(f"  {tz}")
            else:
                print(f"No timezones found matching '{search_term}'", file=sys.stderr)
                print("\nTip: Try searching for city names like 'perth', 'london', 'tokyo'",
                      file=sys.stderr)
                sys.exit(1)
        else:
            # List all timezones (this is a lot!)
            print(f"All available timezones ({len(all_timezones)} total):")
            for tz in all_timezones:
                print(f"  {tz}")

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


def main():
    if len(sys.argv) > 2:
        print("Usage: python list_timezones.py [search_term]", file=sys.stderr)
        print("Example: python list_timezones.py 'perth'", file=sys.stderr)
        sys.exit(1)

    search_term = sys.argv[1] if len(sys.argv) == 2 else ""
    list_timezones(search_term)


if __name__ == "__main__":
    main()
