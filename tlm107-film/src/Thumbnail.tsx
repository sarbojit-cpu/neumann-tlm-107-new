import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS } from "./assets.generated.ts";
import { C, CONTACT, FONT, FILM, REEL } from "./theme.ts";
import { Glyph, PATTERNS } from "./hud/Glyphs.tsx";
import { Stage } from "./shots/Stage.tsx";

// THE COVERS — one claim, stated in the film's own type: "5 MICS / in one
// body.", with both partner marks at full size and the Shivansh Electronics
// website. Every element owns its own block of the frame: the logos (true
// transparent knockouts, scripts/logo_knockout.py), the type, the product and
// the website never overlap, and the stage runs without its ring or dust so
// nothing crosses behind a logo either.

const NEUMANN_AR = 1934 / 437;
const SHIVANSH_AR = 1974 / 576;

const Mark: React.FC<{ file: string; ar: number; left: number; top: number; width: number }> = ({ file, ar, left, top, width }) => (
  <Img src={staticFile(file)} style={{ position: "absolute", left, top, width, height: width / ar }} />
);

const Headline: React.FC<{ big: number; serif: number; wdth: number; name: number }> = ({ big, serif, wdth, name }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 0.86 }}>
    <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" 116, "wght" 800`, fontSize: name, color: C.led, letterSpacing: name * 0.01, whiteSpace: "nowrap", marginBottom: name * 0.34 }}>
      <span style={{ color: C.red, fontSize: name * 0.5, verticalAlign: "0.32em", marginRight: name * 0.22 }}>◆</span>TLM 107
    </span>
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

// The five patterns as a labelled column (portrait), one row each.
const PatternList: React.FC<{ size: number; row: number; label: number }> = ({ size, row, label }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: row - size }}>
    {PATTERNS.map((p) => (
      <div key={p.key} style={{ display: "flex", alignItems: "center", gap: size * 0.42, height: size }}>
        <Glyph a={p.a} size={size} color={C.led} glow={10} stroke={3} neg={C.redHot} />
        <span style={{ fontFamily: FONT.mono, fontSize: label, letterSpacing: label * 0.14, color: "rgba(230,236,242,0.86)", whiteSpace: "nowrap" }}>{p.name}</span>
      </div>
    ))}
  </div>
);

// The website as its own lit plate: a globe mark and the address in the display face.
const Website: React.FC<{ size: number }> = ({ size }) => {
  const g = size * 0.9;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: size * 0.42, padding: `${size * 0.36}px ${size * 0.72}px ${size * 0.36}px ${size * 0.5}px`,
      borderRadius: size * 2, border: "2px solid rgba(221,246,255,0.42)", background: "rgba(221,246,255,0.07)",
      boxShadow: "0 0 36px rgba(190,236,255,0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
    }}>
      <svg width={g} height={g} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke={C.red} strokeWidth="3" />
        <ellipse cx="20" cy="20" rx="7.5" ry="17" fill="none" stroke={C.red} strokeWidth="2.4" />
        <line x1="3" y1="20" x2="37" y2="20" stroke={C.red} strokeWidth="2.4" />
        <line x1="6.5" y1="11.5" x2="33.5" y2="11.5" stroke={C.red} strokeWidth="2" />
        <line x1="6.5" y1="28.5" x2="33.5" y2="28.5" stroke={C.red} strokeWidth="2" />
      </svg>
      <span style={{ fontFamily: FONT.display, fontVariationSettings: `"wdth" 104, "wght" 720`, fontSize: size, color: C.nickel, letterSpacing: size * 0.015, whiteSpace: "nowrap", lineHeight: 1 }}>
        {CONTACT.site}
      </span>
    </div>
  );
};

export const ThumbReel: React.FC = () => {
  const W = REEL.w, H = REEL.h;
  const a = ASSETS["black_front"];
  const floorY = 1350;
  const mh = 870;
  const mw = a ? mh * a.ar : 417;
  const neuW = 900, shivW = 920;
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={0} px={0} py={0} floorY={floorY} glow={0.9} tint="red" ring={false} dust={false} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 42% 30% at 76% 50%, rgba(190,236,255,0.16), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", fontFamily: FONT.mono, fontSize: 24, letterSpacing: 6, color: "rgba(230,236,242,0.8)" }}>
        <span style={{ color: C.red }}>◆</span> FULL BREAKDOWN · 4K
      </div>
      <Mark file="img/logo_neumann_k.png" ar={NEUMANN_AR} left={(W - neuW) / 2} top={158} width={neuW} />
      {a ? <Img src={staticFile(a.file)} style={{ position: "absolute", left: W - 56 - mw, top: floorY - mh, width: mw, height: mh }} /> : null}
      <div style={{ position: "absolute", left: 60, top: 476 }}>
        <Headline big={142} serif={112} wdth={96} name={84} />
        <div style={{ marginTop: 64 }}>
          <PatternList size={58} row={84} label={21} />
        </div>
      </div>
      <Mark file="img/logo_shivansh_k.png" ar={SHIVANSH_AR} left={(W - shivW) / 2} top={1398} width={shivW} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1716, display: "flex", justifyContent: "center" }}>
        <Website size={44} />
      </div>
    </AbsoluteFill>
  );
};

export const ThumbFilm: React.FC = () => {
  const W = FILM.w;
  const n = ASSETS["nickel_front_tall"], b = ASSETS["black_front"];
  const floorY = 880;
  const nh = 620, bh = 600;
  const nw = n ? nh * n.ar : 300, bw = b ? bh * b.ar : 297;
  const right = W - 110, gap = 44;
  const neuH = 140, shivH = 166;
  return (
    <AbsoluteFill>
      <Stage w={W} h={1080} f={0} px={0} py={0} floorY={floorY} glow={0.9} tint="red" ring={false} dust={false} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 30% 50% at 78% 58%, rgba(190,236,255,0.15), rgba(0,0,0,0) 70%)" }} />
      <Mark file="img/logo_neumann_k.png" ar={NEUMANN_AR} left={96} top={64 + (shivH - neuH) / 2} width={neuH * NEUMANN_AR} />
      <Mark file="img/logo_shivansh_k.png" ar={SHIVANSH_AR} left={W - 96 - shivH * SHIVANSH_AR} top={64} width={shivH * SHIVANSH_AR} />
      {n ? <Img src={staticFile(n.file)} style={{ position: "absolute", left: right - bw - gap - nw, top: floorY - nh, height: nh, width: nw }} /> : null}
      {b ? <Img src={staticFile(b.file)} style={{ position: "absolute", left: right - bw, top: floorY - bh, height: bh, width: bw, filter: "contrast(1.08)" }} /> : null}
      <div style={{ position: "absolute", left: 96, top: 272 }}>
        <Headline big={214} serif={128} wdth={104} name={78} />
        <div style={{ marginTop: 44, marginLeft: 6 }}>
          <Glyphs size={66} gap={26} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 96, top: 930 }}>
        <Website size={42} />
      </div>
    </AbsoluteFill>
  );
};
