import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, RADII } from "../theme";
import { LABEL, DISPLAY, labelStyle } from "../fonts";
import { EASE, ramp } from "../lib/anim";
import { hexA } from "./Backgrounds";

/** Slide+fade entrance, optionally with exit. */
export const FloatIn: React.FC<{
  delay?: number;
  dur?: number;
  y?: number;
  x?: number;
  scale?: number;
  exitAt?: number;
  exitDur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  delay = 0,
  dur = 18,
  y = 26,
  x = 0,
  scale = 1,
  exitAt,
  exitDur = 14,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const inP = ramp(frame, delay, dur, EASE.out);
  let outP = 1;
  if (exitAt !== undefined) {
    outP = 1 - ramp(frame, exitAt, exitDur, EASE.in);
  }
  const op = inP * outP;
  const ty = (1 - inP) * y + (1 - outP) * -y * 0.6;
  const tx = (1 - inP) * x;
  const sc = scale + (1 - inP) * (1 - scale);
  return (
    <div
      style={{
        opacity: op,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Eyebrow label with leading chevrons — the Neumann motion motif. */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  color?: string;
  accent?: string;
  size?: number;
  delay?: number;
}> = ({
  children,
  color = COLORS.ivory,
  accent = COLORS.amber,
  size = 24,
  delay = 0,
}) => (
  <FloatIn delay={delay} y={12}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ color: accent, fontSize: size + 4, fontWeight: 900, letterSpacing: "-2px" }}>
        »»
      </span>
      <span style={{ ...labelStyle(size, 700, "0.32em"), color }}>{children}</span>
    </div>
  </FloatIn>
);

/** Small hairline divider. */
export const Rule: React.FC<{ w?: number; color?: string; style?: React.CSSProperties }> = ({
  w = 120,
  color = COLORS.champagne,
  style,
}) => (
  <div
    style={{
      width: w,
      height: 3,
      background: `linear-gradient(90deg, ${color}, ${hexA(color, 0)})`,
      borderRadius: 2,
      ...style,
    }}
  />
);

/** A pill chip for use-cases / tags. */
export const Chip: React.FC<{
  children: React.ReactNode;
  tone?: "dark" | "light" | "red";
  size?: number;
}> = ({ children, tone = "dark", size = 27 }) => {
  const styles: Record<string, React.CSSProperties> = {
    dark: {
      background: hexA(COLORS.ivory, 0.06),
      border: `1px solid ${COLORS.lineStrong}`,
      color: COLORS.ivory,
    },
    light: {
      background: COLORS.paper,
      border: "1px solid rgba(0,0,0,0.08)",
      color: COLORS.ink,
    },
    red: {
      background: hexA(COLORS.red, 0.16),
      border: `1px solid ${hexA(COLORS.redBright, 0.5)}`,
      color: "#FFD9DC",
    },
  };
  return (
    <span
      style={{
        ...labelStyle(size, 600, "0.14em"),
        ...styles[tone],
        padding: "16px 30px",
        borderRadius: RADII.chip,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        backdropFilter: "blur(6px)",
      }}
    >
      {children}
    </span>
  );
};

/** Animated count-up number (specs). */
export const CountUp: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  dur?: number;
  decimals?: number;
  style?: React.CSSProperties;
  prefix?: string;
  suffix?: string;
}> = ({ to, from = 0, delay = 0, dur = 30, decimals = 0, style, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.out,
  });
  const v = from + (to - from) * p;
  return (
    <span style={{ fontFamily: DISPLAY, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** Vertical stack helper. */
export const Stack: React.FC<{
  gap?: number;
  align?: React.CSSProperties["alignItems"];
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ gap = 20, align = "flex-start", children, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, alignItems: align, ...style }}>
    {children}
  </div>
);

/** Redacted-look kicker badge (e.g. "STUDIO SET"). */
export const Tag: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({
  children,
  bg = COLORS.red,
  color = "#fff",
}) => (
  <span
    style={{
      ...labelStyle(22, 700, "0.28em"),
      background: bg,
      color,
      padding: "10px 20px",
      borderRadius: 8,
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

export { LABEL, DISPLAY };
