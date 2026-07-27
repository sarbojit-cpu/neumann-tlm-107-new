# Long-Form Video — Split Delivery

`out/video-longform.mp4` (the ~600s / 10-minute landscape deep dive) is **233 MB**,
which exceeds both GitHub's 100MB per-file limit and this chat's 30MB upload limit.
It's delivered here split into 3 parts, each under 100MB, so the whole thing can
still live in the repo.

## Reassemble (macOS / Linux)

```bash
cd download/video-longform-parts
cat video-longform.mp4.part00 video-longform.mp4.part01 video-longform.mp4.part02 > video-longform.mp4
```

Or, from anywhere:
```bash
cat download/video-longform-parts/video-longform.mp4.part* > video-longform.mp4
```

## Reassemble (Windows / PowerShell)

```powershell
cd download\video-longform-parts
cmd /c copy /b video-longform.mp4.part00+video-longform.mp4.part01+video-longform.mp4.part02 video-longform.mp4
```

## Verify

The reassembled file should be exactly **233,308,468 bytes**. This was verified
byte-for-byte identical against the original render before splitting.

```bash
ls -la video-longform.mp4   # should show 233308468
```
