import React from "react";
import { Audio, Sequence } from "remotion";
import { AUDIO } from "../assets";
import { BEATS, BEAT_STARTS, frames } from "./schedule";
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

// Same rotated SFX palette as the reel, reused as-is. Transition SFX stays
// quiet under narration; the music bed sits a little lower than the reel's
// since a 10-minute runtime needs the bed to recede further behind spoken
// narration over a much longer listen.
const VOL = {
  music: 0.4,
  transition: 0.2,
  accent: 0.12,
  vo: 1.0,
};

const ACCENTS: SfxKey[] = ["tick", "clickPop", "sparkle", "tick", "clickPop", "subDrop"];

export const LF_AudioLayer: React.FC = () => {
  return (
    <>
      <Audio src={AUDIO.musicLongform} volume={VOL.music} />
      <Audio src={AUDIO.voLongform} volume={VOL.vo} />

      {BEATS.map((b, i) => {
        const start = BEAT_STARTS[i];
        const from = Math.max(0, start - 6);
        const accentAt = start + Math.round(frames(b.sec) * 0.45);
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <React.Fragment key={b.n}>
            <Sequence from={from} durationInFrames={45} name={`sfx-${b.n}-${b.sfx}`}>
              <Audio src={SFX_SRC[b.sfx]} volume={VOL.transition} />
            </Sequence>
            {i > 0 && (
              <Sequence from={accentAt} durationInFrames={30} name={`accent-${b.n}`}>
                <Audio src={SFX_SRC[accent]} volume={VOL.accent} />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
