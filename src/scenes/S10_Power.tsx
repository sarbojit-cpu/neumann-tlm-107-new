import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { SpecTile } from "../components/Bits";
import { CountUp } from "../components/Ui";
import { FramedImage } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

/** Max SPL, dynamic range, frequency range — the headroom spec grid. */
export const S10_Power: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.red} glowX={38} glowY={38} />
          <GlowOrb x={220} y={520} size={620} color={COLORS.red} opacity={0.14} seed={4} />
          <Particles seed={31} count={22} opacity={0.2} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      {/* hero image right */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: SPACE.marginX, marginTop: 120 }}>
          <FramedImage src={IMG.macroNickelGrille} width={470} height={860} delay={14} objectPosition="center" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 168, left: SPACE.marginX }}>
          <SceneHeading eyebrow="Enormous headroom" lines={["Nothing it", { text: "can't handle.", color: COLORS.champagneSoft, italic: true }]} size={96} maxWidth={560} />
        </div>

        <div style={{ position: "absolute", top: 640, left: SPACE.marginX, display: "flex", flexDirection: "column", gap: 26 }}>
          <SpecTile value={<CountUp to={141} dur={30} />} unit="dB" label="Max SPL" delay={22} width={470} />
          <SpecTile value={<CountUp to={131} dur={30} delay={6} />} unit="dB" label="Dynamic range" delay={30} width={470} />
          <SpecTile value={<span style={{ fontSize: 62 }}>20&nbsp;Hz–20&nbsp;kHz</span>} label="Frequency range" delay={38} width={470} />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="linkedin" pos="bottomCenter" appearAt={46} />
    </Scene>
  );
};
