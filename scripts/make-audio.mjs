// Deterministic procedural audio: a 178s cinematic music bed, a varied SFX
// palette, and a silent VO placeholder. No external deps, no randomness that
// isn't seeded — identical every run.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "audio");
const VO = path.resolve(__dirname, "..", "public", "vo");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VO, { recursive: true });

const SR = 44100;
const TAU = Math.PI * 2;

// ---- deterministic noise ----
let _s = 22222;
function noise() {
  _s = (_s * 1664525 + 1013904223) >>> 0;
  return (_s / 2147483648) - 1; // -1..1
}
function resetNoise(seed) {
  _s = seed >>> 0;
}

// ---- WAV encoder (16-bit PCM) ----
function writeWavStereo(file, L, R) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(2, 22); // stereo
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 4, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    let l = Math.max(-1, Math.min(1, L[i]));
    let r = Math.max(-1, Math.min(1, R[i]));
    buf.writeInt16LE((l * 32767) | 0, o);
    buf.writeInt16LE((r * 32767) | 0, o + 2);
    o += 4;
  }
  fs.writeFileSync(file, buf);
  return buf.length;
}
function writeWavMono(file, M) {
  return writeWavStereo(file, M, M);
}

// soft clip
const sat = (x) => Math.tanh(x);

// State-variable filter (Chamberlin) — returns {lp,bp,hp} step fn
function makeSVF() {
  let low = 0, band = 0;
  return (x, freq, q) => {
    const f = 2 * Math.sin((Math.PI * Math.min(freq, SR * 0.45)) / SR);
    const qv = 1 / q;
    const high = x - low - qv * band;
    band += f * high;
    low += f * band;
    return { lp: low, bp: band, hp: high };
  };
}

function applyFades(buf, fadeInS, fadeOutS) {
  const fi = (fadeInS * SR) | 0;
  const fo = (fadeOutS * SR) | 0;
  for (let i = 0; i < fi; i++) buf[i] *= i / fi;
  for (let i = 0; i < fo; i++) buf[buf.length - 1 - i] *= i / fo;
}
function normalize(buf, peak = 0.9) {
  let m = 0;
  for (let i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i]));
  if (m < 1e-6) return;
  const g = peak / m;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}

