import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { hexA } from "./Backgrounds";

/** Row of reactive audio bars. `quiet` shrinks amplitude (for the self-noise beat). */
export const WaveBars: React.FC<{
  count?: number;
  width: number;
  height: number;
  color?: string;
  quiet?: number; // 0..1 amplitude scaler
  seed?: number;
}> = ({ count = 42, width, height, color = COLORS.champagne, quiet = 1, seed = 3 }) => {
  const frame = useCurrentFrame();
  const bw = width / count;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: count }).map((_, i) => {
        const phase = i * 0.5 + seed;
        const base =
          0.5 +
          0.5 *
            Math.sin(frame / 6 + phase) *
            Math.sin(frame / 17 + phase * 0.6) *
            Math.cos(frame / 9 + i);
        const h = Math.max(3, Math.abs(base) * height * 0.9 * quiet + 3);
        return (
          <rect
            key={i}
            x={i * bw + bw * 0.2}
            y={(height - h) / 2}
            width={bw * 0.6}
            height={h}
            rx={bw * 0.3}
            fill={color}
            opacity={0.5 + 0.5 * Math.abs(base)}
          />
        );
      })}
    </svg>
  );
};

/** A continuous scrolling waveform line. */
export const WaveLine: React.FC<{
  width: number;
  height: number;
  color?: string;
  amp?: number;
  strokeWidth?: number;
}> = ({ width, height, color = COLORS.champagne, amp = 1, strokeWidth = 3 }) => {
  const frame = useCurrentFrame();
  const N = 120;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * width;
    const env = Math.sin((i / N) * Math.PI); // taper ends
    const y =
      height / 2 +
      env *
        amp *
        (height / 2.4) *
        (Math.sin(i * 0.35 + frame / 5) * 0.6 + Math.sin(i * 0.12 - frame / 8) * 0.4);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
};

/**
 * A stylised frequency-response curve — flat with a gentle presence lift above
 * ~8 kHz, echoing the TLM 107's natural, detailed character. Draws on over time.
 */
export const FreqCurve: React.FC<{
  width: number;
  height: number;
  color?: string;
  progress?: number; // 0..1 draw-on
}> = ({ width, height, color = COLORS.champagne, progress = 1 }) => {
  const N = 100;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * width;
    const f = i / N;
    // mostly flat, subtle dip low, gentle presence bump 0.7..0.95, soft top roll-off
    const bump = Math.exp(-Math.pow((f - 0.82) / 0.12, 2)) * 0.5;
    const low = -Math.exp(-Math.pow(f / 0.06, 2)) * 0.25;
    const roll = -Math.max(0, f - 0.95) * 3;
    const y = height * (0.55 - (bump + low + roll) * 0.36);
    pts.push([x, y]);
  }
  const shown = Math.max(1, Math.floor(N * progress));
  let d = "";
  for (let i = 0; i <= shown; i++) d += (i === 0 ? "M" : "L") + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1) + " ";
  const area = d + `L ${pts[shown][0].toFixed(1)} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hexA(color, 0.32)} />
          <stop offset="1" stopColor={hexA(color, 0)} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={0} y1={height * g} x2={width} y2={height * g} stroke={hexA(COLORS.ivory, 0.08)} strokeWidth={1} />
      ))}
      <path d={area} fill="url(#fc)" />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
