---
name: timezone-tools
description: Get current time in any timezone and convert times between timezones. Use when working with time, dates, timezones, scheduling across regions, "what time is it in X", "convert 3pm Sydney to London", DST checks, or when the user mentions specific cities/regions for time queries. Supports IANA timezone names. Do NOT use for date arithmetic (adding days/months), recurring event scheduling, business-day calculations, or full calendar/booking logic - those need a dedicated date library or scheduling tool.
---

# Timezone Tools

Three standard-library Python scripts (3.9+, `zoneinfo`) over the IANA timezone database. Nothing to install on macOS or Linux.

## Steps

1. **Resolve each place to an IANA name** (`America/New_York`, not `EST`). If unsure, search:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/list_timezones.py" "perth"
   ```
   Done when every place in the question maps to one IANA name. [data/common_timezones.json](data/common_timezones.json) lists major cities.

2. **Current time** ("what time is it in Tokyo?"):
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/get_time.py" "Asia/Tokyo"
   ```
   Prints timezone, ISO datetime, weekday and DST status.

3. **Conversion** ("2pm New York in Perth?"): source zone, 24-hour `HH:MM`, target zone, then an optional `YYYY-MM-DD` date of the source time:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/convert_time.py" "America/New_York" "14:00" "Australia/Perth" 2026-11-02
   ```
   Without the date the time is taken as today in the source zone. Pass the date whenever the question is about a specific day - offsets change at DST boundaries, so today's offset can be wrong for next week's meeting. Prints source and target datetimes with weekday, DST status, and the difference in hours.

Done when the answer quotes the script's output time, including the weekday if it crosses midnight.

## Example

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/convert_time.py" "America/New_York" "14:00" "Australia/Perth" 2026-11-02
# Source: America/New_York - 2026-11-02T14:00:00-05:00 (Monday, DST: No)
# Target: Australia/Perth - 2026-11-03T03:00:00+08:00 (Tuesday, DST: No)
# Time difference: +13.0h
```

## Troubleshooting

- **"Invalid timezone"** - use an IANA name; search with `list_timezones.py`. On Windows, which ships no IANA database, `zoneinfo` needs the `tzdata` package: run the scripts as `uv run --with tzdata python ...`.
- **"Invalid time format"** - 24-hour `HH:MM`: `14:30`, not `2:30 PM`.
- **"Invalid date format"** - `YYYY-MM-DD`.
