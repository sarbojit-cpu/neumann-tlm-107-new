import React from "react";
import { C, FONT, type Canvas } from "../theme.ts";
import { clamp, easeInCubic, easeOutCubic, easeOutExpo, lerp } from "../lib/ease.ts";
import type { Window } from "../plan.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE PRESSURE LOCKUP — the burned-in caption of this film.
//
//     ◆ 07 ──────── INSIDE                     slate: mono, rhombus bullet,
//                                              index, a hairline that draws
//     TWENTY HERTZ TO                          heading: Anybody, uppercase —
//     20 kHz                                   words arrive compressed (wdth
//     ∿∿∿∿∿∿∿∿───────────                       50) and snap open past full
//                                              width like a diaphragm taking a
//                                              pressure wave, then settle
//                                              emphasis: Instrument Serif
//                                              italic, revealed left to right,
//                                              underlined by a sine that decays
//                                              into a straight hairline —
//                                              sound becoming signal
//
// The lockup arrives as one gesture at the start of its window and holds, so
// it never depends on per-word voice timing and cannot drift from the read.
// The layer that owns it sits at TYPE_OPACITY so the picture reads through.
// ─────────────────────────────────────────────────────────────────────────────

const KEEP = /[0-9]|^(dB|kHz|Hz|mV|Pa|V|g|mm|TLM|EA|AES|TEC)$/;
const LOWER = new Set(["OR", "AND", "OF"]);

/** Emphasis words read in serif italic; titles are set in title case unless
 *  they carry numbers or units. */
export const emphasisCase = (k: string) =>
  LOWER.has(k) ? k.toLowerCase() : k
    .split(" ")
    .map((w) => (KEEP.test(w.replace(/[^A-Za-z0-9]/g, "")) || /[0-9]/.test(k) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");

export const splitCaption = (t: string, e: string) => {
  const i = e ? t.indexOf(e) : -1;
  if (i < 0) return { before: t, key: "", after: "" };
  // separators never dangle at the seam between the display face and the serif
  const before = t.slice(0, i).trim().replace(/[\s·–-]+$/, "");
  const after = t.slice(i + e.length).trim().replace(/^[\s·–-]+/, "");
  return { before, key: e.trim(), after };
};

const Word: React.FC<{ w: string; f: number; d: number; out: number; size: number; color: string }> = ({ w, f, d, out, size, color }) => {
  const x = clamp((f - d) / 13);
  const wd = lerp(50, 100, easeOutExpo(x)) + 20 * Math.sin(Math.PI * clamp(x * 1.25)) * (1 - x);
  const wg = lerp(260, 820, easeOutCubic(x));
  const o = out > 0 ? 1 - easeInCubic(out) : 1;
  const wdOut = out > 0 ? lerp(wd, 56, easeInCubic(out)) : wd;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT.display,
        fontVariationSettings: `"wdth" ${wdOut.toFixed(1)}, "wght" ${wg.toFixed(0)}`,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: size * 0.005,
        color,
        opacity: clamp(x * 2.5) * o,
        filter: x < 1 ? `blur(${(1 - easeOutCubic(x)) * 9}px)` : undefined,
        transform: `translateY(${(1 - easeOutCubic(x)) * size * 0.28 - (out > 0 ? easeInCubic(out) * size * 0.14 : 0)}px)`,
        marginRight: size * 0.24,
        whiteSpace: "nowrap",
      }}
    >
      {w}
    </span>
  );
};

