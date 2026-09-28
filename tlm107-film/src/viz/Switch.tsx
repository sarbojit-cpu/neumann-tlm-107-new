import React from "react";
import { C, FONT } from "../theme.ts";
import { clamp, easeOutBack, easeOutCubic, lerp } from "../lib/ease.ts";
import { Glyph, PATTERNS } from "../hud/Glyphs.tsx";
import { Led, Mono, Numeral, plotBox, VizShell, type VizProps } from "./Shell.tsx";

// THE NAVIGATION SWITCH — the TLM 107's control face, rebuilt and operated.
//
// Laid out as on the microphone: pad LEDs (0 / −6 / −12 dB) on the left, low
// cut LEDs (lin / 40 Hz / 100 Hz) on the right, the round switch between them
// and the illuminated pattern glyphs set into the chrome ring below. Presses
// land on the beat (with the synthesized click), a touch ripple shows where.
//
//   patterns  five presses step omni → figure-8
//   pad       0 → −6 → −12 dB, with the max SPL the pad buys
//   autooff   everything lit, a 15-second countdown (time-lapsed), then dark

export const Switch: React.FC<VizProps> = ({ f, canvas, opt, glow, beatF }) => {
  const b = plotBox(canvas);
  const P = canvas.portrait;
  const mode = opt ?? "patterns";
  const bw = P ? 960 : 900, bh = P ? 640 : 560;
  const x0 = b.cx - bw / 2, y0 = b.cy - bh / 2 + (P ? 10 : 20);
  const scx = b.cx, scy = y0 + bh * 0.4;
  const inn = easeOutCubic(clamp(f / 16));

  const presses = mode === "patterns" ? [1, 2, 3, 4, 5] : mode === "pad" ? [1, 3, 5] : [0.5];
  const pressT = presses.map((p) => p * beatF);
  const done = pressT.filter((t) => f >= t).length;
  const last = done ? pressT[done - 1] : -999;
  const press = f - last >= 0 && f - last < 10 ? Math.sin(Math.PI * ((f - last) / 10)) : 0;

  let pat = 2, pad = 0, lc = 0;
  let caption = "";
  if (mode === "patterns") { pat = Math.max(0, done - 1); caption = done ? PATTERNS[pat].name : "PRESS TO STEP"; }
  if (mode === "pad") { pad = Math.min(2, done); caption = ["0 dB · 141 dB SPL MAX", "−6 dB · 147 dB SPL MAX", "−12 dB · 153 dB SPL MAX"][pad]; }
  let power = 1;
  let countdown = 15;
  if (mode === "autooff") {
    const c = clamp((f - 0.5 * beatF) / (5 * beatF));
    countdown = Math.max(0, 15 * (1 - c));
    power = 1 - easeOutCubic(clamp((f - 5.5 * beatF) / 12));
    caption = power > 0.5 ? `DISPLAY ON · ${countdown.toFixed(1)} s` : "DISPLAY OFF";
  }
  const litPad = (i: number) => (i === pad ? 1 : 0) * power;
  const litLc = (i: number) => (i === lc ? 1 : 0) * power;
  const ringR = 76;
  const fs = P ? 24 : 18;

  return (
    <VizShell canvas={canvas} f={f} fig="FIG. S" title="NAVIGATION SWITCH" glow={glow} note={mode === "autooff" ? "COUNTDOWN SHOWN IN TIME-LAPSE" : "PATTERN · PAD · LOW CUT — ONE CONTROL"}>
      <div style={{ position: "absolute", left: x0, top: y0, width: bw, height: bh, opacity: inn, transform: `scale(${lerp(0.96, 1, inn)})` }}>
        {/* the body: black finish, top light */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "linear-gradient(180deg, #2a2e35 0%, #15181d 35%, #0b0d10 100%)", boxShadow: "0 40px 90px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -20px 60px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "#000", opacity: (1 - power) * 0.3 }} />
        {/* pad column */}
        <div style={{ position: "absolute", left: bw * 0.12, top: bh * 0.18, display: "flex", flexDirection: "column", gap: 34 }}>
          {["0 dB", "−6 dB", "−12 dB"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Mono size={fs} color={litPad(i) > 0.5 ? C.led : "rgba(230,236,242,0.45)"} style={{ width: 92, textAlign: "right" }}>{l}</Mono>
              <Led on={litPad(i)} size={16} />
            </div>
          ))}
        </div>
        {/* low cut column */}
        <div style={{ position: "absolute", right: bw * 0.12, top: bh * 0.18, display: "flex", flexDirection: "column", gap: 34 }}>
          {["lin", "40 Hz", "100 Hz"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Led on={litLc(i)} size={16} />
              <Mono size={fs} color={litLc(i) > 0.5 ? C.led : "rgba(230,236,242,0.45)"} style={{ width: 92 }}>{l}</Mono>
            </div>
          ))}
        </div>
        {/* the switch */}
        <svg width={bw} height={bh} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="knob" cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#5a616c" />
              <stop offset="0.5" stopColor="#1d2127" />
              <stop offset="1" stopColor="#0c0e11" />
            </radialGradient>
            <linearGradient id="chromeR" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5f8fb" />
              <stop offset="0.35" stopColor="#8e97a3" />
              <stop offset="0.6" stopColor="#eef2f6" />
              <stop offset="1" stopColor="#5e6670" />
            </linearGradient>
          </defs>
          <circle cx={bw / 2} cy={scy - y0} r={ringR} fill="url(#chromeR)" />
          <circle cx={bw / 2} cy={scy - y0} r={ringR - 12} fill="url(#knob)" transform={`translate(${press * 0} ${press * 3})`} style={{ transformOrigin: `${bw / 2}px ${scy - y0}px` }} />
          <circle cx={bw / 2} cy={scy - y0} r={(ringR - 12) * (1 - press * 0.06)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
          {/* touch ripple */}
          {f - last >= 0 && f - last < 18 ? (
            <circle cx={bw / 2} cy={scy - y0} r={lerp(ringR * 0.6, ringR * 1.9, easeOutCubic((f - last) / 18))} fill="none" stroke={C.led} strokeWidth={3} opacity={(1 - (f - last) / 18) * 0.7} />
          ) : null}
          {/* auto-off countdown ring */}
          {mode === "autooff" ? (
            <circle cx={bw / 2} cy={scy - y0} r={ringR + 22} fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * (ringR + 22) * (countdown / 15)} ${2 * Math.PI * (ringR + 22)}`}
              transform={`rotate(-90 ${bw / 2} ${scy - y0})`} opacity={power} style={{ filter: `drop-shadow(0 0 8px ${C.red})` }} />
          ) : null}
        </svg>
        {/* chrome ring strip with the pattern glyphs */}
        <div style={{ position: "absolute", left: bw * 0.1, right: bw * 0.1, top: bh * 0.7, height: 96, borderRadius: 48, background: "linear-gradient(180deg, #f2f5f8 0%, #9aa3ae 30%, #e9edf1 55%, #6c747e 100%)", boxShadow: "inset 0 2px 3px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 30px" }}>
          {PATTERNS.map((p, i) => {
            const on = (i === pat ? 1 : 0) * power * (mode === "patterns" && !done ? 0 : 1);
            return (
              <div key={p.key} style={{ width: 70, height: 70, borderRadius: 35, background: on ? "radial-gradient(circle, rgba(221,246,255,0.35), rgba(221,246,255,0) 70%)" : "rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? lerp(1.18, 1, easeOutBack(clamp((f - last) / 10))) : 1})` }}>
                <Glyph a={p.a} size={46} color={on ? C.led : "rgba(20,24,30,0.75)"} glow={on ? 10 : 0} stroke={on ? 3 : 2.2} />
              </div>
            );
          })}
        </div>
      </div>
      {/* readout */}
      <div style={{ position: "absolute", left: b.cx - b.w / 2, top: y0 + bh + 36, width: b.w, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: inn }}>
        <Mono size={P ? 22 : 19} color={C.led} weight={700}>{caption}</Mono>
        {mode === "pad" ? <Numeral size={P ? 64 : 56} color={pad === 2 ? C.redHot : C.nickel}>{[141, 147, 153][pad]}<span style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 2, marginLeft: 8 }}>dB</span></Numeral> : null}
        {mode === "autooff" ? <Numeral size={P ? 64 : 56} color={power > 0.5 ? C.nickel : "rgba(230,236,242,0.35)"}>{Math.ceil(countdown)}<span style={{ fontFamily: FONT.mono, fontSize: 22, marginLeft: 6 }}>s</span></Numeral> : null}
      </div>
    </VizShell>
  );
};
