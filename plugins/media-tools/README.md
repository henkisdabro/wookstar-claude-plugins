# Media Tools Plugin

Two skills that work alone or as a pipeline: find a YouTube video, pull its audio, and turn it into text - all locally.

| Skill | What it does |
|---|---|
| `youtube-search` | Searches YouTube with [yt-dlp](https://github.com/yt-dlp/yt-dlp) and returns structured results (title, channel, views, duration, date, URL), with filters for recency, views, duration and channel. Fetches captions or downloads a video's audio. |
| `transcribe` | Transcribes audio or video files to text (or SRT/VTT subtitles) with Whisper - [mlx-whisper](https://pypi.org/project/mlx-whisper/) on Apple Silicon, [openai-whisper](https://github.com/openai/whisper) on other platforms. |

## Installation

```
/plugin install media-tools@wookstar-claude-plugins
```

For converting, trimming or extracting audio, also install the `ffmpeg` plugin from this marketplace - both skills point to its `ffmpeg-cli` skill when a file needs pre-processing.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) - runs the search script and the Whisper engines via `uv run` / `uvx`.
- **yt-dlp** - `brew install yt-dlp`, or see the [installation wiki](https://github.com/yt-dlp/yt-dlp/wiki/Installation). Downloads from YouTube also need a JavaScript runtime such as [Deno](https://deno.com) (Homebrew installs it alongside yt-dlp); see the [EJS wiki](https://github.com/yt-dlp/yt-dlp/wiki/EJS).
- **ffmpeg** - needed for audio extraction and by openai-whisper (`brew install ffmpeg`).
- **transcribe** is fastest on macOS with Apple Silicon. Other platforms fall back to openai-whisper, which works on CPU but is considerably slower on long recordings. The first run downloads a Whisper model (about 1.5 GB).

Respect YouTube's Terms of Service and copyright when downloading.

## Usage

- "Search YouTube for long-form talks on distributed systems, 10 results, most viewed"
- "Find videos from the last 3 months about Vite"
- "Transcribe ~/Downloads/voice-note.opus"
- "Find the official keynote on X, download the audio and transcribe it"

### The search-then-transcribe pipeline

1. `youtube-search` finds the video and checks for captions with `yt-dlp --list-subs`. If captions exist, it fetches them directly - no transcription needed.
2. Otherwise it downloads audio only (`yt-dlp -x --audio-format m4a --print after_move:filepath`), which prints the saved file's path.
3. `transcribe` takes that path, picks mlx-whisper or openai-whisper for the platform, and returns the verbatim transcript.
