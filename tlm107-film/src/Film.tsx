import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, CHAPTERS_FILM, CHAPTERS_REEL, FILM, REEL, TYPE_OPACITY, type Canvas } from "./theme.ts";
import { ENERGY, PLANS, sectionAt, type Energy, type Plan, type Shot } from "./plan.ts";
import { ASSETS } from "./assets.generated.ts";
import { camera } from "./fx/Camera.ts";
import { transIn, transOut } from "./fx/Transitions.tsx";
import { CutoutShot, MosaicShot, PhotoShot, VideoShot } from "./shots/Shots.tsx";
import { VIZ, OWN_TYPE } from "./viz/index.tsx";
import { Caption } from "./type/Caption.tsx";
import { Hud } from "./hud/Hud.tsx";
import { clamp } from "./lib/ease.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE FILM — one composition, two canvases, one plan (src/plan-*.json).
//
//   1. picture   every shot on the 90 BPM grid (20 frames a beat); each one
//                overlaps the next by the incoming transition, so the cut is
//                always a designed move and never a dip to nothing
//   2. grade     vignette and a bass-driven top light in the drops (no
//                per-frame grain: random noise is incompressible at 4K)
//   3. HUD       the viewfinder: marks, pattern-ring progress, lens readout
//   4. captions  the pressure lockup, one per voice window, at TYPE_OPACITY
// ─────────────────────────────────────────────────────────────────────────────

const VIZ_TITLE: Record<string, string> = {
  hook: "Five patterns", polar: "Polar response", polar5: "Five patterns", switch: "Navigation switch", noisefloor: "Self-noise",
  spl: "Max SPL", range: "Dynamic range", sens: "Sensitivity", lowcut: "Low cut", freq: "Frequency response",
  signal: "Signal path", capsule: "Capsule", dual: "Dual diaphragm", specs: "Technical data", dims: "Dimensions",
  awards: "Awards", ecosystem: "Neumann ecosystem", outro: "",
};

const ShotLayer: React.FC<{ shot: Shot; next: Shot | undefined; plan: Plan; canvas: Canvas; en: Energy }> = ({ shot, next, plan, canvas, en }) => {
  const f = useCurrentFrame();
  const dur = shot.f1 - shot.f0;
  const g = Math.min(en.rms.length - 1, shot.f0 + f);
  const drop = sectionAt(plan, g) === "drop";
  const glow = en.rms[g] ?? 0;
  const bass = en.bass[g] ?? 0;
  const pose = camera(shot.move, clamp(f / Math.max(1, dur)), drop ? bass : bass * 0.3);
  const box = { w: canvas.w, h: canvas.h, id: `${plan.name}-${shot.i}` };
  const tin = f < shot.tf ? transIn(shot.trans, f / shot.tf, box) : { style: {} as React.CSSProperties, over: null };
  const outTf = next ? next.tf : 0;
  const tout = next && f >= dur ? transOut(next.trans, (f - dur) / Math.max(1, outTf), box) : { style: {} as React.CSSProperties, defs: null };

  let body: React.ReactNode;
  if (shot.kind === "v") body = <VideoShot shot={shot} f={f} dur={dur} canvas={canvas} pose={pose} />;
  else if (shot.kind === "i") body = <PhotoShot shot={shot} f={f} dur={dur} canvas={canvas} pose={pose} />;
  else if (shot.kind === "c") body = <CutoutShot shot={shot} f={f} dur={dur} canvas={canvas} pose={pose} glow={glow} />;
  else if (shot.kind === "m") body = <MosaicShot shot={shot} f={f} dur={dur} canvas={canvas} beatF={plan.beatFrames} />;
  else {
    const V = VIZ[shot.subject];
    body = V ? <V f={f} dur={dur} canvas={canvas} opt={shot.opt} glow={glow} beatF={plan.beatFrames} bass={bass} /> : <AbsoluteFill style={{ background: C.graphite }} />;
  }
  return (
    <AbsoluteFill style={{ ...tout.style, overflow: "hidden" }}>
      {tout.defs}
      <AbsoluteFill style={{ ...tin.style, overflow: "hidden" }}>{body}</AbsoluteFill>
      {tin.over}
    </AbsoluteFill>
  );
};

const Grade: React.FC<{ frame: number; bass: number; drop: boolean; canvas: Canvas }> = ({ frame, bass, drop, canvas }) => {
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${canvas.portrait ? "95% 70%" : "80% 85%"} at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)` }} />
      {drop ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,236,255,${0.04 + 0.08 * bass}) 0%, rgba(200,236,255,0) 70%)` }} /> : null}
    </>
  );
};

