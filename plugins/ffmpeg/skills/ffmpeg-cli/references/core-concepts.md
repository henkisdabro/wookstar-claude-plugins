# Core Concepts

Foundational concepts that apply across all ffmpeg tasks.

## -c copy (stream copy)

[Reference](https://ffmpeg.org/ffmpeg.html#Streamcopy)

Use `-c copy` whenever possible. It re-muxes video and audio without re-encoding, which is significantly faster.

- `-c copy` - copy all streams
- `-c:v copy` - copy video only
- `-c:a copy` - copy audio only (same as `-acodec copy`)

**Remuxing vs transcoding:** Remuxing rewraps streams into a new container without altering them. Transcoding changes compression and quality. MP4 can be remuxed to MKV and MOV because they are all H264 containers.

### When NOT to use -c copy

- Applying video filters (scale, overlay, subtitles, trim, fade) or modifying audio (amix, atempo, volume) - these require re-encoding
- Frame-accurate trimming - `-c copy` can only cut at keyframes, leading to rough/inaccurate edits
- Burning subtitles into video
- Transcoding between different codecs
- Compressing media

## Input/output seeking

[Seeking reference](https://trac.ffmpeg.org/wiki/Seeking)

### Input seeking (-ss before input)

```sh
ffmpeg -ss 00:00:03 -i input.mp4 -frames:v 1 output.jpg
```

Parses by keyframe - very fast but less accurate. In H264 with 25fps there is typically a keyframe every 10 seconds. Resets video timestamps to the trimmed version.

### Output seeking (-ss after input)

```sh
ffmpeg -i input.mp4 -ss 00:00:03 -frames:v 1 output.jpg
```

Decodes but discards input until the timestamp. Frame-accurate but slower because it must decode.

### Trimming advice

**Use output seeking WITHOUT `-c:v copy`** (re-encode the output) for reliable trimming:

- There is an [open bug](https://trac.ffmpeg.org/ticket/8189) with input seeking + `-c:v copy` ([discussion](https://stackoverflow.com/questions/57450657/ffmpeg-fails-to-trim-beginning-of-clip))
- Output seeking with `-c:v copy` can produce black frames due to copying frames that depend on a missing keyframe ([explanation](https://trac.ffmpeg.org/wiki/Seeking#codec-copy))

From [ffmpeg docs](https://ffmpeg.org/ffmpeg.html#Main-options):

> When used as an input option, seeks in this input file to position. In most formats it is not possible to seek exactly, so ffmpeg will seek to the closest seek point before position. When transcoding and -accurate_seek is enabled (the default), this extra segment between the seek point and position will be decoded and discarded. When doing stream copy or when -noaccurate_seek is used, it will be preserved.

The re-encoded output may have a different bitrate - adjust accordingly.

## Encoding quick reference

### Codec flags

| Flag | Purpose |
|---|---|
| `-c:v` | Video encoder |
| `-c:a` | Audio encoder |
| `-c:a aac` | AAC audio (default, good practice to specify) |
| `-c:a libmp3lame` | [MP3 encoding](https://trac.ffmpeg.org/wiki/Encode/MP3) |
| `-an` | Disable audio output |

### H264 (libx264)

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264)

Default for MP4 output. Always specify `-c:v libx264` explicitly.

- **CRF scale:** 0-51 (0 = lossless 8-bit, 23 = default, 51 = worst)
- **Recommended range:** 17-28, consider 17-18 visually lossless
- CRF +6 = roughly half bitrate; CRF -6 = roughly double bitrate
- Common high-quality: `-crf 18`, better quality: `-crf 10`

### H265 (libx265)

Similar controls to H264. Use `-vtag hvc1` for Apple device compatibility (iOS AirDrop, etc.):

```sh
ffmpeg -i input.mp4 -c:v libx265 -vtag hvc1 -c:a copy output.mp4
```

### VP9 (libvpx-vp9)

[Reference](https://trac.ffmpeg.org/wiki/Encode/VP9)

Open, royalty-free format used by YouTube. Saves 20-50% bitrate vs libx264 at same quality.

- **CRF range:** 0-63 (lower = better, 31 recommended for 1080p)
- **Constant quality:** must use `-crf` with `-b:v 0`
- Default audio encoder: libopus

```sh
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 15 -b:v 0 -c:a libopus output.webm
```

## format=yuv420p

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264#Encodingfordumbplayers)

H264 YUV planar colour format for playback compatibility in most players. Use when transforming images to video or when experiencing playback issues.

> You may need to use `-vf format=yuv420p` (or the alias `-pix_fmt yuv420p`) for your output to work in QuickTime and most other players. These players only support the YUV planar color space with 4:2:0 chroma subsampling for H.264 video.

## -movflags +faststart

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264#faststartforwebvideo)

Moves metadata to the front of the container for faster online playback. [YouTube recommends](https://support.google.com/youtube/answer/1722171) faststart for uploads.

```sh
ffmpeg -i input.mp4 -c copy -movflags +faststart output.mp4
```

Supported in MP4, M4A, and MOV. Works with both libx264 and libx265:

```sh
ffmpeg -i input.mp4 -c:v libx265 -c:a copy -movflags +faststart output.mp4
```

Verify faststart is applied with:

```sh
ffprobe -v trace -i output.mp4
```

Look for `type:'moov'` near the beginning of output.

## GPU acceleration overview

### Nvidia (NVENC)

[Reference](https://trac.ffmpeg.org/wiki/HWAccelIntro#NVENC)

```sh
# H264 via Nvidia GPU
ffmpeg -i input.avi -c:v h264_nvenc output.mp4

# H265 via Nvidia GPU
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
