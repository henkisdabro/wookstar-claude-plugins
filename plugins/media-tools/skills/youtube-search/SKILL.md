---
name: youtube-search
description: Search YouTube with yt-dlp and return structured results (title, channel, views, duration, date, URL), then fetch captions or download audio for a chosen video. Use when the user asks to "search youtube", "find youtube videos about", "what's on youtube about", wants recent or most-viewed videos on a topic, wants videos from a specific channel, needs metadata for a YouTube URL, wants a YouTube video's captions or subtitles, or wants a video's audio downloaded to transcribe. Do NOT use for transcribing a local audio file - use transcribe; for converting or editing media files - use ffmpeg-cli; for playing videos or for non-YouTube platforms.
argument-hint: <topic> [max_results]
allowed-tools: Bash, Read
---

# YouTube Search

Search YouTube through [yt-dlp](https://github.com/yt-dlp/yt-dlp) and present structured results. Users must respect YouTube's Terms of Service and copyright when downloading anything.

## Prerequisites

`yt-dlp` on PATH. Install with `brew install yt-dlp` (Homebrew also installs Deno), or `python3 -m pip install -U "yt-dlp[default]"` per the [installation wiki](https://github.com/yt-dlp/yt-dlp/wiki/Installation). Search and metadata work on their own; **downloads** additionally need ffmpeg (for `-x`) and a JavaScript runtime such as [Deno](https://deno.com) for YouTube's challenge solving - see the [EJS wiki](https://github.com/yt-dlp/yt-dlp/wiki/EJS) if a download fails with a challenge or "n function" error.

## Steps

1. **Parse the request** into a query, a result count (default 10) and any filters from the table below. Done when every constraint the user stated maps to a flag.
2. **Run the search** (allow up to 300 s for `--full` runs):

   ```bash
   uv run "${CLAUDE_SKILL_DIR}/scripts/yt_search.py" "<query>" -n 10 [options]
   ```

   Done when the script prints results, or prints "No results" and you have retried once with looser filters.
3. **Present the Markdown output as-is.** If the user wants more on one video, run `yt-dlp "<url>" --dump-json --no-download --no-warnings` and pick the fields they asked about.
4. **Hand off** if the user wants the content of a video, not just the link - see [Getting the words out of a video](#getting-the-words-out-of-a-video).

## Options

| Flag | Default | Purpose |
|------|---------|---------|
| `-n, --max-results` | 10 | Maximum results to return |
| `--months N` | off | Only videos from the last N months. Implies `--full` |
| `--sort` | relevance | `relevance`, `views`, or `date` (`date` implies `--full`) |
| `--min-views` | - | Minimum view count |
| `--min-duration` / `--max-duration` | - | Duration bounds in seconds |
| `--channel` | - | Channel name, case-insensitive substring |
| `--json` | off | Clean JSON on stdout, safe to pipe to `jq` |
| `--full` | off | Visit each video: upload date, likes, comments, tags, description |

**Fast vs full mode.** Fast mode makes one request to the search results page and finishes in a few seconds, but YouTube's results page carries **no upload dates** (the Date column shows `?`). Full mode visits each video (roughly 3-5 s each, over-fetching 3x to survive filters) and is the only way to filter or sort by date. Reach for `--months` only when recency genuinely matters - for evergreen topics (talks, tutorials, fundamentals) the canonical videos are often years old.

## Search tactics

- `--min-duration 600` drops Shorts, clips and promos; `--min-duration 1800` keeps only long-form talks, interviews and podcasts.
- View count measures popularity, not quality. Weigh the channel too: conference, university and official author channels rarely produce noise.
- `"<person> <topic>"` returns videos *by* and *about* that person. To get only their own uploads, add `--channel "<exact channel name>"`.

## Getting the words out of a video

Check for captions first - they are faster and free:

```bash
yt-dlp --list-subs "<url>"
```

- **Captions exist:** fetch them as `.vtt` without downloading the video:

  ```bash
  yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs en -P "<dir>" -o "%(id)s.%(ext)s" "<url>"
  ```

- **No captions, or the user wants an accurate transcript:** download the audio only, then hand the printed path to the **transcribe** skill:

  ```bash
  yt-dlp -x --audio-format m4a -P "<dir>" -o "%(id)s.%(ext)s" --print after_move:filepath "<url>"
  ```

  `--print after_move:filepath` prints the final file path on stdout - pass exactly that path to transcribe. Done when the `.m4a` exists at that path. For long videos, `--download-sections "*10:00-25:00"` grabs only a time range.

For trimming, splitting or re-encoding the downloaded file, use the **ffmpeg-cli** skill from this marketplace's `ffmpeg` plugin.
