import React from "react";
import { C, FONT } from "../theme.ts";
import { clamp, easeInOutCubic, easeOutCubic, lerp } from "../lib/ease.ts";
import { Glyph, PATTERNS, polarPaths, resp } from "../hud/Glyphs.tsx";
import { Mono, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// POLAR RESPONSE — the pattern, and what it does to the room.
//
// Four sources sit around the capsule (the voice on-axis, the room at the
// sides, the monitor behind). Each reads its real pickup for the current
// pattern, in dB: a cardioid nulls the monitor, a figure-8 nulls the sides,
// a hypercardioid's rear lobe comes back reversed in polarity (red).

const A_OF: Record<string, number> = { omni: 1, wide: 0.7, cardioid: 0.5, hyper: 0.25, fig8: 0 };
const NAME: Record<string, string> = { omni: "OMNIDIRECTIONAL", wide: "WIDE CARDIOID", cardioid: "CARDIOID", hyper: "HYPERCARDIOID", fig8: "FIGURE-8" };

// Portrait geometry: plot radius, plot centre below the box centre, formula line below its default.
const P_R = 245, P_DY = 35, P_NOTE_DY = 18;

const db = (r: number) => (Math.abs(r) < 0.02 ? "NULL" : `${(20 * Math.log10(Math.abs(r))).toFixed(1)} dB`);

const PolarPlot: React.FC<{ a: number; cx: number; cy: number; R: number; draw: number; f: number; glow: number; portrait: boolean }> = ({ a, cx, cy, R, draw, f, glow, portrait }) => {
  const { pos, neg } = polarPaths(a, cx, cy, R * draw, 240);
  const rings = [0.25, 0.5, 0.75, 1];
  const labels: Record<number, string> = { 1: "0 dB", 0.5: "−6", 0.25: "−12" };
  const sources = [
    { ang: 0, label: "VOICE" },
    { ang: 90, label: "ROOM" },
    { ang: 180, label: "MONITOR" },
    { ang: 270, label: "ROOM" },
  ];
  const fs = portrait ? 17 : 15;
  return (
    <svg width={cx * 2 + 800} height={cy * 2 + 400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="pfill" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(221,246,255,0.26)" />
          <stop offset="1" stopColor="rgba(221,246,255,0.06)" />
        </radialGradient>
      </defs>
      {rings.map((r) => (
        <g key={r}>
          <circle cx={cx} cy={cy} r={R * r} fill="none" stroke="rgba(230,236,242,0.16)" strokeWidth={r === 1 ? 1.6 : 1} strokeDasharray={r === 1 ? undefined : "4 8"} />
          {labels[r] && !(portrait && r === 1) ? <text x={cx + 8} y={cy - R * r + 18} fill="rgba(230,236,242,0.45)" fontFamily={FONT.mono} fontSize={fs - 3} letterSpacing={2}>{labels[r]}</text> : null}
        </g>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.sin(t) * R} y2={cy - Math.cos(t) * R} stroke="rgba(230,236,242,0.08)" strokeWidth={1} />;
      })}
      {!portrait && ["0°", "90°", "180°", "270°"].map((l, i) => {
        const t = (i * Math.PI) / 2;
        return (
          <text key={l} x={cx + Math.sin(t) * (R + 34)} y={cy - Math.cos(t) * (R + 34) + 6} fill="rgba(230,236,242,0.5)" fontFamily={FONT.mono} fontSize={fs - 2} textAnchor="middle" letterSpacing={2}>
            {l}
          </text>
        );
      })}
      {/* the pattern */}
      <path d={pos + "Z"} fill="url(#pfill)" stroke="none" opacity={draw} />
      <path d={pos} fill="none" stroke={C.led} strokeWidth={4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 ${8 + 10 * glow}px ${C.ledGlow})` }} />
      {neg ? <path d={neg + "Z"} fill="rgba(225,38,63,0.14)" stroke={C.redHot} strokeWidth={3.2} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }} /> : null}
      {/* capsule, seen from above */}
      <circle cx={cx} cy={cy} r={16} fill="#1b1f26" stroke={C.gold} strokeWidth={3} />
      <path d={`M ${cx} ${cy - 30} L ${cx - 8} ${cy - 18} L ${cx + 8} ${cy - 18} Z`} fill={C.gold} />
      {/* sources */}
      {sources.map((s, i) => {
        const t = (s.ang * Math.PI) / 180;
        const r = resp(a, t);
        const lvl = Math.abs(r);
        const d = R * (portrait ? 1.24 : 1.34);
        const x = cx + Math.sin(t) * d;
        const y = cy - Math.cos(t) * d;
        const col = r < -0.02 ? C.redHot : C.led;
        const side = portrait && (s.ang === 0 || s.ang === 180);
        const wave = (k: number) => {
          const ph = ((f / 22 + k / 3) % 1);
          return <circle key={k} cx={x} cy={y} r={portrait ? 13 + ph * 19 : 14 + ph * 34} fill="none" stroke={col} strokeWidth={2} opacity={(1 - ph) * 0.5 * (0.25 + 0.75 * lvl) * draw} />;
        };
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={cx + Math.sin(t) * (R * 1.04)} y2={cy - Math.cos(t) * (R * 1.04)} stroke={col} strokeWidth={1.5} strokeDasharray="3 7" opacity={0.25 + 0.6 * lvl} />
            {[0, 1, 2].map(wave)}
            <circle cx={x} cy={y} r={11} fill={lvl < 0.02 ? "rgba(255,255,255,0.12)" : col} opacity={0.35 + 0.65 * lvl} style={{ filter: lvl > 0.05 ? `drop-shadow(0 0 ${10 * lvl}px ${col})` : undefined }} />
            <text x={x + (side ? 46 : 0)} y={y + (side ? -5 : s.ang === 180 ? 52 : s.ang === 0 ? -34 : 48)} fill="rgba(230,236,242,0.8)" fontFamily={FONT.mono} fontSize={fs} textAnchor={side ? "start" : "middle"} letterSpacing={3}>{s.label}</text>
            <text x={x + (side ? 46 : 0)} y={y + (side ? 20 : s.ang === 180 ? 76 : s.ang === 0 ? -58 : 72)} fill={lvl < 0.02 ? "rgba(230,236,242,0.45)" : col} fontFamily={FONT.mono} fontSize={fs + 2} fontWeight={700} textAnchor={side ? "start" : "middle"} letterSpacing={2}>
              {db(r)}{r < -0.02 ? " ⟲" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const Polar: React.FC<VizProps> = ({ f, dur, canvas, opt, glow, beatF }) => {
  const b = plotBox(canvas);
  const R = canvas.portrait ? P_R : 250;
  const draw = easeOutCubic(clamp(f / 22));
  let a = A_OF[opt ?? "cardioid"] ?? 0.5;
  let name = NAME[opt ?? "cardioid"] ?? "CARDIOID";
  if (opt === "widehyper") {
    const m = easeInOutCubic(clamp((f - dur * 0.45) / (beatF * 1.2)));
    a = lerp(0.7, 0.25, m);
    name = m < 0.5 ? "WIDE CARDIOID" : "HYPERCARDIOID";
  }
  const cur = PATTERNS.reduce((best, p, i) => (Math.abs(p.a - a) < Math.abs(PATTERNS[best].a - a) ? i : best), 0);
  const cy = b.cy + (canvas.portrait ? P_DY : 30);
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. P" title={`POLAR RESPONSE · ${name}`} note="FIRST-ORDER MODEL · r(θ) = a + (1 − a)·cos θ" noteDy={canvas.portrait ? P_NOTE_DY : 0} glow={glow}>
      <PolarPlot a={a} cx={b.cx} cy={cy} R={R} draw={draw} f={f} glow={glow} portrait={canvas.portrait} />
      <div style={{ position: "absolute", left: b.cx - b.w / 2, top: b.cy - b.h / 2 - 10, display: "flex", gap: 14 }}>
        {PATTERNS.map((p, i) => (
          <div key={p.key} style={{ opacity: i === cur ? 1 : 0.35 }}>
            <Glyph a={p.a} size={canvas.portrait ? 40 : 34} color={i === cur ? C.led : "rgba(230,236,242,0.7)"} glow={i === cur ? 8 : 0} stroke={i === cur ? 2.6 : 1.8} neg={C.redHot} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: b.cx - b.w / 2, top: b.cy - b.h / 2 + (canvas.portrait ? 44 : 40) }}>
        <Mono size={canvas.portrait ? 18 : 16} color="rgba(230,236,242,0.6)">a = {a.toFixed(2)}</Mono>
      </div>
    </VizShell>
  );
};

/** All five in one breath — a morph through omni → figure-8 on the beat. */
export const Polar5: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const R = canvas.portrait ? P_R : 250;
  const step = beatF * 1.4;
  const t0 = beatF * 0.5;
  const k = clamp((f - t0) / step, 0, 4.999);
  const i = Math.floor(k);
  const m = easeInOutCubic(clamp((k - i) * 3));
  const a = i >= 4 ? 0 : lerp(PATTERNS[i].a, PATTERNS[Math.min(4, i + 1)].a, f < t0 ? 0 : m);
  const cur = Math.round(k);
  const draw = easeOutCubic(clamp(f / 18));
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. 5" title="FIVE PATTERNS · ONE CAPSULE" note="FIRST-ORDER MODEL · r(θ) = a + (1 − a)·cos θ" noteDy={canvas.portrait ? P_NOTE_DY : 0} glow={glow}>
      <PolarPlot a={a} cx={b.cx} cy={b.cy + (canvas.portrait ? P_DY : 30)} R={R} draw={draw} f={f} glow={glow} portrait={canvas.portrait} />
      <div style={{ position: "absolute", left: b.cx - b.w / 2, top: b.cy - b.h / 2 - 10, display: "flex", gap: 14, alignItems: "center" }}>
        {PATTERNS.map((p, j) => (
          <div key={p.key} style={{ opacity: j <= cur ? 1 : 0.3, transform: `scale(${j === cur ? 1.15 : 1})` }}>
            <Glyph a={p.a} size={canvas.portrait ? 40 : 34} color={j === cur ? C.led : "rgba(230,236,242,0.75)"} glow={j === cur ? 9 : 0} stroke={2.2} neg={C.redHot} />
          </div>
        ))}
        <Mono size={canvas.portrait ? 20 : 17} color={C.led} weight={700} style={{ marginLeft: 12 }}>{PATTERNS[Math.min(4, cur)].name}</Mono>
      </div>
    </VizShell>
  );
};
