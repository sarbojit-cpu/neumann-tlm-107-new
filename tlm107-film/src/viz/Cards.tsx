import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS } from "../assets.generated.ts";
import { C, FONT } from "../theme.ts";
import { clamp, easeOutBack, easeOutCubic, lerp } from "../lib/ease.ts";
import { Stage } from "../shots/Stage.tsx";
import { Mono, Numeral, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// SPEC TILES · DIMENSIONS · AWARDS · THE NEUMANN CHAIN

const SPECS = [
  { v: 11, fmt: (x: number) => x.toFixed(0), unit: "mV/Pa", label: "SENSITIVITY" },
  { v: 10, fmt: (x: number) => x.toFixed(0), unit: "dB-A", label: "SELF-NOISE" },
  { v: 131, fmt: (x: number) => x.toFixed(0), unit: "dB", label: "DYNAMIC RANGE" },
  { v: 20, fmt: (x: number) => `${x.toFixed(0)}–20k`, unit: "Hz", label: "FREQUENCY RANGE" },
];

export const Specs: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const cols = P ? 2 : 2, rows = 2;
  const gw = P ? 900 : 1040, gh = P ? 720 : 600;
  const gap = 26;
  const tw = (gw - gap * (cols - 1)) / cols, th = (gh - gap * (rows - 1)) / rows;
  const x0 = b.cx - gw / 2, y0 = b.cy - gh / 2 + 20;
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. 107" title="TECHNICAL DATA" note="PUBLISHED TLM 107 DATA" glow={glow}>
      {SPECS.map((s, i) => {
        const t = clamp((f - i * 3 * beatF) / 14);
        const n = lerp(0, s.v, easeOutCubic(clamp((f - i * 3 * beatF) / 24)));
        const c = i % cols, r = Math.floor(i / cols);
        const k = easeOutBack(t, 1.3);
        return (
          <div key={i} style={{ position: "absolute", left: x0 + c * (tw + gap), top: y0 + r * (th + gap), width: tw, height: th, borderRadius: 26, padding: P ? "34px 34px" : "30px 36px", boxSizing: "border-box",
            background: "linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.015))", border: "1.5px solid rgba(230,236,242,0.18)", boxShadow: `0 30px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`,
            opacity: clamp(t * 2), transform: `translateY(${(1 - k) * 40}px) scale(${lerp(0.94, 1, k)})`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Mono size={P ? 19 : 17} color="rgba(230,236,242,0.7)"><span style={{ color: C.red }}>◆</span> {s.label}</Mono>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <Numeral size={P ? (i === 3 ? 96 : 150) : i === 3 ? 100 : 140} color={C.nickel} style={{ textShadow: `0 0 ${20 * glow}px rgba(190,236,255,0.3)` }}>{s.fmt(n)}</Numeral>
              <Mono size={P ? 26 : 24} color={C.led} weight={700}>{s.unit}</Mono>
            </div>
          </div>
        );
      })}
    </VizShell>
  );
};

export const Dims: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const P = canvas.portrait;
  const W = canvas.w, H = canvas.h;
  const a = ASSETS["nickel_front_tall"];
  const mh = P ? H * 0.52 : H * 0.72;
  const mw = a ? mh * a.ar : mh * 0.6;
  const cx = P ? W / 2 - 60 : W * 0.62, top = P ? H * 0.16 : H * 0.12;
  const q = easeOutCubic(clamp(f / 14));
  const l1 = easeOutCubic(clamp((f - beatF) / 16));
  const l2 = easeOutCubic(clamp((f - 2.5 * beatF) / 16));
  const l3 = easeOutBack(clamp((f - 4 * beatF) / 14), 1.6);
  const rx = cx + mw / 2 + 60;
  const dy = top + mh * 0.42;
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={0} py={0} floorY={top + mh} glow={glow} tint="warm" />
      {a ? <Img src={staticFile(a.file)} style={{ position: "absolute", left: cx - mw / 2, top, width: mw, height: mh, opacity: q }} /> : null}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* length */}
        <line x1={rx} y1={top} x2={rx} y2={lerp(top, top + mh, l1)} stroke={C.led} strokeWidth={2.5} />
        <line x1={rx - 16} y1={top} x2={rx + 16} y2={top} stroke={C.led} strokeWidth={2.5} opacity={l1} />
        <line x1={rx - 16} y1={top + mh} x2={rx + 16} y2={top + mh} stroke={C.led} strokeWidth={2.5} opacity={l1} />
        <line x1={cx} y1={top} x2={rx} y2={top} stroke="rgba(221,246,255,0.35)" strokeDasharray="4 6" opacity={l1} />
        {/* diameter */}
        <line x1={cx - mw / 2} y1={dy + mh * 0.62} x2={lerp(cx - mw / 2, cx + mw / 2, l2)} y2={dy + mh * 0.62} stroke={C.redHot} strokeWidth={2.5} />
        <line x1={cx - mw / 2} y1={dy + mh * 0.62 - 14} x2={cx - mw / 2} y2={dy + mh * 0.62 + 14} stroke={C.redHot} strokeWidth={2.5} opacity={l2} />
        <line x1={cx + mw / 2} y1={dy + mh * 0.62 - 14} x2={cx + mw / 2} y2={dy + mh * 0.62 + 14} stroke={C.redHot} strokeWidth={2.5} opacity={l2} />
      </svg>
      <div style={{ position: "absolute", left: rx + 24, top: top + mh / 2 - 40, opacity: l1 }}>
        <Numeral size={P ? 76 : 70}>145</Numeral><Mono size={P ? 22 : 20} color={C.led} weight={700} style={{ marginLeft: 10 }}>mm</Mono>
        <div><Mono size={P ? 16 : 15} color="rgba(230,236,242,0.6)">LENGTH</Mono></div>
      </div>
      <div style={{ position: "absolute", left: cx - 110, width: 220, textAlign: "center", top: dy + mh * 0.62 + 24, opacity: l2 }}>
        <Numeral size={P ? 64 : 58} color={C.redHot}>Ø 64</Numeral><Mono size={P ? 20 : 18} color={C.redHot} weight={700} style={{ marginLeft: 8 }}>mm</Mono>
      </div>
      <div style={{ position: "absolute", left: P ? cx - mw / 2 - 230 : cx - mw / 2 - 330, top: top + mh * 0.18, width: P ? 200 : 240, height: P ? 200 : 240, borderRadius: "50%", border: `2px solid ${C.gold}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${l3})`, background: "radial-gradient(circle, rgba(214,180,116,0.14), rgba(214,180,116,0) 70%)", boxShadow: `0 0 ${20 + 20 * glow}px rgba(214,180,116,0.25)` }}>
        <Numeral size={P ? 70 : 84} color={C.gold}>445</Numeral>
        <Mono size={P ? 20 : 22} color={C.gold} weight={700}>GRAMS</Mono>
      </div>
    </AbsoluteFill>
  );
};