export const Caption: React.FC<{ win: Window; f: number; f1: number; canvas: Canvas; chapter: string; index: number }> = ({ win, f, f1, canvas, chapter, index }) => {
  const P = canvas.portrait;
  const dur = f1 - win.f0;
  const outT = clamp((f - (dur - 9)) / 9);
  const { before, key, after } = splitCaption(win.t, win.e);
  const bw = before ? before.split(/\s+/) : [];
  const aw = after ? after.split(/\s+/) : [];
  const keyText = emphasisCase(key);

  // sizes (design px) — stepped down for long lines so nothing crosses the safe margin
  const maxW = P ? 900 : 1080;
  const fitDisplay = (s: string, base: number) => Math.min(base, (maxW / Math.max(1, s.length)) / 0.64);
  const fitSerif = (s: string, base: number) => Math.min(base, (maxW / Math.max(1, s.length)) / 0.44);
  const dSize = Math.min(fitDisplay(before, P ? 104 : 100), fitDisplay(after, P ? 104 : 100));
  const kSize = fitSerif(keyText, P ? 176 : 164);

  const dKey = bw.length * 3 + 3;
  const dAfter = dKey + 6;
  const kx = clamp((f - dKey) / 16);
  const kOut = outT > 0 ? 1 - easeInCubic(outT) : 1;
  const lineQ = clamp((f - dKey - 4) / 24);
  const slateQ = clamp(f / 10);
  const col = "rgba(238,241,245,0.97)";

  const keyW = Math.min(maxW, keyText.length * kSize * 0.44);
  const amp = (1 - easeOutCubic(lineQ)) * kSize * 0.09;
  let path = "";
  const N = 64;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = u * keyW;
    const y = 12 + amp * Math.sin(u * Math.PI * 12 + f * 0.6) * Math.sin(Math.PI * u);
    path += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  const shadow = "0 3px 0 rgba(0,0,0,0.3), 0 8px 18px rgba(0,0,0,0.4)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: P ? "center" : "flex-start", textAlign: P ? "center" : "left", textShadow: shadow, width: maxW }}>
      {/* slate */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: P ? 18 : 14, opacity: slateQ * kOut, fontFamily: FONT.mono, fontSize: P ? 22 : 19, letterSpacing: 4, color: "rgba(230,236,242,0.9)" }}>
        <svg width={16} height={16} viewBox="0 0 16 16" style={{ filter: `drop-shadow(0 0 6px ${C.red})` }}>
          <polygon points="8,0 16,8 8,16 0,8" fill={C.red} />
        </svg>
        <span style={{ fontWeight: 700 }}>{String(index + 1).padStart(2, "0")}</span>
        <div style={{ width: lerp(0, P ? 120 : 150, easeOutCubic(slateQ)), height: 1.5, background: "linear-gradient(90deg, rgba(230,236,242,0.9), rgba(230,236,242,0.2))" }} />
        <span style={{ fontWeight: 500 }}>{chapter}</span>
      </div>
      {/* heading, before the key */}
      {bw.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: P ? "center" : "flex-start", maxWidth: maxW }}>
          {bw.map((w, i) => (
            <Word key={i} w={w} f={f} d={i * 3} out={clamp((f - (dur - 9) + (bw.length - i)) / 9)} size={dSize} color={col} />
          ))}
        </div>
      ) : null}
      {/* the key, in serif italic */}
      {key ? (
        <div style={{ position: "relative", marginTop: bw.length ? -kSize * 0.08 : 0 }}>
          <div
            style={{
              fontFamily: FONT.serif, fontStyle: "italic", fontSize: kSize, lineHeight: 1.0, color: "rgba(246,250,255,0.98)",
              letterSpacing: lerp(kSize * 0.06, -kSize * 0.01, easeOutCubic(kx)),
              transform: `scale(${lerp(1.08, 1, easeOutCubic(kx))}) translateY(${outT > 0 ? -easeInCubic(outT) * 20 : 0}px)`,
              transformOrigin: P ? "50% 60%" : "0% 60%",
              WebkitMaskImage: `linear-gradient(90deg, #000 ${lerp(-20, 100, easeOutCubic(kx))}%, transparent ${lerp(0, 120, easeOutCubic(kx))}%)`,
              maskImage: `linear-gradient(90deg, #000 ${lerp(-20, 100, easeOutCubic(kx))}%, transparent ${lerp(0, 120, easeOutCubic(kx))}%)`,
              opacity: kOut,
              textShadow: `${shadow}, 0 0 40px rgba(225,38,63,0.22)`,
              whiteSpace: "nowrap",
              paddingRight: kSize * 0.1,
            }}
          >
            {keyText}
          </div>
          <svg width={keyW} height={28 + amp} style={{ display: "block", margin: P ? "2px auto 0" : "2px 0 0", overflow: "visible", opacity: kOut }}>
            <path d={path} fill="none" stroke={C.redHot} strokeWidth={P ? 3.2 : 2.8} strokeLinecap="round"
              strokeDasharray={keyW * 1.6} strokeDashoffset={keyW * 1.6 * (1 - easeOutCubic(lineQ))}
              style={{ filter: `drop-shadow(0 0 6px ${C.red})` }} />
          </svg>
        </div>
      ) : null}
      {/* heading, after the key */}
      {aw.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: P ? "center" : "flex-start", maxWidth: maxW, marginTop: 6 }}>
          {aw.map((w, i) => (
            <Word key={i} w={w} f={f} d={dAfter + i * 3} out={clamp((f - (dur - 9) + (aw.length - i)) / 9)} size={dSize} color={col} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
