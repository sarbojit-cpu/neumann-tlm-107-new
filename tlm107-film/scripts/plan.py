#!/usr/bin/env python3
"""THE PLAN — script + beat grid -> src/plan-{reel,film}.json.

"Mortals" (Warriyo feat. Laura Brehm) runs at exactly 90 BPM with its first
downbeat 1.400 s into the file. At 30 fps one beat is exactly 20 frames, so
every cut, caption, camera accent and SFX cue lands on an integer frame.

  reel  song 41.400 -> 221.400, one continuous take (verse tail, break, drop,
        breakdown, build, drop, final hit).
  film  the song re-cut on whole bars into 300.000 s (see FILM_BLOCKS).

For every window in scripts/script.py the storyboard tokens become shots with
a camera move, a transition in (and the matching transition out on the shot
it replaces) and a synthesized SFX cue. Viz shots also emit their own
interaction cues (switch clicks, LED blips, counter ticks) at the same beat
offsets the motion graphics use.
"""
import json, math, os, random, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import script as S

FPS = 30
BEAT = 60.0 / 90.0
BF = 20  # frames per beat

# Neumann's own TLM 107 film, source seconds (picture only). The 2560x1440
# master (clips/tlm107-master.mp4) starts at source 0.96 s.
MASTER_T0 = 0.96
CLIPS = {
    "heritageA": (1.2, 5.0), "heritageB": (5.0, 9.0), "heritageC": (9.0, 12.4),
    "dome": (13.4, 19.0), "domeLeds": (19.0, 23.2), "xrayRot": (24.2, 28.6),
    "grilleBlack": (29.2, 31.6), "nickelSide": (32.2, 35.5), "navSwitch": (35.72, 42.8),
    "badges": (42.96, 46.0), "grilleGlint": (46.16, 47.96), "capsule": (48.12, 50.48),
    "pcb": (50.64, 52.92), "freq": (53.08, 56.5), "xrayFront": (56.9, 60.6),
    "polarRings": (60.6, 67.9), "guitar": (68.48, 69.96), "congas": (70.28, 71.76),
    "console": (72.08, 73.6), "orchestra": (73.84, 75.44), "pair": (82.0, 83.9),
}
RATE_MIN, RATE_MAX = 0.72, 1.35
FILLERS = ["grille_abstract", "badge_black_macro2", "nickel_grille_macro", "black_leds_macro2",
           "grille_badge_dark2", "black_ring_macro", "nickel_ring_macro", "badge_black_macro"]

ASSETS = {a["slug"]: a for a in json.load(open(os.path.join(HERE, "assets.json")))} if os.path.exists(os.path.join(HERE, "assets.json")) else {}

# ── music structure ────────────────────────────────────────────────────────
REEL_BLOCKS = [(0.0, 41.4, 221.4)]
FILM_BLOCKS = [(0.0, 0.0, 86.7333), (86.7333, 86.7333, 129.4), (129.4, 12.0667, 86.7333),
               (204.0667, 129.4, 156.0667), (230.7333, 156.0667, 225.3333)]
REEL_SECTIONS = [(0.0, "verse"), (2.6667, "break"), (8.0, "drop"), (45.3333, "breakdown"),
                 (88.0, "build"), (114.6667, "drop"), (176.0, "end")]
FILM_SECTIONS = [(0.0, "intro"), (12.0667, "build"), (22.7333, "verse"), (44.0667, "break"),
                 (49.4, "drop"), (86.7333, "breakdown"), (129.4, "build"), (140.0667, "verse"),
                 (161.4, "break"), (166.7333, "drop"), (204.0667, "build"), (230.7333, "drop"),
                 (292.0667, "end")]

