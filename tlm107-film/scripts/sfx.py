#!/usr/bin/env python3
"""The SFX library — every sound synthesized from first principles, 48 kHz.

Nothing is sampled. Tonal material sits on D (the tonic of "Mortals") and its
fifth A, so every shimmer, bell and blip is in key with the bed. Each sound is
placed with its own synthesized room: a stereo impulse response built from
band-split, exponentially decaying noise (the high band dies first, like real
air), so the SFX share one believable space with the music instead of sitting
dry on top of it.

A sound is a function returning (stereo float array, pre-roll seconds): the
pre-roll is how much of it plays BEFORE the cue time, so a whoosh peaks
exactly on the cut and a riser lands exactly on the drop.
"""
import numpy as np
from scipy import signal

SR = 48000
RNG = np.random.default_rng(107)

# ── pitch ──────────────────────────────────────────────────────────────────
def hz(note):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)


# ── primitives ─────────────────────────────────────────────────────────────
def t_(sec):
    return np.arange(int(sec * SR)) / SR


def noise(sec, color="white"):
    n = RNG.standard_normal(int(sec * SR))
    if color == "pink":
        f = np.fft.rfft(n)
        k = np.arange(len(f)); k[0] = 1
        n = np.fft.irfft(f / np.sqrt(k), len(n))
    elif color == "brown":
        n = np.cumsum(n); n -= signal.savgol_filter(n, 4001 if len(n) > 4001 else (len(n) // 2) * 2 - 1, 2)
    return n / (np.abs(n).max() + 1e-9)


def sos(kind, f, order=2):
    nyq = SR / 2
    if isinstance(f, (list, tuple)):
        f = [min(max(x, 10), nyq * 0.98) for x in f]
    else:
        f = min(max(f, 10), nyq * 0.98)
    return signal.butter(order, np.array(f) / nyq, btype=kind, output="sos")


def filt(x, kind, f, order=2):
    return signal.sosfilt(sos(kind, f, order), x)


def sweep_bp(x, f0, f1, q=2.0, curve="exp", block=256):
    """Band-pass whose centre glides f0 -> f1 across the sound (state carried)."""
    n = len(x)
    out = np.zeros(n)
    nb = int(np.ceil(n / block))
    zi = None
    for b in range(nb):
        u = b / max(1, nb - 1)
        fc = f0 * (f1 / f0) ** u if curve == "exp" else f0 + (f1 - f0) * u
        bw = fc / q
        s = sos("bandpass", [max(20, fc - bw / 2), fc + bw / 2], 2)
        if zi is None or zi.shape != (s.shape[0], 2):
            zi = np.zeros((s.shape[0], 2))
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(s, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    return out


def sweep_lp(x, f0, f1, block=256):
    n = len(x); out = np.zeros(n); nb = int(np.ceil(n / block)); zi = np.zeros((1, 2))
    for b in range(nb):
        u = b / max(1, nb - 1)
        fc = f0 * (f1 / f0) ** u
        s = sos("lowpass", fc, 2)
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(s, seg, zi=zi)
        out[b * block:b * block + len(seg)] = y
    return out


def env_exp(n, attack=0.002, decay=0.3):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(0, t - attack) / max(decay, 1e-4))


def env_ad(n, attack, release, shape=2.0):
    t = np.arange(n) / SR
    tot = n / SR
    up = np.clip(t / max(attack, 1e-4), 0, 1) ** shape
    dn = np.clip((tot - t) / max(release, 1e-4), 0, 1) ** shape
    return up * dn


def osc(freq, sec, kind="sine", phase=0.0):
    """freq may be scalar or per-sample array (glides)."""
    n = int(sec * SR)
    f = np.full(n, freq, dtype=float) if np.isscalar(freq) else np.asarray(freq, float)[:n]
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if kind == "sine":
        return np.sin(ph)
    if kind == "tri":
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == "saw":
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    raise ValueError(kind)


def glide(f0, f1, sec, curve="exp"):
    u = np.linspace(0, 1, int(sec * SR))
    return f0 * (f1 / f0) ** u if curve == "exp" else f0 + (f1 - f0) * u


def fm_bell(freq, sec, index=2.2, ratio=3.5, decay=1.2):
    n = int(sec * SR); t = np.arange(n) / SR
    e = np.exp(-t / decay)
    mod = index * e * np.sin(2 * np.pi * freq * ratio * t)
    return np.sin(2 * np.pi * freq * t + mod) * e


def sat(x, drive=1.5):
    return np.tanh(x * drive) / np.tanh(drive)


def fade(x, a=0.002, b=0.01):
    x = x.copy()
    na, nb = int(a * SR), int(b * SR)
    if na:
        x[:na] *= np.linspace(0, 1, na)[:, None] if x.ndim == 2 else np.linspace(0, 1, na)
    if nb:
        x[-nb:] *= np.linspace(1, 0, nb)[:, None] if x.ndim == 2 else np.linspace(1, 0, nb)
    return x


def pad(x, sec):
    n = int(sec * SR)
    z = np.zeros((n,) + x.shape[1:])
    return np.concatenate([x, z])


def stereo(x, width=0.0, pan=0.0):
    """Mono -> stereo with constant-power pan and a Haas-free width decorrelation."""
    if x.ndim == 2:
        return x
    l = x * np.cos((pan + 1) * np.pi / 4)
    r = x * np.sin((pan + 1) * np.pi / 4)
    if width > 0:
        d = filt(x, "highpass", 1200) * width
        d = np.roll(d, 7)
        l, r = l + d * 0.5, r - d * 0.5
    return np.stack([l, r], 1) * np.sqrt(2)


def autopan(x, p0, p1):
    u = np.linspace(p0, p1, len(x))
    return np.stack([x * np.cos((u + 1) * np.pi / 4), x * np.sin((u + 1) * np.pi / 4)], 1) * np.sqrt(2)


# ── the room ───────────────────────────────────────────────────────────────
_IR = {}


def ir(decay=1.8, bright=0.5, predelay=0.012, size="hall"):
    key = (round(decay, 2), round(bright, 2), round(predelay, 3), size)
    if key in _IR:
        return _IR[key]
    n = int((decay * 1.6 + predelay) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    rng = np.random.default_rng(int(decay * 1000 + bright * 100))
    bands = [(20, 250, 1.15), (250, 1500, 1.0), (1500, 5000, 0.7), (5000, 16000, 0.35 + 0.4 * bright)]
    for c in range(2):
        acc = np.zeros(n)
        for lo, hi, dm in bands:
            nz = rng.standard_normal(n)
            nz = signal.sosfilt(sos("bandpass", [lo, hi], 2), nz)
            acc += nz * np.exp(-t * 6.9 / (decay * dm))
        # early reflections
        for k in range(10):
            d = predelay + rng.uniform(0.004, 0.06)
            i = int(d * SR)
            if i < n:
                acc[i] += rng.uniform(0.3, 0.9) * (-1) ** k
        acc[: int(predelay * SR)] = 0
        out[:, c] = acc
    # gentle fade-in of the tail so the IR has no hard onset
    out *= np.clip(t / 0.004, 0, 1)[:, None]
    out /= np.sqrt((out ** 2).sum(0)).max() + 1e-9
    _IR[key] = out
    return out


def verb(x, mix=0.3, decay=1.8, bright=0.5, predelay=0.012):
    """Convolution reverb. x mono or stereo -> stereo, tail appended."""
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    k = min(len(x) // 3, int(0.03 * SR))
    x = x.copy()
    x[-k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    h = ir(decay, bright, predelay)
    wet = np.stack([signal.fftconvolve(x[:, c], h[:, c]) for c in range(2)], 1)
    dry = np.concatenate([x, np.zeros((len(wet) - len(x), 2))])
    wet *= (np.abs(dry).max() + 1e-9) / (np.abs(wet).max() + 1e-9)
    return dry * (1 - mix) + wet * mix


def norm(x, peak=0.98):
    return x / (np.abs(x).max() + 1e-9) * peak


def reverse(x):
    return x[::-1].copy()


# ════════════════════════════════════════════════════════════════════════════
#  THE SOUNDS
# ════════════════════════════════════════════════════════════════════════════

def impact():
    """Punch-in cut: a tuned sub thump (D2 falling to D1), a felt-mallet body,
    a 2 ms transient and a short dark room."""
    sec = 0.9
    n = int(sec * SR)
    sub = osc(glide(hz("D2"), hz("D1"), sec), sec) * env_exp(n, 0.002, 0.22)
    body = filt(noise(sec, "pink"), "bandpass", [120, 900]) * env_exp(n, 0.001, 0.05)
    click = filt(noise(sec), "highpass", 3000) * env_exp(n, 0.0003, 0.003)
    x = sat(sub * 1.0 + body * 0.55 + click * 0.25, 1.4)
    return fade(verb(x, 0.18, 0.7, 0.2)), 0.0


def impact_big():
    """Drop / flash-iris: the big one. Sub boom, a struck-metal partial cluster
    (inharmonic, rooted on D), a pressure 'whump' and a long hall."""
    sec = 2.6
    n = int(sec * SR)
    sub = osc(glide(hz("D2") * 1.02, hz("D1"), 0.9, "exp").tolist() + [hz("D1")] * (n - int(0.9 * SR)), sec) * env_exp(n, 0.003, 0.7)
    whump = filt(noise(sec, "brown"), "lowpass", 220) * env_exp(n, 0.004, 0.18)
    metal = np.zeros(n)
    for r, a, d in [(1.0, 1, 1.4), (2.76, 0.5, 0.9), (5.40, 0.28, 0.6), (8.93, 0.16, 0.4), (1.5, 0.35, 1.1)]:
        metal += a * fm_bell(hz("D4") * r, sec, index=0.8, ratio=1.41, decay=d)
    click = filt(noise(sec), "highpass", 2500) * env_exp(n, 0.0004, 0.006)
    x = sat(sub * 1.1 + whump * 0.7, 1.6) + metal * 0.22 + click * 0.3
    return fade(verb(x, 0.35, 2.6, 0.45, 0.02), 0.001, 0.4), 0.0


def impact_soft():
    sec = 1.2; n = int(sec * SR)
    sub = osc(glide(hz("A2"), hz("D2"), sec), sec) * env_exp(n, 0.003, 0.25)
    body = filt(noise(sec, "pink"), "bandpass", [200, 1400]) * env_exp(n, 0.001, 0.04)
    bell = fm_bell(hz("D5"), sec, 1.2, 2.0, 0.5) * 0.25
    return fade(verb(sat(sub + body * 0.5, 1.3) + bell, 0.3, 1.4, 0.5)), 0.0


def sub_drop():
    """Classic trap sub drop under the downbeat — kept short and round."""
    sec = 1.3; n = int(sec * SR)
    f = glide(hz("D3"), hz("D1") * 0.95, sec)
    x = osc(f, sec) * env_ad(n, 0.004, 0.9, 1.5)
    x = sat(x, 1.8)
    return fade(stereo(filt(x, "lowpass", 160))), 0.0


def whoosh():
    """Whip pan: pink air through a band-pass that climbs then falls, panned
    across the image, peaking exactly on the cut (0.32 s pre-roll)."""
    sec = 0.62; n = int(sec * SR)
    x = noise(sec, "pink")
    up = sweep_bp(x[: int(0.32 * SR)], 280, 4200, q=1.6)
    dn = sweep_bp(x[int(0.32 * SR):], 4200, 700, q=1.4)
    y = np.concatenate([up, dn])
    e = np.concatenate([np.linspace(0, 1, int(0.32 * SR)) ** 2.6, np.exp(-np.arange(n - int(0.32 * SR)) / SR / 0.09)])
    y = y * e
    # doppler flutter
    y *= 1 + 0.12 * np.sin(2 * np.pi * 23 * np.arange(n) / SR)
    s = autopan(norm(y), -0.8, 0.8)
    return fade(verb(s, 0.2, 0.8, 0.6)), 0.32


def air_punch():
    """Zoom-through: a reversed air rush into a soft felt thump."""
    sec = 0.4
    rush = sweep_bp(noise(sec, "pink"), 500, 6000, q=1.2) * np.linspace(0, 1, int(sec * SR)) ** 3
    n2 = int(0.5 * SR)
    thump = osc(glide(hz("A2"), hz("D2"), 0.5), 0.5) * env_exp(n2, 0.002, 0.12)
    x = np.concatenate([rush * 0.8, sat(thump, 1.3)])
    return fade(verb(stereo(x, 0.4), 0.2, 0.9, 0.5)), sec


def shimmer():
    """Rhombus iris: a glass arpeggio on D-A-D-E-A (in key, no third) with a
    rising air bed and a long bright hall."""
    sec = 2.2; n = int(sec * SR)
    x = np.zeros(n)
    notes = ["D6", "A6", "D7", "E7", "A7"]
    for k, nt in enumerate(notes):
        o = int(k * 0.028 * SR)
        b = fm_bell(hz(nt) * (1 + RNG.uniform(-0.002, 0.002)), sec - o / SR, index=1.1, ratio=2.0, decay=0.7) * (0.9 - k * 0.1)
        x[o:o + len(b)] += b
    air = sweep_bp(noise(0.35, "pink"), 2000, 9000, q=1.5) * np.linspace(0, 1, int(0.35 * SR)) ** 2
    pre = np.concatenate([air * 0.35, np.zeros(n)])
    x = np.concatenate([np.zeros(len(air)), x]) + pre
    x = filt(filt(x, "highpass", 500), "lowpass", 9500)
    return fade(verb(stereo(x, 0.6), 0.45, 2.4, 0.75)), 0.35


def ticks():
    """Slats: a cascade of eight tiny metallic ticks swept left to right."""
    sec = 0.7; n = int(sec * SR)
    L, R = np.zeros(n), np.zeros(n)
    for k in range(8):
        o = int(k * 0.038 * SR)
        m = int(0.03 * SR)
        tk = filt(noise(0.03), "bandpass", [3200 + k * 250, 7500]) * env_exp(m, 0.0002, 0.004)
        tk += 0.3 * np.sin(2 * np.pi * hz("A6") * (1 + k * 0.03) * np.arange(m) / SR) * env_exp(m, 0.0005, 0.01)
        p = -0.85 + 1.7 * k / 7
        L[o:o + m] += tk * np.cos((p + 1) * np.pi / 4)
        R[o:o + m] += tk * np.sin((p + 1) * np.pi / 4)
    return fade(verb(np.stack([L, R], 1), 0.25, 0.9, 0.8)), 0.1


def shutter():
    """A cinema-camera shutter: click, 55 ms, clack — the gimbal's own voice."""
    sec = 0.45; n = int(sec * SR); x = np.zeros(n)
    for o, f, g in [(0.0, 2600, 1.0), (0.055, 1700, 0.8)]:
        i = int(o * SR); m = int(0.05 * SR)
        c = filt(noise(0.05), "bandpass", [f * 0.6, f * 2.4]) * env_exp(m, 0.0002, 0.006)
        c += 0.25 * np.sin(2 * np.pi * f * 0.5 * np.arange(m) / SR) * env_exp(m, 0.0003, 0.012)
        x[i:i + m] += c * g
    return fade(verb(stereo(x, 0.3), 0.15, 0.5, 0.6)), 0.02


def swell():
    """Rack focus: a reverse-reverb swell of an open D-A voicing that blooms into
    the cut (0.62 s pre-roll), then a soft tail after it."""
    sec = 1.2; n = int(sec * SR)
    chord = sum(a * np.sin(2 * np.pi * hz(nt) * np.arange(n) / SR) for nt, a in [("D3", 0.7), ("A3", 0.6), ("D4", 0.5), ("A4", 0.35), ("E5", 0.18)])
    hit = chord * env_exp(n, 0.004, 0.25) + filt(noise(sec, "pink"), "bandpass", [300, 3000]) * env_exp(n, 0.001, 0.05) * 0.4
    w = verb(stereo(hit, 0.5), 1.0, 2.2, 0.5)
    rev = reverse(w)
    k = int(0.62 * SR)
    rev = rev[-k:] * (np.linspace(0, 1, k) ** 2.2)[:, None]
    tail = verb(stereo(hit * env_exp(n, 0.002, 0.08), 0.5), 0.5, 1.4, 0.5)[: int(0.9 * SR)] * 0.35
    xf = int(0.012 * SR)
    w8 = np.linspace(0, 1, xf)[:, None]
    joined = np.concatenate([rev[:-xf], rev[-xf:] * (1 - w8) + tail[:xf] * w8, tail[xf:]])
    return fade(joined, 0.002, 0.05), 0.62


def glint():
    """Light sweep: a resonant band glides 2k -> 11k across the frame with
    three pings on A — the streak crossing the lens."""
    sec = 0.5; n = int(sec * SR)
    x = sweep_bp(noise(sec, "pink"), 2000, 11000, q=6.0) * env_ad(n, 0.18, 0.2, 1.5)
    for k, nt in enumerate(["A6", "D7", "A7"]):
        o = int((0.12 + k * 0.05) * SR)
        b = fm_bell(hz(nt), sec - o / SR, 0.6, 2.0, 0.25) * 0.3
        x[o:o + len(b)] += b
    return fade(verb(autopan(norm(x), -0.7, 0.7), 0.35, 1.6, 0.9)), 0.2


def grain():
    """Mesh dissolve: granular air — hundreds of 4 ms grains scattered across the
    stereo field, dense in the middle, like light through the head grille."""
    sec = 0.9; n = int(sec * SR); L, R = np.zeros(n), np.zeros(n)
    for _ in range(300):
        u = RNG.beta(2.2, 2.2)
        o = int(u * (n - 400))
        m = int(RNG.uniform(0.002, 0.006) * SR)
        f = RNG.uniform(1200, 6000)
        g = np.hanning(m) * np.sin(2 * np.pi * f * np.arange(m) / SR) * RNG.uniform(0.2, 1.0)
        p = RNG.uniform(-1, 1)
        L[o:o + m] += g * np.cos((p + 1) * np.pi / 4)
        R[o:o + m] += g * np.sin((p + 1) * np.pi / 4)
    x = np.stack([L, R], 1)
    return fade(verb(norm(x), 0.35, 1.2, 0.8)), 0.45


def ring():
    """Ring wipe: the chrome ring 'rubbed' — a bank of inharmonic ring modes on
    D excited by a soft brush whose band sweeps around the circle."""
    sec = 1.6; n = int(sec * SR)
    brush = sweep_bp(noise(sec, "pink"), 900, 5000, q=2.5) * env_ad(n, 0.25, 0.9, 1.4)
    modes = np.zeros(n)
    for r, a in [(1.0, 1.0), (2.76, 0.6), (5.40, 0.35), (8.93, 0.18)]:
        f = hz("D5") * r
        bw = f / 180
        s = sos("bandpass", [f - bw, f + bw], 2)
        modes += signal.sosfilt(s, brush) * a
    x = norm(modes) * 0.8 + norm(brush) * 0.2
    return fade(verb(autopan(x, 0.6, -0.6), 0.45, 2.0, 0.7)), 0.3


def boom_soft():
    sec = 2.0; n = int(sec * SR)
    x = osc(glide(hz("A1") * 1.2, hz("D1"), sec), sec) * env_exp(n, 0.01, 0.5)
    x += filt(noise(sec, "brown"), "lowpass", 180) * env_exp(n, 0.01, 0.3) * 0.6
    return fade(verb(stereo(sat(x, 1.2)), 0.3, 2.2, 0.3)), 0.0


def bloom():
    """Fade-in / end card: an open-fifth pad on D that breathes in over 0.9 s,
    chorused and roomy."""
    sec = 4.5; n = int(sec * SR)
    x = np.zeros((n, 2))
    for nt, a in [("D2", 0.6), ("A2", 0.5), ("D3", 0.45), ("A3", 0.35), ("E4", 0.16), ("D5", 0.12)]:
        for c, det in ((0, -0.0025), (1, 0.0028)):
            x[:, c] += a * osc(hz(nt) * (1 + det), sec, "tri") * (1 + 0.1 * np.sin(2 * np.pi * 0.3 * np.arange(n) / SR + c))
    x = np.stack([filt(x[:, c], "lowpass", 2400) for c in range(2)], 1)
    x *= env_ad(n, 0.9, 2.6, 1.6)[:, None]
    return fade(verb(x, 0.45, 3.0, 0.5)), 0.0


def riser():
    """Four beats into every drop: noise and a D glissando climbing together,
    ending exactly on the downbeat (the whole sound is pre-roll)."""
    sec = 4 * 60 / 90; n = int(sec * SR)
    nz = filt(sweep_bp(noise(sec, "pink"), 300, 7000, q=1.4), "lowpass", 9000)
    tone = osc(glide(hz("D3"), hz("D5"), sec), sec, "saw")
    tone = sweep_lp(tone, 400, 6000)
    e = np.linspace(0, 1, n) ** 2.8
    x = (norm(nz) * 0.75 + norm(tone) * 0.25) * e
    x[-int(0.012 * SR):] *= np.linspace(1, 0, int(0.012 * SR))
    return stereo(x, 0.8), sec


def click():
    """The TLM 107 navigation switch: a two-stage tactile press (press + release,
    26 ms apart), a small plastic thock and a faint LED blip on A5."""
    sec = 0.35; n = int(sec * SR); x = np.zeros(n)
    for o, g, f in [(0.0, 1.0, 3800), (0.026, 0.6, 3000)]:
        i = int(o * SR); m = int(0.03 * SR)
        c = filt(noise(0.03), "bandpass", [f * 0.5, f * 1.8]) * env_exp(m, 0.0002, 0.003)
        c += 0.5 * np.sin(2 * np.pi * 420 * np.arange(m) / SR) * env_exp(m, 0.0005, 0.008)
        x[i:i + m] += c * g
    m = int(0.09 * SR)
    blip = np.sin(2 * np.pi * hz("A5") * np.arange(m) / SR) * env_ad(m, 0.004, 0.07)
    x[int(0.03 * SR):int(0.03 * SR) + m] += blip * 0.22
    return fade(verb(stereo(x, 0.2), 0.12, 0.5, 0.6)), 0.0


def blip(k):
    """Hook arpeggio — the five pattern LEDs lighting one by one: D5 A5 D6 E6 A6."""
    nt = ["D5", "A5", "D6", "E6", "A6"][k]

    def f():
        sec = 0.9; n = int(sec * SR)
        x = osc(hz(nt), sec, "sine") * env_exp(n, 0.003, 0.16)
        x += 0.25 * osc(hz(nt) * 2, sec, "sine") * env_exp(n, 0.002, 0.06)
        x += 0.15 * fm_bell(hz(nt), sec, 0.8, 3.0, 0.2)
        p = -0.6 + 0.3 * k
        return fade(verb(stereo(x, 0.2, p), 0.35, 1.6, 0.8)), 0.0
    return f


def tick():
    sec = 0.12; n = int(sec * SR)
    x = np.sin(2 * np.pi * 2350 * np.arange(n) / SR) * env_exp(n, 0.0003, 0.006)
    x += filt(noise(sec), "highpass", 5000) * env_exp(n, 0.0002, 0.002) * 0.5
    return fade(stereo(x, 0.1)), 0.0


def lock():
    """A number locking into place: felt thunk + a D6 ping with room."""
    sec = 1.0; n = int(sec * SR)
    th = np.sin(2 * np.pi * glide(260, 170, sec)[:n].cumsum() / SR * 1.0) * env_exp(n, 0.001, 0.035)
    th = osc(glide(260, 170, sec), sec) * env_exp(n, 0.001, 0.035)
    ping = fm_bell(hz("D6"), sec, 0.9, 2.0, 0.35) * 0.45
    return fade(verb(stereo(th + ping, 0.3), 0.3, 1.3, 0.8)), 0.0


def air_down():
    sec = 0.9; n = int(sec * SR)
    x = sweep_bp(noise(sec, "pink"), 6000, 300, q=1.3) * env_ad(n, 0.05, 0.6, 1.4)
    return fade(verb(stereo(x, 0.6), 0.3, 1.5, 0.5)), 0.05


def cross():
    """The transformer struck from the signal path: a falling two-note A5 -> D5."""
    sec = 0.6; n = int(sec * SR); x = np.zeros(n)
    for o, nt in [(0.0, "A5"), (0.09, "D5")]:
        i = int(o * SR); m = n - i
        x[i:] += osc(hz(nt), m / SR, "tri") * env_exp(m, 0.002, 0.08) * 0.8
    return fade(verb(stereo(x, 0.2), 0.3, 1.0, 0.6)), 0.0


def chirp():
    """The frequency-response curve drawing itself: a quiet log sine sweep
    40 Hz -> 14 kHz, tapered so the top end never bites."""
    sec = 2.4; n = int(sec * SR)
    f = glide(40, 14000, sec)
    x = osc(f, sec) * env_ad(n, 0.15, 0.4, 1.2)
    x *= np.interp(f, [40, 2000, 6000, 14000], [1.0, 0.7, 0.35, 0.12])
    return fade(verb(stereo(x, 0.3), 0.25, 1.2, 0.5)), 0.0


def needle():
    sec = 0.5; n = int(sec * SR)
    whirr = sweep_bp(noise(sec, "pink"), 800, 2400, q=3) * env_ad(n, 0.02, 0.3)
    x = whirr * 0.6
    m = int(0.03 * SR); i = int(0.3 * SR)
    x[i:i + m] += filt(noise(0.03), "bandpass", [1500, 6000]) * env_exp(m, 0.0002, 0.004)
    return fade(verb(stereo(x, 0.2), 0.2, 0.8, 0.6)), 0.0


def chime():
    sec = 3.0; n = int(sec * SR)
    x = fm_bell(hz("D6"), sec, 1.4, 3.5, 1.1) + 0.6 * fm_bell(hz("A6"), sec, 1.2, 3.5, 0.9) + 0.3 * fm_bell(hz("D5"), sec, 0.8, 2.0, 1.4)
    x = filt(x, "lowpass", 8500, 4)
    return fade(verb(stereo(x, 0.5), 0.45, 2.6, 0.9)), 0.0


def drop_():
    sec = 0.6; n = int(sec * SR)
    th = osc(glide(180, 110, sec), sec) * env_exp(n, 0.001, 0.05)
    tk = filt(noise(sec), "bandpass", [1500, 4000]) * env_exp(n, 0.0002, 0.004) * 0.4
    return fade(verb(stereo(th + tk, 0.2), 0.2, 0.8, 0.5)), 0.0


def powerdown():
    """The display switching itself off: a falling tone behind a closing filter."""
    sec = 0.9; n = int(sec * SR)
    x = osc(glide(hz("A5"), hz("A3"), sec), sec, "tri") * env_ad(n, 0.01, 0.6, 1.2)
    x = sweep_lp(x, 6000, 300)
    return fade(verb(stereo(x, 0.2), 0.3, 1.2, 0.5)), 0.0


SOUNDS = {
    "impact": impact, "impact-big": impact_big, "impact-soft": impact_soft, "sub-drop": sub_drop,
    "whoosh": whoosh, "air-punch": air_punch, "shimmer": shimmer, "ticks": ticks, "shutter": shutter,
    "swell": swell, "glint": glint, "grain": grain, "ring": ring, "boom-soft": boom_soft, "bloom": bloom,
    "riser": riser, "click": click, "tick": tick, "lock": lock, "air-down": air_down, "cross": cross,
    "chirp": chirp, "needle": needle, "chime": chime, "drop": drop_, "powerdown": powerdown,
    **{f"blip{k}": blip(k) for k in range(5)},
}

# Relative level of each sound inside the SFX bus (dB). Transitions sit a
# little forward; interface accents and repeated ticks sit well back.
RELATIVE = {
    "impact": -3, "impact-big": -3, "impact-soft": -6, "sub-drop": -13, "whoosh": -2, "air-punch": -4.3,
    "shimmer": -7, "ticks": -2, "shutter": -1.5, "swell": -6.5, "glint": -11.6, "grain": -7, "ring": -6,
    "boom-soft": -5, "bloom": -7, "riser": -8, "click": -1, "tick": -15.4, "lock": -7.6, "air-down": -21.7,
    "cross": -13.4, "chirp": -23, "needle": -11, "chime": -8.2, "drop": -8, "powerdown": -10,
    "blip0": -7, "blip1": -7.5, "blip2": -10, "blip3": -14, "blip4": -14,
}

_cache = {}


def render(cue):
    """-> (stereo array at its bus level, pre-roll samples)."""
    if cue not in _cache:
        x, pre = SOUNDS[cue]()
        if x.ndim == 1:
            x = stereo(x)
        x = norm(x) * 10 ** (RELATIVE[cue] / 20)
        _cache[cue] = (x, int(round(pre * SR)))
    return _cache[cue]


if __name__ == "__main__":
    import soundfile as sf, os, sys
    out = sys.argv[1] if len(sys.argv) > 1 else "/home/user/work/sfx"
    os.makedirs(out, exist_ok=True)
    for k in SOUNDS:
        x, pre = render(k)
        sf.write(os.path.join(out, f"{k}.wav"), x.astype(np.float32), SR)
        print(f"{k:12s} {len(x) / SR:5.2f}s pre {pre / SR:.2f}s peak {20 * np.log10(np.abs(x).max()):.1f} dBFS")
