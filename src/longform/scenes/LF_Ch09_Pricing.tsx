import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette, hexA } from "../../components/Backgrounds";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE, PRODUCT, RADII } from "../theme";
import { FloatIn } from "../../components/Ui";
import { displayStyle, labelStyle } from "../../fonts";
import { LogoPlate } from "../../components/LogoPlate";
import { LFBrandCorner } from "../components/LFBrand";
import { Cutout } from "../../components/Product";
import { GlowOrb, CornerTicks } from "../../components/Bits";

/** Beat 32 — Price reveal + call to action. */
export const LF32_Price: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={50} glowY={46} />
        <GlowOrb x={1500} y={520} size={680} color={COLORS.champagne} opacity={0.18} seed={4} />
        <Particles seed={97} count={22} opacity={0.2} />
        <Vignette strength={0.55} />
      </AbsoluteFill>
    }
  >
    {/* faint mic to the right */}
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ marginRight: -160, opacity: 0.38 }}>
        <Cutout src={IMG.mountNickelA} height={760} delay={8} floatAmp={8} shadow={false} />
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{ alignItems: "flex-start" }}>
      <div style={{ position: "absolute", top: LF_SPACE.marginTop, left: LF_SPACE.marginX }}>
        <FloatIn delay={4} y={14}>
          <LogoPlate which="neumann" width={280} />
        </FloatIn>
      </div>
    </AbsoluteFill>

    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: LF_SPACE.marginTop,
        paddingBottom: LF_SPACE.bottomPad,
      }}
    >
      <FloatIn delay={14} y={30}>
        <div
          style={{
            marginLeft: LF_SPACE.marginX,
            position: "relative",
            width: 760,
            padding: "48px 52px",
            borderRadius: RADII.card,
            background: `linear-gradient(180deg, ${hexA(COLORS.inkSoft, 0.86)} 0%, ${hexA(COLORS.inkDeep, 0.9)} 100%)`,
            border: `1px solid ${hexA(COLORS.champagne, 0.45)}`,
            boxShadow: `0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 ${hexA(COLORS.champagne, 0.2)}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <CornerTicks inset={20} size={28} color={hexA(COLORS.champagne, 0.7)} />
          <span style={{ ...labelStyle(22, 700, "0.26em"), color: COLORS.champagneSoft }}>
            Market operating price
          </span>
          <div style={{ ...displayStyle(120, 700), color: COLORS.ivory, lineHeight: 0.95 }}>{PRODUCT.price}</div>
          <span style={{ ...labelStyle(24, 600, "0.12em"), color: COLORS.ivoryDim }}>{PRODUCT.priceNote}</span>
          <div style={{ width: 140, height: 2, background: hexA(COLORS.champagne, 0.5), margin: "6px 0" }} />
          <div
            style={{
              alignSelf: "flex-start",
              padding: "18px 34px",
              borderRadius: RADII.chip,
              background: COLORS.red,
              ...labelStyle(24, 700, "0.13em"),
              color: "#fff",
              boxShadow: `0 18px 42px ${hexA(COLORS.red, 0.45)}`,
            }}
          >
            {PRODUCT.cta}
          </div>
        </div>
      </FloatIn>
    </AbsoluteFill>

    <LFBrandCorner mode="logo" appearAt={44} />
  </LFShell>
);
