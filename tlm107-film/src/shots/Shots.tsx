import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { ASSETS } from "../assets.generated.ts";
import type { Canvas } from "../theme.ts";
import { C, FONT } from "../theme.ts";
import { camera, poseTransform, type Pose } from "../fx/Camera.ts";
import { clamp, easeOutBack, easeOutCubic, lerp, ramp } from "../lib/ease.ts";
import type { Shot } from "../plan.ts";
import { Stage } from "./Stage.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// SHOT RENDERERS — v (Neumann film clip) · i (photograph) · c (cut-out on the
// stage) · m (mosaic). Each takes the shot, its local frame and the camera
// pose, so moves are identical whatever the canvas.
// ─────────────────────────────────────────────────────────────────────────────

export const MASTER = "clips/tlm107-master.mp4";

// Horizontal focus for the 9:16 crop of each 16:9 source clip (0..1).
const CLIP_FOCUS: Record<string, number> = { navSwitch: 0.6, nickelSide: 0.56, freq: 0.5, badges: 0.42, pair: 0.5 };

// The cinematic grade applied to every source: a touch of contrast, cooler
// shadows, and the red kept rich (the badge is the only saturated thing).
// The grade (contrast 1.08, saturation 1.06) is baked into the master clip and
// the photographs, so no frame pays for a full-screen CSS filter.

// Clips whose subject is the whole width (instruments either side of the mic,
// the two finishes side by side) play as a full 16:9 panel in portrait, over a
// blurred, darkened copy of themselves — nothing is lost to a centre crop.
const PANEL = new Set(["guitar", "congas", "console", "orchestra", "pair", "badges", "freq"]);

export const VideoShot: React.FC<{ shot: Shot; f: number; dur: number; canvas: Canvas; pose: Pose }> = ({ shot, canvas, pose }) => {
  const fx = CLIP_FOCUS[shot.subject] ?? 0.5;
  const vid = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(MASTER)} trimBefore={Math.round((shot.masterFrom ?? 0) * canvas.fps)} playbackRate={shot.rate ?? 1} muted style={style} />
  );
  if (canvas.portrait && PANEL.has(shot.subject)) {
    const pw = canvas.w * 1.18;
    const ph = (pw * 9) / 16;
    return (
      <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: canvas.w / 10, height: canvas.h / 10, transformOrigin: "0 0", transform: `scale(${10 * 1.25}) translate(-10%, ${-10 + pose.y * 0.4}%)`, filter: "blur(1.2px)" }}>
          {vid({ width: "100%", height: "100%", objectFit: "cover" })}
        </div>
        <AbsoluteFill style={{ background: "rgba(5,6,8,0.58)" }} />
        <div style={{ position: "absolute", left: (canvas.w - pw) / 2, top: canvas.h * 0.4 - ph / 2, width: pw, height: ph, overflow: "hidden", transform: poseTransform({ ...pose, s: 1 + (pose.s - 1) * 0.5, y: pose.y * 0.3 }), boxShadow: "0 40px 100px rgba(0,0,0,0.7)", borderTop: "1.5px solid rgba(230,236,242,0.35)", borderBottom: "1.5px solid rgba(230,236,242,0.35)", filter: pose.blur > 0.3 ? `blur(${pose.blur}px)` : undefined }}>
          {vid({ width: "100%", height: "100%", objectFit: "cover" })}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: poseTransform(pose), filter: pose.blur > 0.3 ? `blur(${pose.blur}px)` : undefined }}>
        <OffthreadVideo
          src={staticFile(MASTER)}
          trimBefore={Math.round((shot.masterFrom ?? 0) * canvas.fps)}
          playbackRate={shot.rate ?? 1}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% 50%` }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Photos: full frame, with the slack of a cover-crop used for real pans. */
export const PhotoShot: React.FC<{ shot: Shot; f: number; dur: number; canvas: Canvas; pose: Pose }> = ({ shot, f, dur, canvas, pose }) => {
  const a = ASSETS[shot.subject];
  if (!a) return <AbsoluteFill style={{ background: C.graphite }} />;
  const p = clamp(f / Math.max(1, dur));
  const car = canvas.w / canvas.h;
  // paper packshots become lit cards instead of white frames
  if ((a.paper ?? 0) > 0.3 || a.kind === "g") return <CardShot shot={shot} f={f} dur={dur} canvas={canvas} pose={pose} />;
  const tall = a.ar < car * 0.85;
  const wide = a.ar > car * 1.15;
  const e = 0.5 - 0.5 * Math.cos(Math.PI * p);
  const flip = shot.i % 2 === 0;
  const ox = wide ? (flip ? lerp(15, 85, e) : lerp(85, 15, e)) : 50;
  const oy = tall ? (flip ? lerp(20, 80, e) : lerp(80, 20, e)) : 50;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: poseTransform(pose), filter: pose.blur > 0.3 ? `blur(${pose.blur}px)` : undefined }}>
        <Img src={staticFile(a.file)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${ox}% ${oy}%` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A studio packshot on white, presented as a lit card floating on the stage. */
