import React from "react";
import { C, FONT } from "../theme.ts";
import { clamp, easeInOutCubic, easeOutCubic, lerp } from "../lib/ease.ts";
import { Glyph, PATTERNS } from "../hud/Glyphs.tsx";
import { Led, Mono, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// FREQUENCY PLOTS — 20 Hz to 20 kHz on a log axis.
// The curves are illustrative shapes (labelled as such): a second-order
// high-pass at the TLM 107's two low-cut corners, and five near-identical
// responses standing for "balanced in every pattern".

const FMIN = 20, FMAX = 20000;
const GRID = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const lab = (f: number) => (f >= 1000 ? `${f / 1000}k` : `${f}`);

const hp = (f: number, fc: number) => {
  const w = f / fc;
  return 20 * Math.log10((w * w) / Math.sqrt((1 - w * w) ** 2 + (w / 0.707) ** 2));
};

const Axes: React.FC<{ x0: number; y0: number; w: number; h: number; dbLo: number; dbHi: number; portrait: boolean; q: number }> = ({ x0, y0, w, h, dbLo, dbHi, portrait, q }) => {
  const X = (f: number) => x0 + (Math.log10(f / FMIN) / Math.log10(FMAX / FMIN)) * w;
  const Y = (d: number) => y0 + ((dbHi - d) / (dbHi - dbLo)) * h;
  const dbs = [];
  for (let d = dbHi; d >= dbLo; d -= 10) dbs.push(d);
  return (
    <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: q }}>
      <rect x={x0} y={y0} width={w} height={h} fill="rgba(255,255,255,0.015)" stroke="rgba(230,236,242,0.25)" strokeWidth={1.2} />
      {GRID.map((g) => (
        <g key={g}>
          <line x1={X(g)} y1={y0} x2={X(g)} y2={y0 + h} stroke="rgba(230,236,242,0.10)" strokeWidth={1} />
          <text x={X(g)} y={y0 + h + (portrait ? 30 : 26)} fill="rgba(230,236,242,0.5)" fontFamily={FONT.mono} fontSize={portrait ? 16 : 14} textAnchor="middle">{lab(g)}</text>
        </g>
      ))}
      {dbs.map((d) => (
        <g key={d}>
          <line x1={x0} y1={Y(d)} x2={x0 + w} y2={Y(d)} stroke={d === 0 ? "rgba(230,236,242,0.3)" : "rgba(230,236,242,0.08)"} strokeWidth={1} />
          <text x={x0 - 14} y={Y(d) + 5} fill="rgba(230,236,242,0.5)" fontFamily={FONT.mono} fontSize={portrait ? 15 : 13} textAnchor="end">{d > 0 ? `+${d}` : d}</text>
        </g>
      ))}
      <text x={x0 + w} y={y0 + h + (portrait ? 58 : 50)} fill="rgba(230,236,242,0.45)" fontFamily={FONT.mono} fontSize={portrait ? 15 : 13} textAnchor="end" letterSpacing={2}>Hz</text>
      <text x={x0 - 14} y={y0 - 16} fill="rgba(230,236,242,0.45)" fontFamily={FONT.mono} fontSize={portrait ? 15 : 13} textAnchor="end" letterSpacing={2}>dB</text>
    </svg>
  );
};

const curve = (fn: (f: number) => number, x0: number, y0: number, w: number, h: number, lo: number, hi: number, upto = 1) => {
  let d = "";
  const N = 220;
  for (let i = 0; i <= N * upto; i++) {
    const u = i / N;
    const f = FMIN * Math.pow(FMAX / FMIN, u);
    const v = Math.max(lo, Math.min(hi, fn(f)));
    d += (i ? "L" : "M") + (x0 + u * w).toFixed(1) + " " + (y0 + ((hi - v) / (hi - lo)) * h).toFixed(1) + " ";
  }
  return d;
};

