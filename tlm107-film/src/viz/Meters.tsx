import React from "react";
import { C, FONT } from "../theme.ts";
import { clamp, easeInOutCubic, easeOutBack, easeOutCubic, lerp } from "../lib/ease.ts";
import { Mono, Numeral, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// METERS — sound pressure, dynamic range, self-noise, sensitivity.
// Only the TLM 107's own published numbers are marked on these scales.

const Scale: React.FC<{ x: number; y0: number; y1: number; lo: number; hi: number; step: number; label?: number; portrait: boolean; q: number }> = ({ x, y0, y1, lo, hi, step, label = step * 2, portrait, q }) => {
  const Y = (v: number) => lerp(y1, y0, (v - lo) / (hi - lo));
  const ticks = [];
  for (let v = lo; v <= hi + 1e-6; v += step) ticks.push(v);
  return (
    <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: q }}>
      <line x1={x} y1={y0} x2={x} y2={y1} stroke="rgba(230,236,242,0.35)" strokeWidth={1.5} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={x - (v % label === 0 ? 16 : 8)} y1={Y(v)} x2={x} y2={Y(v)} stroke="rgba(230,236,242,0.4)" strokeWidth={1.2} />
          {v % label === 0 ? <text x={x - 24} y={Y(v) + 6} fill="rgba(230,236,242,0.5)" fontFamily={FONT.mono} fontSize={portrait ? 16 : 14} textAnchor="end" letterSpacing={1}>{v}</text> : null}
        </g>
      ))}
      <text x={x - 24} y={y0 - 22} fill="rgba(230,236,242,0.5)" fontFamily={FONT.mono} fontSize={portrait ? 15 : 13} textAnchor="end" letterSpacing={2}>dB SPL</text>
    </svg>
  );
};

const Marker: React.FC<{ x: number; y: number; w: number; label: string; value: string; color: string; q: number; portrait: boolean; big?: boolean }> = ({ x, y, w, label, value, color, q, portrait, big }) => (
  <div style={{ position: "absolute", left: x, top: y - (big ? 40 : 22), opacity: q, transform: `translateX(${(1 - q) * 30}px)`, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: w * q, height: 2, background: color, boxShadow: `0 0 10px ${color}` }} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Numeral size={big ? (portrait ? 84 : 76) : portrait ? 44 : 40} color={color}>{value}</Numeral>
      <Mono size={portrait ? 16 : 14} color="rgba(230,236,242,0.65)">{label}</Mono>
    </div>
  </div>
);

export const SPL: React.FC<VizProps> = ({ f, canvas, opt, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const y0 = b.cy - b.h / 2 + 20, y1 = b.cy + b.h / 2 - 20;
  const sx = b.cx - b.w / 2 + (P ? 150 : 180);
  const lo = 0, hi = 160;
  const Y = (v: number) => lerp(y1, y0, (v - lo) / (hi - lo));
  const q = easeOutCubic(clamp(f / 12));
  const climb = clamp((f - 0.25 * beatF) / (2.75 * beatF));
  let v = lerp(0, 141, easeInOutCubic(climb));
  const pad = opt === "pad";
  const p6 = pad ? easeOutCubic(clamp((f - 5 * beatF) / 10)) : 0;
  const p12 = pad ? easeOutCubic(clamp((f - 7 * beatF) / 10)) : 0;
  v += p6 * 6 + p12 * 6;
  const colW = P ? 90 : 90;
  const lock141 = clamp((f - 3 * beatF) / 8);
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. L" title={pad ? "MAX SPL · TWO-STAGE PAD" : "MAXIMUM SOUND PRESSURE"} note="THD < 0.5 % · PUBLISHED TLM 107 DATA" glow={glow}>
      <Scale x={sx} y0={y0} y1={y1} lo={lo} hi={hi} step={10} label={20} portrait={P} q={q} />
      {/* the column */}
      <div style={{ position: "absolute", left: sx + 30, top: Y(v), width: colW, height: Math.max(0, y1 - Y(v)), background: `linear-gradient(0deg, rgba(221,246,255,0.08) 0%, rgba(221,246,255,0.5) 88%, ${C.led} 100%)`, boxShadow: `0 0 ${24 + 30 * glow}px rgba(190,236,255,0.35)`, borderTop: `3px solid ${C.led}` }} />
      {p6 > 0 ? <div style={{ position: "absolute", left: sx + 30, top: Y(147 + (p12 > 0 ? 6 * p12 : 0)), width: colW, height: Y(141) - Y(147 + 6 * p12), background: `linear-gradient(0deg, rgba(225,38,63,0.25), rgba(255,77,99,0.8))`, borderTop: `3px solid ${C.redHot}` }} /> : null}
      <Marker x={sx + 30 + colW + 10} y={Y(141)} w={P ? 60 : 110} value="141" label="dB SPL · NO PAD" color={C.led} q={lock141} portrait={P} big={!pad} />
      {pad ? <Marker x={sx + 30 + colW + 10} y={Y(147)} w={P ? 60 : 110} value="147" label="dB · −6 dB PAD" color={C.nickel} q={p6} portrait={P} /> : null}
      {pad ? <Marker x={sx + 30 + colW + 10 + (P ? 250 : 300)} y={Y(153)} w={P ? 40 : 80} value="153" label="dB · −12 dB PAD" color={C.redHot} q={p12} portrait={P} big /> : null}
      <div style={{ position: "absolute", left: sx + 30, top: y1 + 14, opacity: q }}>
        <Mono size={P ? 17 : 15} color="rgba(230,236,242,0.55)">{Math.round(v)} dB</Mono>
      </div>
    </VizShell>
  );
};

