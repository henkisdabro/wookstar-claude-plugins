---
name: transcribe
description: Transcribe audio or video files to text locally with Whisper - mlx-whisper on macOS with Apple Silicon, openai-whisper elsewhere. Use when the user wants to transcribe a file, get a transcript of a recording, turn a voice note or WhatsApp audio into text, transcribe a meeting, podcast or interview, produce subtitles (SRT/VTT) from audio, or transcribe audio just downloaded with youtube-search. Do NOT use for finding or downloading YouTube videos - use youtube-search; for converting, trimming or extracting audio - use ffmpeg-cli; for live dictation or real-time speech recognition.
argument-hint: <audio-file> [language]
compatibility: macOS with Apple Silicon (openai-whisper fallback on other platforms)
allowed-tools: Bash, Read, Write
---

# Transcribe

Local speech-to-text with Whisper. On Apple Silicon, [mlx-whisper](https://pypi.org/project/mlx-whisper/) runs on the GPU and is fast (a 15-20 minute file takes a couple of minutes). Elsewhere, [openai-whisper](https://github.com/openai/whisper) does the same job more slowly. Both run through `uvx`, so nothing is installed permanently.

## Steps

1. **Locate the input.** Use the path the user gave, or the path printed by the youtube-search download step (`--print after_move:filepath`). Done when `ls` confirms the file exists.
2. **Convert only if needed.** Both engines read m4a, mp3, wav, flac, ogg, webm and mp4 directly via ffmpeg. Convert first with the **ffmpeg-cli** skill (from this marketplace's `ffmpeg` plugin) when the file is an unusual format (`.amr`, `.wma`, `.caf`), or a WhatsApp `.opus` voice note, which decodes more reliably as m4a:

   ```bash
   ffmpeg -i "input.opus" -c:a aac -b:a 128k "input.m4a"
   ```

3. **Pick the language.** Pass `--language <code>` (`en`, `de`, `sv`, ...) whenever the user states it or the context makes it obvious - auto-detection costs time and can misidentify short clips. Omit the flag only when the language is genuinely unknown.
4. **Pick the engine** with `uname -sm`: `Darwin arm64` runs mlx-whisper; anything else runs openai-whisper.
5. **Run it** (allow up to 600 s; the first run also downloads the model, about 1.5 GB):

   **Apple Silicon - mlx-whisper**

   ```bash
   OUTPUT_DIR=$(mktemp -d)
   uvx --from mlx-whisper mlx_whisper "/path/to/audio.m4a" \
     --model mlx-community/whisper-large-v3-turbo \
     --language en --output-format txt -o "$OUTPUT_DIR"
   ```

   **Other platforms - openai-whisper** (needs `ffmpeg` on PATH; uses the `turbo` model by default; CPU-only is slow on long files)

   ```bash
   OUTPUT_DIR=$(mktemp -d)
   uvx --from openai-whisper whisper "/path/to/audio.m4a" \
     --model turbo --language en --output_format txt -o "$OUTPUT_DIR"
   ```

   Note the flag spelling differs: `--output-format` for mlx-whisper, `--output_format` for openai-whisper. Use `srt` or `vtt` instead of `txt` when the user wants subtitles, or `all` for every format.

   Done when `$OUTPUT_DIR/<input-basename>.txt` exists and is non-empty.

6. **Deliver the transcript.** Print the full verbatim text in the conversation - summarise only when asked. When it runs past about 2000 words, offer to save it as a `.txt` next to the source file.
