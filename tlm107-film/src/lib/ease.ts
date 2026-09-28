import { interpolate } from "remotion";

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInCubic = (t: number) => Math.pow(clamp(t), 3);
export const easeOutExpo = (t: number) => (clamp(t) >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
export const easeInExpo = (t: number) => (clamp(t) <= 0 ? 0 : Math.pow(2, 10 * clamp(t) - 10));
export const easeInOutCubic = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (t: number, s = 1.4) => {
  const x = clamp(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};
/** Critically-damped-looking settle with one soft overshoot: 0 -> 1. */
export const settle = (t: number, k = 1.0) => {
  const x = clamp(t);
  return 1 - Math.exp(-6 * x) * Math.cos(x * Math.PI * 1.6 * k);
};

/** Clamped interpolate shorthand. */
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, ease?: (t: number) => number) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** Deterministic hash noise in [0,1). */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