export const Range: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const y0 = b.cy - b.h / 2 + 20, y1 = b.cy + b.h / 2 - 20;
  const sx = b.cx - b.w / 2 + (P ? 150 : 180);
  const Y = (v: number) => lerp(y1, y0, v / 160);
  const q = easeOutCubic(clamp(f / 12));
  const br = easeInOutCubic(clamp((f - beatF) / (2 * beatF)));
  const n = Math.round(lerp(0, 131, br));
  const bx = sx + 90;
  const top = lerp(Y(10), Y(141), br);
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. D" title="DYNAMIC RANGE" note="SELF-NOISE 10 dB-A · MAX SPL 141 dB · PUBLISHED TLM 107 DATA" glow={glow}>
      <Scale x={sx} y0={y0} y1={y1} lo={0} hi={160} step={10} label={20} portrait={P} q={q} />
      <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={sx} y1={Y(10)} x2={bx + 30} y2={Y(10)} stroke={C.gold} strokeWidth={2} opacity={q} />
        <line x1={sx} y1={Y(141)} x2={bx + 30} y2={Y(141)} stroke={C.led} strokeWidth={2} opacity={br} />
        <path d={`M ${bx} ${Y(10)} L ${bx + 22} ${Y(10)} L ${bx + 22} ${top} L ${bx} ${top}`} fill="none" stroke={C.led} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${C.ledGlow})` }} />
        <rect x={bx + 26} y={top} width={60} height={Y(10) - top} fill="rgba(221,246,255,0.08)" />
      </svg>
      <div style={{ position: "absolute", left: bx + 110, top: lerp(Y(10), Y(75.5), br) - 60, opacity: q }}>
        <Numeral size={P ? 150 : 140} color={C.nickel}>{n}</Numeral>
        <div><Mono size={P ? 22 : 19} color={C.led} weight={700}>dB DYNAMIC RANGE</Mono></div>
      </div>
      <div style={{ position: "absolute", left: bx + 110, top: Y(10) - 14, opacity: q }}><Mono size={P ? 16 : 14} color={C.gold}>10 dB-A · SELF-NOISE</Mono></div>
      <div style={{ position: "absolute", left: bx + 110, top: Y(141) - 14, opacity: br }}><Mono size={P ? 16 : 14} color={C.led}>141 dB · MAX SPL</Mono></div>
    </VizShell>
  );
};

export const NoiseFloor: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const y0 = b.cy - b.h / 2 + 30, y1 = b.cy + b.h / 2 - 20;
  const sx = b.cx - b.w / 2 + (P ? 150 : 200);
  const lo = 0, hi = 60;
  const Y = (v: number) => lerp(y1, y0, (v - lo) / (hi - lo));
  const q = easeOutCubic(clamp(f / 10));
  const d = easeInOutCubic(clamp((f - beatF) / (1.6 * beatF)));
  const v = lerp(55, 10, d);
  const right = b.cx + b.w / 2 - 40;
  // a living noise trace at the current floor
  let path = "";
  for (let i = 0; i <= 80; i++) {
    const x = lerp(sx + 30, right, i / 80);
    const n = Math.sin(i * 1.7 + f * 0.9) * 0.6 + Math.sin(i * 0.63 + f * 0.37) * 0.8 + Math.sin(i * 3.1 - f * 1.3) * 0.4;
    path += (i ? "L" : "M") + x.toFixed(1) + " " + (Y(v) + n * 5).toFixed(1) + " ";
  }
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. N" title="SELF-NOISE · A-WEIGHTED" note="STUDIO BAND SHOWN AS TYPICAL · TLM 107: 10 dB-A PUBLISHED" glow={glow}>
      <Scale x={sx} y0={y0} y1={y1} lo={lo} hi={hi} step={5} label={10} portrait={P} q={q} />
      <div style={{ position: "absolute", left: sx + 30, right: canvas.w - right, top: Y(30), height: Y(20) - Y(30), background: "repeating-linear-gradient(135deg, rgba(230,236,242,0.10) 0 8px, rgba(230,236,242,0.02) 8px 16px)", borderTop: "1px dashed rgba(230,236,242,0.4)", borderBottom: "1px dashed rgba(230,236,242,0.4)", opacity: q }}>
        <div style={{ position: "absolute", right: 14, top: -30 }}><Mono size={P ? 16 : 14} color="rgba(230,236,242,0.7)">A VERY QUIET STUDIO</Mono></div>
      </div>
      <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={path} fill="none" stroke={C.gold} strokeWidth={3} style={{ filter: `drop-shadow(0 0 ${8 + 8 * glow}px ${C.gold})` }} opacity={q} />
      </svg>
      <div style={{ position: "absolute", left: sx + 60, top: Y(v) + 24, opacity: q }}>
        <Numeral size={P ? 110 : 96} color={C.gold}>{v.toFixed(0)}</Numeral>
        <Mono size={P ? 22 : 19} color={C.gold} weight={700} style={{ marginLeft: 14 }}>dB-A</Mono>
        <div><Mono size={P ? 17 : 15} color="rgba(230,236,242,0.7)">TLM 107 SELF-NOISE</Mono></div>
      </div>
    </VizShell>
  );
};

export const Sens: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const cx = b.cx, cy = b.cy + (P ? 120 : 150);
  const R = P ? 360 : 330;
  const q = easeOutCubic(clamp(f / 12));
  const swing = clamp((f - beatF) / 24);
  const val = lerp(0, 11, easeOutBack(swing, 1.8));
  const ang = (v: number) => lerp(-60, 60, v / 20);
  const na = (ang(val) * Math.PI) / 180;
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. M" title="SENSITIVITY · 1 kHz INTO 1 kΩ" note="PUBLISHED TLM 107 DATA" glow={glow}>
      <svg width={2000} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: q }}>
        <defs>
          <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(221,246,255,0.10)" />
            <stop offset="1" stopColor="rgba(221,246,255,0)" />
          </linearGradient>
        </defs>
        <path d={`M ${cx + Math.sin(-Math.PI / 3) * R} ${cy - Math.cos(Math.PI / 3) * R} A ${R} ${R} 0 0 1 ${cx + Math.sin(Math.PI / 3) * R} ${cy - Math.cos(Math.PI / 3) * R}`} fill="none" stroke="rgba(230,236,242,0.5)" strokeWidth={2} />
        <path d={`M ${cx} ${cy} L ${cx + Math.sin(-Math.PI / 3) * R * 1.08} ${cy - Math.cos(Math.PI / 3) * R * 1.08} A ${R * 1.08} ${R * 1.08} 0 0 1 ${cx + Math.sin(Math.PI / 3) * R * 1.08} ${cy - Math.cos(Math.PI / 3) * R * 1.08} Z`} fill="url(#face)" />
        {Array.from({ length: 21 }).map((_, v) => {
          const a = (ang(v) * Math.PI) / 180;
          const big = v % 5 === 0;
          return (
            <g key={v}>
              <line x1={cx + Math.sin(a) * (R - (big ? 26 : 14))} y1={cy - Math.cos(a) * (R - (big ? 26 : 14))} x2={cx + Math.sin(a) * R} y2={cy - Math.cos(a) * R} stroke={v === 11 ? C.redHot : "rgba(230,236,242,0.6)"} strokeWidth={big || v === 11 ? 2.4 : 1.2} />
              {big ? <text x={cx + Math.sin(a) * (R + 30)} y={cy - Math.cos(a) * (R + 30) + 6} fill="rgba(230,236,242,0.6)" fontFamily={FONT.mono} fontSize={P ? 18 : 16} textAnchor="middle">{v}</text> : null}
            </g>
          );
        })}
        <line x1={cx} y1={cy} x2={cx + Math.sin(na) * R * 0.96} y2={cy - Math.cos(na) * R * 0.96} stroke={C.redHot} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${8 + 8 * glow}px ${C.red})` }} />
        <circle cx={cx} cy={cy} r={16} fill="#20242b" stroke="rgba(230,236,242,0.6)" strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy + 40, textAlign: "center", opacity: q }}>
        <Numeral size={P ? 120 : 104} color={C.nickel}>{val.toFixed(swing >= 1 ? 0 : 1)}</Numeral>
        <div><Mono size={P ? 22 : 19} color={C.led} weight={700}>mV / Pa</Mono></div>
      </div>
    </VizShell>
  );
};
