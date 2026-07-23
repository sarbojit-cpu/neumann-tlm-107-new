import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { Grain, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { FloatIn } from "../components/Ui";
import { SceneHeading } from "../components/Heading";
import { LogoPlate } from "../components/LogoPlate";
import { BrandPlate } from "../components/BrandPlate";

/** Neumann legacy — real studio pedigree, full-bleed warm context. */
export const S04_Legacy: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <KenBurns src={IMG.ctxStudioPair} from={1.1} to={1.26} panX={-24} panY={-24} duration={300} scrim="full" />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.28) }} />
          <Grain opacity={0.07} />
          <Vignette strength={0.5} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 150 }}>
          <FloatIn delay={6} y={16}>
            <LogoPlate which="neumann" width={420} />
          </FloatIn>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px`, justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 320 }}>
          <SceneHeading
            eyebrow="A century of listening"
            lines={["Where the", { text: "greats record.", color: COLORS.champagneSoft, italic: true }]}
            size={104}
            support="For decades, Neumann microphones have shaped the sound of the world's finest studios. The TLM 107 carries that lineage forward."
            maxWidth={940}
          />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="instagram" pos="bottomCenter" appearAt={40} />
    </Scene>
  );
};
