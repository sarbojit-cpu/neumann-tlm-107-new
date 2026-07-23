import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { Grain, Vignette, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, Chip } from "../components/Ui";
import { BrandPlate } from "../components/BrandPlate";

/** Instruments use-case — full-bleed cinematic purple-fabric hero. */
export const S14_Instruments: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <KenBurns src={IMG.ctxPurpleFabric} from={1.08} to={1.24} panX={20} panY={-30} duration={300} scrim="full" />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.22) }} />
          <Grain opacity={0.06} />
          <Vignette strength={0.52} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px`, justifyContent: "flex-start" }}>
        <div style={{ marginTop: 60 }}>
          <SceneHeading
            eyebrow="Every source, faithfully"
            lines={["On every", { text: "instrument.", color: COLORS.champagneSoft, italic: true }]}
            size={100}
            support="Acoustic guitar, piano, strings, brass, drum overheads — the TLM 107 captures each with natural detail."
            maxWidth={860}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `0 ${SPACE.marginX}px`, justifyContent: "flex-end" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, maxWidth: 900, marginBottom: 320 }}>
          {["Acoustic Guitar", "Piano", "Strings", "Brass", "Drum Overheads", "Percussion"].map((c, i) => (
            <FloatIn key={c} delay={24 + i * 5} y={16}><Chip tone="dark">{c}</Chip></FloatIn>
          ))}
        </div>
      </AbsoluteFill>

      <BrandPlate mode="community" pos="bottomCenter" appearAt={48} />
    </Scene>
  );
};
