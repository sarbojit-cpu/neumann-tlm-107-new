import React from "react";
import { Composition } from "remotion";
import { Reel, type ReelProps } from "./Reel";
import { Thumb } from "./Thumb";

// Defaults = Raavana Mavandaa edit (134 BPM, drop lands at 3.0 s).
const defaults: ReelProps = { bpm: 134, drop: 3.0 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TLM107" component={Reel} durationInFrames={1800} fps={60} width={1080} height={1080} defaultProps={defaults} />
    <Composition id="TLM107Thumb" component={Thumb} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
