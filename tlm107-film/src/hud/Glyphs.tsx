import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// POLAR PATTERNS — one formula for every drawing of them in the film.
//
// A first-order pattern is r(θ) = a + (1 − a)·cos θ. The TLM 107's five:
//   omni a = 1 · wide cardioid a ≈ 0.7 · cardioid a = 0.5
//   hypercardioid a = 0.25 · figure-8 a = 0
// Where r < 0 the lobe is out of polarity (the rear of a figure-8, the small
// rear lobe of a hypercardioid); drawings mark those lobes in red.
// ─────────────────────────────────────────────────────────────────────────────

export const PATTERNS = [
  { key: "omni", a: 1.0, name: "OMNI" },
  { key: "wide", a: 0.7, name: "WIDE CARDIOID" },
  { key: "cardioid", a: 0.5, name: "CARDIOID" },
  { key: "hyper", a: 0.25, name: "HYPERCARDIOID" },
  { key: "fig8", a: 0.0, name: "FIGURE-8" },
] as const;

/** Pattern response at angle θ (radians, 0 = on-axis, pointing UP in drawings). */
export const resp = (a: number, th: number) => a + (1 - a) * Math.cos(th);

/** SVG path of the |r| curve, split in positive and negative lobes. */
export const polarPaths = (a: number, cx: number, cy: number, R: number, n = 180) => {
  let pos = "";
  let neg = "";
  let lastSign = 0;
  for (let i = 0; i <= n; i++) {
    const th = (i / n) * Math.PI * 2;
    const r = resp(a, th);
    const m = Math.abs(r) * R;
    const x = cx + m * Math.sin(th);
    const y = cy - m * Math.cos(th);
    const s = r >= 0 ? 1 : -1;
    if (s > 0) {
      pos += (lastSign === 1 ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    } else {
      neg += (lastSign === -1 ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    lastSign = s;
  }
  return { pos, neg };
};

/** Small pattern icon as engraved on the TLM 107 chrome ring. */
export const Glyph: React.FC<{ a: number; size: number; color: string; glow?: number; stroke?: number; neg?: string }> = ({
  a, size, color, glow = 0, stroke = 1.6, neg,
}) => {
  // fit the curve's true bounding box into the icon (capsule pointing up)
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (let i = 0; i < 96; i++) {
    const th = (i / 96) * Math.PI * 2;
    const m = Math.abs(resp(a, th));
    const x = m * Math.sin(th), y = -m * Math.cos(th);
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  const R = (size * 0.84) / Math.max(x1 - x0, y1 - y0);
  const cx = size / 2 - ((x0 + x1) / 2) * R;
  const cy = size / 2 - ((y0 + y1) / 2) * R;
  const { pos, neg: n } = polarPaths(a, cx, cy, R, 96);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", filter: glow ? `drop-shadow(0 0 ${glow}px ${color})` : undefined }}>
      <path d={pos} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
      {n ? <path d={n} fill="none" stroke={neg ?? color} strokeWidth={stroke} strokeLinejoin="round" /> : null}
    </svg>
  );
};
