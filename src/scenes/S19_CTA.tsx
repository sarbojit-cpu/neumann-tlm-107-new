import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE, BRAND, RADII } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn } from "../components/Ui";
import { labelStyle } from "../fonts";
import { Phone, Chat } from "../components/icons";
import { Cutout } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";

const CtaPill: React.FC<{ icon: React.FC<{ size?: number; color?: string }>; label: string; value: string; delay: number }> = ({ icon: Icon, label, value, delay }) => (
  <FloatIn delay={delay} y={18}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 28px", borderRadius: RADII.chip, background: hexA(COLORS.ivory, 0.06), border: `1px solid ${COLORS.lineStrong}` }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: COLORS.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={28} color="#fff" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ ...labelStyle(16, 700, "0.2em"), color: COLORS.champagneSoft }}>{label}</span>
        <span style={{ fontFamily: "Archivo", fontWeight: 600, fontSize: 30, color: COLORS.ivory }}>{value}</span>
      </div>
    </div>
  </FloatIn>
);

/** Call to action — DM or call for the best price. */
export const S19_CTA: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      sweepColor={COLORS.red}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.red} glowX={64} glowY={44} />
          <GlowOrb x={240} y={640} size={640} color={COLORS.red} opacity={0.16} seed={5} />
          <Particles seed={51} count={22} opacity={0.2} />
          <Vignette strength={0.56} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -260, marginTop: 40, opacity: 0.5 }}>
          <Cutout src={IMG.mountBlackB} height={1040} delay={8} floatAmp={9} shadow={false} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 240, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Ready when you are"
            lines={["Best price?", { text: "Just ask.", color: COLORS.champagneSoft, italic: true }]}
            size={104}
            support="Message us or call for your best price on the Neumann TLM 107 Studio Set."
            maxWidth={640}
          />
        </div>
        <div style={{ position: "absolute", top: 940, left: SPACE.marginX, display: "flex", flexDirection: "column", gap: 20 }}>
          <CtaPill icon={Chat} label="Direct message" value="DM us anytime" delay={30} />
          <CtaPill icon={Phone} label="Call / WhatsApp" value={BRAND.whatsapp[0]} delay={36} />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="whatsapp" pos="bottomCenter" appearAt={44} />
    </Scene>
  );
};
