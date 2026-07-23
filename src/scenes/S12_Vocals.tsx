import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, Chip } from "../components/Ui";
import { FramedImage } from "../components/Product";
import { LogoPlate } from "../components/LogoPlate";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

/** Vocals & voiceover use-case. */
export const S12_Vocals: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={34} glowY={40} />
          <GlowOrb x={720} y={780} size={620} color={COLORS.champagne} opacity={0.14} seed={5} />
          <Particles seed={33} count={22} opacity={0.2} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: SPACE.marginX, marginTop: 60 }}>
          <FramedImage src={IMG.nickelOnStand} width={470} height={720} delay={12} objectPosition="center" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 128, left: SPACE.marginX }}>
          <FloatIn delay={4} y={14}><LogoPlate which="neumann" width={300} /></FloatIn>
        </div>
        <div style={{ position: "absolute", top: 420, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Made for the voice"
            lines={["For every", { text: "voice.", color: COLORS.champagneSoft, italic: true }]}
            size={102}
            support="From intimate lead vocals to broadcast-ready voiceover — the TLM 107 flatters detail without harshness."
            maxWidth={520}
          />
        </div>
        <div style={{ position: "absolute", top: 1080, left: SPACE.marginX, display: "flex", flexWrap: "wrap", gap: 18, maxWidth: 520 }}>
          {["Lead Vocals", "Voiceover", "Rap", "Narration"].map((c, i) => (
            <FloatIn key={c} delay={30 + i * 5} y={16}><Chip tone="dark">{c}</Chip></FloatIn>
          ))}
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={46} logoWidth={290} />
    </Scene>
  );
};
