import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { Grain, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { BrandPlate } from "../components/BrandPlate";

/** From home studio to pro — the console context shot. */
export const S16_Studios: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <KenBurns src={IMG.ctxConsole} from={1.12} to={1.28} panX={-24} panY={20} duration={180} scrim="full" />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.26) }} />
          <Grain opacity={0.06} />
          <Vignette strength={0.52} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px`, justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 300 }}>
          <SceneHeading
            eyebrow="Scales with you"
            lines={["Bedroom to", { text: "broadcast.", color: COLORS.champagneSoft, italic: true }]}
            size={102}
            support="Whether it's a first home studio or a flagship room, the TLM 107 earns its place on the stand."
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      <BrandPlate mode="address" pos="bottomCenter" appearAt={40} />
    </Scene>
  );
};
