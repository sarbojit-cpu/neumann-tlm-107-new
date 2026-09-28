import reelPlan from "./plan-reel.json";
import filmPlan from "./plan-film.json";
import reelEnergy from "./energy-reel.json";
import filmEnergy from "./energy-film.json";

export type Window = {
  i: number; start: number; end: number; f0: number; f1: number;
  t: string; e: string; h: string; x: string; ch: number; end_screen: boolean;
};

export type Shot = {
  i: number; w: number; kind: "v" | "i" | "c" | "m" | "z"; subject: string; opt: string | null;
  start: number; end: number; f0: number; f1: number; move: string; trans: string; tf: number;
  section: string; firstInWindow: boolean;
  src?: number; rate?: number; masterFrom?: number;
};

export type Plan = {
  name: "reel" | "film"; fps: number; duration: number; frames: number;
  beat: number; beatFrames: number; beatOffset: number;
  sections: { at: number; f: number; type: string }[];
  windows: Window[]; shots: Shot[];
  sfx: { at: number; cue: string; gain: number; why: string }[];
};

export type Energy = { rms: number[]; bass: number[] };

export const PLANS: Record<"reel" | "film", Plan> = { reel: reelPlan as Plan, film: filmPlan as Plan };
export const ENERGY: Record<"reel" | "film", Energy> = { reel: reelEnergy as Energy, film: filmEnergy as Energy };

/** Beat phase helpers: which beat we are on and how far into it (0..1). */
export const beatAt = (plan: Plan, frame: number) => {
  const off = Math.round(plan.beatOffset * plan.fps);
  const f = frame - off;
  const b = Math.floor(f / plan.beatFrames);
  return { beat: b, phase: (f - b * plan.beatFrames) / plan.beatFrames, pre: f < 0 };
};

export const sectionAt = (plan: Plan, frame: number) => {
  let cur = plan.sections[0].type;
  for (const s of plan.sections) if (frame >= s.f) cur = s.type;
  return cur;
};
