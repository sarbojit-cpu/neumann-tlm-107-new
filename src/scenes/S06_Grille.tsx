import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, Chip } from "../components/Ui";
import { Cutout } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";

/** Head grille / iconic design. Macro grille bg + cutout + feature chips. */
export const S06_Grille: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={30} glowY={40} />
          <KenBurns src={IMG.macroGrilleDark} from={1.1} to={1.3} panX={30} panY={-20} duration={210} style={{ opacity: 0.5 }} />
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${hexA(COLORS.ink, 0.92)} 0%, ${hexA(COLORS.ink, 0.4)} 52%, ${hexA(COLORS.ink, 0.1)} 100%)` }} />
          <Particles seed={17} count={22} opacity={0.22} />
          <Vignette strength={0.5} />
        </AbsoluteFill>
      }
    >
      {/* cutout on right (pushed clear of the text column) */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -260, marginTop: 60 }}>
          <Cutout src={IMG.mountBlackA} height={880} delay={8} floatAmp={12} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 210, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="Unmistakable form"
            lines={["The iconic", { text: "head grille.", color: COLORS.champagneSoft, italic: true }]}
            size={96}
            support="A distinctive box-shaped grille protects a large-diaphragm capsule tuned for clarity and depth."
            maxWidth={470}
          />
        </div>

        {/* feature chips in the clear left column */}
        <div style={{ position: "absolute", top: 980, left: SPACE.marginX, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
          {["Large-diaphragm capsule", "Transformerless circuit", "Made in Germany"].map((c, i) => (
            <FloatIn key={c} delay={30 + i * 5} x={-20}><Chip tone="dark" size={25}>{c}</Chip></FloatIn>
          ))}
        </div>
      </AbsoluteFill>

      <BrandPlate mode="facebook" pos="bottomCenter" appearAt={44} />
    </Scene>
  );
};
