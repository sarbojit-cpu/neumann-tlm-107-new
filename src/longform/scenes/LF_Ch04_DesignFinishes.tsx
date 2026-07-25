import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette } from "../../components/Backgrounds";
import { IMG } from "../../assets";
import { COLORS } from "../theme";
import { HeroSplit } from "../components/HeroSplit";
import { ComparePair } from "../components/ComparePair";
import { LFBrandCorner } from "../components/LFBrand";

/** Beat 7 — The head grille. */
export const LF07_Grille: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={70} glowY={44} />
        <Particles seed={23} count={22} opacity={0.2} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "cutout", src: IMG.mountBlackA, height: 700, floatAmp: 11 }}
      eyebrow="Unmistakable form"
      headingLines={["The iconic", { text: "head grille.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={72}
      support="A distinctive box-shaped head grille protects a large-diaphragm capsule tuned for clarity, detail and depth — as recognisable by sight as it is by sound."
      delay={10}
      maxTextWidth={640}
    />
    <LFBrandCorner mode="twitter" appearAt={34} />
  </LFShell>
);

/** Beat 8 — Black & Nickel finishes (compare pair). */
export const LF08_Finishes: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={50} glowY={58} />
        <Particles seed={27} count={24} opacity={0.2} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="Choose your finish"
      headingLines={["Two finishes,", { text: "one sound.", color: COLORS.champagneSoft, italic: true }]}
      support="Matte Black or Nickel — the TLM 107 comes in two timeless finishes, with the very same honest, natural character in either."
      left={{ kind: "framed", src: IMG.heroBlackFront, width: 460, height: 560 }}
      right={{ kind: "framed", src: IMG.heroNickelFront, width: 460, height: 560 }}
      leftLabel="Matte Black"
      rightLabel="Nickel"
      delay={10}
    />
    <LFBrandCorner mode="whatsapp" appearAt={40} />
  </LFShell>
);

/** Beat 9 — Craftsmanship close-up (compare pair). */
export const LF09_Craft: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={50} glowY={30} />
        <Particles seed={29} count={20} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="Precision, close up"
      headingLines={["Built to be", { text: "handled for decades.", color: COLORS.champagneSoft, italic: true }]}
      support="From the knurled grille to the machined connector, every surface is finished to a standard that's meant to last."
      left={{ kind: "framed", src: IMG.macroNickelGrille, width: 460, height: 460 }}
      right={{ kind: "framed", src: IMG.macroNickelXlr, width: 460, height: 460 }}
      leftLabel="Grille detail"
      rightLabel="Gold-plated XLR"
      delay={10}
    />
    <LFBrandCorner mode="community" appearAt={40} />
  </LFShell>
);

/** Beat 10 — Badge & body detail. */
export const LF10_Badge: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={34} glowY={42} />
        <Particles seed={31} count={18} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.macroBadgeWhite, width: 600, height: 560 }}
      eyebrow="The mark of the diamond"
      headingLines={["Every detail,", { text: "considered.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={68}
      support="Even the badge is enamel-finished metal, not a sticker — a small detail that says a lot about how this microphone is built."
      delay={8}
      maxTextWidth={640}
    />
    <LFBrandCorner mode="youtube" appearAt={30} />
  </LFShell>
);
