import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme.ts";
import { clamp, easeInCubic, easeInOutCubic, easeOutCubic, easeOutExpo, lerp } from "../lib/ease.ts";

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS — every one is built from a part of the microphone.
//
//   iris / flashIris   the red rhombus badge opening like an aperture
//   ring               a clock wipe traced by the chrome pattern ring
//   mesh               the head grille: a dot lattice that grows until solid
//   slats              the grille's vertical bars dropping in
//   shutter            a cinema shutter — the camera rig's own cut
//   whip / whipR       gimbal whip-pan, both frames slide, directional blur
//   punch              punch-in with a light hit
//   zoomThru           the old frame rushes past the lens, the new one lands
//   rack               a focus pull: the old frame defocuses, the new resolves
//   sweep              an anamorphic light streak wiping the lens
//   dip                through black
//   fadeIn             open from black, focusing in
//
// The incoming layer owns the transition (it is on top); the outgoing layer
// gets the matching exit (slide, defocus, recede) so there is never a muddy
// double exposure — old content leaves, then new content lands.
// ─────────────────────────────────────────────────────────────────────────────

type Box = { w: number; h: number; id: string };

const Hblur = ({ id, x }: { id: string; x: number }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-20%" y="-5%" width="140%" height="110%">
      <feGaussianBlur stdDeviation={`${x} 0`} />
    </filter>
  </svg>
);

