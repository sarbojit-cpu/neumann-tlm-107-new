#!/usr/bin/env python3
"""The soundtrack — music bed + synthesized SFX, mastered, with stems.

  1. MUSIC   "Mortals" is cut into whole-bar blocks (plan.audio.blocks) and
             re-joined with 12 ms equal-power crossfades centred on each
             downbeat, so the join is inaudible and the beat grid never slips.
  2. SFX     every cue in plan.sfx is rendered by sfx.py and placed so that
             its pre-roll ends exactly on the cue (whooshes peak on the cut,
             risers land on the drop). Transition cues closer than 0.28 s are
             thinned so fast cutting never turns into a machine gun.
  3. MASTER  one linear gain takes the sum to -14 LUFS integrated (what
             Instagram and YouTube normalise to); a transparent soft knee only
             ever touches peaks above -1.5 dBFS.
  4. STEMS   music-bed and transition-SFX stems carry exactly the gain they
             have in the master, so bed + SFX + your voiceover rebuilds the
             mix, and the bed can be ducked under the voice.

Also writes src/energy-{name}.json — per-frame loudness and bass envelopes of
the bed that the picture uses for its (subtle) audio-reactive light.
"""
import json, os, sys
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import sfx as L

SR = L.SR
SONG = "/home/user/work/src/mortals.wav"
OUT = os.path.join(ROOT, "audio")  # outside public/: renders are muted, the master is muxed after
os.makedirs(OUT, exist_ok=True)
SFX_BUS_DB = 1.0

src, sr = sf.read(SONG, always_2d=True)
assert sr == SR, sr


def cut(a, b):
    ia, ib = int(round(a * SR)), int(round(b * SR))
    seg = src[max(0, ia):min(len(src), ib)]
    if ib > len(src):
        seg = np.concatenate([seg, np.zeros((ib - max(ia, len(src)), 2))])
    return seg


def music(plan):
    xf = int(0.012 * SR)
    n = int(round(plan["audio"]["duration"] * SR))
    out = np.zeros((n + xf, 2))
    for i, blk in enumerate(plan["audio"]["blocks"]):
        o, a, b = blk["out"], blk["a"], blk["b"]
        h = xf / 2 / SR
        seg = cut(a - (h if i else 0), b + h)
        i0 = int(round(o * SR)) - (xf // 2 if i else 0)
        w = np.ones(len(seg))
        if i:
            w[:xf] = np.sin(np.linspace(0, np.pi / 2, xf)) ** 2
        if i < len(plan["audio"]["blocks"]) - 1:
            w[-xf:] = np.cos(np.linspace(0, np.pi / 2, xf)) ** 2
        seg = seg * w[:, None]
        m = min(len(seg), len(out) - i0)
        out[i0:i0 + m] += seg[:m]
    out = out[:n]
    out[: int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR))[:, None]
    f = int(1.5 * SR)
    out[-f:] *= (np.linspace(1, 0, f) ** 1.6)[:, None]
    return out


def place_sfx(plan, n):
    out = np.zeros((n, 2))
    last, kept = -9.0, 0
    for c in plan["sfx"]:
        trans = c["why"].startswith("trans")
        if trans and c["at"] - last < 0.28:
            continue
        if trans:
            last = c["at"]
        x, pre = L.render(c["cue"])
        x = x * 10 ** (c.get("gain", 0) / 20)
        a = int(round(c["at"] * SR)) - pre
        s0 = max(0, -a)
        a = max(0, a)
        b = min(n, a + len(x) - s0)
        if b > a:
            out[a:b] += x[s0:s0 + (b - a)]
            kept += 1
    print(f"  {plan['name']}: {kept}/{len(plan['sfx'])} cues placed")
    return out


def k_weight(x):
    # ITU-R BS.1770 K-weighting at 48 kHz (published biquad coefficients)
    b_hs = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a_hs = [1.0, -1.69065929318241, 0.73248077421585]
    b_hp = [1.0, -2.0, 1.0]
    a_hp = [1.0, -1.99004745483398, 0.99007225036621]
    return signal.lfilter(b_hp, a_hp, signal.lfilter(b_hs, a_hs, x))


def lufs(x):
    kw = np.stack([k_weight(x[:, c]) for c in range(2)], 1)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    ms = np.array([np.sum(np.mean(kw[i:i + blk] ** 2, 0)) for i in range(0, len(kw) - blk, hop)])
    lk = -0.691 + 10 * np.log10(np.maximum(ms, 1e-20))
    g = lk > -70
    rel = -0.691 + 10 * np.log10(ms[g].mean()) - 10
    g2 = g & (lk > rel)
    return -0.691 + 10 * np.log10(ms[g2].mean())


def true_peak(x):
    up = signal.resample_poly(x, 4, 1, axis=0)
    return 20 * np.log10(np.abs(up).max() + 1e-12)


def soft_knee(x, ceil_db=-1.0, knee_db=-1.5):
    c = 10 ** (ceil_db / 20)
    k = 10 ** (knee_db / 20)
    y = x.copy()
    m = np.abs(x) > k
    y[m] = np.sign(x[m]) * (k + (c - k) * np.tanh((np.abs(x[m]) - k) / (c - k)))
    return y


def write(path, x):
    sf.write(path, np.clip(x, -1, 1).astype(np.float32), SR, subtype="PCM_24")


def energy(plan, bed):
    fps = plan["fps"]
    hop = SR // fps
    nf = plan["frames"]
    mono = bed.mean(1)
    low = signal.sosfilt(signal.butter(4, 150 / (SR / 2), output="sos"), mono)
    rms = np.array([np.sqrt(np.mean(mono[i * hop:(i + 1) * hop] ** 2)) for i in range(nf)])
    bass = np.array([np.sqrt(np.mean(low[i * hop:(i + 1) * hop] ** 2)) for i in range(nf)])

    def env(v, att, rel):
        o = np.zeros_like(v); e = 0.0
        for i, s in enumerate(v):
            e = e + (s - e) * (att if s > e else rel)
            o[i] = e
        return o

    rms = env(rms, 0.5, 0.08)
    bass = env(bass, 0.7, 0.18)
    rms /= np.percentile(rms, 97) + 1e-9
    bass /= np.percentile(bass, 97) + 1e-9
    json.dump({"rms": [round(float(min(1.2, v)), 3) for v in rms], "bass": [round(float(min(1.2, v)), 3) for v in bass]},
              open(os.path.join(ROOT, "src", f"energy-{plan['name']}.json"), "w"))


if __name__ == "__main__":
    names = sys.argv[1:] or ["reel", "film"]
    for name in names:
        plan = json.load(open(os.path.join(ROOT, "src", f"plan-{name}.json")))
        bed = music(plan)
        fx = place_sfx(plan, len(bed)) * 10 ** (SFX_BUS_DB / 20)
        mix = bed + fx
        g = 10 ** ((-14.0 - lufs(mix)) / 20)
        master = soft_knee(mix * g)
        write(os.path.join(OUT, f"mix-{name}.wav"), master)
        write(os.path.join(OUT, f"music-bed-{name}.wav"), bed * g)
        write(os.path.join(OUT, f"transition-sfx-{name}.wav"), fx * g)
        energy(plan, bed)
        touched = float((np.abs(mix * g) > 10 ** (-1.5 / 20)).mean() * 100)
        print(f"  {name}: {len(master) / SR:.3f} s  {lufs(master):.2f} LUFS  true peak {true_peak(master):.2f} dBTP  "
              f"knee touched {touched:.3f}% of samples  bed gain {20 * np.log10(g):.2f} dB")
