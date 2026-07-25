import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, Enter, Sweep } from "../../components/Scene";
import { CaptionBox } from "./CaptionBox";
import { COLORS } from "../theme";

/**
 * Shared shell for every long-form beat: mounts the Scene transition wrapper,
 * renders children within it, then lays the CaptionBox + a bottom scrim on
 * top so the box is always visible and consistent regardless of what a beat
 * does underneath. Using this for every beat guarantees the reserved band
 * is never accidentally skipped.
 */
export const LFShell: React.FC<{
  bg?: React.ReactNode;
  enter: Enter;
  sweep: Sweep;
  sweepColor?: string;
  children: React.ReactNode;
}> = ({ bg, enter, sweep, sweepColor = COLORS.champagne, children }) => {
  return (
    <Scene bg={bg} enter={enter} sweep={sweep} sweepColor={sweepColor}>
      <AbsoluteFill>{children}</AbsoluteFill>
      <CaptionBox />
    </Scene>
  );
};
