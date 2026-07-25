# Neumann TLM 107 — Downloadable Project (Reel + Long-Form)

This zip is a **self-contained safety net**: extract it anywhere on your own PC and
you can reproduce the full render independently of the original session, with no
external dependencies beyond Node.js and npm.

It contains the complete Remotion source for **both** compositions:
- `MainReel` — the 178s vertical reel (1080×1920)
- `LongForm` — the ~600s landscape deep-dive (1920×1080)

## What's included vs. regenerated

- **Included as real binary files** (can't be regenerated): `public/images/`,
  `public/logos/`, `public/fonts/` — the actual product photos, brand logos, and
  self-hosted type files.
- **NOT included, regenerated locally instead**: `public/audio/*.wav` (music beds +
  SFX) and `public/vo/*.mp3` (silent voiceover placeholders). These are produced by
  small, dependency-free Node scripts (`scripts/make-audio.mjs` and
  `scripts/make-audio-longform.mjs`) that are deterministic — running them
  reproduces byte-identical audio every time. Keeping them out of the zip keeps it
  small; running one setup command regenerates everything.

## Setup (exact commands)

```bash
# 1. Extract the zip, then from inside the project folder:
npm install

# 2. Regenerate all audio (music beds, SFX, silent VO placeholders) — deterministic, ~1-2 min:
npm run setup

# 3a. Render the reel (1080x1920, 178s) → out/video.mp4
npm run render

# 3b. Render the long-form deep dive (1920x1080, ~600s) → out/video-longform.mp4
npm run render:longform
```

### Optional — validate before rendering

```bash
npm run typecheck   # tsc --noEmit
npm run bundle       # Remotion bundler check
```

### Optional — render the thumbnails

```bash
npx remotion still Thumbnail out/thumbnail.png
```
(The 6 language-variant thumbnails for both videos are delivered as standalone
PNGs alongside this zip / in the repo's `out/` folder — they don't need to be
re-rendered, but their source compositions are in `src/` if you want to.)

## Adding real narration

Once you have ElevenLabs (or similar) narration recorded against `VO_SCRIPT.md`
(reel) or `VO_SCRIPT_LONGFORM.md` (long-form), drop the MP3s in:

```
public/vo/voiceover.mp3            ← replaces the reel's silent placeholder
public/vo/voiceover-longform.mp3   ← replaces the long-form's silent placeholder
```

Then re-run `npm run render` / `npm run render:longform`. No burned-in captions
exist anywhere in either video — the long-form additionally reserves a persistent
1704×108px glowing caption box at the bottom of the frame for you to add captions
to afterward in your own editor.

## Requirements

- Node.js 18+ and npm
- ~2GB free disk (node_modules + render output)
- A Chromium browser for Remotion to drive. If Remotion can't find one
  automatically, pass one explicitly:
  ```bash
  npx remotion render MainReel out/video.mp4 --browser-executable="/path/to/chrome"
  npx remotion render LongForm out/video-longform.mp4 --browser-executable="/path/to/chrome"
  ```
  On most desktop systems with Chrome/Edge already installed, Remotion finds it
  automatically and this flag isn't needed.
