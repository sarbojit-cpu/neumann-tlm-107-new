import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, Chip } from "../components/Ui";
import { Cutout } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

/** Podcast & broadcast use-case. */
export const S13_Podcast: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.champagne}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.steel} glowX={66} glowY={44} />
          <GlowOrb x={220} y={760} size={620} color={COLORS.champagne} opacity={0.12} seed={6} />
          <Particles seed={37} count={20} opacity={0.2} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -360, marginTop: 40 }}>
          <Cutout src={IMG.mountNickelA} height={900} delay={10} floatAmp={11} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 240, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="On air, every day"
            lines={["Built for", { text: "broadcast.", color: COLORS.champagneSoft, italic: true }]}
            size={100}
            support="A podcast studio's dream — rich, present tone that cuts through, with the reliability of a Neumann."
            maxWidth={460}
          />
        </div>
        <div style={{ position: "absolute", top: 960, left: SPACE.marginX, display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 470 }}>
          {["Podcasting", "Broadcast", "Streaming", "Interviews"].map((c, i) => (
            <FloatIn key={c} delay={30 + i * 5} y={16}><Chip tone="red" size={25}>{c}</Chip></FloatIn>
          ))}
        </div>
      </AbsoluteFill>

      <BrandPlate mode="youtube" pos="bottomCenter" appearAt={44} />
    </Scene>
  );
};
