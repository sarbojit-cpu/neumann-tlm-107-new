import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn } from "../components/Ui";
import { labelStyle } from "../fonts";
import { PolarGlyph, ALL_PATTERNS, PATTERN_LABEL } from "../components/PolarPattern";
import { FramedImage } from "../components/Product";
import { LogoPlate } from "../components/LogoPlate";
import { BrandPlate } from "../components/BrandPlate";
import { ramp, EASE } from "../lib/anim";
import { GlowOrb } from "../components/Bits";

/** Five polar patterns — glyphs draw on in sequence over the controls image. */
export const S07_Patterns: React.FC<SceneProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const glyphSize = 176;
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.champagne}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={44} />
          <GlowOrb x={340} y={760} size={640} color={COLORS.champagne} opacity={0.14} seed={5} />
          <Particles seed={21} count={24} opacity={0.22} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "flex-end" }}>
        <div style={{ position: "absolute", top: 128, right: SPACE.marginX }}>
          <FloatIn delay={6} y={14}><LogoPlate which="neumann" width={320} /></FloatIn>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 300, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Adaptable pickup"
            lines={["Five ways", { text: "to listen.", color: COLORS.champagneSoft, italic: true }]}
            size={104}
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      {/* glyph row */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 680, display: "flex", gap: 12 }}>
          {ALL_PATTERNS.map((pat, i) => {
            const delay = 20 + i * 8;
            const draw = ramp(frame, delay, 22, EASE.out);
            const active = ramp(frame, delay + 4, 12);
            return (
              <div key={pat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: ramp(frame, delay - 6, 10) }}>
                <PolarGlyph pattern={pat} size={glyphSize} draw={draw} active={active} />
                <span style={{ ...labelStyle(19, 700, "0.1em"), color: COLORS.ivoryDim }}>{PATTERN_LABEL[pat]}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* controls image */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 230 }}>
          <FramedImage src={IMG.controlsBlack} width={860} height={400} delay={46} objectPosition="center" />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={64} logoWidth={280} />
    </Scene>
  );
};
