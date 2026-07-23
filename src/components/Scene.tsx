import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { EASE, ramp } from "../lib/anim";
import { hexA } from "./Backgrounds";

export type Enter = "rise" | "scaleIn" | "pushUp" | "pushLeft" | "pushRight" | "fade";
export type Sweep = "none" | "line" | "lineDown" | "barsUp";

/**
 * Scene shell. The background layer is rendered untransformed and full-bleed so
 * every cut is seamless (no black gaps / pops). The content layer gets a varied
 * kinetic entrance + a gentle exit, which — paired with the rotating transition
 * SFX — gives the "kinetic transition" feel while keeping exact per-scene timing.
 */
export const Scene: React.FC<{
  bg?: React.ReactNode;
  enter?: Enter;
  sweep?: Sweep;
  sweepColor?: string;
  enterDur?: number;
  exit?: boolean;
  children: React.ReactNode;
}> = ({
  bg,
  enter = "rise",
  sweep = "none",
  sweepColor = COLORS.champagne,
  enterDur = 16,
  exit = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const inP = ramp(frame, 0, enterDur, EASE.out);
  const outP = exit ? ramp(frame, durationInFrames - 12, 12, EASE.in) : 0;

  const style = enterTransform(enter, inP, outP);

  return (
    <AbsoluteFill>
      {bg && <AbsoluteFill>{bg}</AbsoluteFill>}
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {sweep !== "none" && <SweepOverlay kind={sweep} color={sweepColor} />}
    </AbsoluteFill>
  );
};

function enterTransform(enter: Enter, inP: number, outP: number): React.CSSProperties {
  const opacity = inP * (1 - outP * 0.9);
  const eout = 1 - inP;
  switch (enter) {
    case "scaleIn":
      return {
        opacity,
        transform: `scale(${1.1 - 0.1 * inP - 0.03 * outP})`,
      };
    case "pushUp":
      return {
        opacity,
        transform: `translateY(${eout * 120 - outP * 40}px)`,
      };
    case "pushLeft":
      return {
        opacity,
        transform: `translateX(${eout * 160 - outP * 60}px)`,
      };
    case "pushRight":
      return {
        opacity,
        transform: `translateX(${-eout * 160 + outP * 60}px)`,
      };
    case "fade":
      return { opacity };
    case "rise":
    default:
      return {
        opacity,
        transform: `translateY(${eout * 46 - outP * 34}px) scale(${1 - 0.02 * eout})`,
      };
  }
}

const SweepOverlay: React.FC<{ kind: Sweep; color: string }> = ({ kind, color }) => {
  const frame = useCurrentFrame();
  if (kind === "line" || kind === "lineDown") {
    // A bright hairline that sweeps across, leaving the scene revealed.
    const p = ramp(frame, 0, 18, EASE.inOut);
    const vertical = kind === "line";
    const pos = p * 100;
    return (
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 1 - ramp(frame, 12, 8) }}>
        <div
          style={{
            position: "absolute",
            ...(vertical
              ? { top: 0, bottom: 0, left: `${pos}%`, width: 4 }
              : { left: 0, right: 0, top: `${pos}%`, height: 4 }),
            background: `linear-gradient(${vertical ? "180deg" : "90deg"}, ${hexA(
              color,
              0
            )}, ${color}, ${hexA(color, 0)})`,
            boxShadow: `0 0 40px ${color}`,
          }}
        />
      </AbsoluteFill>
    );
  }
  if (kind === "barsUp") {
    const cols = 5;
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: cols }).map((_, i) => {
          const p = ramp(frame, i * 2, 14, EASE.inOut);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i / cols) * 100}%`,
                width: `${100 / cols}%`,
                top: 0,
                bottom: 0,
                background: COLORS.ink,
                transform: `translateY(${p * -110}%)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }
  return null;
};
