import React from "react";
import { C, FONT } from "../theme.ts";
import { clamp, easeInOutCubic, easeOutBack, easeOutCubic, lerp } from "../lib/ease.ts";
import { polarPaths, PATTERNS } from "../hud/Glyphs.tsx";
import { Mono, Numeral, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// ENGINEERING DIAGRAMS — the signal path, the capsule, and how two diaphragms
// make five patterns.

/** Transformerless: the output transformer is struck out of the chain. */
export const Signal: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const q = easeOutCubic(clamp(f / 12));
  const hl = clamp((f - beatF) / 10);
  const cut = easeInOutCubic(clamp((f - 3 * beatF) / 16));
  // blocks along the path
  const nodes = P
    ? [{ x: b.cx, y: b.cy - 300, l: "CAPSULE" }, { x: b.cx, y: b.cy - 140, l: "IMPEDANCE CONVERTER" }, { x: b.cx, y: b.cy + 20, l: "OUTPUT TRANSFORMER" }, { x: b.cx, y: b.cy + 180, l: "XLR OUT" }]
    : [{ x: b.cx - 420, y: b.cy - 40, l: "CAPSULE" }, { x: b.cx - 140, y: b.cy - 40, l: "IMPEDANCE\nCONVERTER" }, { x: b.cx + 140, y: b.cy - 40, l: "OUTPUT\nTRANSFORMER" }, { x: b.cx + 420, y: b.cy - 40, l: "XLR OUT" }];
  const bw = P ? 440 : 210, bh = P ? 104 : 130;
  const along = (u: number) => {
    const a = nodes[0], z = nodes[3];
    return { x: lerp(a.x, z.x, u), y: lerp(a.y, z.y, u) };
  };
  const pulses = Array.from({ length: 7 }).map((_, i) => ((f / 40 + i / 7) % 1));
  // waveform above the line: squashed lows before, full after
  const wav = (full: number) => {
    let d = "";
    const W = P ? 760 : 840, x0 = b.cx - W / 2, y = P ? b.cy + 330 : b.cy + 170;
    for (let i = 0; i <= 200; i++) {
      const u = i / 200;
      const low = Math.sin(u * Math.PI * 4 + f * 0.12);
      const sat = lerp(Math.tanh(low * 2.2) / Math.tanh(2.2) * 0.62, low, full);
      const det = 0.18 * Math.sin(u * Math.PI * 38 + f * 0.5) * (0.6 + 0.4 * full);
      d += (i ? "L" : "M") + (x0 + u * W).toFixed(1) + " " + (y - (sat + det) * 60).toFixed(1) + " ";
    }
    return d;
  };
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. T" title="SIGNAL PATH · TRANSFORMERLESS" note="SIMPLIFIED BLOCK DIAGRAM" glow={glow}>
      <svg width={2000} height={2600} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: q }}>
        <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[3].x} y2={nodes[3].y} stroke="rgba(221,246,255,0.45)" strokeWidth={3} />
        {pulses.map((u, i) => {
          const p = along(u);
          const blocked = cut < 0.5 && ((P ? p.y > nodes[2].y - bh / 2 && p.y < nodes[2].y + bh / 2 : p.x > nodes[2].x - bw / 2 && p.x < nodes[2].x + bw / 2));
          return <circle key={i} cx={p.x} cy={p.y} r={7} fill={C.led} opacity={blocked ? 0.25 : 0.9} style={{ filter: `drop-shadow(0 0 10px ${C.ledGlow})` }} />;
        })}
        <path d={wav(cut)} fill="none" stroke={cut > 0.5 ? C.led : C.steel} strokeWidth={3} style={{ filter: cut > 0.5 ? `drop-shadow(0 0 8px ${C.ledGlow})` : undefined }} />
      </svg>
      {nodes.map((n, i) => {
        const isT = i === 2;
        const o = isT ? 1 - cut * 0.85 : 1;
        const s = isT ? lerp(1, 0.86, cut) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: n.x - bw / 2, top: n.y - bh / 2, width: bw, height: bh, borderRadius: 16, border: `2px ${isT ? "dashed" : "solid"} ${isT && hl > 0 ? `rgba(255,77,99,${0.5 + 0.5 * hl})` : "rgba(230,236,242,0.4)"}`, background: i === 0 ? "radial-gradient(circle at 50% 40%, rgba(214,180,116,0.35), rgba(20,22,26,0.9) 70%)" : "rgba(18,21,27,0.9)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: o * q, transform: `scale(${s})`, whiteSpace: "pre-line" }}>
            <Mono size={P ? 20 : 17} color={isT ? C.redHot : C.nickel} weight={700} ls={2}>{n.l}</Mono>
            {isT ? (
              <svg width={bw} height={bh} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <line x1={-10} y1={-10} x2={-10 + (bw + 20) * cut} y2={-10 + (bh + 20) * cut} stroke={C.redHot} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.red})` }} />
                <line x1={bw + 10} y1={-10} x2={bw + 10 - (bw + 20) * cut} y2={-10 + (bh + 20) * cut} stroke={C.redHot} strokeWidth={6} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.red})` }} />
              </svg>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: b.cx - b.w / 2, top: P ? b.cy + 410 : b.cy + 250, width: b.w, display: "flex", justifyContent: "space-between", opacity: cut }}>
        <Mono size={P ? 20 : 18} color={C.led} weight={700}>NO OUTPUT TRANSFORMER</Mono>
        <Mono size={P ? 20 : 18} color={C.led} weight={700}>FULL, UNRESTRICTED BASS</Mono>
      </div>
    </VizShell>
  );
};