export const LowCut: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const w = P ? 760 : 900, h = P ? 520 : 520;
  const x0 = b.cx - w / 2 + (P ? 40 : 30), y0 = b.cy - h / 2 + 20;
  const lo = -30, hi = 10;
  const q = easeOutCubic(clamp(f / 12));
  const s40 = easeInOutCubic(clamp((f - 2 * beatF) / 14));
  const s100 = easeInOutCubic(clamp((f - 5 * beatF) / 14));
  const mode = s100 > 0.5 ? 2 : s40 > 0.5 ? 1 : 0;
  const fc = mode === 2 ? lerp(40, 100, s100) : 40;
  const amt = mode === 0 ? s40 : 1;
  const fn = (fr: number) => amt * hp(fr, fc) + 0;
  const X = (fr: number) => x0 + (Math.log10(fr / FMIN) / Math.log10(FMAX / FMIN)) * w;
  const fs = P ? 17 : 15;
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. H" title="LOW-CUT FILTER · LIN / 40 Hz / 100 Hz" note="ILLUSTRATIVE FILTER SHAPES · CORNERS AS PUBLISHED" glow={glow}>
      <Axes x0={x0} y0={y0} w={w} h={h} dbLo={lo} dbHi={hi} portrait={P} q={q} />
      <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={curve(() => 0, x0, y0, w, h, lo, hi)} fill="none" stroke="rgba(230,236,242,0.25)" strokeWidth={2} strokeDasharray="6 8" opacity={q} />
        <path d={curve(fn, x0, y0, w, h, lo, hi)} fill="none" stroke={C.led} strokeWidth={4} style={{ filter: `drop-shadow(0 0 ${8 + 8 * glow}px ${C.ledGlow})` }} opacity={q} />
        {/* the double bass open E */}
        <line x1={X(41.2)} y1={y0} x2={X(41.2)} y2={y0 + h} stroke={C.gold} strokeWidth={2} strokeDasharray="3 6" opacity={s40} />
        <text x={X(41.2) + 10} y={y0 + 30} fill={C.gold} fontFamily={FONT.mono} fontSize={fs} opacity={s40} letterSpacing={2}>41 Hz · DOUBLE BASS, OPEN E</text>
        <rect x={X(85)} y={y0} width={X(300) - X(85)} height={h} fill="rgba(225,38,63,0.07)" opacity={s100} />
        <text x={X(110)} y={y0 + 64} fill={C.redHot} fontFamily={FONT.mono} fontSize={fs} opacity={s100} letterSpacing={2}>100 Hz · VOICE & SPEECH</text>
      </svg>
      <div style={{ position: "absolute", left: x0 + w - (P ? 330 : 360), top: y0 + h - (P ? 150 : 140), display: "flex", flexDirection: "column", gap: 14, opacity: q }}>
        {["lin", "40 Hz", "100 Hz"].map((l, i) => (
          <div key={l} style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Led on={mode === i ? 1 : 0} size={14} />
            <Mono size={fs + 1} color={mode === i ? C.led : "rgba(230,236,242,0.5)"} weight={mode === i ? 700 : 500}>{l}</Mono>
          </div>
        ))}
      </div>
    </VizShell>
  );
};

export const Freq: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const w = P ? 760 : 900, h = P ? 440 : 440;
  const x0 = b.cx - w / 2 + (P ? 40 : 30), y0 = b.cy - h / 2 + 30;
  const lo = -20, hi = 10;
  const q = easeOutCubic(clamp(f / 12));
  const draw = easeInOutCubic(clamp((f - 0.5 * beatF) / 72));
  const fr = FMIN * Math.pow(FMAX / FMIN, draw);
  const shapes = PATTERNS.map((p, i) => (x: number) => {
    const lf = -6 * Math.exp(-((Math.log10(x) - Math.log10(18)) ** 2) / 0.02);
    const pres = 1.0 * Math.exp(-((Math.log10(x) - Math.log10(9000)) ** 2) / 0.05) * (0.6 + 0.1 * i);
    const hfroll = -8 * Math.max(0, Math.log10(x / 17000)) * 4;
    return lf + pres + hfroll + (i - 2) * 0.35 * Math.sin(Math.log10(x) * 3);
  });
  const X = (fq: number) => x0 + (Math.log10(fq / FMIN) / Math.log10(FMAX / FMIN)) * w;
  const Yv = (v: number) => y0 + ((hi - v) / (hi - lo)) * h;
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. F" title="FREQUENCY RESPONSE · ALL FIVE PATTERNS" note="ILLUSTRATIVE · 20 Hz – 20 kHz AS PUBLISHED" glow={glow}>
      <Axes x0={x0} y0={y0} w={w} h={h} dbLo={lo} dbHi={hi} portrait={P} q={q} />
      <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {shapes.map((fn, i) => (
          <path key={i} d={curve(fn, x0, y0, w, h, lo, hi, draw)} fill="none" stroke={i === 2 ? C.led : `rgba(221,246,255,${0.28 + i * 0.06})`} strokeWidth={i === 2 ? 4 : 2} style={i === 2 ? { filter: `drop-shadow(0 0 ${8 + 8 * glow}px ${C.ledGlow})` } : undefined} />
        ))}
        {draw > 0 && draw < 1 ? (
          <g>
            <line x1={X(fr)} y1={y0} x2={X(fr)} y2={y0 + h} stroke={C.redHot} strokeWidth={1.5} opacity={0.7} />
            <circle cx={X(fr)} cy={Yv(shapes[2](fr))} r={8} fill={C.redHot} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }} />
          </g>
        ) : null}
      </svg>
      <div style={{ position: "absolute", left: x0, top: y0 + h + (P ? 70 : 64), display: "flex", gap: 22, alignItems: "center", opacity: q }}>
        {PATTERNS.map((p) => (
          <Glyph key={p.key} a={p.a} size={P ? 34 : 30} color={C.led} stroke={2} glow={4} neg={C.redHot} />
        ))}
        <Mono size={P ? 19 : 17} color={C.led} weight={700}>{draw < 1 ? `${fr >= 1000 ? (fr / 1000).toFixed(1) + " kHz" : Math.round(fr) + " Hz"}` : "20 Hz – 20 kHz"}</Mono>
      </div>
    </VizShell>
  );
};
