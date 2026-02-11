# Audio Processing

## Replace audio in video

```sh
ffmpeg -i video.mp4 -i new_audio.mp3 \
  -map 0:v -map 1:a -shortest -c:v copy -c:a aac output.mp4
```

- `-map 0:v` - video from first input
- `-map 1:a` - audio from second input
- [`-shortest`](https://ffmpeg.org/ffmpeg.html#Advanced-options) - trims output to shortest stream duration. Remove to keep full video length (muted after audio ends).
- `-c:v copy` - no video re-encoding

## Extract audio from video

Encode MP4 to MP3:

```sh
ffmpeg -i input.mp4 output.mp3
```

Extract audio with downsample to 16kHz mono MP3, plus extract muted video:

```sh
ffmpeg -i input.mp4 \
  -ar 16000 -ab 48k -codec:a libmp3lame -ac 1 audio_out.mp3 \
  -map 0:v -c:v copy -an video_out.mp4
```

[Audio options reference](https://ffmpeg.org/ffmpeg.html#Audio-Options)

| Flag | Purpose |
|---|---|
| `-ar` | Sample rate (e.g. 16000 = 16kHz) |
| `-b:a` (or `-ab`) | Audio bitrate (e.g. 48k = 48kbit/s) |
| `-ac 1` | Mono (1 channel) |

Extract AAC audio without re-encoding:

```sh
ffmpeg -i input.mp4 -map 0:a:0 -acodec copy output.aac
```

## Mix audio in video

Mix video's existing audio with a new audio file at lower volume:

```sh
ffmpeg -i video.mp4 -i music.mp3 \
  -filter_complex "[1:a]volume=0.2[a1];[0:a][a1]amix=inputs=2:duration=shortest" \
  -shortest -map 0:v -c:v copy -c:a aac output.mp4
```

- [`volume=0.2`](https://trac.ffmpeg.org/wiki/AudioVolume) - lowers music volume to 20%
- [`amix=inputs=2`](https://ffmpeg.org/ffmpeg-filters.html#amix) - mixes two audio streams
- `duration=shortest` - output audio as short as shortest input
- `-shortest` - still required to control final video length

Without volume change, simplify the filter to:

```sh
-filter_complex "[0:a][1:a]amix=inputs=2:duration=shortest"
```

[AAC reference](https://trac.ffmpeg.org/wiki/Encode/AAC)

## Combine two MP3 tracks

Fade out first track, fade in second, concatenate:

```sh
ffmpeg -i track1.mp3 -i track2.mp3 \
  -filter_complex "[0:a]afade=t=out:st=2:d=3[a0];[1:a]afade=t=in:st=0:d=3[a1];[a0][a1]concat=n=2:v=0:a=1" \
  -c:a libmp3lame -q:a 2 output.mp3
```

[`afade`](https://ffmpeg.org/ffmpeg-filters.html#afade-1) parameters:

- `t=out` / `t=in` - fade type
- `st=2` - start time in seconds
- `d=3` - duration in seconds

[`concat=n=2:v=0:a=1`](https://ffmpeg.org/ffmpeg-filters.html#concat) - concatenate 2 audio streams, no video (`v=0`).

[`-q:a 2`](https://trac.ffmpeg.org/wiki/Encode/MP3) - high quality MP3 output (~170-210 kbit/s stereo).

## Audio crossfade

```sh
ffmpeg -i track1.mp3 -i track2.mp3 \
  -filter_complex "[0:0][1:0]acrossfade=d=3:c1=exp:c2=qsin" \
  -c:a libmp3lame -q:a 2 output.mp3
```

[`acrossfade=d=3:c1=exp:c2=qsin`](https://ffmpeg.org/ffmpeg-filters.html#acrossfade) - 3-second crossfade where first track fades out quickly (exponential) and second fades in slowly (quarter sine).

## Change audio format

MP3 to WAV pcm_s32le (unsigned 32-bit little-endian), mono, 48kHz:

```sh
ffmpeg -i input.mp3 -acodec pcm_s32le -ac 1 -ar 48000 output.wav
```

[Audio types reference](https://trac.ffmpeg.org/wiki/audio%20types)

## Merge and normalise audio

Merge audio from two MP4 files, mix to mono equally, normalise volume, downsample to 16kHz, encode as MP3 at 64kbit/s:

```sh
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest,pan=mono|c0=.5*c0+.5*c1,dynaudnorm" \
  -ar 16000 -c:a libmp3lame -b:a 64k merged_audio.mp3
```

- `pan=mono|c0=.5*c0+.5*c1` - output channel blends 50% left + 50% right
- `dynaudnorm` - dynamic audio normalisation (smoothens loud/quiet parts)
- [Channel manipulation reference](https://trac.ffmpeg.org/wiki/AudioChannelManipulation)
