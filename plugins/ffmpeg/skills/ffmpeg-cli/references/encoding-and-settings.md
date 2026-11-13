# Encoding and Settings

Encoder choice and tuning. Whether to re-encode at all (`-c copy`), seeking, `format=yuv420p` and faststart are in [core-concepts.md](core-concepts.md).

## Optimised daily command

Good for archiving, streaming (non-live), and wide device playback:

```sh
ffmpeg -i input.mp4 \
  -vf "scale=w=1080:h=1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1:1" \
  -crf 18 -preset veryslow -threads 0 -tune fastdecode -movflags +faststart \
  output.mp4
```

| Flag | Purpose |
|---|---|
| `-crf 18` | High quality constant rate factor (see H264 section) |
| [`-preset veryslow`](https://trac.ffmpeg.org/wiki/Encode/H.264#Preset) | Slower encoding, better compression for same quality. Use `ultrafast` when speed matters more than size |
| `-threads 0` | Let ffmpeg optimise thread count (default, usually best to omit) |
| [`-tune fastdecode`](https://trac.ffmpeg.org/wiki/Encode/H.264#Tune) | Output requires less compute to decode - good for edge devices. Use `zerolatency` for [fast encoding and low-latency streaming](https://superuser.com/questions/564402/explanation-of-x264-tune) |
| `-movflags +faststart` | Move metadata to front for faster web playback |

## H264 (libx264)

[Full reference](https://trac.ffmpeg.org/wiki/Encode/H.264)

Default for MP4 output. Always specify `-c:v libx264` explicitly.

### CRF (Constant Rate Factor)

Default bitrate control for libx264 and libx265. Best for quality-focused encoding where file size is secondary.

- **Range:** 0-51 (0 = lossless 8-bit, for 10-bit use `-qp 0`)
- **Default:** 23
- **Recommended:** 17-28 (17-18 visually lossless)
- **Exponential scale:** CRF +6 = roughly half bitrate/file size; -6 = roughly double
- Common high-quality: `-crf 18`; better quality: `-crf 10`

> CRF allows the encoder to attempt a certain output quality for the whole file. It adjusts the quantizer for each frame to maintain requested quality. The downside is you cannot target a specific file size or bitrate, so this is not recommended for streaming.

For player compatibility add `-vf format=yuv420p`, and for web delivery `-movflags +faststart` - both are explained in [core-concepts.md](core-concepts.md).

## H265 (libx265)

Similar controls to H264, on the same 0-51 CRF scale but with a default of 28, which gives roughly the quality of libx264 at 23. Use `-vtag hvc1` for Apple compatibility (iOS AirDrop):

```sh
ffmpeg -i input.mp4 -c:v libx265 -vtag hvc1 -c:a copy output.mp4
```

## VP9 (libvpx-vp9)

[Full reference](https://trac.ffmpeg.org/wiki/Encode/VP9)

Open, royalty-free format owned by Google. Used by YouTube. Saves 20-50% bitrate vs libx264 at same visual quality.

### Constant quality encoding

Must use `-crf` with `-b:v 0` (setting `-b:v` higher or omitting it invokes Constrained Quality mode instead):

```sh
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 15 -b:v 0 -c:a libopus output.webm
```

- **CRF range:** 0-63 (lower = better)
- **Recommended:** 15-35, with 31 for 1080p
- Default audio encoder: libopus (re-encodes AAC to Opus)
- [CPU/speed/threading controls](https://trac.ffmpeg.org/wiki/Encode/VP9#speed)

## 1-pass vs 2-pass encoding

VP9, libx264, and libx265 all support both modes.

| Use case | Recommended mode |
|---|---|
| Archival | CRF (single pass) |
| Streaming (non-live) | Two-pass CRF or ABR with VBV-constrained bitrate |
| Live streaming | One-pass CRF or ABR with VBV, or CBR |
| Encoding for devices | Two-pass ABR |

Two-pass CRF in VP9 ([reference](https://trac.ffmpeg.org/wiki/Encode/VP9#twopass)): first pass calculates optimal encoding parameters, second pass achieves better compression for web-hosted video.

## Codec flags

| Flag | Purpose |
|---|---|
| `-c:v` | Video encoder |
| `-c:a` | Audio encoder |
| `-c:a aac` | AAC audio (default, good practice to specify) |
| [`-c:a libmp3lame`](https://trac.ffmpeg.org/wiki/Encode/MP3) | MP3 encoding |
| `-an` | Disable audio output |

## GPU acceleration

### Nvidia (NVENC)

[Reference](https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC)

H264 via Nvidia GPU:

```sh
ffmpeg -i input.avi -c:v h264_nvenc output.mp4
```

H265 via Nvidia GPU:

```sh
ffmpeg -i input.avi -c:v hevc_nvenc output.mp4
```

### Intel Quick Sync Video (QSV)

[Reference](https://trac.ffmpeg.org/wiki/Hardware/QuickSync)

```sh
ffmpeg -init_hw_device qsv=hw -filter_hw_device hw -i input.avi -c:v h264_qsv output.mp4
```

### AMD (AMF, VAAPI)

Encoders: `h264_amf` and `hevc_amf` through AMD's AMF, or `h264_vaapi` and `hevc_vaapi` through [VAAPI](https://trac.ffmpeg.org/wiki/Hardware/VAAPI) on Linux. More complex setup and less broadly supported than the Nvidia and Intel options.

### Apple (VideoToolbox)

```sh
ffmpeg -i input.mov -c:v h264_videotoolbox output.mp4   # hevc_videotoolbox for H265
```

A hardware encoder exists only in builds compiled with it - `ffmpeg -encoders` lists what the installed build has.
