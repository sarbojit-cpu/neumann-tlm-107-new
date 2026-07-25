// Long-form-only audio: a ~600s evolving cinematic music bed and a silent VO
// placeholder, sized specifically at 32kHz to stay safely under GitHub's
// 100MB per-file cap (600s stereo 16-bit @32kHz ≈ 77MB). Deterministic, zero
// dependencies — reruns produce byte-identical output. The reel's existing
// SFX palette (public/audio/sfx-*.wav) is reused as-is; nothing here
// duplicates it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "audio");
const VO = path.resolve(__dirname, "..", "public", "vo");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VO, { recursive: true });

const SR = 32000; // reduced from the reel's 44.1kHz specifically for file-size safety at 10x the duration
const TAU = Math.PI * 2;

let _s = 990011;
function noise() {
  _s = (_s * 1664525 + 1013904223) >>> 0;
  return (_s / 2147483648) - 1;
}

function writeWavStereo(file, L, R) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
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

const sat = (x) => Math.tanh(x);

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
// LONG-FORM MUSIC BED — ~600s, A-minor cinematic pad + arp + pulse,
// slowly evolving energy across the runtime (matched loosely to the 10
// chapter beats: calmer intro/heritage, more rhythmic controls/specs,
// warmer workflows, building outro) via a normalized-time envelope.
// ============================================================
function makeMusicLongform() {
  const dur = 600;
  const N = dur * SR;
  const M = new Float32Array(N);

  const chords = [
    [110.0, 164.81, 220.0, 261.63, 329.63], // Am
    [87.31, 130.81, 174.61, 220.0, 261.63], // F
    [130.81, 196.0, 261.63, 329.63, 392.0], // C
    [98.0, 146.83, 196.0, 246.94, 392.0], // G
    [110.0, 146.83, 220.0, 261.63, 349.23], // Am7-ish colour chord for variety
  ];
  const roots = [55.0, 43.66, 65.41, 49.0, 55.0];
  const chordLen = 10; // seconds per chord — slightly slower than the reel for a calmer long-form feel

  const arps = [
    [440.0, 523.25, 659.25, 880.0],
    [349.23, 440.0, 523.25, 698.46],
    [523.25, 659.25, 784.0, 1046.5],
    [392.0, 493.88, 587.33, 784.0],
    [440.0, 523.25, 587.33, 698.46],
  ];

  const svf = makeSVF();
  const tempo = 80;
  const beat = 60 / tempo;
  const nChords = chords.length;

  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const tn = t / dur; // 0..1 normalized position across the whole runtime

    // Slow "energy" envelope: gentle rise into the controls/specs midsection,
    // a warm plateau through workflows, a modest lift into the outro.
    const energy =
      0.55 +
      0.22 * Math.sin(TAU * (tn * 1.4)) * (0.4 + 0.6 * tn) +
      0.18 * Math.min(1, tn * 1.3);

    const ci = Math.floor(t / chordLen) % nChords;
    const nci = (ci + 1) % nChords;
    const local = (t % chordLen) / chordLen;
    const xf = local > 0.9 ? (local - 0.9) / 0.1 : 0;

    let pad = 0;
    const voice = (freqs, gain) => {
      let s = 0;
      for (let k = 0; k < freqs.length; k++) {
        const f = freqs[k];
        const det = 1 + 0.0015 * Math.sin(t * 0.6 + k);
        const vib = 1 + 0.002 * Math.sin(TAU * 4.2 * t + k);
        s += Math.sin(TAU * f * det * vib * t) * (1 / (k + 1.8));
      }
      return s * gain;
    };
    pad += voice(chords[ci], 1 - xf);
    if (xf > 0) pad += voice(chords[nci], xf);
    const swell = 0.5 + 0.5 * Math.sin(TAU * (t / 22) - Math.PI / 2);
    pad *= 0.12 * (0.55 + 0.45 * swell) * energy;

    const rf = roots[ci];
    let sub = Math.sin(TAU * rf * t) * 0.15;
    sub += Math.sin(TAU * rf * 2 * t) * 0.035;
    const bph = (t % beat) / beat;
    const duck = 0.78 + 0.22 * Math.min(1, bph * 3);
    sub *= duck * (0.7 + 0.3 * energy);

    const kb = t % (beat * 2);
    let kick = 0;
    if (kb < 0.13) {
      const ke = Math.exp(-kb * 34);
      const kf = 50 + 58 * Math.exp(-kb * 45);
      kick = Math.sin(TAU * kf * kb) * ke * 0.13 * energy;
    }

    const arpRate = beat / 2;
    const ai = Math.floor(t / arpRate);
    const ap = (t % arpRate) / arpRate;
    const arpSet = arps[ci];
    const note = arpSet[ai % arpSet.length];
    const aenv = Math.exp(-ap * 6) * (ap < 1 ? 1 : 0);
    let arp = Math.sin(TAU * note * t) * aenv * 0.045;
    arp += Math.sin(TAU * note * 2 * t) * aenv * 0.018;
    // arp density gently increases through the middle of the runtime
    const arpGate = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(TAU * (t / 36))) * (0.5 + 0.5 * energy);
    arp *= arpGate;

    const air = noise() * 0.005;

    let mix = pad + sub + kick + arp + air;
    const f = svf(mix, 5000, 0.9);
    mix = mix * 0.6 + f.lp * 0.4;

    M[i] = sat(mix * 1.05) * 0.85;
  }

  applyFades(M, 3.0, 6.0);
  normalize(M, 0.72);

  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const d = (0.009 * SR) | 0;
  for (let i = 0; i < N; i++) {
    const pan = 0.5 + 0.12 * Math.sin(TAU * (i / SR) / 34);
    const dry = M[i];
    const del = i >= d ? M[i - d] : 0;
    L[i] = dry * (1 - (pan - 0.5)) * 0.5 + del * 0.27;
    R[i] = dry * (1 + (pan - 0.5)) * 0.5 + M[i] * 0.05;
  }
  normalize(L, 0.7);
  normalize(R, 0.7);
  const bytes = writeWavStereo(path.join(OUT, "music-bed-longform.wav"), L, R);
  console.log(`music-bed-longform.wav  ${(bytes / 1e6).toFixed(1)} MB (${dur}s @ ${SR}Hz stereo)`);
}

function makeSilentMp3(file, seconds) {
  const FRAME = 417;
  const header = Buffer.from([0xff, 0xfb, 0x90, 0xc0]);
  const samplesPerFrame = 1152;
  const framesN = Math.ceil((seconds * 44100) / samplesPerFrame);
  const buf = Buffer.alloc(framesN * FRAME);
  for (let f = 0; f < framesN; f++) header.copy(buf, f * FRAME);
  fs.writeFileSync(file, buf);
  return buf.length;
}

console.log("Rendering long-form audio…");
makeMusicLongform();
const mp3Bytes = makeSilentMp3(path.join(VO, "voiceover-longform.mp3"), 600);
console.log(`voiceover-longform.mp3 (silent placeholder) ${(mp3Bytes / 1e6).toFixed(2)} MB`);
console.log("Done.");
