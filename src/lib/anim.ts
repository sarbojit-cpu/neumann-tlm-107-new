import { interpolate, Easing } from "remotion";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // strong ease-out (settling)
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  outSoft: Easing.bezier(0.25, 1, 0.5, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
} as const;

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 ramp over [start, start+dur] with easing. */
export const ramp = (
  frame: number,
  start: number,
  dur: number,
  ease = EASE.out
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    ...clampOpts,
    easing: ease,
  });

/** Fade in then out around a segment; returns 0..1 envelope. */
export const inOutEnvelope = (
  frame: number,
  duration: number,
  fadeIn = 16,
  fadeOut = 16
) =>
  interpolate(
    frame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    clampOpts
  );

/** map a value between ranges with clamping. */
export const mapClamp = (
  v: number,
  inR: [number, number],
  outR: [number, number],
  ease?: (n: number) => number
) =>
  interpolate(v, inR, outR, { ...clampOpts, ...(ease ? { easing: ease } : {}) });

/** Staggered entrance delay for list items. */
export const stagger = (index: number, base: number, step: number) =>
  base + index * step;

/** translate helper string */
export const t3d = (x: number, y: number, scale = 1) =>
  `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