const Laurel: React.FC<{ x: number; y: number; s: number; flip?: boolean; q: number }> = ({ x, y, s, flip, q }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={q}>
    <path d="M 0 60 C -30 30, -34 -10, -14 -48" fill="none" stroke={C.gold} strokeWidth={3} />
    {Array.from({ length: 7 }).map((_, i) => {
      const t = i / 6;
      const px = lerp(0, -14, t) - 28 * Math.sin(Math.PI * t) * 0.9;
      const py = lerp(60, -48, t);
      return <ellipse key={i} cx={px - 12} cy={py} rx={13} ry={5.5} fill={C.gold} transform={`rotate(${-40 + t * 60} ${px - 12} ${py})`} opacity={clamp(q * 7 - i)} />;
    })}
  </g>
);

export const Awards: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const P = canvas.portrait;
  const W = canvas.w, H = canvas.h;
  const a = ASSETS["black_front"];
  const mh = P ? H * 0.42 : H * 0.62;
  const mw = a ? mh * a.ar : mh * 0.6;
  const q = easeOutCubic(clamp(f / 16));
  const items = [
    { k: 1, top: "BEST OF SHOW", big: "AES", year: "2013", sub: "PRO SOUND NEWS" },
    { k: 3, top: "WINNER", big: "TEC", year: "2014", sub: "TEC AWARDS" },
  ];
  const pw = P ? 440 : 420, ph = P ? 360 : 400;
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={0} py={0} floorY={P ? H * 0.64 : H * 0.8} glow={glow} tint="warm" />
      {a ? <Img src={staticFile(a.file)} style={{ position: "absolute", left: W / 2 - mw / 2, top: P ? H * 0.64 - mh : H * 0.8 - mh, width: mw, height: mh, opacity: q * 0.75 }} /> : null}
      {items.map((it, i) => {
        const t = easeOutBack(clamp((f - it.k * beatF) / 16), 1.4);
        const x = P ? W / 2 - pw / 2 + (i ? 1 : -1) * 0 : i ? W / 2 + mw / 2 + 60 : W / 2 - mw / 2 - 60 - pw;
        const y = P ? (i ? H * 0.2 + ph + 30 : H * 0.2) - H * 0.02 : H * 0.22;
        const xx = P ? (i ? W - pw - 70 : 70) : x;
        const yy = P ? H * 0.19 + (i ? 60 : 0) : y;
        return (
          <div key={i} style={{ position: "absolute", left: xx, top: yy, width: pw, height: ph, opacity: clamp(t * 2), transform: `translateY(${(1 - t) * 50}px) scale(${lerp(0.9, 1, t)})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(160deg, rgba(40,34,24,0.92), rgba(12,12,14,0.92))", border: `1.5px solid rgba(214,180,116,0.6)`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${24 + 20 * glow}px rgba(214,180,116,0.18), inset 0 1px 0 rgba(255,236,200,0.25)` }} />
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0 }}>
              <Laurel x={pw / 2 - (P ? 120 : 115)} y={ph / 2 + 10} s={P ? 1.35 : 1.4} q={clamp(t)} />
              <Laurel x={pw / 2 + (P ? 120 : 115)} y={ph / 2 + 10} s={P ? 1.35 : 1.4} flip q={clamp(t)} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Mono size={P ? 17 : 17} color={C.gold} weight={700} ls={4}>{it.top}</Mono>
              <span style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: P ? 110 : 120, lineHeight: 1, color: "#F4E6C8" }}>{it.big}</span>
              <Numeral size={P ? 44 : 46} color={C.gold} wdth={120}>{it.year}</Numeral>
              <Mono size={P ? 14 : 14} color="rgba(244,230,200,0.6)">{it.sub}</Mono>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ECO_MAIN = ["eco_monitor_a", "eco_headphones_a", "eco_monitor_b", "eco_sub", "eco_monitor_c", "eco_headphones_b", "eco_ma1", "tube_mic_psu"];
