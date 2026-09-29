import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { DISP, GOLD, INK, LOGO_NEUMANN, LOGO_SHIVANSH, MONO, PAPER, Product, RED, SERIF, im, polarPath, useFonts } from "./kit";

/** 4K portrait cover (1080x1920 rendered at 2x = 2160x3840). */
export const Thumb: React.FC = () => {
  useFonts();
  const chips: [string, string][] = [
    ["10", "dB-A SELF-NOISE"],
    ["141", "dB MAX SPL"],
    ["5", "POLAR PATTERNS"],
  ];
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 900px at 50% 44%, rgba(92,72,54,.55), transparent 70%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.09) 1.1px, transparent 1.3px)",
          backgroundSize: "15px 15px",
          WebkitMaskImage: "radial-gradient(600px 700px at 50% 45%, black, transparent 75%)",
          opacity: 0.6,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(420px 560px at 540px 900px, rgba(225,38,47,.28), transparent 70%)" }} />

      <Img src={LOGO_NEUMANN} style={{ position: "absolute", width: 520, left: 280, top: 80, borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: GOLD }}>
        STUDIO CONDENSER MICROPHONE
      </div>

      {/* giant outline title behind the product */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", lineHeight: 0.8 }}>
        {["TLM", "107"].map((w) => (
          <div key={w} style={{ fontFamily: DISP, fontWeight: 900, fontSize: 440, color: "transparent", WebkitTextStroke: "2.5px rgba(244,240,232,.3)" }}>
            {w}
          </div>
        ))}
      </div>

      {/* polar motif */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
        {[0.5, 0.75, 1].map((r) => (
          <circle key={r} cx={540} cy={930} r={470 * r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={1.5} />
        ))}
        <path d={polarPath(0.5, 540, 930, 460)} fill="none" stroke="rgba(225,38,47,.55)" strokeWidth={3} style={{ filter: "drop-shadow(0 0 16px rgba(225,38,47,.8))" }} />
      </svg>

      <Product src={im("n_mount2")} x={760} y={1000} w={500} h={640} rot={6} opacity={0.95} />
      <Product src={im("b_mount2")} x={450} y={960} w={700} h={860} rot={-3} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", fontFamily: DISP, fontWeight: 900, fontSize: 168, letterSpacing: -4, color: PAPER, lineHeight: 1, textShadow: "0 18px 50px rgba(0,0,0,.85)" }}>
        TLM 107
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1468, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER }}>
        Record the whole truth.
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1566, display: "flex", gap: 18 }}>
        {chips.map(([v, l]) => (
          <div key={l} style={{ flex: 1, padding: "20px 0 18px", borderRadius: 18, border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.05)", textAlign: "center" }}>
            <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 64, color: PAPER, lineHeight: 1 }}>{v}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: GOLD, marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1718, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: "rgba(244,240,232,.85)" }}>
        Available now at
      </div>
      <Img src={LOGO_SHIVANSH} style={{ position: "absolute", width: 300, left: 390, top: 1768, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1448, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, opacity: 0.6 }} />
    </AbsoluteFill>
  );
};
