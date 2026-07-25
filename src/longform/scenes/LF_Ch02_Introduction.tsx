import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette } from "../../components/Backgrounds";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { HeroSplit } from "../components/HeroSplit";
import { LFBrandCorner } from "../components/LFBrand";
import { LogoPlate } from "../../components/LogoPlate";
import { FloatIn } from "../../components/Ui";

/** Beat 2 — Meet the TLM 107. */
export const LF02_Meet: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={64} glowY={40} />
        <Particles seed={11} count={26} opacity={0.22} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <AbsoluteFill style={{ alignItems: "flex-start" }}>
      <div style={{ position: "absolute", top: LF_SPACE.marginTop, left: LF_SPACE.marginX }}>
        <FloatIn delay={4} y={14}>
          <LogoPlate which="neumann" width={300} />
        </FloatIn>
      </div>
    </AbsoluteFill>
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.heroBlackFront, width: 640, height: 780, objectPosition: "center" }}
      eyebrow="Introducing"
      headingLines={["Meet the", { text: "TLM 107.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={82}
      support="A large-diaphragm studio condenser from Neumann Berlin — the flagship of the TLM range, and one of the most versatile microphones in modern recording."
      delay={16}
      maxTextWidth={680}
    />
    <LFBrandCorner mode="website" appearAt={40} />
  </LFShell>
);

/** Beat 3 — Design philosophy. */
export const LF03_Philosophy: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={36} glowY={52} />
        <Particles seed={13} count={22} opacity={0.2} />
        <Vignette strength={0.52} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "cutout", src: IMG.mountBlackB, height: 700, floatAmp: 11 }}
      eyebrow="Built with intent"
      headingLines={["One microphone.", { text: "Built to adapt.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={72}
      support="The TLM 107 was designed to be the second microphone in your locker that ends up being your first choice — flexible enough for any source, simple enough to trust on instinct."
      delay={10}
      maxTextWidth={680}
    />
    <LFBrandCorner mode="instagram" appearAt={34} />
  </LFShell>
);

/** Beat 4 — What "TLM" means. */
export const LF04_Lineage: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={58} glowY={38} />
        <Particles seed={17} count={20} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.ctxDarkBranded, width: 700, height: 560, objectPosition: "center" }}
      eyebrow="The Neumann naming system"
      headingLines={["What “TLM”", { text: "really means.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={70}
      support="TLM stands for Transformerless Microphone — Neumann's own transformerless output circuit, built to the same exacting standard as the rest of the range, at a more accessible point of entry."
      delay={10}
      maxTextWidth={660}
    />
    <LFBrandCorner mode="facebook" appearAt={34} />
  </LFShell>
);