/** Style for the incoming shot's content + an overlay drawn over both shots. */
export const transIn = (kind: string, t: number, b: Box): { style: React.CSSProperties; over?: React.ReactNode } => {
  if (t >= 1) return { style: {} };
  const e = easeInOutCubic(t);
  switch (kind) {
    case "fadeIn":
      return { style: { opacity: Math.pow(t, 1.3), filter: `blur(${lerp(18, 0, easeOutCubic(t))}px)`, transform: `scale(${lerp(1.05, 1, easeOutCubic(t))})` } };
    case "punch":
      return {
        style: { transform: `scale(${lerp(1.3, 1, easeOutExpo(t))})`, filter: `brightness(${lerp(1.9, 1, easeOutCubic(t))})` },
        over: <AbsoluteFill style={{ background: "#fff", opacity: Math.pow(1 - t, 2.5) * 0.45 }} />,
      };
    case "whip":
    case "whipR": {
      const dir = kind === "whip" ? 1 : -1;
      const bx = Math.sin(Math.PI * clamp(t)) * 70;
      return {
        style: { transform: `translateX(${dir * (1 - e) * 100}%)`, filter: bx > 1 ? `url(#wi-${b.id})` : undefined },
        over: <Hblur id={`wi-${b.id}`} x={bx} />,
      };
    }
    case "slats": {
      const N = b.w > b.h ? 9 : 6;
      const imgs: string[] = [], sizes: string[] = [], pos: string[] = [];
      for (let i = 0; i < N; i++) {
        const p = easeOutCubic(clamp((t - i * 0.055) / (1 - 0.055 * (N - 1))));
        imgs.push("linear-gradient(#000,#000)");
        sizes.push(`${100 / N + 0.3}% ${p * 100}%`);
        pos.push(`${(i * 100) / (N - 1)}% ${i % 2 ? "100%" : "0%"}`);
      }
      const m = { maskImage: imgs.join(","), maskSize: sizes.join(","), maskPosition: pos.join(","), maskRepeat: "no-repeat" };
      return { style: { ...m, WebkitMaskImage: m.maskImage, WebkitMaskSize: m.maskSize, WebkitMaskPosition: m.maskPosition, WebkitMaskRepeat: "no-repeat" } as React.CSSProperties };
    }
    case "zoomThru": {
      const q = clamp((t - 0.3) / 0.7);
      return { style: { opacity: easeOutCubic(q), transform: `scale(${lerp(0.72, 1, easeOutCubic(q))})`, filter: `blur(${lerp(14, 0, easeOutCubic(q))}px)` } };
    }
    case "iris":
    case "flashIris": {
      const cx = b.w / 2, cy = b.h / 2;
      const R = (b.w + b.h) * 0.56;
      const r = R * (kind === "flashIris" ? easeOutExpo(t) : e);
      const poly = `polygon(${cx}px ${cy - r}px, ${cx + r}px ${cy}px, ${cx}px ${cy + r}px, ${cx - r}px ${cy}px)`;
      const outline = (
        <svg width={b.w} height={b.h} style={{ position: "absolute", inset: 0 }}>
          <polygon
            points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
            fill="none"
            stroke={C.redHot}
            strokeWidth={3}
            opacity={(1 - t) * 0.9}
            style={{ filter: `drop-shadow(0 0 10px ${C.red})` }}
          />
          <polygon
            points={`${cx},${cy - r * 0.94} ${cx + r * 0.94},${cy} ${cx},${cy + r * 0.94} ${cx - r * 0.94},${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={1}
            opacity={(1 - t) * 0.8}
          />
        </svg>
      );
      const flash = kind === "flashIris" ? <AbsoluteFill style={{ background: "#fff", opacity: Math.pow(1 - t, 3) * 0.75 }} /> : null;
      return {
        style: { clipPath: poly, transform: kind === "flashIris" ? `scale(${lerp(1.12, 1, easeOutCubic(t))})` : undefined },
        over: (
          <>
            {outline}
            {flash}
          </>
        ),
      };
    }
    case "shutter": {
      const close = t < 0.45 ? easeInCubic(t / 0.45) : 1 - easeOutCubic((t - 0.45) / 0.55);
      const bar = (top: boolean) => (
        <div
          style={{
            position: "absolute", left: 0, right: 0, height: `${close * 50.5}%`, [top ? "top" : "bottom"]: 0,
            background: "linear-gradient(180deg,#07080a,#000)", boxShadow: `0 0 40px rgba(0,0,0,0.9)`,
            borderBottom: top ? "1px solid rgba(255,255,255,0.12)" : undefined, borderTop: top ? undefined : "1px solid rgba(255,255,255,0.12)",
          }}
        />
      );
      return { style: { opacity: t < 0.45 ? 0 : 1 }, over: <>{bar(true)}{bar(false)}</> };
    }
    case "rack": {
      const q = clamp((t - 0.2) / 0.6);
      return { style: { opacity: easeInOutCubic(q), filter: `blur(${lerp(22, 0, easeOutCubic(t))}px)`, transform: `scale(${lerp(1.06, 1, easeOutCubic(t))})` } };
    }
    case "sweep": {
      const x = lerp(-12, 112, e);
      const g = `linear-gradient(90deg, #000 0%, #000 ${x - 5}%, transparent ${x + 1}%)`;
      return {
        style: { maskImage: g, WebkitMaskImage: g },
        over: (
          <>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x - 4}%`, width: "8%", background: "linear-gradient(90deg, rgba(221,246,255,0) 0%, rgba(221,246,255,0.55) 50%, rgba(221,246,255,0) 100%)", opacity: Math.sin(Math.PI * t) * 0.8 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "linear-gradient(90deg, transparent, rgba(190,236,255,0.9), transparent)", opacity: Math.sin(Math.PI * t) * 0.8, boxShadow: "0 0 18px rgba(190,236,255,0.8)" }} />
          </>
        ),
      };
    }
    case "mesh": {
      const cell = 28;
      const R = lerp(0, cell * 0.74, easeInOutCubic(clamp(t / 0.8)));
      const wipe = lerp(-40, 140, easeInOutCubic(clamp((t - 0.25) / 0.75)));
      const img = `radial-gradient(circle at center, #000 ${R}px, transparent ${R + 1.2}px), linear-gradient(135deg, #000 ${wipe - 30}%, transparent ${wipe}%)`;
      return {
        style: {
          maskImage: img, WebkitMaskImage: img, maskSize: `${cell}px ${cell}px, 100% 100%`, WebkitMaskSize: `${cell}px ${cell}px, 100% 100%`,
          maskRepeat: "repeat, no-repeat", WebkitMaskRepeat: "repeat, no-repeat", maskComposite: "add", WebkitMaskComposite: "source-over",
        } as React.CSSProperties,
      };
    }
    case "ring": {
      const A = 360 * e;
      const g = `conic-gradient(from 0deg at 50% 50%, #000 ${Math.max(0, A - 8)}deg, transparent ${A}deg)`;
      const rr = Math.min(b.w, b.h) * 0.3;
      const circ = 2 * Math.PI * rr;
      const hx = b.w / 2 + rr * Math.sin((A * Math.PI) / 180);
      const hy = b.h / 2 - rr * Math.cos((A * Math.PI) / 180);
      return {
        style: { maskImage: g, WebkitMaskImage: g },
        over: (
          <svg width={b.w} height={b.h} style={{ position: "absolute", inset: 0, opacity: Math.sin(Math.PI * t) }}>
            <defs>
              <linearGradient id={`chrome-${b.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" />
                <stop offset="0.45" stopColor="#8d96a3" />
                <stop offset="0.55" stopColor="#f4f7fa" />
                <stop offset="1" stopColor="#6c7480" />
              </linearGradient>
            </defs>
            <circle cx={b.w / 2} cy={b.h / 2} r={rr} fill="none" stroke={`url(#chrome-${b.id})`} strokeWidth={4}
              strokeDasharray={`${(A / 360) * circ} ${circ}`} transform={`rotate(-90 ${b.w / 2} ${b.h / 2})`} />
            <circle cx={hx} cy={hy} r={7} fill={C.led} style={{ filter: `drop-shadow(0 0 12px ${C.ledGlow})` }} />
          </svg>
        ),
      };
    }
    case "dip": {
      const black = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5;
      return { style: { opacity: t < 0.5 ? 0 : 1 }, over: <AbsoluteFill style={{ background: C.ink, opacity: easeInOutCubic(black) }} /> };
    }
    default:
      return { style: {} };
  }
};

/** Style for the outgoing shot while the next one arrives over it. */
export const transOut = (kind: string, t: number, b: Box): { style: React.CSSProperties; defs?: React.ReactNode } => {
  if (t <= 0) return { style: {} };
  const e = easeInOutCubic(t);
  switch (kind) {
    case "whip":
    case "whipR": {
      const dir = kind === "whip" ? -1 : 1;
      const bx = Math.sin(Math.PI * clamp(t)) * 70;
      return { style: { transform: `translateX(${dir * e * 100}%)`, filter: bx > 1 ? `url(#wo-${b.id})` : undefined }, defs: <Hblur id={`wo-${b.id}`} x={bx} /> };
    }
    case "zoomThru":
      return { style: { transform: `scale(${1 + 1.5 * easeInCubic(t)})`, filter: `blur(${16 * t}px)`, opacity: 1 - easeInCubic(clamp(t / 0.8)) } };
    case "rack":
      return { style: { filter: `blur(${22 * easeOutCubic(clamp(t / 0.7))}px)`, transform: `scale(${1 + 0.05 * t})` } };
    case "iris":
    case "ring":
    case "mesh":
    case "slats":
      return { style: { transform: `scale(${1 - 0.05 * e})`, filter: `brightness(${1 - 0.45 * e})` } };
    default:
      return { style: {} };
  }
};
