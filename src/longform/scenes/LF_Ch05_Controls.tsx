import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette } from "../../components/Backgrounds";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { HeroSplit } from "../components/HeroSplit";
import { PatternShowcase } from "../components/PatternShowcase";
import { LFBrandCorner } from "../components/LFBrand";
import { FramedImage } from "../../components/Product";
import { Eyebrow, FloatIn } from "../../components/Ui";
import { labelStyle } from "../../fonts";

/** Beat 11 — Meet the control ring. */
export const LF11_ControlRing: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={66} glowY={50} />
        <Particles seed={33} count={20} opacity={0.18} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="right"
      image={{ kind: "framed", src: IMG.controlsBlack, width: 760, height: 480 }}
      eyebrow="One switch, everything"
      headingLines={["Meet the", { text: "control ring.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={70}
      support="A single navigation switch, right on the mic body, sets the polar pattern — no menus, no computer, just a twist of the dial."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="logo" appearAt={30} />
  </LFShell>
);

/** Beat 12 — Official control layout reference (short authoritative insert). */
export const LF12_ControlDiagram: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={50} glowY={50} />
        <Vignette strength={0.55} />
      </AbsoluteFill>
    }
  >
    <AbsoluteFill>
      <div style={{ position: "absolute", top: LF_SPACE.marginTop + 30, left: LF_SPACE.marginX, maxWidth: 1000 }}>
        <Eyebrow delay={6} accent={COLORS.amber}>Straight from the control ring</Eyebrow>
      </div>
      <div
        style={{
          position: "absolute",
          top: (LF_SPACE.marginTop + LF_SPACE.safeBottom) / 2 - 200,
        }}
      >
        <FloatIn delay={12} y={20} scale={0.96}>
          <FramedImage
            src={IMG.controlDiagramAnnotated}
            width={900}
            height={484}
            delay={0}
            objectPosition="center"
            ticks
            zoomFrom={1.0}
            zoomTo={1.05}
          />
        </FloatIn>
      </div>
    </AbsoluteFill>
    <LFBrandCorner mode="address" appearAt={26} />
  </LFShell>
);

/** Beat 13 — Polar pattern system intro. */
export const LF13_PatternIntro: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={34} glowY={40} />
        <Particles seed={37} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.polarDiagram, width: 620, height: 620, objectPosition: "center" }}
      eyebrow="Adaptable pickup"
      headingLines={["Five patterns,", { text: "one microphone.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={62}
      support="Polar pattern describes how a microphone hears the room around it — and the TLM 107 gives you five to choose from, switchable in an instant."
      delay={10}
      maxTextWidth={660}
    />
    <LFBrandCorner mode="logo" appearAt={30} />
  </LFShell>
);

const patternBg = (seed: number) => (
  <AbsoluteFill>
    <DarkBase glow={COLORS.champagne} glowX={50} glowY={50} />
    <Particles seed={seed} count={16} opacity={0.15} />
    <Vignette strength={0.5} />
  </AbsoluteFill>
);

/** Beat 14 — Omni & Wide Cardioid. */
export const LF14_OmniWide: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell enter={enter} sweep={sweep} bg={patternBg(41)}>
    <PatternShowcase
      patterns={["omni", "wide"]}
      side="right"
      eyebrow="Pattern 1 & 2"
      headingLines={["Omni &", { text: "Wide Cardioid.", color: COLORS.champagneSoft, italic: true }]}
      support="Omni picks up evenly from every direction — ideal for room ambience or a natural group recording. Wide cardioid softens the rear rejection for a slightly more open pickup."
      delay={8}
    />
    <LFBrandCorner mode="instagram" appearAt={28} />
  </LFShell>
);

/** Beat 15 — Cardioid & Hypercardioid. */
export const LF15_CardioidHyper: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell enter={enter} sweep={sweep} bg={patternBg(43)}>
    <PatternShowcase
      patterns={["cardioid", "hyper"]}
      side="left"
      eyebrow="Pattern 3 & 4"
      headingLines={["Cardioid &", { text: "Hypercardioid.", color: COLORS.champagneSoft, italic: true }]}
      support="Cardioid is the workhorse — rejecting sound from behind while capturing the source in rich detail. Hypercardioid narrows that focus further, isolating a single source in a busier room."
      delay={8}
    />
    <LFBrandCorner mode="facebook" appearAt={28} />
  </LFShell>
);

/** Beat 16 — Figure-8. */
export const LF16_Figure8: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell enter={enter} sweep={sweep} bg={patternBg(47)}>
    <PatternShowcase
      patterns={["fig8"]}
      side="right"
      eyebrow="Pattern 5"
      headingLines={[{ text: "Figure-8.", color: COLORS.champagneSoft, italic: true }]}
      support="Figure-8 hears equally from the front and back while rejecting the sides entirely — ideal for duets, face-to-face interviews, or blending with another mic in mid-side stereo."
      delay={6}
      glyphSize={380}
    />
    <LFBrandCorner mode="linkedin" appearAt={24} />
  </LFShell>
);

/** Beat 17 — Pad & low-cut filter. */
export const LF17_PadLowcut: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.steel} glowX={40} glowY={56} />
        <Particles seed={51} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <HeroSplit
      side="left"
      image={{ kind: "framed", src: IMG.controlsNickel, width: 800, height: 520 }}
      eyebrow="Total control"
      headingLines={["Pad &", { text: "low-cut filter.", color: COLORS.champagneSoft, italic: true }]}
      headingSize={66}
      support="A switchable −6 / −12 dB pad handles loud sources without distortion, and a low-cut filter tames rumble and proximity bass — both selected right on the mic."
      delay={10}
      maxTextWidth={620}
    />
    <LFBrandCorner mode="whatsapp" appearAt={32} />
  </LFShell>
);