// ============================================================
// MUSIC BED — 178s, A-minor cinematic pad + arp + soft pulse
// ============================================================
function makeMusic() {
  const dur = 178;
  const N = dur * SR;
  const M = new Float32Array(N);

  // chord voicings (Hz), 4 chords, each 8s → 32s loop
  const chords = [
    [110.0, 164.81, 220.0, 261.63, 329.63], // Am
    [87.31, 130.81, 174.61, 220.0, 261.63], // F
    [130.81, 196.0, 261.63, 329.63, 392.0], // C
    [98.0, 146.83, 196.0, 246.94, 392.0], // G
  ];
  const roots = [55.0, 43.66, 65.41, 49.0]; // sub-bass roots
  const chordLen = 8; // seconds

  // arpeggio note pool (higher octave), one per chord
  const arps = [
    [440.0, 523.25, 659.25, 880.0],
    [349.23, 440.0, 523.25, 698.46],
    [523.25, 659.25, 784.0, 1046.5],
    [392.0, 493.88, 587.33, 784.0],
  ];

  const svf = makeSVF();
  const tempo = 84; // bpm
  const beat = 60 / tempo;

  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ci = Math.floor(t / chordLen) % 4;
    const nci = (ci + 1) % 4;
    const local = (t % chordLen) / chordLen;
    // crossfade last 12% into next chord
    const xf = local > 0.88 ? (local - 0.88) / 0.12 : 0;

    // --- Pad ---
    let pad = 0;
    const voice = (freqs, gain) => {
      let s = 0;
      for (let k = 0; k < freqs.length; k++) {
        const f = freqs[k];
        const det = 1 + 0.0016 * Math.sin(t * 0.7 + k);
        const vib = 1 + 0.0025 * Math.sin(TAU * 4.5 * t + k);
        s += Math.sin(TAU * f * det * vib * t) * (1 / (k + 1.8));
      }
      return s * gain;
    };
    pad += voice(chords[ci], 1 - xf);
    if (xf > 0) pad += voice(chords[nci], xf);
    // slow swell
    const swell = 0.5 + 0.5 * Math.sin(TAU * (t / 16) - Math.PI / 2);
    pad *= 0.13 * (0.6 + 0.4 * swell);

    // --- Sub bass ---
    const rf = roots[ci] * (xf > 0 ? 1 : 1);
    let sub = Math.sin(TAU * rf * t) * 0.16;
    sub += Math.sin(TAU * rf * 2 * t) * 0.04;
    // gentle sidechain-ish duck on the beat
    const bph = (t % beat) / beat;
    const duck = 0.75 + 0.25 * Math.min(1, bph * 3);
    sub *= duck;

    // --- Soft kick pulse ---
    const kb = t % (beat * 2);
    let kick = 0;
    if (kb < 0.14) {
      const ke = Math.exp(-kb * 34);
      const kf = 52 + 60 * Math.exp(-kb * 45);
      kick = Math.sin(TAU * kf * kb) * ke * 0.16;
    }

    // --- Arp (soft plucks) ---
    const arpRate = beat / 2; // eighth notes
    const ai = Math.floor(t / arpRate);
    const ap = (t % arpRate) / arpRate;
    const note = arps[ci][ai % arps[ci].length];
    const aenv = Math.exp(-ap * 6) * (ap < 1 ? 1 : 0);
    let arp = Math.sin(TAU * note * (t)) * aenv * 0.05;
    // shimmer octave
    arp += Math.sin(TAU * note * 2 * t) * aenv * 0.02;
    // only bring arp in during middle/high-energy sections
    const arpGate = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(TAU * (t / 32)));
    arp *= arpGate;

    // --- air noise ---
    const air = noise() * 0.006;

    let mix = pad + sub + kick + arp + air;
    // soft lowpass the whole thing a touch for warmth
    const f = svf(mix, 5200, 0.9);
    mix = mix * 0.6 + f.lp * 0.4;

    M[i] = sat(mix * 1.05) * 0.85;
  }

  applyFades(M, 2.5, 5.0);
  normalize(M, 0.72);

  // stereo widen via tiny Haas + pad LFO pan
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const d = (0.008 * SR) | 0;
  for (let i = 0; i < N; i++) {
    const pan = 0.5 + 0.12 * Math.sin(TAU * (i / SR) / 24);
    const dry = M[i];
    const del = i >= d ? M[i - d] : 0;
    L[i] = dry * (1 - (pan - 0.5)) * 0.5 + del * 0.28;
    R[i] = dry * (1 + (pan - 0.5)) * 0.5 + M[i] * 0.05;
  }
  normalize(L, 0.7);
  normalize(R, 0.7);
  const bytes = writeWavStereo(path.join(OUT, "music-bed.wav"), L, R);
  console.log(`music-bed.wav  ${(bytes / 1e6).toFixed(1)} MB (${dur}s)`);
}

// ============================================================
// SFX PALETTE
// ============================================================
function buffer(seconds) {
  return new Float32Array((seconds * SR) | 0);
}
function saveSfx(name, buf, peak = 0.85, fi = 0.002, fo = 0.02) {
  applyFades(buf, fi, fo);
  normalize(buf, peak);
  writeWavMono(path.join(OUT, name), buf);
}

function sfxWhoosh(name, up) {
  resetNoise(up ? 101 : 202);
  const dur = 0.7;
  const b = buffer(dur);
  const svf = makeSVF();
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const p = t / dur;
    const env = Math.sin(Math.PI * p) ** 1.4;
    const freq = up ? 300 + 5200 * p : 5500 - 5200 * p;
    const f = svf(noise(), freq, 3.2);
    b[i] = f.bp * env;
  }
  saveSfx(name, b, 0.8);
}

function sfxImpact(name, soft) {
  const dur = soft ? 0.55 : 0.42;
  const b = buffer(dur);
  resetNoise(soft ? 303 : 404);
  const svf = makeSVF();
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.exp(-t * (soft ? 9 : 13));
    const pf = (soft ? 60 : 90) + (soft ? 40 : 80) * Math.exp(-t * 40);
    let s = Math.sin(TAU * pf * t) * env;
    // click transient
    if (t < 0.02) {
      const cf = svf(noise(), soft ? 1800 : 3200, 1.2);
      s += cf.lp * (1 - t / 0.02) * (soft ? 0.3 : 0.6);
    }
    b[i] = s;
  }
  saveSfx(name, b, soft ? 0.7 : 0.9);
}