/** The capsule, exploded, with callouts. */
export const Capsule: React.FC<VizProps> = ({ f, dur, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const q = easeOutCubic(clamp(f / 12));
  const ex = easeInOutCubic(clamp(f / (1.2 * beatF)));
  const rot = lerp(-38, -22, clamp(f / Math.max(1, dur)));
  const cx = P ? b.cx : b.cx - 150, cy = b.cy + 10;
  const D = P ? 380 : 360;
  const disc = (dx: number, kind: "front" | "back" | "plate") => (
    <div style={{ position: "absolute", left: cx - D / 2 + dx, top: cy - D / 2, width: D, height: D, borderRadius: "50%", transform: `perspective(1400px) rotateY(${rot}deg)`,
      background: kind === "plate" ? `radial-gradient(circle at 40% 35%, #b39055, ${C.goldDeep} 70%)` : `radial-gradient(circle at 38% 32%, #fff3d6 0%, ${C.gold} 35%, #a8843f 75%, #6d5324 100%)`,
      boxShadow: `0 0 0 ${kind === "plate" ? 10 : 6}px rgba(120,95,50,0.9), 0 20px 60px rgba(0,0,0,0.6), 0 0 ${30 + 30 * glow}px rgba(214,180,116,0.25)`,
      opacity: kind === "plate" ? 1 : 0.94 }}>
      {kind === "plate" ? (
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", backgroundImage: "radial-gradient(circle, rgba(40,30,12,0.85) 5px, transparent 6px)", backgroundSize: "34px 34px" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), rgba(255,255,255,0) 40%)" }} />
      )}
    </div>
  );
  const sep = lerp(0, P ? 120 : 150, ex);
  const call = (k: number, x: number, y: number, tx: number, ty: number, text: string) => {
    const t = easeOutCubic(clamp((f - k * beatF) / 12));
    return (
      <g opacity={t}>
        <circle cx={x} cy={y} r={7} fill={C.led} style={{ filter: `drop-shadow(0 0 8px ${C.ledGlow})` }} />
        <path d={`M ${x} ${y} L ${lerp(x, tx, t)} ${lerp(y, ty, t)} L ${lerp(x, tx + (tx > x ? 60 : -60), t)} ${lerp(y, ty, t)}`} fill="none" stroke={C.led} strokeWidth={2} />
        <text x={tx + (tx > x ? 76 : -76)} y={ty + 7} fill={C.nickel} fontFamily={FONT.mono} fontSize={P ? 21 : 19} fontWeight={700} letterSpacing={3} textAnchor={tx > x ? "start" : "end"}>{text}</text>
      </g>
    );
  };
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. K" title="CAPSULE · EXPLODED VIEW" note="SCHEMATIC · NOT TO SCALE" glow={glow}>
      <div style={{ position: "absolute", inset: 0, opacity: q }}>
        {disc(-sep, "back")}
        {disc(0, "plate")}
        {disc(sep, "front")}
      </div>
      <svg width={2000} height={2600} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {P ? (
          <>
            {call(1, cx - sep, cy - D * 0.3, cx - 180, cy - D * 0.75, "DUAL DIAPHRAGM")}
            {call(2, cx + sep + D * 0.2, cy + D * 0.2, cx + 120, cy + D * 0.75, "EDGE-TERMINATED")}
            {call(3, cx, cy + D * 0.4, cx - 150, cy + D * 0.95, "NEW · FOR THE TLM 107")}
          </>
        ) : (
          <>
            {call(1, cx - sep, cy - D * 0.32, cx + 380, cy - D * 0.5, "DUAL DIAPHRAGM")}
            {call(2, cx + sep + D * 0.3, cy, cx + 380, cy, "EDGE-TERMINATED")}
            {call(3, cx + sep * 0.3, cy + D * 0.4, cx + 380, cy + D * 0.5, "NEW · FOR THE TLM 107")}
          </>
        )}
      </svg>
    </VizShell>
  );
};