const findShot = (plan: Plan, frame: number) => {
  let lo = 0, hi = plan.shots.length - 1;
  while (lo < hi) {
    const m = (lo + hi + 1) >> 1;
    if (plan.shots[m].f0 <= frame) lo = m;
    else hi = m - 1;
  }
  return plan.shots[lo];
};

const labelOf = (s: Shot) => {
  if (s.kind === "v") return "Neumann film";
  if (s.kind === "m") return "In the studio";
  if (s.kind === "z") return VIZ_TITLE[s.subject] ?? s.subject;
  return ASSETS[s.subject]?.label.replace(/^TLM 107( bk)?\s*·\s*/, "") ?? "";
};

export const Film: React.FC<{ name: "reel" | "film"; audio?: boolean }> = ({ name, audio = false }) => {
  const canvas = name === "reel" ? REEL : FILM;
  const plan = PLANS[name];
  const en = ENERGY[name];
  const frame = useCurrentFrame();
  const g = Math.min(en.rms.length - 1, frame);
  const shot = findShot(plan, frame);
  const win = plan.windows[shot.w];
  const chapters = name === "reel" ? CHAPTERS_REEL : CHAPTERS_FILM;
  const own = shot.kind === "z" && OWN_TYPE.has(shot.subject);
  const hudVis = own ? clamp(1 - (frame - shot.f0) / 8) : 1;
  const pose = shot.kind === "z" || shot.kind === "m" ? null : camera(shot.move, clamp((frame - shot.f0) / Math.max(1, shot.f1 - shot.f0)));

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {plan.shots.map((s, i) => {
        const next = plan.shots[i + 1];
        const tail = next ? next.tf : 0;
        return (
          <Sequence key={i} from={s.f0} durationInFrames={s.f1 - s.f0 + tail} name={`${s.kind}:${s.subject}`}>
            <ShotLayer shot={s} next={next} plan={plan} canvas={canvas} en={en} />
          </Sequence>
        );
      })}
      <Grade frame={frame} bass={en.bass[g] ?? 0} drop={sectionAt(plan, frame) === "drop"} canvas={canvas} />
      <Hud canvas={canvas} f={frame} chapter={win.ch} chapterName={chapters[win.ch]} label={labelOf(shot)} pose={pose} visible={hudVis} energy={en.rms[g] ?? 0} />
      {/* a soft scrim only where the caption sits — the picture is never dimmed elsewhere */}
      <AbsoluteFill style={{ opacity: own ? 0 : 1, background: canvas.portrait
        ? "linear-gradient(0deg, rgba(4,5,7,0) 0%, rgba(4,5,7,0.46) 16%, rgba(4,5,7,0.4) 30%, rgba(4,5,7,0) 44%)"
        : "linear-gradient(18deg, rgba(4,5,7,0.55) 0%, rgba(4,5,7,0.32) 26%, rgba(4,5,7,0) 46%)" }} />
      <AbsoluteFill style={{ opacity: TYPE_OPACITY }}>
        {plan.windows.map((w) => {
          if (!w.t) return null;
          const ownShot = plan.shots.find((s) => s.w === w.i && s.kind === "z" && OWN_TYPE.has(s.subject));
          const f1 = ownShot ? ownShot.f0 : w.f1;
          if (f1 - w.f0 < 30) return null;
          return (
            <Sequence key={w.i} from={w.f0} durationInFrames={f1 - w.f0} name={`cap ${w.t}`}>
              <CaptionAt w={w} f1={f1} canvas={canvas} chapter={chapters[w.ch]} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {/* renders are muted; audio/mix-*.wav is muxed onto the picture afterwards */}
      {audio ? <Audio src={staticFile(`audio/mix-${name}.wav`)} /> : null}
    </AbsoluteFill>
  );
};

const CaptionAt: React.FC<{ w: Plan["windows"][number]; f1: number; canvas: Canvas; chapter: string }> = ({ w, f1, canvas, chapter }) => {
  const f = useCurrentFrame();
  const P = canvas.portrait;
  return (
    <div style={{ position: "absolute", left: P ? (canvas.w - 900) / 2 : canvas.safe.left, bottom: P ? canvas.safe.bottom : 92, width: P ? 900 : 1080 }}>
      <Caption win={w} f={f} f1={f1} canvas={canvas} chapter={chapter} index={w.i} />
    </div>
  );
};

export const REEL_CANVAS = REEL;
export const FILM_CANVAS = FILM;
