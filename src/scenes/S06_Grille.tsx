import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { Cutout, CalloutPin } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";

/** Head grille / iconic design. Macro grille bg + cutout + capsule callouts. */
export const S06_Grille: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={30} glowY={40} />
          <KenBurns src={IMG.macroGrilleDark} from={1.1} to={1.3} panX={30} panY={-20} duration={210} style={{ opacity: 0.5 }} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${hexA(COLORS.ink, 0.9)} 0%, ${hexA(COLORS.ink, 0.35)} 55%, ${hexA(COLORS.ink, 0.1)} 100%)` }} />
          <Particles seed={17} count={22} opacity={0.22} />
          <Vignette strength={0.5} />
        </AbsoluteFill>
      }
    >
      {/* cutout on right */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -140, marginTop: 40 }}>
          <Cutout src={IMG.mountBlackA} height={1120} delay={8} floatAmp={12} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 220, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Unmistakable form"
            lines={["The iconic", { text: "head grille.", color: COLORS.champagneSoft, italic: true }]}
            size={100}
            support="A distinctive box-shaped grille protects a large-diaphragm capsule tuned for clarity and depth."
            maxWidth={500}
          />
        </div>
      </AbsoluteFill>

      <CalloutPin x={560} y={760} label="Capsule" value="Large diaphragm" delay={30} />
      <CalloutPin x={600} y={1080} label="Circuit" value="Transformerless" delay={38} />

      <BrandPlate mode="facebook" pos="bottomCenter" appearAt={44} />
    </Scene>
  );
};
