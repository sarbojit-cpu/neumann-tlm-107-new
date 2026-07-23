import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE, RADII } from "../theme";
import { FloatIn } from "../components/Ui";
import { labelStyle } from "../fonts";
import { SceneHeading } from "../components/Heading";
import { BrandPlate } from "../components/BrandPlate";
import { Cutout } from "../components/Product";
import { GlowOrb } from "../components/Bits";

const FinishPill: React.FC<{ text: string; delay: number; color: string }> = ({ text, delay, color }) => (
  <FloatIn delay={delay} y={14}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 30px",
        borderRadius: RADII.chip,
        background: hexA(COLORS.inkDeep, 0.82),
        border: `1px solid ${hexA(color, 0.5)}`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, boxShadow: `0 0 14px ${color}` }} />
      <span style={{ ...labelStyle(28, 700, "0.2em"), color: COLORS.ivory }}>{text}</span>
    </div>
  </FloatIn>
);

/** Black & Nickel finishes, staggered dual cutouts. */
export const S03_Finishes: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.steel} glowX={50} glowY={58} />
          <GlowOrb x={120} y={900} size={620} color={COLORS.champagne} opacity={0.16} seed={3} />
          <GlowOrb x={660} y={1040} size={560} color={COLORS.steel} opacity={0.14} seed={6} />
          <Particles seed={13} count={30} opacity={0.26} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 150, left: SPACE.marginX }}>
          <SceneHeading eyebrow="Choose your finish" lines={["Black", { text: "& Nickel.", color: COLORS.champagneSoft, italic: true }]} size={110} support="One microphone, two timeless looks — the same honest, natural sound in either." maxWidth={900} />
        </div>
      </AbsoluteFill>

      {/* staggered cutouts — raised to fill the middle */}
      <AbsoluteFill>
        <div style={{ position: "absolute", left: -70, top: 560 }}>
          <Cutout src={IMG.mountBlackB} height={720} delay={8} rotate={-3} floatAmp={10} />
        </div>
        <div style={{ position: "absolute", right: -110, top: 660 }}>
          <Cutout src={IMG.mountNickelB} height={720} delay={16} rotate={3} floatAmp={11} />
        </div>
      </AbsoluteFill>

      {/* labels in clear space below mics */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 1520, display: "flex", gap: 40 }}>
          <FinishPill text="Matte Black" delay={26} color={COLORS.ivory} />
          <FinishPill text="Nickel" delay={30} color={COLORS.champagneSoft} />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="website" pos="bottomCenter" appearAt={40} />
    </Scene>
  );
};
