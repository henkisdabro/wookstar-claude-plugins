# Advanced Editing

## Change playback speed

Speed up 1.5x without distorting audio:

```sh
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]setpts=PTS/1.5[v];[0:a]atempo=1.5[a]" \
  -map "[v]" -map "[a]" output.mp4
```

- [`setpts=PTS/1.5`](https://ffmpeg.org/ffmpeg-filters.html#setpts_002c-asetpts) - speeds up video by 1.5x
- `atempo=1.5` - speeds up audio playback while preserving pitch

## Change FPS

Change video frame rate without changing audio speed:

```sh
ffmpeg -i input.mp4 -filter:v fps=60 output.mp4
```

## Jump cuts

Remove segments and keep only specified time ranges:

```sh
ffmpeg -i input.mp4 \
  -vf "select='between(t,0.0,5.7)+between(t,11.0,18.0)+between(t,19.0,20.0)',setpts=N/FRAME_RATE/TB" \
  -af "aselect='between(t,0.0,5.7)+between(t,11.0,18.0)+between(t,19.0,20.0)',asetpts=N/SR/TB" \
  output.mp4
```

Used for making clips shorter, silence removal, removing transitions.

[`setpts=N/FRAME_RATE/TB` and `asetpts=N/SR/TB`](https://ffmpeg.org/ffmpeg-filters.html#setpts_002c-asetpts) reset presentation timestamps:

- `N` - count of consumed frames/audio samples (from 0)
- `FRAME_RATE` / `SR` - video frame rate / audio sample rate
- `TB` - timebase of input timestamps

## Video cropping for social media

Crop 1080x720 video to 720x1080 vertical by cropping chunks at specific timeframes, upscaling 1.5x:

```sh
ffmpeg -i input.mp4 \
  -vf "split=3[1][2][3]; \
    [1]trim=0.0:4.5,setpts=PTS-STARTPTS,crop=min(in_w-300\,480):min(in_h-0\,720):300:0,scale=720:1080,setsar=1:1[1]; \
    [2]trim=4.5:8.5,setpts=PTS-STARTPTS,crop=min(in_w-500\,480):min(in_h-0\,720):500:0,scale=720:1080,setsar=1:1[2]; \
    [3]trim=8.5,setpts=PTS-STARTPTS,crop=min(in_w-400\,480):min(in_h-0\,720):400:0,scale=720:1080,setsar=1:1[3]; \
    [1][2][3]concat=n=3:v=1" \
  -c:v libx264 -c:a copy output.mp4
```

- [`split=3`](https://ffmpeg.org/ffmpeg-filters.html#split_002c-asplit) - splits input into 3 named streams
- [`trim=0.0:4.5`](https://ffmpeg.org/ffmpeg-filters.html#trim) - cuts to time range; omit end to go to video end
- `setpts=PTS-STARTPTS` - required after trim before concat to reset timestamps
- [`crop=width:height:x:y`](https://ffmpeg.org/ffmpeg-filters.html#crop) - the `min()` prevents cropping outside frame boundaries

With black padding for out-of-bounds crops:

```sh
ffmpeg -i input.mp4 \
  -vf "split=3[1][2][3]; \
    [1]trim=0.0:4.5,setpts=PTS-STARTPTS,crop=min(in_w-1200\,480):min(in_h-0\,720):1200:0,pad=480:720:(ow-iw)/2:(oh-ih)/2:color=black,scale=720:1080,setsar=1:1[1]; \
    [2]trim=4.5:8.5,setpts=PTS-STARTPTS,crop=min(in_w-500\,480):min(in_h-0\,720):500:0,pad=480:720:(ow-iw)/2:(oh-ih)/2:color=black,scale=720:1080,setsar=1:1[2]; \
    [3]trim=8.5,setpts=PTS-STARTPTS,crop=min(in_w-400\,480):min(in_h-0\,720):400:0,pad=480:720:(ow-iw)/2:(oh-ih)/2:color=black,scale=720:1080,setsar=1:1[3]; \
    [1][2][3]concat=n=3:v=1" \
  -c:v libx264 -c:a copy output.mp4
```

## Overlay text on video (drawtext)

Three text messages with timed fade-in and semi-transparent background:

```sh
ffmpeg -i input.mp4 \
  -vf "drawtext=text='Get ready':x=50:y=100:fontsize=80:fontcolor=black:alpha='if(gte(t,1)*lte(t,3),(t-1)/2,1)':box=1:boxcolor=#6bb666@0.6:boxborderw=7:enable='gte(t,1)', \
       drawtext=text='Set':x=50:y=200:fontsize=80:fontcolor=black:alpha='if(gte(t,6)*lte(t,10),(t-6)/4,1)':box=1:boxcolor=#6bb666@0.6:boxborderw=7:enable='gte(t,6)', \
       drawtext=text='BOOM!':x=50:y=300:fontsize=80:fontcolor=black:alpha='if(gte(t,10)*lte(t,15),(t-10)/5,1)':box=1:boxcolor=#6bb666@0.6:boxborderw=7:enable='gte(t,10)'" \
  -c:v libx264 output.mp4
```

[drawtext reference](https://ffmpeg.org/ffmpeg-filters.html#drawtext-1)

| Parameter | Purpose |
|---|---|
| [`enable='gte(t,1)'`](https://ffmpeg.org/ffmpeg-filters.html#Timeline-editing) | Controls visibility - show from t=1s. `*` is AND operator |
| `alpha='if(gte(t,1)*lte(t,3),(t-1)/2,1)'` | Fade in from t=1 to t=3, then fully opaque |
| `box=1` | Draw background behind text |
| `boxborderw=7` | Box padding in pixels |
| [`boxcolor=#6bb666@0.6`](https://ffmpeg.org/ffmpeg-utils.html#color-syntax) | Background colour at 60% opacity |
| `fontfile=path.ttf` | Custom font file |

### Text from file with custom font

```sh
ffmpeg -i input.mp4 \
  -vf "drawtext=textfile=text.txt:fontfile=Poppins-Regular.ttf:x=50:y=100:fontsize=40:fontcolor=black:alpha='if(gte(t,1)*lte(t,5),t-1,1)':box=1:boxcolor=#6bb666@0.6:boxborderw=7:enable='gte(t,1)'" \
  -c:v libx264 output.mp4
```

ffmpeg does not download `textfile=` or `fontfile=` files - they must be local. Use `textfile` instead of inline text to avoid shell special character issues.

## Subtitles

### Burn subtitles with custom font and style

```sh
ffmpeg -i input.mp4 -ss 00:00 -to 00:40 \
  -vf "subtitles=subs.srt:fontsdir=.:force_style='FontName=Poppins,FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H4066B66B,Outline=1,BorderStyle=3'" \
  -c:v libx264 -c:a copy output.mp4
```

- Use `FontName` (not filename) - check by opening the font file
- Specify `fontsdir` for the directory containing the font
- Colours: `&HBBGGRR` or `&HAABBGGRR` (FF = fully transparent, 00 = opaque)
- `PrimaryColour` = font colour
- `OutlineColour` with `Outline=1,BorderStyle=3` creates a coloured background
- [Burn subtitles reference](https://trac.ffmpeg.org/wiki/HowToBurnSubtitlesIntoVideo)
- [Subtitles filter reference](https://ffmpeg.org/ffmpeg-filters.html#subtitles-1)

For heavily customised subtitles use ASS format. [ASS reference](https://hhsprings.bitbucket.io/docs/programming/examples/ffmpeg/subtitle/ass.html). For pixel-perfect effects, create opaque images and overlay them.

### Embed subtitles in MKV (no re-encoding)

```sh
ffmpeg -i input.mp4 -i subs.srt \
  -c copy -c:s srt -disposition:s:0 default output.mkv
```

- `-c:s srt` - subtitle format
- [`-disposition:s:0 default`](https://ffmpeg.org/ffmpeg.html#Stream-specifiers-1) - set as default subtitle track

### Extract subtitles from MKV

```sh
ffmpeg -i input.mkv -map 0:s:0 subs.srt
```

## Combine media assets

### Overlay image/logo on video

```sh
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "overlay=x=(main_w-overlay_w)/8:y=(main_h-overlay_h)/8:enable='gte(t,1)*lte(t,7)'" \
  -c:v libx264 -c:a copy output.mp4
```

- `main_w`/`main_h` - main video dimensions
- `overlay_w`/`overlay_h` - overlay image dimensions
- `enable` controls visibility timing

### Overlay with controlled transparency

```sh
ffmpeg -i video.mp4 -i logo.png \
  -filter_complex "[1:v]format=argb,geq='p(X,Y)':a='0.5*alpha(X,Y)'[v1]; \
    [0:v][v1]overlay=x=(main_w-overlay_w)/8:y=(main_h-overlay_h)/8:enable='gte(t,1)*lte(t,7)'" \
  -c:v libx264 -c:a copy output.mp4
```

- `format=argb` - converts to ARGB for alpha channel support
- [`geq='p(X,Y)'`](https://ffmpeg.org/ffmpeg-filters.html#geq) - preserves original pixel colours
- `a='0.5*alpha(X,Y)'` - 50% transparency

### Video on background image

```sh
ffmpeg -i video.mp4 -i background.png \
  -filter_complex "[1:v][0:v]overlay=(W-w)/2:(H-h)/2" \
  -c:v libx264 -c:a copy output.mp4
```

- `[1:v][0:v]` - background first, then video on top
- `W`/`H` = first stream (background) dimensions; `w`/`h` = second stream (video)

### Concat intro + main + outro with background music

```sh
ffmpeg -i intro.mp4 -i main.mp4 -i outro.mp4 -i bgm.mp3 \
  -filter_complex " \
    [0:v]fps=30,format=yuv420p,setsar=1[intro_v]; \
    [1:v]scale=-2:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,fps=30,format=yuv420p,setsar=1[main_v]; \
    [2:v]fps=30,format=yuv420p,setsar=1[outro_v]; \
    [0:a]aformat=sample_fmts=fltp:channel_layouts=stereo[intro_a]; \
    [1:a]aformat=sample_fmts=fltp:channel_layouts=stereo[main_a]; \
    [2:a]aformat=sample_fmts=fltp:channel_layouts=stereo[outro_a]; \
    [intro_v][intro_a][main_v][main_a][outro_v][outro_a]concat=n=3:v=1:a=1[combined_video][combined_audio]; \
    [3:a]volume=0.1,aformat=sample_fmts=fltp,afade=t=in:ss=0:d=1.5,afade=t=out:st=20:d=2[bgm_faded]; \
    [combined_audio][bgm_faded]amix=inputs=2:duration=first:dropout_transition=2[final_audio]" \
  -map "[combined_video]" -map "[final_audio]" \
  -c:v libx264 -c:a aac -shortest output.mp4
```

- `duration=first` - output audio duration matches combined audio
- `dropout_transition=2` - fade out shorter audio to avoid abrupt cutoff
- [`aformat=sample_fmts=fltp`](https://ffmpeg.org/ffmpeg.html#Audio-Options) - 32-bit float planar format (common in ffmpeg)

### Stack two videos vertically

```sh
ffmpeg -i top.mp4 -i bottom.mp4 \
  -filter_complex " \
    [0:v]scale=720:-2:force_original_aspect_ratio=decrease,pad=720:640:(ow-iw)/2:(oh-ih)/2:black[top]; \
    [1:v]scale=720:-2:force_original_aspect_ratio=decrease,pad=720:640:(ow-iw)/2:(oh-ih)/2:black[bottom]; \
    [top][bottom]vstack=inputs=2:shortest=1[v]" \
  -map "[v]" -map 1:a -c:v libx264 -c:a aac -shortest output.mp4
```

- [`shortest=1`](https://ffmpeg.org/ffmpeg-filters.html#Options-for-filters-with-several-inputs-_0028framesync_0029) in vstack - follow shortest video stream
- `-shortest` - match output to shortest of video/audio
