# Neumann TLM 107 — 4K deliverables

| Folder | What | Canvas | Length |
|---|---|---|---|
| `reel-4k/` | Instagram / Shorts reel, in playable parts | 2160 × 3840 (9:16), 30 fps | 180.000 s (6 s outro) |
| `video-4k/` | YouTube film, in playable parts | 3840 × 2160 (16:9), 30 fps | 300.000 s (~10 s outro) |
| `audio-stems/` | Music bed and transition SFX, separately | 48 kHz / 24-bit WAV | full length of each film |
| `thumbnails/` | Portrait cover and landscape thumbnail | 4K + 1080p versions | — |
| `VOICEOVER-SCRIPT.md` | The voiceover, window by window, ≤ 152 wpm | — | — |

Each part is a normal MP4 that plays on its own, in order (`part01`, `part02`, …), with the
music bed and transition SFX already embedded. The video in every part is the renderer's
own 4K H.264 encode, stream-copied, never re-encoded. Each folder's `JOIN.md` has the
one-line ffmpeg command that rejoins the parts with the full soundtrack.

**Picture:** only the picture of Neumann's official TLM 107 film is used (its audio is
discarded), rebuilt to 2560 × 1440 with Real-ESRGAN; every product photograph from the
repository was rebuilt 4× the same way, and the white-background packshots were cut out.

**Sound:** music — "Mortals" (Warriyo feat. Laura Brehm, NCS), re-cut on its own 90 BPM
grid. Every transition and interface SFX is synthesized from first principles
(`tlm107-film/scripts/sfx.py`), tuned to the song's D tonic. Mixed to −14 LUFS integrated.
The stems carry exactly the gain they have in the master, so `music-bed + transition-sfx`
rebuilds the mix and the bed can be ducked under your voiceover.

**Outro:** Neumann and Shivansh Electronics logos, "Shivansh Electronics is the Exclusive
Partner of the Neumann TLM 107 Studio Set" (no zone or region), the three contact numbers,
the website and the four social handles. No prices appear anywhere.

Source project: `tlm107-film/` (Remotion). Rebuild: `python3 scripts/plan.py && python3
scripts/audio.py`, then `sh scripts/render.sh Reel tlm107-reel 5400 300` and
`sh scripts/render.sh Film tlm107-film 9000 300`, then `scripts/package.py`.
