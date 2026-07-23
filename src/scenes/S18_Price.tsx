import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE, PRODUCT, RADII } from "../theme";
import { FloatIn } from "../components/Ui";
import { displayStyle, labelStyle } from "../fonts";
import { LogoPlate } from "../components/LogoPlate";
import { BrandPlate } from "../components/BrandPlate";
import { Cutout } from "../components/Product";
import { GlowOrb, CornerTicks } from "../components/Bits";

/** Price reveal — premium framed price card. */
export const S18_Price: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={46} />
          <GlowOrb x={340} y={760} size={720} color={COLORS.champagne} opacity={0.18} seed={4} />
          <Particles seed={47} count={22} opacity={0.2} />
          <Vignette strength={0.58} />
        </AbsoluteFill>
      }
    >
      {/* faint mic on right */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -300, marginTop: 60, opacity: 0.4 }}>
          <Cutout src={IMG.mountNickelA} height={1080} delay={8} floatAmp={8} shadow={false} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 130 }}>
          <FloatIn delay={4} y={14}><LogoPlate which="neumann" width={360} /></FloatIn>
        </div>
      </AbsoluteFill>

      {/* price card */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <FloatIn delay={14} y={40}>
          <div
            style={{
              position: "relative",
              width: 880,
              padding: "64px 60px",
              borderRadius: RADII.card,
              background: `linear-gradient(180deg, ${hexA(COLORS.inkSoft, 0.86)} 0%, ${hexA(COLORS.inkDeep, 0.9)} 100%)`,
              border: `1px solid ${hexA(COLORS.champagne, 0.45)}`,
              boxShadow: `0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 ${hexA(COLORS.champagne, 0.2)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <CornerTicks inset={22} size={30} color={hexA(COLORS.champagne, 0.7)} />
            <span style={{ ...labelStyle(26, 700, "0.28em"), color: COLORS.champagneSoft }}>Market operating price</span>
            <div style={{ ...displayStyle(172, 700), color: COLORS.ivory, lineHeight: 0.9 }}>{PRODUCT.price}</div>
            <span style={{ ...labelStyle(30, 600, "0.14em"), color: COLORS.ivoryDim }}>{PRODUCT.priceNote}</span>
            <div style={{ width: 160, height: 2, background: hexA(COLORS.champagne, 0.5), margin: "10px 0" }} />
            <span style={{ ...labelStyle(24, 600, "0.1em"), color: COLORS.champagneSoft }}>Best price on request →</span>
          </div>
        </FloatIn>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={44} logoWidth={300} />
    </Scene>
  );
};
