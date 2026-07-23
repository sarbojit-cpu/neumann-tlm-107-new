import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette, ChevronField } from "../components/Backgrounds";
import { KenBurns } from "../components/KenBurns";
import { IMG } from "../assets";
import { COLORS, SPACE, PRODUCT } from "../theme";
import { FloatIn, Tag } from "../components/Ui";
import { displayStyle, labelStyle } from "../fonts";
import { LogoPlate } from "../components/LogoPlate";
import { BrandPlate } from "../components/BrandPlate";
import { Cutout } from "../components/Product";
import { GlowOrb, Watermark } from "../components/Bits";

/** Product reveal + first Neumann brand moment + title lockup (centered hero). */
export const S02_Reveal: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.champagne}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={54} />
          <KenBurns src={IMG.macroGrilleDark} from={1.15} to={1.32} panY={-30} duration={270} style={{ opacity: 0.24 }} />
          <GlowOrb x={340} y={820} size={760} color={COLORS.champagne} opacity={0.2} seed={4} />
          <Watermark top={880} size={520} rotate={0}>107</Watermark>
          <Particles seed={9} count={32} opacity={0.32} />
          <ChevronField opacity={0.045} />
          <Vignette strength={0.6} />
        </AbsoluteFill>
      }
    >
      {/* Mic cutout centered */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: 180 }}>
        <Cutout src={IMG.mountBlackB} height={1040} delay={6} floatAmp={13} />
      </AbsoluteFill>

      {/* Neumann brand plate — top */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 116 }}>
          <FloatIn delay={4} y={18}>
            <LogoPlate which="neumann" width={440} />
          </FloatIn>
        </div>
      </AbsoluteFill>

      {/* Title lockup */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <FloatIn delay={16} y={30}>
            <div style={{ ...labelStyle(30, 700, "0.5em"), color: COLORS.amber, marginBottom: 10, paddingLeft: "0.5em" }}>Introducing</div>
          </FloatIn>
          <FloatIn delay={22} y={40}>
            <div style={{ ...displayStyle(210, 700), color: COLORS.ivory, letterSpacing: "-0.03em" }}>
              TLM <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>107</span>
            </div>
          </FloatIn>
        </div>

        <div style={{ position: "absolute", top: 1548, display: "flex", alignItems: "center", gap: 22 }}>
          <FloatIn delay={36} y={16}>
            <Tag bg={COLORS.red}>{PRODUCT.set}</Tag>
          </FloatIn>
          <FloatIn delay={42} y={16}>
            <span style={{ ...labelStyle(27, 600, "0.14em"), color: COLORS.ivoryDim }}>Large-diaphragm condenser</span>
          </FloatIn>
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={44} logoWidth={300} />
    </Scene>
  );
};