function sfxRiser() {
  const dur = 1.4;
  const b = buffer(dur);
  resetNoise(505);
  const svf = makeSVF();
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const p = t / dur;
    const env = p ** 1.6;
    const freq = 200 + 6000 * p * p;
    const nf = svf(noise(), freq, 2.4);
    const tone = Math.sin(TAU * (200 + 900 * p) * t) * 0.4;
    b[i] = (nf.bp + tone) * env;
  }
  // quick drop at end
  const tail = (0.03 * SR) | 0;
  for (let i = 0; i < tail; i++) b[b.length - 1 - i] *= i / tail;
  saveSfx("sfx-riser.wav", b, 0.75, 0.05, 0.03);
}

function sfxTick() {
  const dur = 0.06;
  const b = buffer(dur);
  resetNoise(606);
  const svf = makeSVF();
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 120);
    const f = svf(noise(), 4200, 1.1);
    b[i] = (f.bp * 0.8 + Math.sin(TAU * 2000 * t) * 0.2) * env;
  }
  saveSfx("sfx-tick.wav", b, 0.7, 0.001, 0.01);
}

function sfxSparkle() {
  const dur = 0.6;
  const b = buffer(dur);
  const notes = [1568, 2093, 2637, 3136];
  for (let n = 0; n < notes.length; n++) {
    const start = n * 0.05;
    for (let i = 0; i < b.length; i++) {
      const t = i / SR - start;
      if (t < 0) continue;
      const env = Math.exp(-t * 9);
      b[i] += Math.sin(TAU * notes[n] * t) * env * 0.5;
    }
  }
  saveSfx("sfx-sparkle.wav", b, 0.6, 0.001, 0.05);
}

function sfxSubDrop() {
  const dur = 0.6;
  const b = buffer(dur);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const p = t / dur;
    const f = 150 * Math.pow(0.28, p); // 150 → ~42
    const env = Math.exp(-t * 4);
    b[i] = Math.sin(TAU * f * t) * env;
  }
  saveSfx("sfx-subdrop.wav", b, 0.85, 0.004, 0.05);
}

function sfxReverseSwell() {
  const dur = 0.85;
  const b = buffer(dur);
  resetNoise(707);
  const svf = makeSVF();
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const p = t / dur;
    const env = p ** 2.2; // reverse swell
    const f = svf(noise(), 800 + 2200 * p, 2.0);
    b[i] = f.bp * env;
  }
  // tiny impact tail
  saveSfx("sfx-reverse-swell.wav", b, 0.72, 0.05, 0.02);
}

function sfxClickPop() {
  const dur = 0.12;
  const b = buffer(dur);
  resetNoise(808);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.exp(-t * 40);
    b[i] = (Math.sin(TAU * 760 * t) * 0.7 + noise() * 0.3) * env;
  }
  saveSfx("sfx-click-pop.wav", b, 0.62, 0.001, 0.02);
}

// ============================================================
// SILENT VO PLACEHOLDER  (valid silent MP3 + wav fallback)
// ============================================================
function makeSilentMp3(file, seconds) {
  // MPEG-1 Layer III, 44100 Hz, 128 kbps, mono, no CRC.
  // Frame = 417 bytes; header + zeroed side-info/main-data → decodes as silence.
  const FRAME = 417;
  const header = Buffer.from([0xff, 0xfb, 0x90, 0xc0]); // mono, 128k, 44.1k
  const samplesPerFrame = 1152;
  const frames = Math.ceil((seconds * SR) / samplesPerFrame);
  const buf = Buffer.alloc(frames * FRAME);
  for (let f = 0; f < frames; f++) {
    header.copy(buf, f * FRAME); // rest of frame already zero
  }
  fs.writeFileSync(file, buf);
  return buf.length;
}
function makeSilentWav(file, seconds) {
  const b = new Float32Array((seconds * SR) | 0);
  return writeWavMono(file, b);
}

// ---- run ----
console.log("Rendering audio…");
makeMusic();
sfxWhoosh("sfx-whoosh-up.wav", true);
sfxWhoosh("sfx-whoosh-down.wav", false);
sfxImpact("sfx-impact.wav", false);
sfxImpact("sfx-soft-impact.wav", true);
sfxRiser();
sfxTick();
sfxSparkle();
sfxSubDrop();
sfxReverseSwell();
sfxClickPop();
const mp3Bytes = makeSilentMp3(path.join(VO, "voiceover.mp3"), 178);
makeSilentWav(path.join(VO, "voiceover-silent.wav"), 2);
console.log(`voiceover.mp3 (silent placeholder) ${(mp3Bytes / 1e6).toFixed(2)} MB`);
console.log("SFX written:", fs.readdirSync(OUT).filter((f) => f.startsWith("sfx")).length);
console.log("Done.");
