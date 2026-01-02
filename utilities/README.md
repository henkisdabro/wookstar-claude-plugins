# Utilities Toolkit

General-purpose utility tools for common tasks in Claude Code.

## What's Included

### Skills (1)

- **timezone-tools** - Timezone conversion and time utilities using the IANA timezone database

## Installation

```bash
/plugin install utilities@wookstar
```

## Usage Examples

```bash
# Get current time in a specific timezone
"What time is it in Tokyo?"

# Convert time between timezones
"I have a meeting at 2pm New York time, what time is that in Perth?"

# Find timezone codes
"What are the timezone codes for London, Tokyo, and Sydney?"
```

## Skill Details

### timezone-tools

Get current time in any timezone and convert times between different timezones.

**Features:**

- Current time queries for any IANA timezone
- Time conversion between timezones with automatic DST handling
- Timezone name search by city or country
- Support for all IANA timezone database entries

**Scripts included:**

- `get_time.py` - Get current time in a specified timezone
- `convert_time.py` - Convert time between two timezones
- `list_timezones.py` - Search for timezone names

**Time format:**

- All times use 24-hour format (HH:MM)
- ISO 8601 datetime format for output
- IANA timezone names (e.g., `America/New_York`, not `EST`)

## Dependencies

- Python 3.9+
- `tzlocal>=5.0` - for local timezone detection
- `zoneinfo` - built-in Python 3.9+ (IANA timezone database)

Install with:

```bash
pip install tzlocal
```

## When to Use

This toolkit is ideal for:

- Working with distributed teams across timezones
- Scheduling meetings across regions
- Converting times for international coordination
- Quick timezone lookups
