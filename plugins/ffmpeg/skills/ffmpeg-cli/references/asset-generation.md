# Asset Generation

## Image to video

Create 10-second video from looping image with audio and fade-in:

```sh
ffmpeg -loop 1 -t 10 -i image.png -i audio.mp3 \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black,setsar=1,fade=t=in:st=0:d=1,format=yuv420p" \
  -c:v libx264 -c:a aac -shortest output.mp4
```

- `-loop 1` - infinitely loop input image
- `-t 10` - limit loop duration to 10 seconds
- [`fade=t=in:st=0:d=1`](https://ffmpeg.org/ffmpeg-filters.html#fade) - 1-second fade-in at start
- [Loop reference](https://video.stackexchange.com/questions/12905/repeat-loop-input-video-with-ffmpeg)

For faster processing, download the image locally first (ffmpeg re-downloads each frame from URLs).

## Slideshow with fade

5 seconds per image, fading between images:

```sh
ffmpeg -loop 1 -t 5 -i image1.png -loop 1 -t 5 -i image2.png -i audio.mp3 \
  -filter_complex " \
    [0:v]format=yuv420p,fade=t=in:st=0:d=0.5,setpts=PTS-STARTPTS[v0]; \
    [1:v]format=yuv420p,fade=t=out:st=4.5:d=0.5,setpts=PTS-STARTPTS[v1]; \
    [v0][v1]xfade=transition=fade:duration=0.5:offset=4.5,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -c:a aac -shortest output.mp4
```

Output is 9.5 seconds (0.5s overlap during transition). First image fades in, last fades out.

- Streams flow: `[0:v]` filtered to `[v0]`, `[1:v]` to `[v1]`, then xfade to `[v]`
- [`xfade=transition=fade:duration=0.5:offset=4.5`](https://trac.ffmpeg.org/wiki/Xfade) - starts transition at 4.5s of first image, lasts 0.5s

## Ken Burns effect (zoompan)

Zoom in on first image centre, fade to second image which zooms out from left:

```sh
ffmpeg -loop 1 -i image1.png -loop 1 -i image2.png -i audio.mp3 \
  -filter_complex " \
    [0:v]scale=8000:-1,zoompan=z='zoom+0.005':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=1920x1080:fps=25,trim=duration=4,format=yuv420p,setpts=PTS-STARTPTS[v0]; \
    [1:v]scale=8000:-1,zoompan=z='if(lte(zoom,1.0),1.5,max(zoom-0.005,1.005))':x=0:y='ih/2-(ih/zoom/2)':d=100:s=1920x1080:fps=25,trim=duration=4,format=yuv420p,setpts=PTS-STARTPTS[v1]; \
    [v0][v1]xfade=transition=fade:duration=1:offset=3,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -c:a aac -shortest output.mp4
```

Output is 7 seconds (4s + 4s - 1s fade overlap).

[zoompan reference](https://ffmpeg.org/ffmpeg-filters.html#zoompan)

**Zoom-in parameters:**

- `z='zoom+0.005'` - each frame adds 0.005 zoom
- `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'` - pan to centre
- `d=100:s=1920x1080:fps=25` - 100 frames at 25fps = 4 seconds

**Zoom-out parameters:**

- `z='if(lte(zoom,1.0),1.5,max(zoom-0.005,1.005))'` - start at 1.5x zoom, decrease by 0.005 per frame until 1.005x
- `x=0` - pan from left side

**Key details:**

- `scale=8000:-1` - upscale first to avoid [jitteriness bug](https://trac.ffmpeg.org/ticket/4298) with zoompan. Costs more compute but smooth result.
- `trim=duration=4` required instead of `-t` because zoompan's internal frame/fps control overrides `-t`
- [Ken Burns Effect](https://en.wikipedia.org/wiki/Ken_Burns_effect)

## Create GIFs

Looping GIF from video, auto-scaled to 320px height, every 2nd frame, 10x speed:

```sh
ffmpeg -i input.mp4 \
  -vf "select='gt(trunc(t/2),trunc(prev_t/2))',setpts='PTS*0.1',scale=trunc(oh*a/2)*2:320:force_original_aspect_ratio=decrease,pad=trunc(oh*a/2)*2:320:-1:-1" \
  -loop 0 -an output.gif
```

- `select='gt(trunc(t/2),trunc(prev_t/2))'` - take every 2nd frame
- `setpts='PTS*0.1'` - 10x playback speed
- `-loop 0` - infinite loop (default, can be omitted); `-loop 1` loops once
- `-an` - no audio

## Video compilation with fades

Split single video into segments with fade effects and concatenate:

```sh
ffmpeg -i input.mp4 \
  -filter_complex " \
    [0:v]trim=start=11:end=15,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v1]; \
    [0:a]atrim=start=11:end=15,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.5,afade=t=out:st=3.5:d=0.5[a1]; \
    [0:v]trim=start=21:end=25,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v2]; \
    [0:a]atrim=start=21:end=25,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.5,afade=t=out:st=3.5:d=0.5[a2]; \
    [v1][a1][v2][a2]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" -c:v libx264 -c:a aac output.mp4
```

- `trim=start=X:end=Y` - cut video to time range; `atrim` for audio
- `setpts=PTS-STARTPTS` - reset timestamps from 0
- `fade=t=in:st=0:d=0.5` / `fade=t=out:st=3.5:d=0.5` - fade effects
- `afade` - audio fade equivalent
- `concat=n=2:v=1:a=1` - combine 2 segments with video and audio

## Thumbnails

### Single frame at specific time

```sh
ffmpeg -i input.mp4 -ss 00:00:07 -frames:v 1 thumbnail.png
```

With quality control (JPEG, 2 = best, 31 = worst):

```sh
ffmpeg -i input.mp4 -ss 00:00:07 -frames:v 1 -q:v 2 thumbnail.jpg
```

### Multiple thumbnails at different times

```sh
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]split=2[first][second];[first]select='gte(t,5)'[thumb1];[second]select='gte(t,15)'[thumb2]" \
  -map [thumb1] -frames:v 1 thumb_5s.png \
  -map [thumb2] -frames:v 1 thumb_15s.png
```

`-frames:v 1` - output only 1 video frame.

### Scene change detection thumbnail

```sh
ffmpeg -i input.mp4 -vf "select='gt(scene,0.4)'" -frames:v 1 -q:v 2 scene_thumb.jpg
```

[`gt(scene,0.4)`](https://www.ffmpeg.org/ffmpeg-filters.html#select_002c-aselect) - sensitivity 0 to 1 (lower = more sensitive). Recommended: 0.3-0.5.

## Image thumbnail from input images

Overlay multiple images on a base image:

```sh
ffmpeg -i base.png -i overlay1.png -i overlay2.png \
  -filter_complex " \
    [1]scale=640:360,pad=648:368:4:4:black[overlay1]; \
    [2]scale=640:360,pad=648:368:4:4:black[overlay2]; \
    [0][overlay1]overlay=0:main_h-overlay_h[tmp1]; \
    [tmp1][overlay2]overlay=main_w-overlay_w:main_h-overlay_h" \
  -frames:v 1 thumbnail.png
```

## Storyboards

### Scene-based tile

```sh
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.4)',scale=640:480,tile=2x2" \
  -frames:v 1 storyboard.jpg
```

[`tile=2x2`](https://www.ffmpeg.org/ffmpeg-filters.html#Examples-169) creates a 2x2 grid from detected scenes.

### Separate images per scene

```sh
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.4)'" \
  -vsync 0 scene_%03d.jpg
```

[`-vsync 0`](https://www.ffmpeg.org/ffmpeg-filters.html#Examples-126) drops duplicate frames from the same scene.

Note: `-vsync` is deprecated in newer ffmpeg versions; use `-fps_mode` instead. [Reference](https://ffmpeg.org/ffmpeg.html#:~:text=%2Dfps_mode)

### Keyframe-based tile

```sh
ffmpeg -skip_frame nokey -i input.mp4 \
  -vf 'scale=640:480,tile=4x4' \
  -an -vsync 0 keyframes_%03d.png
```

`-skip_frame nokey` - skip all non-keyframes.

### Every Nth frame

```sh
ffmpeg -i input.mp4 \
  -vf "select=not(mod(n\,10)),scale=640:480,tile=4x2" \
  -vsync 0 tile_%03d.png
```

Every 10th frame in 4x2 tiles. Remove `,tile=4x2` for individual frame images.
