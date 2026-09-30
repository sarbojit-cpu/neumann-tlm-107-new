import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, type Canvas } from "../theme.ts";
import { clamp, easeOutCubic } from "../lib/ease.ts";

// Shared ground for every technical visualisation: graphite, the head-grille
// dot lattice, a cool key from above, and a figure slate.

export type VizProps = { f: number; dur: number; canvas: Canvas; opt: string | null; glow: number; beatF: number; bass: number };

/** The plot region: clear of the HUD and of the caption lockup. */
export const plotBox = (c: Canvas) =>
  c.portrait ? { cx: c.w / 2, cy: 690, w: 960, h: 720 } : { cx: 1320, cy: 500, w: 980, h: 740 };

export const VizShell: React.FC<{ canvas: Canvas; f: number; fig: string; title: string; note?: string; noteDy?: number; glow?: number; children: React.ReactNode }> = ({
  canvas, f, fig, title, note, noteDy = 0, glow = 0, children,
}) => {
  const b = plotBox(canvas);
  const q = easeOutCubic(clamp(f / 14));
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 20%, ${C.slate} 0%, ${C.graphite} 40%, ${C.night} 75%, ${C.ink} 100%)` }} />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(circle, rgba(221,246,255,0.075) 1.3px, transparent 1.6px)",
          backgroundSize: "26px 26px",
          backgroundPosition: `${(f * 0.2) % 26}px 0px`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 55% 45%, rgba(10,12,16,0) 30%, ${C.night} 88%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 40% at ${(b.cx / canvas.w) * 100}% ${(b.cy / canvas.h) * 100}%, rgba(190,236,255,${0.05 + 0.05 * glow}) 0%, rgba(190,236,255,0) 70%)` }} />
      <div
        style={{
          position: "absolute", left: b.cx - b.w / 2, top: b.cy - b.h / 2 - (canvas.portrait ? 64 : 58), display: "flex", alignItems: "center", gap: 14,
          fontFamily: FONT.mono, fontSize: canvas.portrait ? 19 : 17, letterSpacing: 4, color: "rgba(230,236,242,0.78)", opacity: q,
        }}
      >
        <span style={{ color: C.red }}>◆</span>
        <span style={{ fontWeight: 700 }}>{fig}</span>
        <span style={{ width: 60 * q, height: 1.5, background: "rgba(230,236,242,0.5)" }} />
        <span>{title}</span>
      </div>
      {children}
      {note ? (
        <div style={{ position: "absolute", right: canvas.w - (b.cx + b.w / 2), top: b.cy + b.h / 2 + 18 + noteDy, textAlign: "right", fontFamily: FONT.mono, fontSize: canvas.portrait ? 15 : 13, letterSpacing: 3, color: "rgba(230,236,242,0.42)", opacity: q }}>
          {note}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Mono: React.FC<{ size: number; color?: string; weight?: number; ls?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ size, color = "rgba(230,236,242,0.85)", weight = 500, ls = 3, style, children }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: size, color, fontWeight: weight, letterSpacing: ls, ...style }}>{children}</span>
);

/** Big technical numeral: Anybody at a wide, heavy setting. */
export const Numeral: React.FC<{ size: number; children: React.ReactNode; color?: string; wdth?: number; style?: React.CSSProperties }> = ({ size, children, color = C.nickel, wdth = 112, style }) => (
  <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" ${wdth}, "wght" 760`, fontSize: size, lineHeight: 0.9, color, letterSpacing: -size * 0.01, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>
);

export const Led: React.FC<{ on: number; size?: number; color?: string }> = ({ on, size = 12, color = C.led }) => (
  <div style={{ width: size, height: size, borderRadius: size, background: on > 0.05 ? color : "rgba(255,255,255,0.12)", opacity: 0.35 + 0.65 * on, boxShadow: on > 0.05 ? `0 0 ${10 * on}px ${color}, 0 0 ${22 * on}px ${color}` : "inset 0 1px 2px rgba(0,0,0,0.6)" }} />
);
