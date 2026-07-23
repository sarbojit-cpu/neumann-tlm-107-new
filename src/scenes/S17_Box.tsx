import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { CheckRow } from "../components/Bits";
import { FramedImage } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";
import { FloatIn } from "../components/Ui";
import { labelStyle, displayStyle } from "../fonts";
import { RADII, PRODUCT } from "../theme";
import { hexA } from "../components/Backgrounds";

/** What's in the Studio Set — kit layout + checklist. */
export const S17_Box: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.champagne}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={30} glowY={40} />
          <GlowOrb x={680} y={900} size={560} color={COLORS.champagne} opacity={0.14} seed={3} />
          <Particles seed={43} count={20} opacity={0.18} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      {/* right column images */}
      <AbsoluteFill style={{ alignItems: "flex-end" }}>
        <div style={{ position: "absolute", right: SPACE.marginX, top: 300, display: "flex", flexDirection: "column", gap: 26 }}>
          <FramedImage src={IMG.boxOpen} width={470} height={420} delay={12} objectPosition="center" />
          <FramedImage src={IMG.mountBlackAlone} width={470} height={420} delay={20} objectPosition="center" />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 168, left: SPACE.marginX }}>
          <SceneHeading eyebrow="The Studio Set" lines={["In the", { text: "box.", color: COLORS.champagneSoft, italic: true }]} size={104} maxWidth={470} />
        </div>
        <div style={{ position: "absolute", top: 700, left: SPACE.marginX, display: "flex", flexDirection: "column", gap: 36, maxWidth: 500 }}>
          <CheckRow delay={22}>TLM 107 microphone</CheckRow>
          <CheckRow delay={28}>EA 4 elastic shock mount</CheckRow>
          <CheckRow delay={34}>Wooden jeweller's box</CheckRow>
          <CheckRow delay={40}>Certificate &amp; manual</CheckRow>
        </div>
      </AbsoluteFill>

      {/* price teaser strip fills the lower third */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <FloatIn delay={48} y={24}>
          <div
            style={{
              marginBottom: 300,
              width: 936,
              padding: "30px 44px",
              borderRadius: RADII.card,
              background: `linear-gradient(180deg, ${hexA(COLORS.inkSoft, 0.8)} 0%, ${hexA(COLORS.inkDeep, 0.9)} 100%)`,
              border: `1px solid ${hexA(COLORS.champagne, 0.4)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ ...labelStyle(22, 700, "0.22em"), color: COLORS.champagneSoft }}>Complete Studio Set</span>
              <span style={{ ...labelStyle(20, 600, "0.1em"), color: COLORS.steel }}>{PRODUCT.priceNote}</span>
            </div>
            <span style={{ ...displayStyle(84, 700), color: COLORS.ivory }}>{PRODUCT.price}</span>
          </div>
        </FloatIn>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={54} logoWidth={290} />
    </Scene>
  );
};
