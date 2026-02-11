# FFmpeg CLI Reference Plugin

Comprehensive FFmpeg CLI reference for video and audio processing, format conversion, encoding, filtering, and media automation.

## Installation

```
/plugin install ffmpeg@wookstar-claude-plugins
```

## Coverage

### SKILL.md (loaded on trigger)

- Glossary of flags and filters
- Converting formats (MP4, MKV, MOV, AVI)
- Resizing and padding (scale, pad, setsar)
- Trim by time
- Verification and inspection (ffprobe)

### Reference files (loaded on demand)

| File | Topics |
|---|---|
| `core-concepts.md` | `-c copy`, input/output seeking, encoding quick ref, GPU overview, yuv420p, faststart |
| `audio-processing.md` | Replace/extract/mix audio, combine tracks, crossfade, format conversion, normalisation |
| `advanced-editing.md` | Speed, FPS, jump cuts, social media cropping, drawtext, subtitles, media combining |
| `asset-generation.md` | Image to video, slideshows, Ken Burns, GIFs, compilations, thumbnails, storyboards |
| `encoding-and-settings.md` | H264/H265/VP9 deep-dive, CRF/bitrate, 1-pass vs 2-pass, GPU acceleration detail |

## Structure

```
plugins/ffmpeg/
  .claude-plugin/plugin.json
  README.md
  skills/ffmpeg-cli/
    SKILL.md
    references/
      core-concepts.md
      audio-processing.md
      advanced-editing.md
      asset-generation.md
      encoding-and-settings.md
```
