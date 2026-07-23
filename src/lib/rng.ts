// Deterministic PRNG (mulberry32) — every render is identical.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rand = () => number;

export function seeded(seed: number) {
  return mulberry32(seed);
}

/** Return `count` deterministic particles with stable fields. */
export function particles(
  seed: number,
  count: number,
  w: number,
  h: number
): { x: number; y: number; r: number; s: number; p: number }[] {
  const rnd = mulberry32(seed);
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: rnd() * w,
      y: rnd() * h,
      r: 1 + rnd() * 3.2,
      s: 0.35 + rnd() * 1.1, // speed
      p: rnd() * Math.PI * 2, // phase
    });
  }
  return arr;
}
