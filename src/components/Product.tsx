import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { COLORS, RADII } from "../theme";
import { CornerTicks } from "./Bits";
import { hexA } from "./Backgrounds";
import { ramp, EASE } from "../lib/anim";

/** A transparent product cutout that floats gently with a soft contact shadow. */
export const Cutout: React.FC<{
  src: string;
  height: number;
  delay?: number;
  floatAmp?: number;
  rotate?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
  enterScale?: number;
}> = ({ src, height, delay = 0, floatAmp = 12, rotate = 0, shadow = true, style, enterScale = 0.9 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, 22, EASE.out);
  const bob = Math.sin(frame / 26) * floatAmp;
  const sc = enterScale + (1 - enterScale) * p;
  return (
    <div style={{ position: "relative", opacity: p, ...style }}>
      <Img
        src={src}
        style={{
          height,
          width: "auto",
          transform: `translateY(${bob}px) rotate(${rotate}deg) scale(${sc})`,
          filter: `drop-shadow(0 40px 60px rgba(0,0,0,0.55))`,
          willChange: "transform",
        }}
      />
    </div>
  );
};

/** A JPG image seated inside a premium rounded card with hairline + corner ticks. */
export const FramedImage: React.FC<{
  src: string;
  width: number;
  height: number;
  delay?: number;
  objectPosition?: string;
  ticks?: boolean;
  zoomFrom?: number;
  zoomTo?: number;
  radius?: number;
  border?: string;
  style?: React.CSSProperties;
  panX?: number;
  panY?: number;
}> = ({
  src,
  width,
  height,
  delay = 0,
  objectPosition = "center",
  ticks = true,
  zoomFrom = 1.12,
  zoomTo = 1.24,
  radius = RADII.card,
  border = COLORS.line,
  style,
  panX = 0,
  panY = 0,
}) => {
  const frame = useCurrentFrame();
  const inP = ramp(frame, delay, 20, EASE.out);
  const life = ramp(frame, delay, 240, EASE.inOut);
  const scale = zoomFrom + (zoomTo - zoomFrom) * life;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        border: `1px solid ${border}`,
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
        opacity: inP,
        transform: `translateY(${(1 - inP) * 30}px)`,
        ...style,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale}) translate(${panX * life}px, ${panY * life}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${hexA(COLORS.ink, 0)} 60%, ${hexA(COLORS.ink, 0.5)} 100%)`,
        }}
      />
      {ticks && <CornerTicks inset={16} size={26} color={hexA(COLORS.champagne, 0.8)} />}
    </div>
  );
};

/** Bracketed number tag for spec / capsule callouts pointing at an image. */
export const CalloutPin: React.FC<{
  x: number;
  y: number;
  label: string;
  value: string;
  delay?: number;
  side?: "left" | "right";
}> = ({ x, y, label, value, delay = 0, side = "right" }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, 16, EASE.out);
  const lineW = 90 * p;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", flexDirection: side === "left" ? "row-reverse" : "row", gap: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.champagne, boxShadow: `0 0 14px ${COLORS.champagne}` }} />
        <div style={{ width: lineW, height: 2, background: COLORS.champagne }} />
        <div
          style={{
            padding: "12px 20px",
            background: hexA(COLORS.ink, 0.72),
            border: `1px solid ${hexA(COLORS.champagne, 0.4)}`,
            borderRadius: 12,
            backdropFilter: "blur(6px)",
            transform: `translateX(${side === "left" ? -8 : 8}px)`,
          }}
        >
          <div style={{ fontFamily: "Archivo", fontSize: 17, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.champagneSoft, fontWeight: 700 }}>{label}</div>
          <div style={{ fontFamily: "Archivo", fontSize: 27, color: COLORS.ivory, fontWeight: 600 }}>{value}</div>
        </div>
      </div>
    </div>
  );
};
