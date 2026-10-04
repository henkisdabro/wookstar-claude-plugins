#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Search YouTube via the yt-dlp CLI and print structured results (Markdown or JSON).

Requires `yt-dlp` on PATH. Fast mode reads the search results page only, which
carries no upload dates, so date filtering and date sorting switch to full mode.
"""

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime, timedelta


def parse_args():
    parser = argparse.ArgumentParser(description="Search YouTube via yt-dlp")
    parser.add_argument("query", help="Search keywords or topic")
    parser.add_argument("-n", "--max-results", type=int, default=10,
                        help="Maximum results to return (default: 10)")
    parser.add_argument("--months", type=int, default=None,
                        help="Only videos uploaded in the last N months (implies --full)")
    parser.add_argument("--sort", choices=["relevance", "date", "views"], default="relevance",
                        help="Sort order (default: relevance; 'date' implies --full)")
    parser.add_argument("--min-views", type=int, default=None, help="Minimum view count")
    parser.add_argument("--min-duration", type=int, default=None, help="Minimum duration in seconds (videos of unknown duration are kept)")
    parser.add_argument("--max-duration", type=int, default=None, help="Maximum duration in seconds (videos of unknown duration are kept)")
    parser.add_argument("--channel", type=str, default=None,
                        help="Filter to channel name (case-insensitive substring match)")
    parser.add_argument("--json", action="store_true", help="Output JSON instead of Markdown")
    parser.add_argument("--full", action="store_true",
                        help="Visit each video for upload date, likes, comments, tags (slower)")
    return parser.parse_args()


def run_ytdlp(cmd: list[str], timeout: int) -> str:
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout).stdout
    except subprocess.TimeoutExpired:
        sys.exit(f"ERROR: search timed out after {timeout} seconds")


def run_search_fast(query: str, fetch_count: int) -> list[dict]:
    """One request: metadata from the search results page (no upload dates)."""
    out = run_ytdlp([
        "yt-dlp", f"ytsearch{fetch_count}:{query}",
        "--flat-playlist", "--dump-single-json",
        "--no-warnings", "--ignore-errors", "--socket-timeout", "15",
    ], timeout=60)
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return []
    return data.get("entries", []) if isinstance(data, dict) else []


def run_search_full(query: str, fetch_count: int, months: int | None) -> list[dict]:
    """One request per video: full metadata including upload date and engagement."""
    cmd = [
        "yt-dlp", f"ytsearch{fetch_count}:{query}",
        "--dump-json", "--no-download",
        "--no-warnings", "--ignore-errors", "--socket-timeout", "15",
    ]
    if months is not None:
        cmd += ["--dateafter", f"today-{months}months"]
    results = []
    for line in run_ytdlp(cmd, timeout=300).splitlines():
        try:
            results.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return results


def format_duration(seconds) -> str:
    if seconds is None:
        return "?"
    hours, remainder = divmod(int(seconds), 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{hours}:{minutes:02d}:{secs:02d}" if hours else f"{minutes}:{secs:02d}"


def format_count(count) -> str:
    if count is None:
        return "?"
    if count >= 1_000_000:
        return f"{count / 1_000_000:.1f}M"
    if count >= 1_000:
        return f"{count / 1_000:.1f}K"
    return str(count)


def format_date(upload_date) -> str:
    if not upload_date or len(upload_date) != 8:
        return "?"
    return f"{upload_date[:4]}-{upload_date[4:6]}-{upload_date[6:8]}"


def extract_fields(video: dict, full_mode: bool) -> dict:
    fields = {
        "title": video.get("title", "?"),
        "channel": video.get("channel") or video.get("uploader") or "?",
        "url": video.get("webpage_url") or video.get("url")
        or f"https://www.youtube.com/watch?v={video.get('id', '')}",
        "id": video.get("id", ""),
        "duration": video.get("duration"),
        "duration_string": video.get("duration_string") or format_duration(video.get("duration")),
        "view_count": video.get("view_count"),
        "views_formatted": format_count(video.get("view_count")),
        "upload_date": video.get("upload_date"),
        "date_formatted": format_date(video.get("upload_date")),
        "live_status": video.get("live_status"),
    }
    if full_mode:
        fields.update({
            "like_count": video.get("like_count"),
            "comment_count": video.get("comment_count"),
            "description": (video.get("description") or "")[:300],
            "categories": video.get("categories") or [],
            "tags": (video.get("tags") or [])[:10],
            "channel_url": video.get("channel_url", ""),
            "thumbnail": video.get("thumbnail", ""),
        })
    return fields


def apply_filters(results: list[dict], args, full_mode: bool) -> list[dict]:
    date_cutoff = None
    if args.months is not None:
        date_cutoff = (datetime.now() - timedelta(days=args.months * 30)).strftime("%Y%m%d")

    filtered = []
    for video in results:
        v = extract_fields(video, full_mode)
        if v["live_status"] in ("is_live", "is_upcoming"):
            continue
        if date_cutoff and v["upload_date"] and v["upload_date"] < date_cutoff:
            continue
        if args.channel and args.channel.lower() not in v["channel"].lower():
            continue
        if args.min_views and (v["view_count"] or 0) < args.min_views:
            continue
        dur = v["duration"]
        # Unknown durations (often live streams) pass both duration filters
        if args.min_duration and dur and dur < args.min_duration:
            continue
        if args.max_duration and dur and dur > args.max_duration:
            continue
        filtered.append(v)

    if args.sort == "views":
        filtered.sort(key=lambda x: x["view_count"] or 0, reverse=True)
    elif args.sort == "date":
        filtered.sort(key=lambda x: x["upload_date"] or "", reverse=True)
    return filtered[:args.max_results]


def print_markdown(results: list[dict], query: str, months: int | None, full_mode: bool):
    date_label = f"last {months} months" if months else "any date"
    print(f'\n## YouTube Search: "{query}" ({len(results)} results, {date_label})\n')
    if not results:
        print("No results found matching the criteria.")
        return
    for i, v in enumerate(results, 1):
        print(f"### {i}. {v['title']}")
        print(f"- **Channel**: {v['channel']}")
        print(f"- **Views**: {v['views_formatted']}  |  **Duration**: {v['duration_string']}"
              f"  |  **Date**: {v['date_formatted']}")
        if full_mode and v.get("like_count"):
            line = f"- **Likes**: {format_count(v['like_count'])}"
            if v.get("comment_count"):
                line += f"  |  **Comments**: {format_count(v['comment_count'])}"
            print(line)
        print(f"- **URL**: {v['url']}")
        if full_mode and v.get("description"):
            desc = v["description"].replace("\n", " ").strip()
            print(f"- **Description**: {desc[:200] + '...' if len(desc) > 200 else desc}")
        print()


def main():
    args = parse_args()
    if not shutil.which("yt-dlp"):
        sys.exit("ERROR: yt-dlp not found on PATH - install it with `brew install yt-dlp` "
                 "or see https://github.com/yt-dlp/yt-dlp#installation")

    full_mode = args.full or args.months is not None or args.sort == "date"
    fetch_count = min(args.max_results * 3, 50)  # over-fetch to survive filtering

    if full_mode:
        results = run_search_full(args.query, fetch_count, args.months)
    else:
        results = run_search_fast(args.query, fetch_count)

    filtered = apply_filters(results, args, full_mode)
    if args.json:
        print(json.dumps(filtered, indent=2, ensure_ascii=False))
    else:
        print_markdown(filtered, args.query, args.months, full_mode)


if __name__ == "__main__":
    main()
