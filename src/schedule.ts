import { VIDEO } from "./theme";
import type { Enter, Sweep } from "./components/Scene";

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

export type SceneDef = {
  n: number;
  title: string;
  sec: number;
  enter: Enter;
  sweep: Sweep;
  sfx: SfxKey; // transition SFX at scene start (mixed low)
};

// The 21-beat structure — sums to exactly 178s.
const RAW: Omit<SceneDef, "n">[] = [
  { title: "Cold-open hook", sec: 7, enter: "scaleIn", sweep: "none", sfx: "reverseSwell" },
  { title: "Product reveal", sec: 9, enter: "rise", sweep: "line", sfx: "impact" },
  { title: "Black & Nickel", sec: 8, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { title: "Neumann legacy", sec: 10, enter: "fade", sweep: "none", sfx: "softImpact" },
  { title: "Made in Germany", sec: 7, enter: "scaleIn", sweep: "lineDown", sfx: "whooshDown" },
  { title: "Head grille / design", sec: 7, enter: "pushUp", sweep: "none", sfx: "subDrop" },
  { title: "5 polar patterns", sec: 10, enter: "rise", sweep: "line", sfx: "riser" },
  { title: "Pad & low-cut", sec: 8, enter: "pushLeft", sweep: "none", sfx: "whooshUp" },
  { title: "Low self-noise", sec: 8, enter: "scaleIn", sweep: "none", sfx: "softImpact" },
  { title: "SPL / dynamic range", sec: 8, enter: "rise", sweep: "barsUp", sfx: "whooshDown" },
  { title: "Natural sound", sec: 6, enter: "fade", sweep: "none", sfx: "sparkle" },
  { title: "Vocals & voiceover", sec: 10, enter: "pushUp", sweep: "none", sfx: "impact" },
  { title: "Podcast & broadcast", sec: 8, enter: "rise", sweep: "line", sfx: "whooshUp" },
  { title: "Instruments", sec: 10, enter: "scaleIn", sweep: "none", sfx: "softImpact" },
  { title: "Studio ecosystem", sec: 8, enter: "pushLeft", sweep: "none", sfx: "subDrop" },
  { title: "Project studios", sec: 6, enter: "fade", sweep: "none", sfx: "whooshDown" },
  { title: "Studio Set contents", sec: 10, enter: "rise", sweep: "line", sfx: "riser" },
  { title: "Price reveal", sec: 10, enter: "scaleIn", sweep: "none", sfx: "impact" },
  { title: "Call to action", sec: 8, enter: "pushUp", sweep: "none", sfx: "whooshUp" },
  { title: "Contact & social", sec: 12, enter: "rise", sweep: "none", sfx: "softImpact" },
  { title: "Final brand lockup", sec: 8, enter: "scaleIn", sweep: "lineDown", sfx: "reverseSwell" },
];

export const SCENES: SceneDef[] = RAW.map((s, i) => ({ n: i + 1, ...s }));

export const frames = (sec: number) => Math.round(sec * VIDEO.fps);

// cumulative start frame for each scene
export const SCENE_STARTS: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (const s of SCENES) {
    out.push(acc);
    acc += frames(s.sec);
  }
  return out;
})();

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + frames(s.sec), 0);
