# Neumann TLM 107 Studio Set — Product Reel (Remotion)

A complete, deterministic **178-second (2:58) vertical reel** (1080×1920, 30 fps)
for the **Neumann TLM 107 Studio Set**, offered by **Shivansh Electronics**.
Built with [Remotion](https://www.remotion.dev/).

> Shivansh Electronics **sells / offers** the Neumann TLM 107. It is **not** a
> distributor of Neumann, and is never described as one anywhere in this project.

---

## Quick start

```bash
npm install            # install dependencies
npm run studio         # open the Remotion Studio preview

# Regenerate assets (only needed if you change the source scripts)
npm run make-assets    # copy source images/logos into public/
npm run make-audio     # synthesize the music bed, SFX and silent VO placeholder
```

## Render

```bash
# Full reel → out/video.mp4  (H.264, 1080x1920, 30fps)
npm run render

# Premium thumbnail → out/thumbnail.png
npm run render:thumb
```

If Remotion cannot find a browser in your environment, pass a Chrome/Chromium
Headless-Shell path, e.g.:

```bash
npx remotion render MainReel out/video.mp4 \
  --browser-executable="/path/to/chrome-headless-shell"
```

## Validate (no render)

```bash
npm run typecheck      # tsc --noEmit
npm run bundle         # Remotion bundler check
```

Both pass green in this project, so the render is correct in one pass.

---

## Voiceover (VO)

- The visual timeline contains **no burned-in captions of the narration**, so the
  same render can be re-used for **Hindi, English and Bengali** voiceovers.
- The full timestamped script is in **[`VO_SCRIPT.md`](./VO_SCRIPT.md)** — feed it
  into ElevenLabs (or similar), export a single MP3, and drop it in:

  ```
  public/vo/voiceover.mp3     ← replace the silent placeholder, then re-render
  ```

## Sound design

- `public/audio/music-bed.wav` — a ~178s cinematic bed (procedural, deterministic).
- `public/audio/sfx-*.wav` — a rotating SFX palette (whooshes, impacts, risers,
  ticks, sparkles, sub-drops). Transition SFX are mixed **low** so narration always
  sits on top. See `src/AudioLayer.tsx` for the mix.

To re-synthesize any audio, edit `scripts/make-audio.mjs` and run `npm run make-audio`.

---

## Project structure

```
public/
  images/      product & context shots (clean names; see scripts/copy-assets.mjs)
  logos/       Neumann + Shivansh Electronics (transparent PNGs, used as-is)
  fonts/       self-hosted variable fonts (Fraunces, Archivo) — no network at render
  audio/       music bed + SFX
  vo/          voiceover.mp3 (silent placeholder — replace with your narration)
src/
  Root.tsx           compositions (MainReel + Thumbnail) + font loader
  MainReel.tsx       the full 21-scene timeline + audio + global overlays
  Thumbnail.tsx      standalone 9:16 thumbnail
  schedule.ts        single source of truth for scene timing / transitions / SFX
  theme.ts, fonts.ts design tokens + type system
  components/        reusable design system (backgrounds, logo plates, callouts, …)
  scenes/            S01…S21 — one file per scene
scripts/
  copy-assets.mjs    source images/logos → public/
  make-audio.mjs     procedural music bed + SFX + silent VO
  qa-stills.mjs      render still frames for layout QA
out/
  video.mp4          final render (git-ignored; delivered as a downloadable zip)
  thumbnail.png      premium thumbnail (committed)
```

## Type system

- **Fraunces** — display headlines (characterful high-contrast serif)
- **Archivo** — labels, specs, contact, numerals (clean technical grotesque)

Fonts are self-hosted in `public/fonts` and loaded via `@font-face`, so renders are
fully offline and deterministic.

## Brand / content rules honoured

- Neumann + Shivansh Electronics logos are the **supplied transparent PNGs**, always
  seated on light plates at a clearly legible size.
- Product covered **positively only**; no competitor is named or compared.
- Shivansh Electronics is referred to only as **selling / offering** the TLM 107 —
  never as a distributor of Neumann.
- No "ENTER | LEARN | INNOVATE …"-style tagline anywhere.
- Price shown: **₹1,44,900 (incl. GST, per unit)** with a clear **DM / call for best
  price** call-to-action; rotating Shivansh contact/social presence throughout.
