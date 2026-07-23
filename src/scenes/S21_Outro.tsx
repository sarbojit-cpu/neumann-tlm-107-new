import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE, PRODUCT, BRAND, RADII } from "../theme";
import { FloatIn } from "../components/Ui";
import { displayStyle, labelStyle } from "../fonts";
import { LogoPlate } from "../components/LogoPlate";
import { GlowOrb } from "../components/Bits";

/** Final brand lockup — both logos, product, price recap + CTA. */
export const S21_Outro: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.champagne}
      exit={false}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={40} />
          <KenBurns src={IMG.macroGrilleDark} from={1.3} to={1.5} panY={-20} duration={240} style={{ opacity: 0.2 }} />
          <GlowOrb x={340} y={760} size={760} color={COLORS.champagne} opacity={0.16} seed={4} />
          <Particles seed={59} count={26} opacity={0.22} />
          <Vignette strength={0.6} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "center", padding: `0 ${SPACE.marginX}px` }}>
        {/* eyebrow */}
        <div style={{ position: "absolute", top: 150 }}>
          <FloatIn delay={6} y={16}>
            <div style={{ ...labelStyle(28, 700, "0.4em"), color: COLORS.amber, paddingLeft: "0.4em" }}>Available at</div>
          </FloatIn>
        </div>

        {/* dual logos */}
        <div style={{ position: "absolute", top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <FloatIn delay={12} y={24}><LogoPlate which="neumann" width={470} /></FloatIn>
          <FloatIn delay={18} y={10}>
            <div style={{ ...displayStyle(46, 500), color: COLORS.champagneSoft, fontStyle: "italic" }}>at</div>
          </FloatIn>
          <FloatIn delay={22} y={24}><LogoPlate which="shivansh" width={520} /></FloatIn>
        </div>

        {/* product + price + CTA */}
        <div style={{ position: "absolute", top: 1040, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <FloatIn delay={30} y={20}>
            <div style={{ ...displayStyle(66, 600), color: COLORS.ivory, textAlign: "center" }}>
              {PRODUCT.full} <span style={{ color: COLORS.champagneSoft }}>· {PRODUCT.set}</span>
            </div>
          </FloatIn>
          <FloatIn delay={36} y={16}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ ...displayStyle(96, 700), color: COLORS.ivory }}>{PRODUCT.price}</span>
              <span style={{ ...labelStyle(26, 600, "0.12em"), color: COLORS.ivoryDim }}>{PRODUCT.priceNote}</span>
            </div>
          </FloatIn>
          <FloatIn delay={44} y={16}>
            <div
              style={{
                marginTop: 14,
                padding: "22px 44px",
                borderRadius: RADII.chip,
                background: COLORS.red,
                ...labelStyle(30, 700, "0.14em"),
                color: "#fff",
                boxShadow: `0 20px 50px ${hexA(COLORS.red, 0.45)}`,
              }}
            >
              {PRODUCT.cta}
            </div>
          </FloatIn>
          <FloatIn delay={52} y={12}>
            <div style={{ ...labelStyle(22, 600, "0.14em"), color: COLORS.steel, marginTop: 8 }}>
              Follow · Join the WhatsApp Community · {BRAND.whatsapp[0]}
            </div>
          </FloatIn>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