export const CardShot: React.FC<{ shot: Shot; f: number; dur: number; canvas: Canvas; pose: Pose }> = ({ shot, f, canvas, pose }) => {
  const a = ASSETS[shot.subject];
  const W = canvas.w, H = canvas.h;
  const maxW = W * (canvas.portrait ? 0.86 : 0.62), maxH = H * (canvas.portrait ? 0.5 : 0.72);
  let cw = maxW, ch = cw / a.ar;
  if (ch > maxH) { ch = maxH; cw = ch * a.ar; }
  const inn = easeOutCubic(clamp(f / 14));
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={pose.x} py={pose.y} floorY={H * 0.8} glow={0.5} />
      <div
        style={{
          position: "absolute", left: (W - cw) / 2, top: canvas.portrait ? (H * 0.78 - ch) / 2 : (H - ch) / 2 - H * 0.03, width: cw, height: ch,
          transform: `${poseTransform({ ...pose, s: pose.s * lerp(0.94, 1, inn) }, 2200)} rotateY(${pose.ry * 0.5 + (pose.x * -0.6)}deg)`,
          borderRadius: 18, overflow: "hidden", background: "#F4F6F8", boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.14)",
          filter: pose.blur > 0.3 ? `blur(${pose.blur}px)` : undefined,
        }}
      >
        <Img src={staticFile(a.file)} style={{ width: "100%", height: "100%", objectFit: a.kind === "g" ? "contain" : "cover", padding: a.kind === "g" ? "4%" : undefined, boxSizing: "border-box" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${lerp(-30, 90, clamp(f / 60))}%, rgba(255,255,255,0.18) ${lerp(-20, 100, clamp(f / 60))}%, rgba(255,255,255,0) ${lerp(-10, 110, clamp(f / 60))}%)` }} />
      </div>
    </AbsoluteFill>
  );
};

/** Cut-out on the stage: reflection, contact shadow, specular sweep, parallax. */
export const CutoutShot: React.FC<{ shot: Shot; f: number; dur: number; canvas: Canvas; pose: Pose; glow: number }> = ({ shot, f, dur, canvas, pose, glow }) => {
  const a = ASSETS[shot.subject];
  if (!a) return <AbsoluteFill style={{ background: C.graphite }} />;
  const W = canvas.w, H = canvas.h;
  const floorY = H * (canvas.portrait ? 0.74 : 0.84);
  const maxH = H * (canvas.portrait ? 0.56 : 0.74);
  const maxW = W * (canvas.portrait ? 0.84 : 0.5);
  let ph = maxH, pw = ph * a.ar;
  if (pw > maxW) { pw = maxW; ph = pw / a.ar; }
  const left = (W - pw) / 2;
  const top = floorY - ph;
  const p = clamp(f / Math.max(1, dur));
  const sweep = lerp(-40, 140, clamp((f - 4) / 40));
  const tint = shot.subject.includes("nickel") || shot.subject.includes("cream") ? "warm" : "cool";
  const tr = poseTransform(pose, 2000);
  const mask = { WebkitMaskImage: `url(${staticFile(a.file)})`, maskImage: `url(${staticFile(a.file)})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Stage w={W} h={H} f={f} px={pose.x} py={pose.y} floorY={floorY} glow={glow} tint={tint} />
      <AbsoluteFill style={{ transformOrigin: `50% ${(floorY / H) * 100}%`, transform: tr, filter: pose.blur > 0.3 ? `blur(${pose.blur}px)` : undefined }}>
        {/* contact shadow */}
        <div style={{ position: "absolute", left: W / 2 - pw * 0.42, top: floorY - 18, width: pw * 0.84, height: 36, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85), rgba(0,0,0,0) 70%)" }} />
        {/* reflection */}
        <div style={{ position: "absolute", left, top: floorY + 2, width: pw, height: ph * 0.45, overflow: "hidden", opacity: 0.14 }}>
          <Img src={staticFile(a.file)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: "scaleY(-1)", transformOrigin: "50% 0%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,12,16,0) 0%, rgba(10,12,16,1) 90%)" }} />
        </div>
        {/* product */}
        <div style={{ position: "absolute", left: left + pw * 0.1, top: top + ph * 0.2, width: pw * 0.8, height: ph * 0.85, borderRadius: "40%", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)", transform: "translateY(30px)" }} />
        <Img src={staticFile(a.file)} style={{ position: "absolute", left, top, width: pw, height: ph }} />
        {/* specular sweep, masked by the product itself — mounted only while it travels */}
        {sweep > -30 && sweep < 130 ? (
          <div style={{ position: "absolute", left, top, width: pw, height: ph, ...mask, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 14}%, rgba(255,255,255,0.3) ${sweep}%, rgba(255,255,255,0) ${sweep + 14}%)` }} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MOSAIC = ["black_homestudio", "black_ring_top", "thumb_box_mount", "thumb_black_ea4", "box_black_small", "nav_callouts"];

export const MosaicShot: React.FC<{ shot: Shot; f: number; dur: number; canvas: Canvas; beatF: number }> = ({ f, dur, canvas, beatF }) => {
  const W = canvas.w, H = canvas.h;
  const cols = canvas.portrait ? 2 : 3;
  const rows = canvas.portrait ? 3 : 2;
  const gap = 26;
  const gw = canvas.portrait ? W * 0.84 : W * 0.72;
  const gh = canvas.portrait ? H * 0.6 : H * 0.7;
  const cw = (gw - gap * (cols - 1)) / cols, ch = (gh - gap * (rows - 1)) / rows;
  const x0 = (W - gw) / 2, y0 = (H - gh) / 2 - (canvas.portrait ? H * 0.06 : 0);
  const push = lerp(1.0, 1.06, clamp(f / Math.max(1, dur)));
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={0} py={0} floorY={H * 0.9} glow={0.4} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {MOSAIC.map((slug, i) => {
          const a = ASSETS[slug];
          if (!a) return null;
          const c = i % cols, r = Math.floor(i / cols);
          const t = clamp((f - i * beatF * 0.5) / 12);
          const k = easeOutBack(t, 1.2);
          return (
            <div key={slug} style={{ position: "absolute", left: x0 + c * (cw + gap), top: y0 + r * (ch + gap), width: cw, height: ch, borderRadius: 14, overflow: "hidden", opacity: clamp(t * 2), transform: `translateY(${(1 - k) * 60}px) rotate(${(1 - k) * (i % 2 ? 3 : -3)}deg) scale(${lerp(0.9, 1, k)})`, boxShadow: "0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.12)" }}>
              <Img src={staticFile(a.file)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 10, bottom: 8, fontFamily: FONT.mono, fontSize: 13, letterSpacing: 1.5, color: "rgba(255,255,255,0.8)", textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>{a.label.toUpperCase()}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const shotPose = (shot: Shot, f: number, dur: number, kick: number) => camera(shot.move, clamp(f / Math.max(1, dur)), kick);
export { ramp };
