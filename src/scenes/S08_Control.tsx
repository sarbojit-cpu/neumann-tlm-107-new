import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FramedImage, CalloutPin } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

/** Navigation switch, pad and low-cut — total control. */
export const S08_Control: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.steel} glowX={50} glowY={64} />
          <GlowOrb x={520} y={1140} size={620} color={COLORS.champagne} opacity={0.14} seed={8} />
          <Particles seed={23} count={22} opacity={0.2} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 168, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="One switch, everything"
            lines={["Total", { text: "control.", color: COLORS.champagneSoft, italic: true }]}
            size={106}
            support="A single navigation switch sets the pattern, a −6 / −12 dB pad and a low-cut filter — right on the mic."
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      {/* big control macro */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 210, position: "relative" }}>
          <FramedImage src={IMG.controlsNickel} width={900} height={620} delay={12} objectPosition="center" />
        </div>
      </AbsoluteFill>

      <CalloutPin x={140} y={1010} label="Pad" value="0 · −6 · −12 dB" delay={26} side="right" />
      <CalloutPin x={690} y={1010} label="Low-cut" value="Lin · 40 · 100 Hz" delay={32} side="left" />
      <CalloutPin x={430} y={1440} label="Navigation" value="5 patterns" delay={38} side="right" />

      <BrandPlate mode="whatsapp" pos="bottomCenter" appearAt={44} />
    </Scene>
  );
};
