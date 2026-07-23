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
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

/** Made in Germany craftsmanship — badge + connector macros. */
export const S05_Craft: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.red}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.red} glowX={50} glowY={26} />
          <GlowOrb x={540} y={300} size={620} color={COLORS.red} opacity={0.16} seed={2} />
          <Particles seed={7} count={26} opacity={0.24} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 168, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Precision built"
            lines={["Made in", { text: "Germany.", color: COLORS.champagneSoft, italic: true }]}
            size={108}
            support="Hand-assembled to a legendary standard — from the machined body and enamel Neumann badge to the gold-plated XLR contacts."
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      {/* two macros side by side */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 640, display: "flex", gap: 28 }}>
          <FramedImage src={IMG.macroBadgeDark} width={470} height={560} delay={12} objectPosition="center" />
          <FramedImage src={IMG.macroNickelXlr} width={470} height={560} delay={20} objectPosition="center" />
        </div>
      </AbsoluteFill>

      {/* spec chips fill the lower third */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 1290, display: "flex", gap: 18 }}>
          {["Enamel badge", "Gold XLR", "Made in Germany"].map((c, i) => (
            <FloatIn key={c} delay={30 + i * 5} y={14}><Chip tone="dark" size={24}>{c}</Chip></FloatIn>
          ))}
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={44} logoWidth={300} />
    </Scene>
  );
};
