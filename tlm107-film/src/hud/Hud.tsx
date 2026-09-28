import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, type Canvas } from "../theme.ts";
import { clamp, easeOutCubic } from "../lib/ease.ts";
import { Glyph, PATTERNS } from "./Glyphs.tsx";
import type { Pose } from "../fx/Camera.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE VIEWFINDER — the film is "shot" on a gimbal, and the frame shows it.
//
//   top-left     the Neumann mark (knocked out to white) + what is on screen
//   top-right    the PATTERN RING: the TLM 107's five pattern glyphs; one lights
//                per chapter, so the progress bar is the microphone's own ring
//   bottom       lens readout — focal length and focus distance of the move
//                that is actually happening (it changes on zooms and pulls)
//   corners      hairline viewfinder brackets
// ─────────────────────────────────────────────────────────────────────────────

export const Hud: React.FC<{
  canvas: Canvas; f: number; chapter: number; chapterName: string; label: string; pose: Pose | null; visible: number; energy: number;
}> = ({ canvas, f, chapter, chapterName, label, pose, visible, energy }) => {
  const P = canvas.portrait;
  const s = canvas.safe;
  const top = P ? s.top : 54;
  const left = P ? s.left : 70;
  const right = P ? 60 : 70;
  const inn = easeOutCubic(clamp(f / 30));
  const op = visible * inn;
  const arm = P ? 34 : 30;
  const corner = (x: number, y: number, sx: number, sy: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: arm, height: arm, borderLeft: sx > 0 ? "1.5px solid rgba(255,255,255,0.4)" : undefined, borderRight: sx < 0 ? "1.5px solid rgba(255,255,255,0.4)" : undefined, borderTop: sy > 0 ? "1.5px solid rgba(255,255,255,0.4)" : undefined, borderBottom: sy < 0 ? "1.5px solid rgba(255,255,255,0.4)" : undefined, transform: `translate(${sx < 0 ? -arm : 0}px, ${sy < 0 ? -arm : 0}px)` }} />
  );
  const inset = P ? 40 : 36;
  const mm = pose ? Math.round(pose.mm) : 50;
  const fd = pose ? pose.focus.toFixed(2) : "1.20";
  const pulling = pose ? pose.blur > 0.5 : false;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      {corner(inset, inset, 1, 1)}
      {corner(canvas.w - inset, inset, -1, 1)}
      {corner(inset, canvas.h - inset, 1, -1)}
      {corner(canvas.w - inset, canvas.h - inset, -1, -1)}

      {/* mark + label */}
      <div style={{ position: "absolute", left, top, display: "flex", flexDirection: "column", gap: P ? 12 : 10 }}>
        <Img src={staticFile("img/logo_neumann_w.png")} style={{ height: P ? 34 : 30, width: "auto", opacity: 0.9 }} />
        <div style={{ fontFamily: FONT.mono, fontSize: P ? 17 : 15, letterSpacing: 3, color: "rgba(230,236,242,0.66)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
          TLM 107 <span style={{ color: C.red }}>◆</span> {label.toUpperCase()}
        </div>
      </div>

      {/* pattern ring progress */}
      <div style={{ position: "absolute", right, top: top - 4, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        <div style={{ display: "flex", gap: P ? 10 : 12, padding: P ? "10px 16px" : "9px 16px", borderRadius: 40, border: "1.5px solid rgba(255,255,255,0.28)", background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 24px rgba(0,0,0,0.4)" }}>
          {PATTERNS.map((p, i) => {
            const lit = i === chapter;
            const past = i < chapter;
            const col = lit ? C.led : past ? "rgba(221,246,255,0.62)" : "rgba(255,255,255,0.26)";
            return <Glyph key={p.key} a={p.a} size={P ? 30 : 26} color={col} glow={lit ? 6 + 6 * energy : 0} stroke={lit ? 2.2 : 1.6} neg={lit ? C.redHot : undefined} />;
          })}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: P ? 16 : 14, letterSpacing: 4, color: "rgba(230,236,242,0.62)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
          {String(chapter + 1).padStart(2, "0")} / 05 · {chapterName}
        </div>
      </div>

      {/* lens readout */}
      <div style={{ position: "absolute", right, top: P ? top + 110 : undefined, bottom: P ? undefined : 52, fontFamily: FONT.mono, fontSize: P ? 16 : 14, letterSpacing: 3, color: "rgba(230,236,242,0.55)", textShadow: "0 1px 4px rgba(0,0,0,0.8)", display: "flex", gap: 16, alignItems: "center" }}>
        <span>{mm} MM</span>
        <span style={{ color: pulling ? C.led : undefined }}>◎ {fd} M</span>
        <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 9, background: C.red, boxShadow: `0 0 8px ${C.red}`, opacity: 0.55 + 0.45 * Math.round((Math.sin(f / 9) + 1) / 2) }} />
      </div>
    </AbsoluteFill>
  );
};
