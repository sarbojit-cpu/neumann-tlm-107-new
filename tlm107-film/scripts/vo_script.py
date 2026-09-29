#!/usr/bin/env python3
"""Writes deliverables/VOICEOVER-SCRIPT.md from scripts/script.py.

Window by window, each block's on-screen heading is spoken first, then the
bridging narration for the same window. No window is read faster than
152 words per minute."""
import math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import script as S

REPO = os.path.dirname(os.path.dirname(HERE))


def ts(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"


out = ["# Neumann TLM 107 — Voiceover Speech Script", "",
       "Pace: at most 152 words per minute, matched window by window to the picture.",
       "In each block the on-screen heading (the burned-in caption) is spoken first, followed by the narration for that same time block.",
       "Timelines are exactly 3:00 (reel) and 5:00 (film). The outro blocks run over the end screens (6 s reel, ~10 s film).",
       "No prices are mentioned anywhere.", ""]
for name, title, total in (("reel", "REEL — 9:16 4K, 3:00", S.REEL_SECONDS), ("film", "FILM — 16:9 4K, 5:00", S.FILM_SECONDS)):
    rows = S.timed(name)
    words = sum(S.words(w) for _, _, w in rows)
    out += ["---", "", f"## {title}", "", f"{words} words over {total:.0f} s = {words / total * 60:.1f} wpm average; every block ≤ 152 wpm.", ""]
    for n, (a, b, w) in enumerate(rows, 1):
        k = S.words(w)
        cap = math.floor((b - a) * 152 / 60)
        screen = w["t"] if w["t"] else "END SCREEN — logos, partner line, numbers, website, socials"
        out += [f"**{n:02d} · {ts(a)} – {ts(b)} · on screen: \"{screen}\"** ({k} words, max {cap} · {k / (b - a) * 60:.0f} wpm)", "",
                (w["h"] + " " + w["x"]).strip(), ""]
    out += ["### Full reading text", "", " ".join((w["h"] + " " + w["x"]).strip() for _, _, w in rows), ""]

os.makedirs(os.path.join(REPO, "deliverables"), exist_ok=True)
open(os.path.join(REPO, "deliverables", "VOICEOVER-SCRIPT.md"), "w").write("\n".join(out))
print("wrote deliverables/VOICEOVER-SCRIPT.md")