# ── camera vocabulary ──────────────────────────────────────────────────────
MOVES = {
    "i": ["gimbalL", "zoomIn", "focusIn", "gimbalR", "craneUp", "zoomOut", "dutch", "focusOut", "craneDown", "pushTilt"],
    "c": ["orbitL", "heroRise", "gimbalR", "zoomIn", "orbitR", "craneUp", "gimbalL", "focusIn"],
    "v": ["pushIn", "gimbalL", "focusIn", "pullOut", "gimbalR", "floatUp"],
    "m": ["drift"], "z": ["none"],
}
# transition vocabulary, by music energy
T_DROP = ["punch", "whip", "slats", "zoomThru", "iris", "whipR", "punch", "shutter"]
T_CALM = ["rack", "sweep", "mesh", "ring", "rack", "dip"]
T_BUILD = ["ring", "whip", "rack", "slats", "sweep"]
T_VIZ = ["iris", "ring", "mesh"]
TRANS_FRAMES = {"fadeIn": 24, "punch": 8, "whip": 10, "whipR": 10, "slats": 14, "zoomThru": 12, "iris": 14,
                "shutter": 10, "rack": 18, "sweep": 16, "mesh": 18, "ring": 18, "dip": 20, "flashIris": 12}
TRANS_CUE = {"punch": "impact", "whip": "whoosh", "whipR": "whoosh", "slats": "ticks", "zoomThru": "air-punch",
             "iris": "shimmer", "shutter": "shutter", "rack": "swell", "sweep": "glint", "mesh": "grain",
             "ring": "ring", "dip": "boom-soft", "flashIris": "impact-big", "fadeIn": "bloom"}

# interaction cues inside the motion graphics: (beat offset, cue)
VIZ_EVENTS = {
    "hook": [(k * 0.5, f"blip{k}") for k in range(5)],
    "polar5": [(0.5 + k * 1.4, "tick") for k in range(5)],
    "switch:patterns": [(1 + k, "click") for k in range(5)],
    "switch:pad": [(1.0, "click"), (3.0, "click"), (5.0, "click")],
    "switch:autooff": [(0.5, "click"), (5.5, "powerdown")],
    "spl:141": [(0.25 + k * 0.25, "tick") for k in range(10)] + [(3.0, "lock")],
    "spl:pad": [(0.25 + k * 0.25, "tick") for k in range(10)] + [(3.0, "lock"), (5.0, "lock"), (7.0, "lock")],
    "range": [(1.0, "tick"), (3.0, "lock")],
    "lowcut": [(2.0, "click"), (5.0, "click")],
    "noisefloor": [(1.0, "air-down")],
    "capsule": [(1.0, "tick"), (2.0, "tick"), (3.0, "tick")],
    "dual": [(2.0, "tick"), (4.0, "tick"), (6.0, "tick")],
    "signal": [(1.0, "tick"), (3.0, "cross")],
    "freq": [(0.5, "chirp")],
    "sens": [(1.0, "needle")],
    "specs": [(k * 3.0, "lock") for k in range(4)],
    "dims": [(1.0, "tick"), (2.5, "tick"), (4.0, "lock")],
    "awards": [(1.0, "chime"), (3.0, "chime")],
    "ecosystem": [(k * 0.75, "drop") for k in range(8)],
    "cta": [(0.0, "impact-soft"), (2.0, "tick"), (3.0, "tick"), (4.0, "tick")],
    "outro": [(0.0, "impact-soft"), (1.0, "bloom"), (2.0, "tick"), (3.0, "tick"), (4.0, "tick"), (5.0, "tick"), (6.0, "tick")],
}


def section_at(sections, t):
    cur = sections[0][1]
    for a, name in sections:
        if t + 1e-6 >= a:
            cur = name
    return cur


def fr(t):
    return int(round(t * FPS))


