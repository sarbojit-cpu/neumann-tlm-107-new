import { LF_VIDEO } from "./theme";
import type { Enter, Sweep } from "../components/Scene";

export type SfxKey =
  | "whooshUp"
  | "whooshDown"
  | "impact"
  | "softImpact"
  | "riser"
  | "subDrop"
  | "reverseSwell"
  | "sparkle"
  | "tick"
  | "clickPop";

export type Chapter =
  | "Cold Open"
  | "Introduction"
  | "Neumann Berlin Heritage"
  | "Exterior Design & Finishes"
  | "Controls & Technical Deep Dive"
  | "Performance Specs"
  | "Accessories & Studio Set Contents"
  | "Real-World Workflows"
  | "Pricing & Call to Action"
  | "Outro";

export type BeatDef = {
  n: number;
  chapter: Chapter;
  title: string;
  sec: number;
  enter: Enter;
  sweep: Sweep;
  sfx: SfxKey;
};

// 34 beats across 10 chapters — sums to exactly 600s (18,000 frames @ 30fps).
const RAW: Omit<BeatDef, "n">[] = [
  // Chapter 1 — Cold Open (15s)
  { chapter: "Cold Open", title: "Brand mark reveal", sec: 15, enter: "scaleIn", sweep: "none", sfx: "reverseSwell" },

  // Chapter 2 — Introduction (60s)
  { chapter: "Introduction", title: "Meet the TLM 107", sec: 22, enter: "rise", sweep: "line", sfx: "impact" },
  { chapter: "Introduction", title: "Design philosophy", sec: 20, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { chapter: "Introduction", title: "What TLM means", sec: 18, enter: "fade", sweep: "none", sfx: "softImpact" },

  // Chapter 3 — Neumann Berlin Heritage (45s)
  { chapter: "Neumann Berlin Heritage", title: "Engineering heritage", sec: 25, enter: "scaleIn", sweep: "lineDown", sfx: "whooshDown" },
  { chapter: "Neumann Berlin Heritage", title: "Reputation & standards", sec: 20, enter: "pushUp", sweep: "none", sfx: "subDrop" },

  // Chapter 4 — Exterior Design & Finishes (75s)
  { chapter: "Exterior Design & Finishes", title: "The head grille", sec: 20, enter: "rise", sweep: "line", sfx: "riser" },
  { chapter: "Exterior Design & Finishes", title: "Black & Nickel", sec: 20, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { chapter: "Exterior Design & Finishes", title: "Craftsmanship close-up", sec: 20, enter: "scaleIn", sweep: "none", sfx: "softImpact" },
  { chapter: "Exterior Design & Finishes", title: "Badge & body detail", sec: 15, enter: "fade", sweep: "none", sfx: "sparkle" },

  // Chapter 5 — Controls & Technical Deep Dive (95s)
  { chapter: "Controls & Technical Deep Dive", title: "Meet the control ring", sec: 16, enter: "rise", sweep: "line", sfx: "impact" },
  { chapter: "Controls & Technical Deep Dive", title: "Official control layout", sec: 10, enter: "fade", sweep: "none", sfx: "tick" },
  { chapter: "Controls & Technical Deep Dive", title: "Polar pattern system", sec: 14, enter: "scaleIn", sweep: "none", sfx: "whooshDown" },
  { chapter: "Controls & Technical Deep Dive", title: "Omni & Wide cardioid", sec: 13, enter: "pushLeft", sweep: "none", sfx: "clickPop" },
  { chapter: "Controls & Technical Deep Dive", title: "Cardioid & Hypercardioid", sec: 13, enter: "pushRight", sweep: "none", sfx: "clickPop" },
  { chapter: "Controls & Technical Deep Dive", title: "Figure-8", sec: 11, enter: "pushUp", sweep: "none", sfx: "subDrop" },
  { chapter: "Controls & Technical Deep Dive", title: "Pad & low-cut filter", sec: 18, enter: "rise", sweep: "barsUp", sfx: "riser" },

  // Chapter 6 — Performance Specs (65s)
  { chapter: "Performance Specs", title: "Self-noise", sec: 23, enter: "scaleIn", sweep: "none", sfx: "softImpact" },
  { chapter: "Performance Specs", title: "Max SPL & dynamic range", sec: 21, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { chapter: "Performance Specs", title: "Frequency response character", sec: 21, enter: "fade", sweep: "none", sfx: "sparkle" },

  // Chapter 7 — Accessories & Studio Set Contents (75s)
  { chapter: "Accessories & Studio Set Contents", title: "What's in the Studio Set", sec: 17, enter: "rise", sweep: "line", sfx: "impact" },
  { chapter: "Accessories & Studio Set Contents", title: "The wooden case", sec: 14, enter: "pushUp", sweep: "none", sfx: "tick" },
  { chapter: "Accessories & Studio Set Contents", title: "EA 4 shock mount", sec: 15, enter: "scaleIn", sweep: "none", sfx: "whooshDown" },
  { chapter: "Accessories & Studio Set Contents", title: "Adapters & windscreen", sec: 15, enter: "pushLeft", sweep: "none", sfx: "subDrop" },
  { chapter: "Accessories & Studio Set Contents", title: "Everything together", sec: 14, enter: "fade", sweep: "none", sfx: "softImpact" },

  // Chapter 8 — Real-World Workflows (100s)
  { chapter: "Real-World Workflows", title: "Vocals", sec: 18, enter: "rise", sweep: "line", sfx: "riser" },
  { chapter: "Real-World Workflows", title: "Voiceover & broadcast", sec: 18, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { chapter: "Real-World Workflows", title: "Podcasting", sec: 18, enter: "pushRight", sweep: "none", sfx: "clickPop" },
  { chapter: "Real-World Workflows", title: "Instruments", sec: 16, enter: "scaleIn", sweep: "none", sfx: "sparkle" },
  { chapter: "Real-World Workflows", title: "Project & home studios", sec: 14, enter: "fade", sweep: "none", sfx: "tick" },
  { chapter: "Real-World Workflows", title: "The wider studio ecosystem", sec: 16, enter: "pushUp", sweep: "none", sfx: "subDrop" },

  // Chapter 9 — Pricing & Call to Action (25s)
  { chapter: "Pricing & Call to Action", title: "Price reveal + CTA", sec: 25, enter: "scaleIn", sweep: "none", sfx: "impact" },

  // Chapter 10 — Outro (45s)
  { chapter: "Outro", title: "Brand recap & full contact block", sec: 27, enter: "rise", sweep: "line", sfx: "whooshDown" },
  { chapter: "Outro", title: "Final CTA & community", sec: 18, enter: "fade", sweep: "none", sfx: "reverseSwell" },
];

export const BEATS: BeatDef[] = RAW.map((s, i) => ({ n: i + 1, ...s }));

export const frames = (sec: number) => Math.round(sec * LF_VIDEO.fps);

export const BEAT_STARTS: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (const b of BEATS) {
    out.push(acc);
    acc += frames(b.sec);
  }
  return out;
})();

export const LF_TOTAL_FRAMES = BEATS.reduce((a, b) => a + frames(b.sec), 0);

// Chapter start-frame lookup, useful for chapter-title cards / debugging.
export const CHAPTER_STARTS: { chapter: Chapter; startFrame: number }[] = (() => {
  const seen = new Set<Chapter>();
  const out: { chapter: Chapter; startFrame: number }[] = [];
  BEATS.forEach((b, i) => {
    if (!seen.has(b.chapter)) {
      seen.add(b.chapter);
      out.push({ chapter: b.chapter, startFrame: BEAT_STARTS[i] });
    }
  });
  return out;
})();
