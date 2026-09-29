# tlm107-reel-4k

5 sequential parts, each a normal MP4 that plays on its own with its music bed and transition SFX embedded; total 180.000 s.
The video in every part is the renderer's own 4K H.264 encode, stream-copied — never re-encoded.

Rejoin into one 4K master (video stream-copied, the full soundtrack from `tlm107-reel-4k-audio.m4a`):

```
ffmpeg -f concat -safe 0 -i tlm107-reel-4k.concat.txt -i tlm107-reel-4k-audio.m4a -map 0:v -map 1:a -c copy tlm107-reel-4k.mp4
```
