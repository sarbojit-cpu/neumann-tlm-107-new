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

/** Beat 21 — What's in the Studio Set. */
export const LF21_BoxOverview: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={68} glowY={44} />
        <Particles seed={61} count={20} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.boxOpen, width: 680, height: 560 }}
      eyebrow="The Studio Set"
      headingLines={["What's in", { text: "the box.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={70}
      support="Every TLM 107 Studio Set arrives complete — the microphone, its elastic suspension mount, and a wooden presentation case built to protect it for years."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="logo" appearAt={32} />
  </LFShell>
);

/** Beat 22 — The wooden case. */
export const LF22_Case: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={32} glowY={40} />
        <Particles seed={63} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.boxClosed, width: 680, height: 520 }}
      eyebrow="A case built to last"
      headingLines={["The wooden", { text: "case.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={72}
      support="A hinged hardwood case with brass clasps and a fitted foam interior — as much a piece of furniture as it is protection for transport and storage."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="website" appearAt={32} />
  </LFShell>
);

/** Beat 23 — EA 4 shock mount. */
export const LF23_ShockMount: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={64} glowY={50} />
        <Particles seed={67} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.mountNickelBranded, width: 640, height: 640 }}
      eyebrow="The EA 4 shock mount"
      headingLines={["Isolated from", { text: "the stand.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={66}
      support="The elastic suspension mount decouples the capsule from footfalls, desk bumps and stand-borne vibration — available to match either finish."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="instagram" appearAt={32} />
  </LFShell>
);

/** Beat 24 — Adapters & windscreen (compare pair). */
export const LF24_Adapters: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={50} glowY={48} />
        <Particles seed={71} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <ComparePair
      eyebrow="Ready for every setup"
      headingLines={["The small parts", { text: "that matter.", color: COLORS.champagneSoft, italic: true }]}
      support="Thread adapters for different stand sizes, and a foam windscreen for plosive control — the accessories that make daily use effortless."
      left={{ kind: "framed", src: IMG.mountNickelAdapters, width: 460, height: 400 }}
      right={{ kind: "framed", src: IMG.windscreen, width: 460, height: 400 }}
      leftLabel="Mounting adapters"
      rightLabel="Foam windscreen"
      delay={10}
    />
    <LFBrandCorner mode="facebook" appearAt={36} />
  </LFShell>
);

/** Beat 25 — Everything together. */
export const LF25_Everything: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={38} glowY={44} />
        <Particles seed={73} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.kitComposite, width: 860, height: 435, objectPosition: "center", zoomFrom: 1.0, zoomTo: 1.04 }}
      eyebrow="The complete kit"
      headingLines={["Everything,", { text: "together.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={64}
      support="Microphone, mount, and case — a complete, ready-to-record kit in one box."
      delay={10}
      maxTextWidth={560}
    />
    <LFBrandCorner mode="linkedin" appearAt={32} />
  </LFShell>
);
