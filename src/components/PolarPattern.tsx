import React from "react";
import { COLORS } from "../theme";
import { LABEL } from "../fonts";
import { hexA } from "./Backgrounds";

export type Pattern = "omni" | "wide" | "cardioid" | "hyper" | "fig8";

export const PATTERN_LABEL: Record<Pattern, string> = {
  omni: "Omni",
  wide: "Wide",
  cardioid: "Cardioid",
  hyper: "Hyper",
  fig8: "Figure-8",
};

const rFn: Record<Pattern, (t: number) => number> = {
  omni: () => 1,
  wide: (t) => 0.58 + 0.42 * Math.cos(t),
  cardioid: (t) => (1 + Math.cos(t)) / 2,
  hyper: (t) => Math.max(Math.abs(0.34 + 0.66 * Math.cos(t)), 0.02),
  fig8: (t) => Math.max(Math.abs(Math.cos(t)), 0.02),
};

function polarPath(pattern: Pattern, radius: number, cx: number, cy: number): string {
  const N = 160;
  const fn = rFn[pattern];
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const rr = fn(t) * radius;
    // front (t=0) points up
    const a = t - Math.PI / 2;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  return d + "Z";
}

/**
 * A single polar-pattern plot on a subtle grid, with a stroke draw-on
 * controlled by `draw` (0..1) and an `active` highlight.
 */
export const PolarGlyph: React.FC<{
  pattern: Pattern;
  size: number;
  draw?: number; // 0..1 path draw progress
  active?: number; // 0..1 highlight
  stroke?: string;
  showGrid?: boolean;
}> = ({ pattern, size, draw = 1, active = 1, stroke = COLORS.champagne, showGrid = true }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.4;
  const path = polarPath(pattern, R, cx, cy);
  const perim = size * 3.4; // approx for dash
  const col = active > 0.5 ? stroke : COLORS.steelDim;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {showGrid && (
        <g stroke={hexA(COLORS.ivory, 0.14)} strokeWidth={1} fill="none">
          <circle cx={cx} cy={cy} r={R} />
          <circle cx={cx} cy={cy} r={R * 0.66} />
          <circle cx={cx} cy={cy} r={R * 0.33} />
          <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} />
          <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} />
        </g>
      )}
      <path
        d={path}
        fill={hexA(stroke, 0.14 * active)}
        stroke={col}
        strokeWidth={active > 0.5 ? 3.4 : 2.2}
        strokeDasharray={perim}
        strokeDashoffset={perim * (1 - draw)}
        style={{ filter: active > 0.5 ? `drop-shadow(0 0 12px ${hexA(stroke, 0.5)})` : "none" }}
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Simple line-icon glyph (matches the on-mic ring icons) for compact callouts. */
export const PatternIcon: React.FC<{ pattern: Pattern; size: number; color?: string }> = ({
  pattern,
  size,
  color = COLORS.ivory,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <PolarGlyph pattern={pattern} size={size} draw={1} active={1} stroke={color} showGrid={false} />
    <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size * 0.13, letterSpacing: "0.12em", textTransform: "uppercase", color }}>
      {PATTERN_LABEL[pattern]}
    </span>
  </div>
);

export const ALL_PATTERNS: Pattern[] = ["omni", "wide", "cardioid", "hyper", "fig8"];