def build(name):
    rng = random.Random("tlm107-" + name)
    sections = REEL_SECTIONS if name == "reel" else FILM_SECTIONS
    total = S.REEL_SECONDS if name == "reel" else S.FILM_SECONDS
    windows, shots, sfx = [], [], []
    move_i = {k: rng.randrange(len(v)) for k, v in MOVES.items()}
    trans_i = {"drop": 0, "calm": 0, "build": 0, "viz": 0}
    clip_uses = {}
    filler_i = [0]
    last_trans = None
    drops = [a for a, n in sections if n == "drop"]

    for wi, (a, b, w) in enumerate(S.timed(name)):
        windows.append({"i": wi, "start": a, "end": b, "f0": fr(a), "f1": fr(b), "t": w["t"], "e": w["e"],
                        "h": w["h"], "x": w["x"], "ch": w["ch"], "end_screen": bool(w.get("end"))})
        # expand storyboard tokens to beats; the pickup rides on the first shot
        toks = []
        for tok in w["s"]:
            p = tok.split(":")
            kind, subj = p[0], p[1]
            beats = None if p[2] == "end" else float(p[2])
            opt = p[3] if len(p) > 3 else None
            toks.append([kind, subj, beats, opt])
        # a clip too short for its slot (at >= RATE_MIN, including the
        # outgoing transition tail) hands its spare beats to a detail still
        fixed = []
        for tk in toks:
            fixed.append(tk)
            if tk[0] == "v" and tk[2]:
                ln = CLIPS[tk[1]][1] - CLIPS[tk[1]][0]
                maxb = math.floor((ln / RATE_MIN - 0.5) / BEAT + 1e-6)
                if tk[2] > maxb:
                    spare = tk[2] - maxb
                    tk[2] = maxb
                    fixed.append(["i", FILLERS[filler_i[0] % len(FILLERS)], spare, None])
                    filler_i[0] += 1
        toks = fixed
        t = a
        for k, (kind, subj, beats, opt) in enumerate(toks):
            dur = (b - t) if beats is None else beats * BEAT
            if k == 0 and w.get("pickup"):
                dur += S.FILM_PICKUP
            s0, s1 = t, t + dur
            if k == len(toks) - 1:
                s1 = b
            sec = section_at(sections, s0)
            first_in_window = k == 0
            is_drop_start = any(abs(s0 - d) < 1e-3 for d in drops)
            # transition in
            if not shots:
                tr = "fadeIn"
            elif is_drop_start:
                tr = "flashIris"
            elif kind == "z" and subj == "outro":
                tr = "iris"
            elif kind == "z":
                tr = T_VIZ[trans_i["viz"] % len(T_VIZ)]; trans_i["viz"] += 1
            elif sec == "drop":
                tr = T_DROP[trans_i["drop"] % len(T_DROP)]; trans_i["drop"] += 1
            elif sec in ("build", "break"):
                tr = T_BUILD[trans_i["build"] % len(T_BUILD)]; trans_i["build"] += 1
            else:
                tr = T_CALM[trans_i["calm"] % len(T_CALM)]; trans_i["calm"] += 1
            if tr == last_trans and tr not in ("fadeIn", "flashIris"):
                pool = T_DROP if sec == "drop" else T_CALM
                tr = pool[(pool.index(tr) + 1) % len(pool)] if tr in pool else "rack"
            last_trans = tr
            # camera move
            mk = kind if kind in MOVES else "i"
            if kind in ("i", "c") and subj in ASSETS and ASSETS[subj]["kind"] == "c":
                mk = "c"
            if kind == "i" and subj in ASSETS and ASSETS[subj]["kind"] == "c":
                kind = "c"
            pool = MOVES[mk]
            move = pool[move_i[mk] % len(pool)]; move_i[mk] += 1
            if opt == "reveal":
                move = "heroReveal"
            shot = {"i": len(shots), "w": wi, "kind": kind, "subject": subj, "opt": opt, "start": round(s0, 4),
                    "end": round(s1, 4), "f0": fr(s0), "f1": fr(s1), "move": move, "trans": tr,
                    "tf": TRANS_FRAMES[tr], "section": sec, "firstInWindow": first_in_window}
            if kind == "v":
                shot["_dur"] = dur
            if kind in ("i", "c") and subj not in ASSETS:
                print(f"  !! {name}: missing asset {subj}")
            shots.append(shot)
            # sfx for the transition
            cue = TRANS_CUE[tr]
            gain = 0.0 if first_in_window else -3.0
            sfx.append({"at": round(s0, 4), "cue": cue, "gain": gain, "why": f"trans:{tr}"})
            # viz interaction cues
            if kind == "z":
                key = f"{subj}:{opt}" if f"{subj}:{opt}" in VIZ_EVENTS else subj
                for off_b, c in VIZ_EVENTS.get(key, []):
                    at = s0 + off_b * BEAT
                    if at < s1 - 0.05:
                        sfx.append({"at": round(at, 4), "cue": c, "gain": -2.0, "why": f"viz:{key}"})
            t = s1

    # risers into every drop, from the start of the break before it
    for a, n in sections:
        if n == "drop":
            sfx.append({"at": round(a - 4 * BEAT, 4), "cue": "riser", "gain": -1.0, "why": "pre-drop"})
            sfx.append({"at": round(a, 4), "cue": "sub-drop", "gain": 0.0, "why": "drop"})
    sfx.sort(key=lambda c: c["at"])

    # clip in-points: the clip must also cover the outgoing tail (the next
    # shot's transition), so no frame from beyond the clean range ever shows
    for k, sh in enumerate(shots):
        if sh["kind"] != "v":
            continue
        dur = sh.pop("_dur")
        tail = (shots[k + 1]["tf"] / FPS) if k + 1 < len(shots) else 0.0
        c0, c1 = CLIPS[sh["subject"]]
        ln = c1 - c0
        rate = min(RATE_MAX, max(RATE_MIN, ln / dur))
        if (dur + tail) * rate > ln:
            rate = max(0.5, ln / (dur + tail))
        used = (dur + tail) * rate
        n = clip_uses.get(sh["subject"], 0)
        clip_uses[sh["subject"]] = n + 1
        slack = max(0.0, ln - used)
        off = (n * 0.61803 * slack) % (slack + 1e-9) if slack > 0.05 else 0.0
        sh.update(src=round(c0 + off, 3), rate=round(rate, 4), masterFrom=round((c0 + off - MASTER_T0), 4))
        assert c0 + off + used <= c1 + 1e-3, sh

    total_f = fr(total)
    assert shots[-1]["f1"] == total_f, (shots[-1]["f1"], total_f)
    for s0, s1 in zip(shots, shots[1:]):
        assert s0["f1"] == s1["f0"], (s0, s1)
    beat_offset = 0.0 if name == "reel" else S.FILM_PICKUP
    blocks = REEL_BLOCKS if name == "reel" else FILM_BLOCKS
    plan = {"name": name, "fps": FPS, "duration": total, "frames": total_f, "beat": BEAT, "beatFrames": BF,
            "beatOffset": beat_offset, "sections": [{"at": a, "f": fr(a), "type": n} for a, n in sections],
            "windows": windows, "shots": shots, "sfx": sfx,
            "audio": {"blocks": [{"out": o, "a": sa, "b": sb} for o, sa, sb in blocks], "duration": total}}
    json.dump(plan, open(os.path.join(ROOT, "src", f"plan-{name}.json"), "w"), indent=1)
    kinds = {}
    for s in shots:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
    used = sorted({s["subject"] for s in shots if s["kind"] in ("i", "c")})
    print(f"{name}: {len(windows)} windows, {len(shots)} shots {kinds}, {len(sfx)} sfx cues, {len(used)} stills")
    return plan, used


if __name__ == "__main__":
    assert S.check(verbose=False)
    _, ur = build("reel")
    _, uf = build("film")
    if ASSETS:
        stills = {k for k, a in ASSETS.items() if a["kind"] in ("c", "i", "g")}
        mosaic = {"black_homestudio", "black_ring_top", "thumb_box_mount", "thumb_black_ea4", "box_black_small", "nav_callouts"}
        eco = {k for k in stills if k.startswith("eco_")} | {"tube_mic_psu", "u87_eco"}
        print("film misses:", sorted(stills - set(uf) - mosaic - eco))
        print("reel misses:", sorted(stills - set(ur) - mosaic - eco))
