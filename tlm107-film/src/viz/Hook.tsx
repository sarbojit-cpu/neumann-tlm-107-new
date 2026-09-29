import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS } from "../assets.generated.ts";
import { C } from "../theme.ts";
import { clamp, easeOutBack, easeOutCubic, lerp } from "../lib/ease.ts";
import { Glyph, PATTERNS } from "../hud/Glyphs.tsx";
import type { VizProps } from "./Shell.tsx";

// THE HOOK — frame one. The black TLM 107 rises out of the dark while its five
// pattern glyphs light, one per half-beat, around the capsule: "five
// microphones, one body" said in picture before a word is read.
export const Hook: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const W = canvas.w, H = canvas.h;
  const a = ASSETS["black_front"];
  const P = canvas.portrait;
  const mh = P ? H * 0.46 : H * 0.62;
  const mw = a ? mh * a.ar : mh * 0.6;
  const cx = P ? W / 2 : W * 0.64;
  const top = P ? H * 0.26 : H * 0.3;
  const capY = top + mh * 0.25;
  const R = P ? mw * 0.7 : mw * 0.95;
  const GR = P ? R * 1.1 : 400;
  const rise = easeOutCubic(clamp(f / 26));
  const ringQ = easeOutCubic(clamp((f - 4) / 24));
  const lit = (k: number) => clamp((f - k * beatF * 0.5) / 6);
  const angles = P ? [-60, -30, 0, 30, 60] : [-80, -40, 0, 40, 80];
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 45% at ${(cx / W) * 100}% ${(capY / H) * 100}%, rgba(190,236,255,${0.08 + 0.1 * glow}) 0%, rgba(10,12,16,0) 70%)` }} />
      {/* pressure rings, one per lit glyph */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {angles.map((_, k) => {
          const t = clamp((f - k * beatF * 0.5) / 26);
          if (t <= 0 || t >= 1) return null;
          return <circle key={k} cx={cx} cy={capY} r={lerp(R * 0.3, R * 1.9, easeOutCubic(t))} fill="none" stroke={C.led} strokeWidth={2} opacity={(1 - t) * 0.5} />;
        })}
        <circle cx={cx} cy={capY} r={R} fill="none" stroke="rgba(230,236,242,0.55)" strokeWidth={2}
          strokeDasharray={`${2 * Math.PI * R * ringQ} ${2 * Math.PI * R}`} transform={`rotate(-90 ${cx} ${capY})`} />
        <circle cx={cx} cy={capY} r={R * 1.035} fill="none" stroke="rgba(230,236,242,0.14)" strokeWidth={1} strokeDasharray="3 9" />
      </svg>
      {a ? (
        <Img
          src={staticFile(a.file)}
          style={{
            position: "absolute", left: cx - mw / 2, top: top + (1 - rise) * H * 0.06, width: mw, height: mh,
            opacity: rise,
          }}
        />
      ) : null}
      {angles.map((ang, k) => {
        const q = lit(k);
        const rad = (ang * Math.PI) / 180;
        const gx = cx + Math.sin(rad) * GR;
        const gy = capY - Math.cos(rad) * GR;
        const s = P ? 104 : 92;
        const pop = easeOutBack(q, 2.2);
        return (
          <div key={k} style={{ position: "absolute", left: gx - s / 2, top: gy - s / 2, width: s, height: s, transform: `scale(${lerp(0.4, 1, pop)})`, opacity: clamp(q * 3) }}>
            <Glyph a={PATTERNS[k].a} size={s} color={C.led} glow={8 + 10 * (1 - q) + 6 * glow} stroke={3} neg={C.redHot} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
