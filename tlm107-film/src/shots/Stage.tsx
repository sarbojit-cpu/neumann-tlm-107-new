import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme.ts";
import { hash } from "../lib/ease.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE STAGE — where every cut-out product is lit.
//
// A graphite cyclorama with a cool key from above, a faint red bounce from the
// badge side, a reflective floor, a slow chrome ring behind the product (the
// TLM 107's pattern ring, blown up to set scale) and a few motes of dust in the
// key light. The stage moves at a fraction of the product's camera move, so
// every orbit and crane has real parallax.
// ─────────────────────────────────────────────────────────────────────────────

export const Stage: React.FC<{
  w: number; h: number; f: number; px: number; py: number; floorY: number; glow: number; tint?: "cool" | "warm" | "red";
}> = ({ w, h, f, px, py, floorY, glow, tint = "cool" }) => {
  const key = tint === "warm" ? "rgba(255,226,186," : tint === "red" ? "rgba(255,120,140," : "rgba(196,232,255,";
  const ringR = Math.min(w, h) * 0.42;
  const rot = f * 0.12;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${px * 0.3}%, ${py * 0.3}%) scale(1.08)`,
          background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${C.slate} 0%, ${C.graphite} 38%, ${C.night} 70%, ${C.ink} 100%)`,
        }}
      />
      {/* key light cone */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 62% at 50% 8%, ${key}${0.2 + 0.1 * glow}) 0%, ${key}0.05) 45%, ${key}0) 70%)`,
          transform: `translateX(${px * 0.15}%)`,
        }}
      />
      {/* red bounce, low right */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 40% 30% at 88% 86%, rgba(225,38,63,${0.1 + 0.08 * glow}) 0%, rgba(225,38,63,0) 70%)` }} />
      {/* the chrome ring */}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, transform: `translate(${px * 0.45}%, ${py * 0.45}%)`, opacity: 0.55 }}>
        <defs>
          <linearGradient id="stageRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="0.5" stopColor="rgba(140,150,165,0.08)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.28)" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${rot} ${w / 2} ${h * 0.46})`}>
          <circle cx={w / 2} cy={h * 0.46} r={ringR} fill="none" stroke="url(#stageRing)" strokeWidth={2} />
          <circle cx={w / 2} cy={h * 0.46} r={ringR * 1.06} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="2 10" />
          {Array.from({ length: 72 }).map((_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r0 = ringR * (i % 6 === 0 ? 0.955 : 0.975);
            return (
              <line key={i} x1={w / 2 + Math.sin(a) * r0} y1={h * 0.46 - Math.cos(a) * r0} x2={w / 2 + Math.sin(a) * ringR} y2={h * 0.46 - Math.cos(a) * ringR}
                stroke={i % 6 === 0 ? "rgba(221,246,255,0.45)" : "rgba(255,255,255,0.14)"} strokeWidth={i % 6 === 0 ? 1.6 : 1} />
            );
          })}
        </g>
      </svg>
      {/* floor */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: floorY, bottom: 0,
          background: "linear-gradient(180deg, rgba(40,46,56,0.55) 0%, rgba(10,12,16,0.9) 45%, #040506 100%)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div style={{ position: "absolute", left: "10%", right: "10%", top: floorY - 1, height: 2, background: "linear-gradient(90deg, transparent, rgba(221,246,255,0.35), transparent)" }} />
      {/* dust in the key */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = hash(i + 1) * w;
        const y0 = hash(i + 50) * h * 0.8;
        const y = (y0 - f * (0.25 + hash(i + 9) * 0.5)) % (h * 0.8);
        const s = 1.5 + hash(i + 3) * 3;
        return (
          <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 40 + i) * 12, top: (y + h * 0.8) % (h * 0.8), width: s, height: s, borderRadius: s, background: "rgba(230,245,255,0.8)", opacity: 0.12 + 0.3 * hash(i + 7) }} />
        );
      })}
    </AbsoluteFill>
  );
};
