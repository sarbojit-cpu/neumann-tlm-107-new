import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette, Grain, hexA } from "../../components/Backgrounds";
import { KenBurns } from "../../components/KenBurns";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { HeroSplit } from "../components/HeroSplit";
import { ComparePair } from "../components/ComparePair";
import { FullBleedMoment } from "../components/FullBleedMoment";
import { LFBrandCorner } from "../components/LFBrand";

/** Beat 26 — Vocals. */
export const LF26_Vocals: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={34} glowY={40} />
        <Particles seed={81} count={20} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.nickelOnStand, width: 560, height: 700 }}
      eyebrow="Made for the voice"
      headingLines={["For every", { text: "vocal performance.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={62}
      support="From an intimate lead vocal take to a polished voiceover session, the TLM 107 flatters detail without ever turning harsh."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="logo" appearAt={32} />
  </LFShell>
);

/** Beat 27 — Voiceover & broadcast (compare pair). */
export const LF27_Voiceover: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={50} glowY={54} />
        <Particles seed={83} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="On air, every day"
      headingLines={["Voiceover,", { text: "ready for broadcast.", color: COLORS.champagneSoft, italic: true }]}
      support="Rich, present, and consistent take after take — exactly what a voiceover artist or broadcaster needs from a main microphone."
      left={{ kind: "framed", src: IMG.black3qXlr, width: 440, height: 460 }}
      right={{ kind: "framed", src: IMG.candidHomeStudio, width: 440, height: 460 }}
      leftLabel="Studio ready"
      rightLabel="In a real home studio"
      delay={10}
    />
    <LFBrandCorner mode="youtube" appearAt={36} />
  </LFShell>
);

/** Beat 28 — Podcasting (compare pair). */
export const LF28_Podcasting: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={50} glowY={40} />
        <Particles seed={87} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="A natural home for podcasting"
      headingLines={["Every setup,", { text: "covered.", color: COLORS.champagneSoft, italic: true }]}
      support="Whether it's mounted on a boom arm or sitting on a console, the TLM 107 brings a broadcast-grade voice to any podcast setup."
      left={{ kind: "framed", src: IMG.ctxConsole, width: 440, height: 460 }}
      right={{ kind: "framed", src: IMG.nickelBoomMount, width: 300, height: 460 }}
      leftLabel="On the console"
      rightLabel="On a boom arm"
      delay={10}
      gap={70}
    />
    <LFBrandCorner mode="whatsapp" appearAt={36} />
  </LFShell>
);

/** Beat 29 — Instruments (full-bleed). */
export const LF29_Instruments: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <KenBurns src={IMG.ctxPurpleFabric} from={1.05} to={1.2} panX={24} panY={-20} duration={210} scrim="full" />
        <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.2) }} />
        <Grain opacity={0.06} />
        <Vignette strength={0.48} />
      </AbsoluteFill>
    }
  >
    <FullBleedMoment
      align="left"
      eyebrow="Every source, faithfully"
      headingLines={["On every", { text: "instrument.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={74}
      support="Acoustic guitar, piano, strings, brass, drum overheads — the TLM 107 captures each with natural, detailed character."
      delay={10}
      maxWidth={800}
    />
    <LFBrandCorner mode="community" appearAt={36} />
  </LFShell>
);

/** Beat 30 — Project & home studios. */
export const LF30_ProjectStudios: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={64} glowY={48} />
        <Particles seed={91} count={16} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.controlsBlackAngle, width: 700, height: 470 }}
      eyebrow="Scales with you"
      headingLines={["Bedroom to", { text: "project studio.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={62}
      support="Whether it's a first home setup or a growing project studio, the TLM 107 earns its place on the stand as the room grows around it."
      delay={8}
      maxTextWidth={600}
    />
    <LFBrandCorner mode="address" appearAt={28} />
  </LFShell>
);

/** Beat 31 — The wider studio ecosystem (compare pair). */
export const LF31_Ecosystem: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={50} glowY={56} />
        <Particles seed={93} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="A complete signal chain"
      headingLines={["Part of a wider", { text: "Neumann studio.", color: COLORS.champagneSoft, italic: true }]}
      support="Pairs naturally with Neumann's own studio monitors and headphones — a consistent, trustworthy chain from mic to mix."
      left={{ kind: "cutout", src: IMG.ecoMonitorA, height: 460 }}
      right={{ kind: "cutout", src: IMG.ecoHeadphonesA, height: 460 }}
      leftLabel="Studio monitors"
      rightLabel="Studio headphones"
      delay={10}
    />
    <LFBrandCorner mode="logo" appearAt={36} />
  </LFShell>
);