/** Two diaphragms, one sum: a = (1 + g) / 2. */
export const Dual: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const q = easeOutCubic(clamp(f / 12));
  // g steps: cardioid → omni (beat 2) → figure-8 (beat 4) → cardioid (beat 6)
  const keys = [{ t: 0, g: 0 }, { t: 2, g: 1 }, { t: 4, g: -1 }, { t: 6, g: 0 }];
  let g = 0;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (f >= k.t * beatF) {
      const prev = i ? keys[i - 1].g : 0;
      g = lerp(prev, k.g, easeInOutCubic(clamp((f - k.t * beatF) / 14)));
    }
  }
  const a = (1 + g) / 2;
  const name = PATTERNS.reduce((best, p) => (Math.abs(p.a - a) < Math.abs(best.a - a) ? p : best), PATTERNS[0]).name;
  const lx = P ? b.cx : b.cx - 260, ly = P ? b.cy - 220 : b.cy;
  const px = P ? b.cx : b.cx + 260, py = P ? b.cy + 200 : b.cy;
  const R = P ? 170 : 190;
  const { pos, neg } = polarPaths(a, px, py, R * easeOutCubic(q), 200);
  return (
    <VizShell canvas={canvas} f={f} fig="FIG. Σ" title="TWO DIAPHRAGMS · FIVE PATTERNS" note="BACK-TO-BACK CARDIOIDS · a = (1 + g) / 2" glow={glow}>
      <svg width={2000} height={2600} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: q }}>
        {/* diaphragms, side view */}
        <line x1={lx - 50} y1={ly - 120} x2={lx - 50} y2={ly + 120} stroke={C.gold} strokeWidth={6} />
        <line x1={lx} y1={ly - 130} x2={lx} y2={ly + 130} stroke={C.goldDeep} strokeWidth={14} strokeDasharray="6 10" />
        <line x1={lx + 50} y1={ly - 120} x2={lx + 50} y2={ly + 120} stroke={C.gold} strokeWidth={6} opacity={0.35 + 0.65 * Math.abs(g)} />
        <text x={lx - 50} y={ly + 164} fill={C.nickel} fontFamily={FONT.mono} fontSize={P ? 18 : 16} textAnchor="middle" letterSpacing={2}>FRONT</text>
        <text x={lx + 50} y={ly + 164} fill={C.nickel} fontFamily={FONT.mono} fontSize={P ? 18 : 16} textAnchor="middle" letterSpacing={2}>BACK</text>
        {/* sum node */}
        <circle cx={lx + (P ? 190 : 150)} cy={ly - (P ? 0 : 0)} r={34} fill="rgba(18,21,27,0.95)" stroke={C.led} strokeWidth={2.5} />
        <text x={lx + (P ? 190 : 150)} y={ly + 12} fill={C.led} fontFamily={FONT.serif} fontStyle="italic" fontSize={38} textAnchor="middle">Σ</text>
        <path d={`M ${lx - 50} ${ly - 120} C ${lx - 50} ${ly - 200}, ${lx + 150} ${ly - 150}, ${lx + (P ? 170 : 130)} ${ly - 24}`} fill="none" stroke="rgba(221,246,255,0.5)" strokeWidth={2} />
        <path d={`M ${lx + 50} ${ly + 120} C ${lx + 50} ${ly + 200}, ${lx + 150} ${ly + 150}, ${lx + (P ? 170 : 130)} ${ly + 24}`} fill="none" stroke={g < 0 ? C.redHot : "rgba(221,246,255,0.5)"} strokeWidth={2} />
        {/* pattern */}
        <circle cx={px} cy={py} r={R} fill="none" stroke="rgba(230,236,242,0.14)" strokeWidth={1.2} />
        <circle cx={px} cy={py} r={R / 2} fill="none" stroke="rgba(230,236,242,0.1)" strokeWidth={1} strokeDasharray="4 8" />
        <path d={pos} fill="rgba(221,246,255,0.12)" stroke={C.led} strokeWidth={4} style={{ filter: `drop-shadow(0 0 ${8 + 8 * glow}px ${C.ledGlow})` }} />
        {neg ? <path d={neg} fill="rgba(225,38,63,0.12)" stroke={C.redHot} strokeWidth={3} /> : null}
      </svg>
      <div style={{ position: "absolute", left: P ? b.cx - b.w / 2 : lx - 120, top: P ? b.cy - 20 : b.cy + 210, display: "flex", flexDirection: "column", gap: 6, opacity: q }}>
        <Mono size={P ? 20 : 18} color="rgba(230,236,242,0.7)">BACK GAIN g = {g >= 0 ? "+" : "−"}{Math.abs(g).toFixed(2)}</Mono>
        <Mono size={P ? 24 : 21} color={C.led} weight={700}>{name}</Mono>
      </div>
      <div style={{ position: "absolute", left: px + R + (P ? -40 : 30), top: py - R - (P ? 50 : 10), opacity: q }}>
        <Numeral size={P ? 42 : 38} color={C.nickel}>a = {a.toFixed(2)}</Numeral>
      </div>
    </VizShell>
  );
};

export { easeOutBack };
