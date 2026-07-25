import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { KenBurns } from "../../components/KenBurns";
import { Grain, Vignette, hexA } from "../../components/Backgrounds";
import { DarkBase, Particles } from "../../components/Backgrounds";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { FullBleedMoment } from "../components/FullBleedMoment";
import { HeroSplit } from "../components/HeroSplit";
import { LFBrandCorner } from "../components/LFBrand";
import { LogoPlate } from "../../components/LogoPlate";
import { FloatIn } from "../../components/Ui";

/** Beat 5 — Engineering heritage (full-bleed cinematic). */
export const LF05_Heritage: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <KenBurns src={IMG.ctxStudioPair} from={1.06} to={1.22} panX={-30} panY={-18} duration={300} scrim="full" objectPosition="center" />
        <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.24) }} />
        <Grain opacity={0.06} />
        <Vignette strength={0.48} />
      </AbsoluteFill>
    }
  >
    <AbsoluteFill style={{ alignItems: "flex-start" }}>
      <div style={{ position: "absolute", top: LF_SPACE.marginTop, left: LF_SPACE.marginX }}>
        <FloatIn delay={6} y={14}>
          <LogoPlate which="neumann" width={310} />
        </FloatIn>
      </div>
    </AbsoluteFill>
    <FullBleedMoment
      align="left"
      eyebrow="A legacy of listening"
      headingLines={["Where the", { text: "greats record.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={78}
      support="For decades, Neumann microphones have shaped the sound of the world's most respected studios and broadcast rooms — a reputation earned through consistency, precision, and an obsessive attention to sonic detail."
      delay={12}
      maxWidth={860}
    />
    <LFBrandCorner mode="linkedin" appearAt={40} />
  </LFShell>
);

/** Beat 6 — Reputation & standards. */
export const LF06_Standards: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={30} glowY={36} />
        <Particles seed={19} count={20} opacity={0.2} />
        <Vignette strength={0.52} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.macroBadgeDark, width: 620, height: 620, objectPosition: "center" }}
      eyebrow="Built to a standard"
      headingLines={["Made in Germany,", { text: "built to last.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={64}
      support="Every TLM 107 is assembled and tested to Neumann's own quality standard — the same rigor applied across their entire studio microphone range, from broadcast booths to the world's top recording rooms."
      delay={10}
      maxTextWidth={680}
    />
    <LFBrandCorner mode="threads" appearAt={34} />
  </LFShell>
);