const ECO_MORE = ["eco_clip_kk", "eco_hanging", "eco_dark_mic", "eco_black_mic", "u87_eco"];

export const Ecosystem: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const P = canvas.portrait;
  const W = canvas.w, H = canvas.h;
  const hero = ASSETS["black_ea4"];
  const hx = W / 2, floorY = P ? H * 0.6 : H * 0.8;
  const hh = P ? H * 0.3 : H * 0.46;
  const hw = hero ? hh * hero.ar : hh * 0.7;
  const R = P ? 420 : 760;
  const q = easeOutCubic(clamp(f / 14));
  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={0} py={0} floorY={floorY} glow={glow} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {ECO_MAIN.map((slug, i) => {
          const t = clamp((f - i * 0.75 * beatF) / 14);
          const ang = lerp(-78, 78, i / (ECO_MAIN.length - 1)) * (Math.PI / 180);
          const x = hx + Math.sin(ang) * R;
          const y = floorY - hh * 0.55 - Math.cos(ang) * R * (P ? 0.55 : 0.42);
          return <path key={slug} d={`M ${hx} ${floorY - hh * 0.72} Q ${(hx + x) / 2} ${Math.min(y, floorY - hh) - 80} ${x} ${y}`} fill="none" stroke={C.led} strokeWidth={2} strokeDasharray="5 9" strokeDashoffset={-f * 1.5} opacity={t * 0.55} />;
        })}
      </svg>
      {hero ? <Img src={staticFile(hero.file)} style={{ position: "absolute", left: hx - hw / 2, top: floorY - hh, width: hw, height: hh, opacity: q }} /> : null}
      {ECO_MAIN.map((slug, i) => {
        const a = ASSETS[slug];
        if (!a) return null;
        const t = easeOutBack(clamp((f - i * 0.75 * beatF) / 14), 1.5);
        const ang = lerp(-78, 78, i / (ECO_MAIN.length - 1)) * (Math.PI / 180);
        const x = hx + Math.sin(ang) * R;
        const y = floorY - hh * 0.55 - Math.cos(ang) * R * (P ? 0.55 : 0.42);
        const s = P ? 190 : 230;
        let w = s, h = s / a.ar;
        if (h > s) { h = s; w = s * a.ar; }
        return <Img key={slug} src={staticFile(a.file)} style={{ position: "absolute", left: x - w / 2, top: y - h / 2 - (1 - t) * 60, width: w, height: h, opacity: clamp(t * 2), transform: `scale(${lerp(0.7, 1, t)})` }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY + (P ? 40 : 24), display: "flex", justifyContent: "center", gap: P ? 24 : 40 }}>
        {ECO_MORE.map((slug, i) => {
          const a = ASSETS[slug];
          if (!a) return null;
          const t = easeOutCubic(clamp((f - (6 + i * 0.4) * beatF) / 12));
          const h = P ? 150 : 130;
          return <Img key={slug} src={staticFile(a.file)} style={{ height: h, width: h * a.ar, opacity: t * 0.85, transform: `translateY(${(1 - t) * 30}px)` }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: P ? H * 0.16 : 120, display: "flex", justifyContent: "center", gap: 40, opacity: q }}>
        {["MICROPHONES", "MONITORS", "HEADPHONES"].map((l) => <Mono key={l} size={P ? 18 : 17} color="rgba(230,236,242,0.7)"><span style={{ color: C.red }}>◆</span> {l}</Mono>)}
      </div>
    </AbsoluteFill>
  );
};
