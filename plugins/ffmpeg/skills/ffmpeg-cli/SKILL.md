---
name: ffmpeg-cli
description: FFmpeg CLI reference for video and audio processing, format conversion, filtering and media automation. Use when converting or remuxing between formats, resizing, cropping or padding video, trimming by time or changing playback speed, replacing, extracting or mixing audio, overlaying text or images or burning subtitles, concatenating clips, creating GIFs, thumbnails, storyboards or slideshows, choosing encoding settings (H264/H265/VP9, CRF, bitrate, GPU acceleration), writing a filter_complex graph, or inspecting a file with ffprobe. Do NOT use for image-only processing (use ImageMagick), live-streaming server setup (use OBS/nginx-rtmp), or NLE-style timeline editing (use a video editor).
allowed-tools: Bash, Read, Glob, Grep, Write, Edit
---

# FFmpeg CLI Reference

Needs `ffmpeg` on PATH (`ffmpeg -version`); install with `brew install ffmpeg`, `sudo apt install ffmpeg` or `scoop install ffmpeg`.

The common tasks are inline below. Read the reference file for the task before writing a command it covers:

| Read | When the task is |
|---|---|
| `references/core-concepts.md` | Deciding between `-c copy` and re-encoding, input vs output seeking and reliable trimming, `format=yuv420p`, `-movflags +faststart` |
| `references/audio-processing.md` | Replacing, extracting or mixing audio, combining MP3 tracks, crossfade, changing audio format, merging and normalising |
| `references/advanced-editing.md` | Playback speed, FPS change, jump cuts, cropping for social, drawtext overlay, subtitles (burn/embed/extract), combining media (overlay, logo, background, concat intro/main/outro, vstack) |
| `references/asset-generation.md` | Image to video, slideshow with fade, Ken Burns (zoompan), GIFs, video compilation with fades, thumbnails (single/multiple/scene), image thumbnails, storyboards (scene tile/keyframe/Nth frame) |
| `references/encoding-and-settings.md` | Choosing or tuning an encoder: optimised daily command, codec flags, H264 (libx264) CRF, H265 (libx265) Apple compatibility, VP9 (libvpx-vp9) constant quality, 1-pass vs 2-pass, GPU encoders (Nvidia, Intel, AMD, Apple) |

## Glossary of flags and filters

[Filtering reference](https://ffmpeg.org/ffmpeg-filters.html#Filtering-Introduction)

| Flag/Filter | Purpose |
|---|---|
| `-vf` (also `-filter:v`) | Video filter |
| `-af` (also `-filter:a`) | Audio filter |
| `-filter_complex` | Complex filter graph for multi-stream filtering |
| `[0]` | All streams from first input (0-based) |
| `[0:v]` | Video stream from first input |
| `[1:a]` | Audio stream from second input |
| `0:v:0` | First input, first video stream |
| `0:a:1` | First input, second audio stream |
| `[name]` | Named stream, used with `-filter_complex` |
| `-map [name]` | [Select stream for output](https://trac.ffmpeg.org/wiki/Map) |
| `-y` | Auto-overwrite output files without confirmation |

[Expression evaluations](https://ffmpeg.org/ffmpeg-all.html#Expression-Evaluation): `if`, `lte`, `gte` and more.

## Converting formats

Remux MP4 to MKV (no re-encoding):

```sh
ffmpeg -i input.mp4 -c copy output.mkv
```

MKV and MP4 are both containers for H264/H265 video and AAC/MP3 audio. Video quality is determined by the codec, not the container. MKV supports multiple video streams; MP4 has wider device support.

Remux MP4 to MOV:

```sh
ffmpeg -i input.mp4 -c copy output.mov
```

Encode MP4 to AVI (re-encodes):

```sh
ffmpeg -i input.mp4 output.avi
```

`ffmpeg -formats` and `ffmpeg -codecs` list what the installed build supports.

## Resizing and padding

Upscale to 1080x1920, preserve aspect ratio, black padding:

```sh
ffmpeg -i input.mp4 -vf "scale=w=1080:h=1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1:1" output.mp4
```

**scale** options:

- `force_original_aspect_ratio=decrease` - auto-decrease output dimensions to fit aspect ratio
- `force_original_aspect_ratio=increase` - auto-increase dimensions
- `scale=w=1080:h=-1` - let ffmpeg pick correct height for aspect ratio
- `scale=w=1080:h=-2` - force dimensions divisible by 2

[scale reference](https://trac.ffmpeg.org/wiki/Scaling)

**pad** options:

- `pad=width:height:x:y:color` - x:y is top-left corner position
- `(ow-iw)/2:(oh-ih)/2` centres the video; negative values also centre
- [pad reference](https://ffmpeg.org/ffmpeg-filters.html#pad)

**setsar=1:1** ensures 1:1 pixel aspect ratio. Prevents ffmpeg from compensating for ratio changes. [setsar reference](https://ffmpeg.org/ffmpeg-filters.html#setdar_002c-setsar)

Two scaled outputs from one input (horizontal + vertical with logo overlay):

```sh
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[0:v]split=2[s0][s1]; \
    [s0]scale=w=1920:h=1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1:1[out1]; \
    [s1]scale=w=720:h=1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1:1[s2]; \
    [s2][1]overlay=(main_w-overlay_w)/2:(main_w-overlay_w)/5[out2]" \
  -map [out1] -map 0:a output_youtube.mp4 \
  -map [out2] -map 0:a output_shorts.mp4
```

## Trim by time

```sh
ffmpeg -i input.mp4 -ss 00:00:10 -to 00:00:25 output.mp4
```

For faster but less accurate trimming, or trimming with `-c copy`, read `references/core-concepts.md` first.

## Verify the output

[ffprobe](https://ffmpeg.org/ffprobe.html) provides structured metadata about media files:

```sh
ffprobe -show_streams -i output.mp4
```

Done when the streams it lists match the codec, resolution and duration the task asked for.

To confirm faststart was applied, see the faststart section of `references/core-concepts.md`.
