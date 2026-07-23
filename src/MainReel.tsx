import React from "react";
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENES, frames } from "./schedule";
import { AudioLayer } from "./AudioLayer";
import { DarkBase, Grain } from "./components/Backgrounds";
import { COLORS } from "./theme";
import { hexA } from "./components/Backgrounds";

import { S01_Hook } from "./scenes/S01_Hook";
import { S02_Reveal } from "./scenes/S02_Reveal";
import { S03_Finishes } from "./scenes/S03_Finishes";
import { S04_Legacy } from "./scenes/S04_Legacy";
import { S05_Craft } from "./scenes/S05_Craft";
import { S06_Grille } from "./scenes/S06_Grille";
import { S07_Patterns } from "./scenes/S07_Patterns";
import { S08_Control } from "./scenes/S08_Control";
import { S09_Noise } from "./scenes/S09_Noise";
import { S10_Power } from "./scenes/S10_Power";
import { S11_Sound } from "./scenes/S11_Sound";
import { S12_Vocals } from "./scenes/S12_Vocals";
import { S13_Podcast } from "./scenes/S13_Podcast";
import { S14_Instruments } from "./scenes/S14_Instruments";
import { S15_Ecosystem } from "./scenes/S15_Ecosystem";
import { S16_Studios } from "./scenes/S16_Studios";
import { S17_Box } from "./scenes/S17_Box";
import { S18_Price } from "./scenes/S18_Price";
import { S19_CTA } from "./scenes/S19_CTA";
import { S20_Contact } from "./scenes/S20_Contact";
import { S21_Outro } from "./scenes/S21_Outro";
import type { SceneProps } from "./scenes/types";

const COMPONENTS: React.FC<SceneProps>[] = [
  S01_Hook, S02_Reveal, S03_Finishes, S04_Legacy, S05_Craft, S06_Grille,
  S07_Patterns, S08_Control, S09_Noise, S10_Power, S11_Sound, S12_Vocals,
  S13_Podcast, S14_Instruments, S15_Ecosystem, S16_Studios, S17_Box,
  S18_Price, S19_CTA, S20_Contact, S21_Outro,
];

/** Thin top progress bar for whole-video pacing. */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = Math.min(1, frame / durationInFrames);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: hexA(COLORS.ivory, 0.08) }}>
      <div style={{ height: "100%", width: `${p * 100}%`, background: `linear-gradient(90deg, ${COLORS.champagne}, ${COLORS.champagneSoft})`, boxShadow: `0 0 16px ${hexA(COLORS.champagne, 0.6)}` }} />
    </div>
  );
};

export const MainReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkDeep }}>
      {/* persistent base so kinetic transitions never expose pure black */}
      <AbsoluteFill><DarkBase glow={COLORS.champagne} glowX={50} glowY={50} /></AbsoluteFill>

      <Series>
        {SCENES.map((s, i) => {
          const Comp = COMPONENTS[i];
          return (
            <Series.Sequence key={s.n} durationInFrames={frames(s.sec)} name={`${s.n}·${s.title}`}>
              <Comp enter={s.enter} sweep={s.sweep} />
            </Series.Sequence>
          );
        })}
      </Series>

      {/* global overlays for cohesion */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Grain opacity={0.05} />
        <ProgressBar />
      </AbsoluteFill>

      <AudioLayer />
    </AbsoluteFill>
  );
};
