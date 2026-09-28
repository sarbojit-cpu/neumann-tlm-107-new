import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS } from "./assets.generated.ts";
import { C, FONT, FILM, REEL } from "./theme.ts";
import { Glyph, PATTERNS } from "./hud/Glyphs.tsx";
import { Stage } from "./shots/Stage.tsx";

// THE COVERS — one claim, stated in the film's own type: "5 MICS / in one
// body." The portrait keeps every word inside Instagram's 4:5 grid crop
// (y 285-1635); the landscape reads at YouTube's smallest thumbnail size.

const Headline: React.FC<{ big: number; serif: number; align: "center" | "left"; wdth?: number }> = ({ big, serif, align, wdth = 118 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", lineHeight: 0.86 }}>
    <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" ${wdth}, "wght" 900`, fontSize: big, color: C.nickel, letterSpacing: -big * 0.01, textShadow: "0 10px 40px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
      5 MICS
    </span>
    <span style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: serif, color: "#FFFFFF", marginTop: serif * 0.05, whiteSpace: "nowrap", textShadow: `0 0 40px rgba(225,38,63,0.45), 0 10px 30px rgba(0,0,0,0.6)` }}>
      in one body.
    </span>
  </div>
);

const Glyphs: React.FC<{ size: number; gap: number }> = ({ size, gap }) => (
  <div style={{ display: "flex", gap }}>
    {PATTERNS.map((p) => (
      <Glyph key={p.key} a={p.a} size={size} color={C.led} glow={10} stroke={3} neg={C.redHot} />
    ))}
  </div>
);

export const ThumbReel: React.FC = () => {
  const W = REEL.w, H = REEL.h;
  const a = ASSETS["black_front"];
  const floorY = 1560;
  const mh = 800;
  const mw = a ? mh * a.ar : 500;
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={0} px={0} py={0} floorY={floorY} glow={0.9} tint="red" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 36% at 50% 62%, rgba(190,236,255,0.2), rgba(0,0,0,0) 70%)" }} />
      {a ? <Img src={staticFile(a.file)} style={{ position: "absolute", left: W / 2 - mw / 2, top: floorY - mh, width: mw, height: mh }} /> : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
        <Headline big={196} serif={132} align="center" wdth={104} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 648, display: "flex", justifyContent: "center" }}>
        <Glyphs size={78} gap={34} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY + 26, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <Img src={staticFile("img/logo_neumann_w.png")} style={{ height: 42 }} />
        <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" 125, "wght" 800`, fontSize: 52, color: C.nickel }}>TLM 107</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, letterSpacing: 6, color: "rgba(230,236,242,0.8)" }}>
        <span style={{ color: C.red }}>◆</span> FULL BREAKDOWN
      </div>
    </AbsoluteFill>
  );
};

export const ThumbFilm: React.FC = () => {
  const W = FILM.w, H = FILM.h;
  const n = ASSETS["nickel_front_tall"], b = ASSETS["black_front"];
  const floorY = 1080;
  const nh = 900, bh = 820;
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={0} px={0} py={0} floorY={floorY} glow={0.9} tint="red" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 45% 60% at 74% 55%, rgba(190,236,255,0.16), rgba(0,0,0,0) 70%)" }} />
      {n ? <Img src={staticFile(n.file)} style={{ position: "absolute", left: 1150, top: floorY - nh + 60, height: nh, width: nh * n.ar, filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.7))" }} /> : null}
      {b ? <Img src={staticFile(b.file)} style={{ position: "absolute", left: 1150 + nh * (n?.ar ?? 0.6) * 0.72, top: floorY - bh + 100, height: bh, width: bh * b.ar, filter: "drop-shadow(0 0 60px rgba(190,236,255,0.25)) contrast(1.08)" }} /> : null}
      <div style={{ position: "absolute", left: 100, top: 150 }}>
        <Headline big={300} serif={170} align="left" />
      </div>
      <div style={{ position: "absolute", left: 108, top: 700 }}>
        <Glyphs size={78} gap={30} />
      </div>
      <div style={{ position: "absolute", left: 104, top: 880, display: "flex", alignItems: "center", gap: 26 }}>
        <Img src={staticFile("img/logo_neumann_w.png")} style={{ height: 50 }} />
        <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" 125, "wght" 800`, fontSize: 64, color: C.nickel }}>TLM 107</span>
      </div>
      <div style={{ position: "absolute", left: 104, top: 80, fontFamily: FONT.mono, fontSize: 26, letterSpacing: 6, color: "rgba(230,236,242,0.8)" }}>
        <span style={{ color: C.red }}>◆</span> FULL BREAKDOWN · 4K
      </div>
    </AbsoluteFill>
  );
};
