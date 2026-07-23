import React from "react";
import { Audio, Sequence } from "remotion";
import { AUDIO } from "./assets";
import { SCENES, SCENE_STARTS, frames, TOTAL_FRAMES } from "./schedule";
import type { SfxKey } from "./schedule";

const SFX_SRC: Record<SfxKey, string> = {
  whooshUp: AUDIO.whooshUp,
  whooshDown: AUDIO.whooshDown,
  impact: AUDIO.impact,
  softImpact: AUDIO.softImpact,
  riser: AUDIO.riser,
  subDrop: AUDIO.subDrop,
  reverseSwell: AUDIO.reverseSwell,
  sparkle: AUDIO.sparkle,
  tick: AUDIO.tick,
  clickPop: AUDIO.clickPop,
};

// Mix levels — transition SFX deliberately quiet so narration always sits on
// top (per brief). VO placeholder is silent until the user drops a file in.
const VOL = {
  music: 0.5,
  transition: 0.22,
  accent: 0.14,
  vo: 1.0,
};

// Rotating accent SFX for on-screen animations (keeps the palette changing).
const ACCENTS: SfxKey[] = ["tick", "clickPop", "sparkle", "tick", "clickPop"];

export const AudioLayer: React.FC = () => {
  return (
    <>
      {/* Background music bed (already fades in/out inside the file) */}
      <Audio src={AUDIO.music} volume={VOL.music} />

      {/* Voiceover placeholder slot — drop your narration into public/vo/voiceover.mp3 */}
      <Audio src={AUDIO.vo} volume={VOL.vo} />

      {/* Per-scene transition SFX + one animation accent */}
      {SCENES.map((s, i) => {
        const start = SCENE_STARTS[i];
        // start the whoosh slightly before the cut so it peaks on the beat
        const from = Math.max(0, start - 6);
        const accentAt = start + Math.round(frames(s.sec) * 0.42);
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <React.Fragment key={s.n}>
            <Sequence from={from} durationInFrames={45} name={`sfx-${s.n}-${s.sfx}`}>
              <Audio src={SFX_SRC[s.sfx]} volume={VOL.transition} />
            </Sequence>
            {i > 0 && (
              <Sequence from={accentAt} durationInFrames={30} name={`accent-${s.n}`}>
                <Audio src={SFX_SRC[accent]} volume={VOL.accent} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const AUDIO_TOTAL = TOTAL_FRAMES;
