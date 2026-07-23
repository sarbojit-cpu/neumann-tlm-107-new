import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, RADII } from "../theme";
import { LABEL, DISPLAY, labelStyle } from "../fonts";
import { hexA } from "./Backgrounds";
import { FloatIn } from "./Ui";

/** Corner registration ticks — a technical framing motif. */
export const CornerTicks: React.FC<{
  inset?: number;
  size?: number;
  color?: string;
  which?: ("tl" | "tr" | "bl" | "br")[];
}> = ({ inset = 0, size = 34, color = COLORS.champagne, which = ["tl", "tr", "bl", "br"] }) => {
  const L = size;
  const s: React.CSSProperties = { position: "absolute", stroke: color, strokeWidth: 3, fill: "none" };
  return (
    <>
      {which.includes("tl") && (
        <svg style={{ ...s, left: inset, top: inset }} width={L} height={L}>
          <path d={`M0 ${L} L0 0 L${L} 0`} />
        </svg>
      )}
      {which.includes("tr") && (
        <svg style={{ ...s, right: inset, top: inset }} width={L} height={L}>
          <path d={`M0 0 L${L} 0 L${L} ${L}`} />
        </svg>
      )}
      {which.includes("bl") && (
        <svg style={{ ...s, left: inset, bottom: inset }} width={L} height={L}>
          <path d={`M0 0 L0 ${L} L${L} ${L}`} />
        </svg>
      )}
      {which.includes("br") && (
        <svg style={{ ...s, right: inset, bottom: inset }} width={L} height={L}>
          <path d={`M${L} 0 L${L} ${L} L0 ${L}`} />
        </svg>
      )}
    </>
  );
};

/** Soft elliptical contact shadow under a floating product cutout. */
export const FloorShadow: React.FC<{
  width: number;
  y: number;
  x?: number;
  opacity?: number;
}> = ({ width, y, x = 0, opacity = 0.5 }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: y,
      transform: `translateX(-50%) translateX(${x}px)`,
      width,
      height: width * 0.16,
      borderRadius: "50%",
      background: `radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
      filter: "blur(6px)",
    }}
  />
);

/** A blurred colored glow orb for depth. */
export const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
  drift?: number;
  seed?: number;
}> = ({ x, y, size, color, opacity = 0.5, drift = 20, seed = 1 }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 80 + seed) * drift;
  const dy = Math.cos(frame / 95 + seed) * drift;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(50% 50% at 50% 50%, ${hexA(color, opacity)} 0%, ${hexA(color, 0)} 70%)`,
        filter: "blur(30px)",
        pointerEvents: "none",
      }}
    />
  );
};

/** Big stat tile: value + unit + label. */
export const SpecTile: React.FC<{
  value: React.ReactNode;
  unit?: string;
  label: string;
  delay?: number;
  accent?: string;
  width?: number;
  align?: "left" | "center";
}> = ({ value, unit, label, delay = 0, accent = COLORS.champagne, width, align = "left" }) => (
  <FloatIn delay={delay} y={30}>
    <div
      style={{
        width,
        padding: "30px 34px",
        borderRadius: RADII.card,
        background: `linear-gradient(180deg, ${hexA(COLORS.ivory, 0.06)} 0%, ${hexA(COLORS.ivory, 0.02)} 100%)`,
        border: `1px solid ${COLORS.line}`,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 92, color: COLORS.ivory, lineHeight: 0.9, letterSpacing: "-0.02em" }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 40, color: accent }}>{unit}</span>
        )}
      </div>
      <span style={{ ...labelStyle(22, 700, "0.2em"), color: COLORS.ivoryDim }}>{label}</span>
    </div>
  </FloatIn>
);

/** Thin checklist row (for the Studio Set contents). */
export const CheckRow: React.FC<{ children: React.ReactNode; delay?: number; accent?: string }> = ({
  children,
  delay = 0,
  accent = COLORS.champagne,
}) => (
  <FloatIn delay={delay} x={-24} y={0}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={34} height={34} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="none" stroke={accent} strokeWidth="1.6" />
        <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 34, color: COLORS.ivory, letterSpacing: "0.01em" }}>
        {children}
      </span>
    </div>
  </FloatIn>
);

/** Faint oversized watermark word behind content. */
export const Watermark: React.FC<{ children: React.ReactNode; size?: number; color?: string; top?: number; rotate?: number }> = ({
  children,
  size = 300,
  color = hexA(COLORS.ivory, 0.035),
  top = 200,
  rotate = 0,
}) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        letterSpacing: "-0.03em",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);
