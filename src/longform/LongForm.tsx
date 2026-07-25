import React from "react";
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, frames } from "./schedule";
import { LF_AudioLayer } from "./LF_AudioLayer";
import { DarkBase, Grain, hexA } from "../components/Backgrounds";
import { COLORS } from "./theme";
import type { LFBeatProps } from "./scenes/types";

import { LF01_ColdOpen } from "./scenes/LF_Ch01_ColdOpen";
import { LF02_Meet, LF03_Philosophy, LF04_Lineage } from "./scenes/LF_Ch02_Introduction";
import { LF05_Heritage, LF06_Standards } from "./scenes/LF_Ch03_Heritage";
import { LF07_Grille, LF08_Finishes, LF09_Craft, LF10_Badge } from "./scenes/LF_Ch04_DesignFinishes";
import {
  LF11_ControlRing,
  LF12_ControlDiagram,
  LF13_PatternIntro,
  LF14_OmniWide,
  LF15_CardioidHyper,
  LF16_Figure8,
  LF17_PadLowcut,
} from "./scenes/LF_Ch05_Controls";
import { LF18_SelfNoise, LF19_Headroom, LF20_Frequency } from "./scenes/LF_Ch06_Specs";
import {
  LF21_BoxOverview,
  LF22_Case,
  LF23_ShockMount,
  LF24_Adapters,
  LF25_Everything,
} from "./scenes/LF_Ch07_Accessories";
import {
  LF26_Vocals,
  LF27_Voiceover,
  LF28_Podcasting,
  LF29_Instruments,
  LF30_ProjectStudios,
  LF31_Ecosystem,
} from "./scenes/LF_Ch08_Workflows";
import { LF32_Price } from "./scenes/LF_Ch09_Pricing";
import { LF33_ContactBlock, LF34_FinalCTA } from "./scenes/LF_Ch10_Outro";

const COMPONENTS: React.FC<LFBeatProps>[] = [
  LF01_ColdOpen,
  LF02_Meet,
  LF03_Philosophy,
  LF04_Lineage,
  LF05_Heritage,
  LF06_Standards,
  LF07_Grille,
  LF08_Finishes,
  LF09_Craft,
  LF10_Badge,
  LF11_ControlRing,
  LF12_ControlDiagram,
  LF13_PatternIntro,
  LF14_OmniWide,
  LF15_CardioidHyper,
  LF16_Figure8,
  LF17_PadLowcut,
  LF18_SelfNoise,
  LF19_Headroom,
  LF20_Frequency,
  LF21_BoxOverview,
  LF22_Case,
  LF23_ShockMount,
  LF24_Adapters,
  LF25_Everything,
  LF26_Vocals,
  LF27_Voiceover,
  LF28_Podcasting,
  LF29_Instruments,
  LF30_ProjectStudios,
  LF31_Ecosystem,
  LF32_Price,
  LF33_ContactBlock,
  LF34_FinalCTA,
];

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = Math.min(1, frame / durationInFrames);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: hexA(COLORS.ivory, 0.07) }}>
      <div
        style={{
          height: "100%",
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.champagne}, ${COLORS.champagneSoft})`,
          boxShadow: `0 0 14px ${hexA(COLORS.champagne, 0.55)}`,
        }}
      />
    </div>
  );
};

export const LongForm: React.FC = () => {
  if (COMPONENTS.length !== BEATS.length) {
    throw new Error(`LongForm: ${COMPONENTS.length} components registered but schedule has ${BEATS.length} beats.`);
  }
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkDeep }}>
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={50} glowY={50} />
      </AbsoluteFill>

      <Series>
        {BEATS.map((b, i) => {
          const Comp = COMPONENTS[i];
          return (
            <Series.Sequence key={b.n} durationInFrames={frames(b.sec)} name={`${b.n}·${b.chapter}·${b.title}`}>
              <Comp enter={b.enter} sweep={b.sweep} />
            </Series.Sequence>
          );
        })}
      </Series>

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Grain opacity={0.045} />
        <ProgressBar />
      </AbsoluteFill>

      <LF_AudioLayer />
    </AbsoluteFill>
  );
};
