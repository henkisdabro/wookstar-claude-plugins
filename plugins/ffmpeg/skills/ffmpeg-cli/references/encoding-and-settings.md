# Encoding and Settings

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

### format=yuv420p

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264#Encodingfordumbplayers)

H264 YUV planar colour format for broad playback compatibility:

```sh
ffmpeg -i input.mp4 -vf format=yuv420p -c:v libx264 output.mp4
```

Required for QuickTime and most players. Use when converting images to video or experiencing playback issues. Alias: `-pix_fmt yuv420p`.

### -movflags +faststart

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264#faststartforwebvideo)

Moves metadata to front of container. Supported in MP4, M4A, MOV.

```sh
ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4
```

Works with both libx264 and libx265:

```sh
ffmpeg -i input.mp4 -c:v libx265 -c:a copy -movflags +faststart output.mp4
```

Verify with ffprobe:

```sh
ffprobe -v trace -i output.mp4
```

Look for `type:'moov'` near the beginning. [YouTube recommends](https://support.google.com/youtube/answer/1722171) faststart for uploads.

## H265 (libx265)

Similar controls to H264. Use `-vtag hvc1` for Apple compatibility (iOS AirDrop):

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

### Codec flags quick reference

| Flag | Purpose |
|---|---|
| `-c:v` | Video encoder |
| `-c:a` | Audio encoder |
| `-c:a aac` | AAC audio (default, good practice to specify) |
| [`-c:a libmp3lame`](https://trac.ffmpeg.org/wiki/Encode/MP3) | MP3 encoding |
| `-an` | Disable audio output |

## -c copy (stream copy) - detailed

[Reference](https://ffmpeg.org/ffmpeg.html#Streamcopy)

Re-muxes without re-encoding - dramatically faster than transcoding.

| Flag | Purpose |
|---|---|
| `-c copy` | Copy all streams |
| `-c:v copy` | Copy video only |
| `-c:a copy` (or `-acodec copy`) | Copy audio only |

**Remuxing** rewraps streams into a new container without altering them. **Transcoding** changes compression and quality. MP4 can be remuxed to MKV and MOV (all H264 containers).

### When NOT to use -c copy

- Applying video filters (scale, overlay, subtitles, trim, fade)
- Mixing or modifying audio (amix, atempo, volume)
- Frame-accurate trimming (can only cut at keyframes)
- Burning subtitles
- Transcoding between codecs
- Compressing media

## Input/output seeking - detailed

[Reference](https://trac.ffmpeg.org/wiki/Seeking)

### Input seeking (-ss before -i)

```sh
ffmpeg -ss 00:00:03 -i input.mp4 -frames:v 1 output.jpg
```

Parses by keyframe - very fast but less accurate. In H264 with 25fps, keyframes typically every ~10 seconds. Resets timestamps to trimmed version - adjust filters accordingly.

### Output seeking (-ss after -i)

```sh
ffmpeg -i input.mp4 -ss 00:00:03 -frames:v 1 output.jpg
```

Decodes and discards until timestamp - frame-accurate but slower.

### The trimming problem

**Use output seeking WITHOUT `-c:v copy`** for reliable trimming:

1. **Input seeking + `-c:v copy` bug:** [FFmpeg bug report](https://trac.ffmpeg.org/ticket/8189), [Stack Overflow discussion](https://stackoverflow.com/questions/57450657/ffmpeg-fails-to-trim-beginning-of-clip)

2. **Output seeking + `-c:v copy` black frames:** Copies frames that depend on a missing keyframe. [Explanation](https://trac.ffmpeg.org/wiki/Seeking#codec-copy)

From [ffmpeg docs](https://ffmpeg.org/ffmpeg.html#Main-options):

> When used as an input option, seeks in this input file to position. In most formats it is not possible to seek exactly, so ffmpeg will seek to the closest seek point before position. When transcoding and -accurate_seek is enabled (the default), this extra segment between the seek point and position will be decoded and discarded. When doing stream copy or when -noaccurate_seek is used, it will be preserved.

Re-encoded output may have different bitrate - adjust as needed.

## GPU acceleration - detailed

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

### AMD (VAAPI)

[Reference](https://trac.ffmpeg.org/wiki/Hardware/VAAPI)

More complex setup and less broadly supported than Nvidia/Intel options.
