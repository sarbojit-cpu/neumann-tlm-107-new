import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { particles } from "../lib/rng";

/** Full-frame charcoal base with a soft warm radial glow that drifts. */
export const DarkBase: React.FC<{
  glow?: string;
  glowX?: number;
  glowY?: number;
  seed?: number;
}> = ({ glow = COLORS.champagne, glowX = 50, glowY = 38, seed = 7 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90 + seed) * 3;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at ${glowX + drift}% ${glowY}%, ${hexA(
          glow,
          0.16
        )} 0%, ${hexA(glow, 0.04)} 34%, rgba(0,0,0,0) 62%), linear-gradient(180deg, ${
          COLORS.inkSoft
        } 0%, ${COLORS.ink} 46%, ${COLORS.inkDeep} 100%)`,
      }}
    />
  );
};

/** Warm ivory base for lighter scenes. */
export const LightBase: React.FC<{ tint?: string }> = ({
  tint = COLORS.champagne,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 100) * 2.5;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 70% at ${50 + drift}% 30%, ${hexA(
          tint,
          0.14
        )} 0%, rgba(0,0,0,0) 55%), linear-gradient(180deg, ${COLORS.paper} 0%, #EFE9DC 60%, #E4DCCB 100%)`,
      }}
    />
  );
};

/** Subtle film grain — hides banding, adds a premium texture. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const shift = (frame % 6) * 13;
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundPosition: `${shift}px ${shift}px`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Cinematic vignette. */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 100% at 50% 44%, rgba(0,0,0,0) 52%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Drifting dust particles for depth on dark scenes. */
export const Particles: React.FC<{
  seed?: number;
  count?: number;
  color?: string;
  opacity?: number;
}> = ({ seed = 11, count = 46, color = COLORS.champagneSoft, opacity = 0.5 }) => {
  const frame = useCurrentFrame();
  const ps = particles(seed, count, 1080, 1920);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {ps.map((p, i) => {
        const y = (p.y - frame * p.s * 0.55) % 1920;
        const yy = y < 0 ? y + 1920 : y;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 20 + p.p));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: yy,
              width: p.r,
              height: p.r,
              borderRadius: "50%",
              background: color,
              opacity: opacity * tw,
              filter: "blur(0.3px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Faint moving chevron field (Neumann motion motif). */
export const ChevronField: React.FC<{ color?: string; opacity?: number }> = ({
  color = COLORS.ivory,
  opacity = 0.04,
}) => {
  const frame = useCurrentFrame();
  const rows = 9;
  const cols = 6;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const x = 60 + c * 190 + ((frame * 0.6 + r * 40) % 190);
          const y = 120 + r * 210;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: x % 1080,
                top: y,
                color,
                fontSize: 26,
                fontWeight: 800,
                transform: "skewX(-6deg)",
              }}
            >
              »
            </div>
          );
        })
      )}
    </AbsoluteFill>
  );
};

export function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
