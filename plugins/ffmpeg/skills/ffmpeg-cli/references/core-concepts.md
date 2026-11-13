# Core Concepts

Stream copy, seeking, pixel format and faststart - the decisions that apply to every ffmpeg command.

## -c copy (stream copy)

[Reference](https://ffmpeg.org/ffmpeg.html#Streamcopy)

Use `-c copy` whenever possible. It re-muxes video and audio without re-encoding, which is significantly faster.

- `-c copy` - copy all streams
- `-c:v copy` - copy video only
- `-c:a copy` - copy audio only (same as `-acodec copy`)

**Remuxing vs transcoding:** Remuxing rewraps streams into a new container without altering them. Transcoding changes compression and quality. MP4 can be remuxed to MKV or MOV because all three containers can carry the same codecs (H264 or H265 video, AAC audio). A remux fails only when the target container does not support one of the streams' codecs.

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

- Input seeking + `-c:v copy` can fail to trim the start of the clip ([bug report](https://trac.ffmpeg.org/ticket/8189)) ([discussion](https://stackoverflow.com/questions/57450657/ffmpeg-fails-to-trim-beginning-of-clip))
- Output seeking with `-c:v copy` can produce black frames due to copying frames that depend on a missing keyframe ([explanation](https://trac.ffmpeg.org/wiki/Seeking#codec-copy))

From [ffmpeg docs](https://ffmpeg.org/ffmpeg.html#Main-options):

> When used as an input option (before -i), seeks in this input file to position. Note that in most formats it is not possible to seek exactly, so ffmpeg will seek to the closest seek point before position. When transcoding and -accurate_seek is enabled (the default), this extra segment between the seek point and position will be decoded and discarded. When doing stream copy or when -noaccurate_seek is used, it will be preserved.

The re-encoded output may have a different bitrate - adjust accordingly.

## format=yuv420p

[Reference](https://trac.ffmpeg.org/wiki/Encode/H.264#Encodingfordumbplayers)

H264 YUV planar colour format for playback compatibility in most players. Use when transforming images to video or when experiencing playback issues.

```sh
ffmpeg -i input.mp4 -vf format=yuv420p -c:v libx264 output.mp4
```

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

## Choosing an encoder

Codec flags, CRF values for H264, H265 and VP9, 1-pass vs 2-pass and GPU encoders are in [encoding-and-settings.md](encoding-and-settings.md).
