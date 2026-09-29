import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Brackets,
  Cover,
  DISP,
  GOLD,
  INK,
  LOGO_NEUMANN,
  LOGO_SHIVANSH,
  MONO,
  NICKEL,
  PAPER,
  Product,
  RED,
  Reveal,
  SERIF,
  Scramble,



  easeIO,
  expo,
  im,
  lerp,
  polarPath,
  ramp,
  rnd,
  useFonts,
} from "./kit";

/**
 * Neumann TLM 107 — 30 s square beat-synced animation.
 * Every scene boundary sits on a bar line of the music: the whole cut grid is derived
 * from (bpm, drop), so the same design re-syncs exactly to any track.
 */
export type ReelProps = { bpm: number; drop: number };

type G = { t: number; beat: number; bar: number; drop: number };

const PLAN: [string, number][] = [
  ["hero", 1],
  ["montage", 2],
  ["split", 1],
  ["craft", 1],
  ["patterns", 2],
  ["context", 1],
  ["stats", 2],
  ["set", 1],
  ["family", 1],
];

const pulse = (g: G, decay = 0.12) => {
  const k = (g.t - g.drop) / g.beat;
  const ph = k - Math.floor(k);
  return Math.exp((-ph * g.beat) / decay);
};
const barPulse = (g: G) => {
  const k = (g.t - g.drop) / g.bar;
  const ph = k - Math.floor(k);
  return Math.exp((-ph * g.bar) / 0.18);
};

// ---------------------------------------------------------------- stage
const Stage: React.FC<{ g: G; warm?: number }> = ({ g, warm = 0 }) => {
  const t = g.t;
  const gx = 540 + Math.sin(t * 0.35) * 160;
  const gy = 470 + Math.cos(t * 0.27) * 90;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(760px 620px at ${gx}px ${gy}px, rgba(${lerp(60, 92, warm)},${lerp(58, 70, warm)},${lerp(62, 48, warm)},.55), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.09) 1.1px, transparent 1.3px)",
          backgroundSize: "15px 15px",
          backgroundPosition: `${(t * 6) % 15}px 0px`,
          WebkitMaskImage: "radial-gradient(520px 460px at 50% 50%, black, transparent 75%)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
);

// ---------------------------------------------------------------- scene wrapper
const Scene: React.FC<{ g: G; s: number; e: number; children: (u: number, d: number) => React.ReactNode }> = ({ g, s, e, children }) => {
  const pre = 0.16;
  const post = 0.12;
  if (g.t < s - pre || g.t > e + post) return null;
  const ain = ramp(g.t, s - pre, s + 0.32);
  const aout = ramp(g.t, e - 0.03, e + post);
  const scale = lerp(1.14, 1, expo(ain)) * lerp(1, 1.12, aout * aout);
  const blur = (1 - expo(ain)) * 16 + aout * 14;
  const op = ramp(g.t, s - pre, s - 0.02) * (1 - aout);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, filter: blur > 0.4 ? `blur(${blur.toFixed(2)}px)` : undefined, opacity: op, overflow: "hidden" }}>
      {children(g.t - s, e - s)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- transitions (light blades on every cut)
const Blades: React.FC<{ g: G; cuts: number[] }> = ({ g, cuts }) => {
  const out: React.ReactNode[] = [];
  cuts.forEach((T, i) => {
    const dt = g.t - T;
    if (dt < -0.2 || dt > 0.3) return;
    const flash = dt >= 0 ? Math.exp(-dt / 0.06) * 0.5 : Math.exp(dt / 0.035) * 0.22;
    const sp = ramp(dt, -0.16, 0.16);
    const dir = i % 2 ? -1 : 1;
    const x = lerp(-60, 160, easeIO(sp));
    out.push(
      <AbsoluteFill key={i} style={{ pointerEvents: "none" }}>
        <AbsoluteFill style={{ background: `rgba(255,248,236,${flash})` }} />
        <AbsoluteFill
          style={{
            background: `linear-gradient(${dir > 0 ? 112 : 68}deg, transparent ${x - 9}%, rgba(255,236,210,.0) ${x - 6}%, rgba(255,240,220,.85) ${x}%, rgba(255,236,210,0) ${x + 5}%, transparent ${x + 9}%)`,
            mixBlendMode: "screen",
            opacity: Math.sin(sp * Math.PI),
          }}
        />
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              top: 90 + rnd(i * 7 + k) * 900,
              left: dir > 0 ? lerp(-500, 1200, easeIO(sp)) - rnd(k + i) * 300 : lerp(1200, -500, easeIO(sp)) + rnd(k + i) * 300,
              width: 260 + rnd(k * 3 + i) * 380,
              height: 1.5 + rnd(k + 9) * 2,
              background: "linear-gradient(90deg, transparent, rgba(255,240,220,.9), transparent)",
              opacity: Math.sin(sp * Math.PI) * 0.8,
            }}
          />
        ))}
      </AbsoluteFill>,
    );
  });
  return <>{out}</>;
};

// ---------------------------------------------------------------- INTRO (anticipation build, logos)
const Intro: React.FC<{ g: G }> = ({ g }) => {
  const t = g.t;
  const D = g.drop;
  if (t > D + 0.12) return null;
  const k = t / D;
  const pb = t > 0.4 ? pulse(g, 0.1) * k : 0;
  const line = expo(ramp(t, 0.15, 1.1));
  const logosIn = expo(ramp(t, 0.45, 1.15));
  const logosOut = easeIO(ramp(t, D - 0.95, D - 0.55));
  const titleIn = ramp(t, D - 0.75, D - 0.05);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {/* grille macro under a travelling light */}
      <Cover
        src={im("grille_tex")}
        z={lerp(1.35, 1.7, k) + pb * 0.02}
        opacity={lerp(0.25, 0.75, k)}
        filter={`brightness(${lerp(0.7, 1.5, k)}) contrast(1.15)`}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(420px 260px at ${lerp(10, 90, easeIO(k))}% 50%, rgba(255,226,190,${0.25 + 0.3 * k}), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,.85) 85%)" }} />
      {/* horizon hairline */}
      <div
        style={{
          position: "absolute",
          top: 539,
          left: 540 - 520 * line,
          width: 1040 * line,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,235,210,.95), transparent)",
          boxShadow: `0 0 ${18 + pb * 30}px rgba(255,210,160,.8)`,
          opacity: 1 - titleIn * 0.6,
        }}
      />
      {/* logo lockup */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: logosIn * (1 - logosOut), transform: `scale(${lerp(0.94, 1, logosIn) * lerp(1, 1.08, logosOut)})`, filter: logosOut > 0 ? `blur(${logosOut * 10}px)` : undefined }}>
        <Img src={LOGO_NEUMANN} style={{ position: "absolute", width: 520, left: 280, top: 346, borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
        <Scramble text="PRESENTED BY" p={t - 0.9} size={15} spacing={6} style={{ left: 0, right: 0, top: 492, textAlign: "center" }} />
        <Img src={LOGO_SHIVANSH} style={{ position: "absolute", width: 380, left: 350, top: 586, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
      </div>
      {/* title assembles into the drop */}
      {titleIn > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}>
          <div
            style={{
              fontFamily: DISP,
              fontWeight: 900,
              fontSize: 300,
              letterSpacing: lerp(60, -6, expo(titleIn)),
              color: "transparent",
              WebkitTextStroke: `2px rgba(255,236,214,${0.35 + titleIn * 0.6})`,
              textShadow: `0 0 ${40 * titleIn}px rgba(255,200,150,${0.5 * titleIn})`,
              opacity: expo(titleIn),
              transform: `scale(${lerp(1.25, 1, expo(titleIn))})`,
            }}
          >
            TLM 107
          </div>
        </div>
      ) : null}
      <AbsoluteFill style={{ background: `rgba(255,248,236,${Math.pow(ramp(t, D - 0.35, D), 3) * 0.9})` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- HERO
const Hero: React.FC<{ g: G; u: number; d: number }> = ({ g, u, d }) => {
  const a = expo(ramp(u, 0, 0.55));
  const drift = u / d;
  return (
    <AbsoluteFill>
      <Stage g={g} />
      <AbsoluteFill style={{ background: `radial-gradient(420px 520px at 540px 560px, rgba(225,38,47,${0.22 + barPulse(g) * 0.15}), transparent 70%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", lineHeight: 0.82 }}>
        {["TLM", "107"].map((w, i) => (
          <div
            key={w}
            style={{
              fontFamily: DISP,
              fontWeight: 900,
              fontSize: 430,
              color: "transparent",
              WebkitTextStroke: "2px rgba(244,240,232,.28)",
              transform: `translateX(${(i ? 1 : -1) * lerp(0, 70, drift)}px)`,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <Product src={im("b_mount2")} x={540} y={lerp(700, 590, a) - drift * 20} w={780} h={900} scale={lerp(1.25, 1, a)} shine={ramp(u, 0.25, 1.3)} />
      <Scramble text="NEUMANN.BERLIN  /  STUDIO CONDENSER" p={u - 0.1} size={17} style={{ left: 48, top: 44 }} />
      <Scramble text="LARGE DIAPHRAGM · TRANSFORMERLESS" p={u - 0.3} size={17} style={{ right: 48, bottom: 44 }} />
      <Reveal text="Record the whole truth." p={u - 0.2} size={50} font={SERIF} italic weight={400} style={{ left: 48, bottom: 80 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- MONTAGE (a new product view on every beat)
const MONT: [string, "black" | "nickel", number][] = [
  ["b_front", "black", 1],
  ["n_front", "nickel", 1],
  ["b_3q", "black", 0.9],
  ["n_angle", "nickel", 0.95],
  ["b_front2", "black", 1],
  ["n_front2", "nickel", 1],
  ["b_mount", "black", 1],
  ["n_stand", "nickel", 1.05],
];
const Montage: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const i = Math.min(MONT.length - 1, Math.max(0, Math.floor(u / g.beat)));
  const ui = u - i * g.beat;
  const [src, fin, sc] = MONT[i];
  const a = expo(ramp(ui, 0, 0.3));
  const dir = i % 2 ? 1 : -1;
  const nick = fin === "nickel";
  const half = u < 4 * g.beat ? 0 : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: nick
            ? "radial-gradient(700px 700px at 60% 45%, #3a342b, #14120f 60%, #0a0908)"
            : "radial-gradient(700px 700px at 40% 45%, #23262d, #0c0d10 60%, #060708)",
        }}
      />
      {/* moving vertical rules */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <div key={k} style={{ position: "absolute", top: 0, bottom: 0, width: 1, left: ((k * 160 + u * 90 * dir) % 1120 + 1120) % 1120 - 20, background: "rgba(255,255,255,.07)" }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 300,
          fontFamily: DISP,
          fontWeight: 900,
          fontSize: 190,
          lineHeight: 0.85,
          color: "transparent",
          WebkitTextStroke: `2px ${nick ? "rgba(227,184,115,.35)" : "rgba(244,240,232,.2)"}`,
          transform: `translateX(${dir * (1 - a) * 80}px)`,
        }}
      >
        {nick ? "NICKEL" : "MATTE"}
        <br />
        {nick ? "" : "BLACK"}
      </div>
      <Product src={im(src)} x={lerp(640 + dir * 90, 640, a)} y={560} w={640 * sc} h={820 * sc} scale={lerp(1.3, 1, a)} blur={(1 - a) * 10} shine={ramp(ui, 0.05, g.beat)} />
      <Reveal key={half} text={half ? "One honest sound." : "Two finishes."} p={u - half * 4 * g.beat} size={86} font={SERIF} italic weight={400} style={{ left: 60, top: 84 }} />
      <div style={{ position: "absolute", right: 56, top: 64, fontFamily: MONO, fontSize: 22, color: "rgba(244,240,232,.7)", letterSpacing: 4 }}>
        {String(i + 1).padStart(2, "0")} / 08
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 64, display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: nick ? NICKEL : "#1b1c20", border: "2px solid rgba(255,255,255,.6)" }} />
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: PAPER }}>{nick ? "NICKEL FINISH" : "MATTE BLACK FINISH"}</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 40, height: 2, background: "rgba(255,255,255,.12)" }}>
        <div style={{ width: `${((i + ramp(ui, 0, g.beat)) / 8) * 100}%`, height: 2, background: nick ? GOLD : RED }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- SPLIT (black | nickel)
const Split: React.FC<{ g: G; u: number; d: number }> = ({ u, d }) => {
  const a = expo(ramp(u, 0, 0.4));
  const b = expo(ramp(u, 0.08, 0.5));
  const drift = u / d;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1080, overflow: "hidden", transform: `translateY(${(1 - a) * -1080}px)`, background: "radial-gradient(500px 600px at 60% 50%, #262930, #0b0c0f 70%)" }}>
        <Product src={im("b_mount")} x={300} y={560 - drift * 20} w={520} h={700} shine={ramp(u, 0.3, 1.3)} />
        <div style={{ position: "absolute", left: 44, top: 60, fontFamily: DISP, fontWeight: 800, fontSize: 64, color: PAPER, letterSpacing: 2 }}>BLACK</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1080, overflow: "hidden", transform: `translateY(${(1 - b) * 1080}px)`, background: "radial-gradient(500px 600px at 40% 50%, #4a4136, #16130f 70%)" }}>
        <Product src={im("n_mount2")} x={240} y={560 + drift * 20} w={520} h={700} shine={ramp(u, 0.45, 1.45)} />
        <div style={{ position: "absolute", right: 44, top: 60, fontFamily: DISP, fontWeight: 800, fontSize: 64, color: GOLD, letterSpacing: 2 }}>NICKEL</div>
      </div>
      <div style={{ position: "absolute", left: 539, top: 540 - 540 * b, width: 2, height: 1080 * b, background: "linear-gradient(transparent, rgba(255,236,210,.95), transparent)", boxShadow: "0 0 24px rgba(255,210,160,.8)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, textAlign: "center" }}>
        <Reveal text="Choose the look. Keep the sound." p={u - 0.25} size={46} font={SERIF} italic weight={400} style={{ position: "relative", display: "inline-block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CRAFT (macros per beat)
const CRAFT: [string, string, string][] = [
  ["b_badge", "ENAMEL DIAMOND BADGE", "50% 40%"],
  ["n_grille", "PRECISION MESH HEAD GRILLE", "50% 50%"],
  ["b_macro", "LARGE-DIAPHRAGM CAPSULE", "50% 50%"],
  ["n_xlr", "GOLD-PLATED XLR CONNECTOR", "40% 60%"],
];
const Craft: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const i = Math.min(3, Math.max(0, Math.floor(u / g.beat)));
  const ui = u - i * g.beat;
  const [src, cap, pos] = CRAFT[i];
  const a = expo(ramp(ui, 0, 0.28));
  const cut = src === "n_grille";
  return (
    <AbsoluteFill style={{ background: "#0d0c0b" }}>
      {cut ? (
        <>
          <Stage g={g} warm={1} />
          <Product src={im(src)} x={560} y={500} w={1100} h={1000} scale={lerp(1.3, 1.08, a) + ui * 0.05} rot={-6} />
        </>
      ) : (
        <Cover src={im(src)} z={lerp(1.35, 1.12, a) + ui * 0.06} x={(i % 2 ? 1 : -1) * (1 - a) * 60} pos={pos} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55), transparent 30%, transparent 55%, rgba(0,0,0,.85))" }} />
      <Brackets x={60} y={60} w={960} h={960} p={ramp(u, 0, 0.4)} />
      <Reveal text="Hand-built in Germany." p={u} size={84} font={SERIF} italic weight={400} style={{ left: 84, bottom: 150 }} />
      <Scramble key={i} text={cap} p={ui} size={22} color={GOLD} spacing={5} style={{ left: 88, bottom: 104 }} />
      <div style={{ position: "absolute", right: 88, top: 92, fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: "rgba(244,240,232,.8)" }}>DETAIL {String(i + 1).padStart(2, "0")}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- PATTERNS (polar plot morph + switch)
const PAT: [string, number][] = [
  ["OMNI", 1],
  ["WIDE CARDIOID", 0.75],
  ["CARDIOID", 0.5],
  ["HYPERCARDIOID", 0.25],
  ["FIGURE-8", 0],
];
const PatternIcon: React.FC<{ a: number; on: boolean; x: number }> = ({ a, on, x }) => (
  <svg style={{ position: "absolute", left: x, top: 0 }} width={64} height={64} viewBox="0 0 64 64">
    <circle cx={32} cy={32} r={29} fill={on ? "rgba(225,38,47,.18)" : "none"} stroke={on ? RED : "rgba(255,255,255,.3)"} strokeWidth={2} />
    <path d={polarPath(a, 32, 32, 21)} fill="none" stroke={on ? PAPER : "rgba(255,255,255,.55)"} strokeWidth={2} />
  </svg>
);
const Patterns: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const bi = Math.floor(u / g.beat);
  const idx = Math.min(4, Math.max(0, bi));
  const prev = Math.min(4, Math.max(0, bi - 1));
  const m = expo(ramp(u - bi * g.beat, 0, 0.2));
  const aCur = bi <= 4 ? lerp(PAT[prev][1], PAT[idx][1], bi === 0 ? 1 : m) : lerp(0, 0.5, expo(ramp(u - 5 * g.beat, 0, 0.35)));
  const label = bi <= 4 ? PAT[idx][0] : "CARDIOID";
  const cx = 300;
  const cy = 590;
  const R = 220;
  const draw = expo(ramp(u, 0, 0.6));
  const second = u >= 4 * g.beat;
  const cardIn = expo(ramp(u - (second ? 4 * g.beat : 0), 0, 0.35));
  const p = pulse(g);
  return (
    <AbsoluteFill>
      <Stage g={g} />
      <Img src={im("polar")} style={{ position: "absolute", left: cx - 250, top: cy - 255, width: 500, filter: "invert(1)", opacity: 0.16 * draw }} />
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1080}>
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={R * r * draw} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={1.5} />
        ))}
        {Array.from({ length: 12 }).map((_, k) => {
          const th = (k / 12) * Math.PI * 2;
          return <line key={k} x1={cx} y1={cy} x2={cx + Math.sin(th) * R * draw} y2={cy - Math.cos(th) * R * draw} stroke="rgba(255,255,255,.08)" strokeWidth={1} />;
        })}
        <path d={polarPath(aCur, cx, cy, R * 0.98 * draw)} fill="rgba(225,38,47,.16)" stroke={RED} strokeWidth={4 + p * 3} style={{ filter: `drop-shadow(0 0 ${10 + p * 14}px rgba(225,38,47,.9))` }} />
        <circle cx={cx} cy={cy} r={5} fill={PAPER} />
        <text x={cx} y={cy - R - 18} fill="rgba(244,240,232,.6)" fontFamily="JetBrains Mono" fontSize={15} textAnchor="middle" letterSpacing={3}>
          0°
        </text>
      </svg>
      <div style={{ position: "absolute", left: cx - 170, width: 340, top: cy + R + 34, height: 64 }}>
        {PAT.map(([n, a], k) => (
          <PatternIcon key={n} a={a} x={k * 69} on={label === n} />
        ))}
      </div>
      <Reveal text="Five polar patterns." p={u} size={76} font={SERIF} italic weight={400} style={{ left: 60, top: 64 }} />
      <Scramble key={label} text={label} p={u - Math.min(bi, 5) * g.beat} size={26} color={GOLD} spacing={6} style={{ left: 64, top: 170 }} />
      {/* switch close-up card */}
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 250,
          width: 440,
          height: 330,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,.6)",
          transform: `translateX(${(1 - cardIn) * 120}px) scale(${lerp(0.9, 1, cardIn)})`,
          opacity: cardIn,
        }}
      >
        <Img src={im(second ? "n_controls" : "b_controls")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + u * 0.02})` }} />
        <div
          style={{
            position: "absolute",
            left: 220 - 34 - p * 8,
            top: 118 - 34 - p * 8,
            width: 68 + p * 16,
            height: 68 + p * 16,
            borderRadius: "50%",
            border: `3px solid ${RED}`,
            boxShadow: `0 0 20px ${RED}`,
            opacity: 0.9,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 590,
          top: 612,
          width: 440,
          height: 237,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,.6)",
          opacity: expo(ramp(u, 0.2, 0.6)),
          transform: `translateY(${(1 - expo(ramp(u, 0.2, 0.6))) * 60}px)`,
        }}
      >
        <Img src={im("ctrl_diagram")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <Scramble text="NAVIGATION SWITCH · PAD 0/-6/-12 dB · LOW-CUT 40/100 Hz" p={u - 0.4} size={15} spacing={2} style={{ left: 590, top: 872 }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CONTEXT (where it shines)
const CTX: [string, string, string][] = [
  ["ctx_console", "VOCALS", "50% 40%"],
  ["ctx_purple", "VOICEOVER", "50% 50%"],
  ["ctx_dark", "PODCASTS", "50% 50%"],
  ["ctx_pair", "INSTRUMENTS", "50% 45%"],
];
const Context: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const i = Math.min(3, Math.max(0, Math.floor(u / g.beat)));
  const ui = u - i * g.beat;
  const [src, word, pos] = CTX[i];
  const a = expo(ramp(ui, 0, 0.25));
  const fs = Math.min(170, Math.floor(1010 / (word.length * 0.72)));
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Cover src={im(src)} z={lerp(1.3, 1.1, a) + ui * 0.08} y={(1 - a) * (i % 2 ? 60 : -60)} pos={pos} filter="brightness(.8) contrast(1.08)" />
      {i === 2 ? (
        <div style={{ position: "absolute", right: 70, top: 150, width: 330, padding: 12, background: PAPER, borderRadius: 6, transform: `rotate(${lerp(10, 4, a)}deg) scale(${lerp(0.7, 1, a)})`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <Img src={im("candid")} style={{ width: "100%", display: "block" }} />
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45), transparent 35%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.9))" }} />
      <Reveal text="Wherever the voice matters." p={u} size={48} font={SERIF} italic weight={400} style={{ left: 60, top: 60 }} />
      <Reveal key={word} text={word} p={ui} size={fs} weight={900} spacing={-3} style={{ left: 54, bottom: 70 }} />
      <div style={{ position: "absolute", right: 60, bottom: 90, display: "flex", gap: 8 }}>
        {CTX.map((_, k) => (
          <div key={k} style={{ width: k === i ? 36 : 12, height: 6, borderRadius: 3, background: k === i ? RED : "rgba(255,255,255,.4)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- STATS (data slam on the phrase)
const STATS: { v: number; from: number; txt?: string; unit: string; label: string; sub: string }[] = [
  { v: 10, from: 60, unit: "dB-A", label: "SELF-NOISE", sub: "Quieter than the room you record in." },
  { v: 141, from: 60, unit: "dB SPL", label: "MAX SOUND PRESSURE", sub: "Kick drums, brass, screams. No sweat." },
  { v: 131, from: 40, unit: "dB", label: "DYNAMIC RANGE", sub: "From a whisper to full voice." },
  { v: 20, from: 20, txt: "20–20k", unit: "Hz", label: "FREQUENCY RANGE", sub: "Neutral, open, with air on top." },
];
const Meter: React.FC<{ k: number; p: number; x: number; y: number; w: number }> = ({ k, p, x, y, w }) => {
  const toX = (db: number) => (db / 150) * w;
  if (k === 3) {
    // log frequency axis with the response curve drawing in
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const f = i / 100;
      const lift = Math.exp(-Math.pow((f - 0.82) / 0.08, 2)) * 10;
      const roll = f < 0.06 ? (0.06 - f) * 260 : f > 0.97 ? (f - 0.97) * 500 : 0;
      pts.push(`${(f * w).toFixed(1)},${(60 - lift + roll).toFixed(1)}`);
    }
    const shown = Math.floor(expo(p) * 100) + 1;
    return (
      <svg style={{ position: "absolute", left: x, top: y }} width={w} height={130}>
        {["20", "100", "1k", "10k", "20k"].map((l, i) => {
          const fx = [0, 0.233, 0.566, 0.9, 1][i] * w;
          return (
            <g key={l}>
              <line x1={fx} x2={fx} y1={0} y2={100} stroke="rgba(255,255,255,.14)" />
              <text x={Math.min(fx, w - 30)} y={124} fill="rgba(244,240,232,.6)" fontFamily="JetBrains Mono" fontSize={15}>
                {l}
              </text>
            </g>
          );
        })}
        <line x1={0} x2={w} y1={60} y2={60} stroke="rgba(255,255,255,.2)" strokeDasharray="4 6" />
        <polyline points={pts.slice(0, shown).join(" ")} fill="none" stroke={GOLD} strokeWidth={4} style={{ filter: "drop-shadow(0 0 8px rgba(227,184,115,.8))" }} />
      </svg>
    );
  }
  const lo = k === 2 ? 10 : 0;
  const hi = k === 0 ? 10 : 141;
  const e = expo(p);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 130 }}>
      {Array.from({ length: 31 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: toX(i * 5), top: i % 2 ? 58 : 50, width: 2, height: i % 2 ? 14 : 22, background: "rgba(255,255,255,.25)" }} />
      ))}
      {[0, 30, 60, 90, 120, 150].map((db) => (
        <div key={db} style={{ position: "absolute", left: toX(db) - 10, top: 92, fontFamily: MONO, fontSize: 15, color: "rgba(244,240,232,.6)" }}>
          {db}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: toX(lo),
          top: 20,
          height: 20,
          width: toX(lerp(lo, hi, e)) - toX(lo),
          borderRadius: 10,
          background: k === 1 ? `linear-gradient(90deg, ${GOLD}, ${RED})` : k === 0 ? "#7FE0C8" : `linear-gradient(90deg, #7FE0C8, ${GOLD}, ${RED})`,
          boxShadow: "0 0 18px rgba(255,200,150,.5)",
        }}
      />
    </div>
  );
};
const Stats: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const i = Math.min(3, Math.max(0, Math.floor(u / (2 * g.beat))));
  const ui = u - i * 2 * g.beat;
  const s = STATS[i];
  const a = expo(ramp(ui, 0, 0.3));
  const val = s.txt ?? String(Math.round(lerp(s.from, s.v, expo(ramp(ui, 0, 0.5)))));
  const p = pulse(g);
  return (
    <AbsoluteFill>
      <Stage g={g} />
      <Product src={im(i % 2 ? "n_front2" : "b_front")} x={860} y={560} w={560} h={900} rot={lerp(-8, 4, u / (8 * g.beat))} opacity={0.35} shadow={false} scale={1.1 + p * 0.02} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,8,10,.95) 30%, rgba(7,8,10,.35) 75%, rgba(7,8,10,.6))" }} />
      <div style={{ position: "absolute", left: 60, top: 70, fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: GOLD }}>
        SPEC {String(i + 1).padStart(2, "0")} / 04
      </div>
      <Scramble key={s.label} text={s.label} p={ui} size={30} color={PAPER} spacing={7} style={{ left: 60, top: 150 }} />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 210,
          fontFamily: DISP,
          fontWeight: 900,
          fontSize: s.txt ? 230 : 330,
          lineHeight: 1,
          color: PAPER,
          letterSpacing: -10,
          transform: `translateY(${(1 - a) * 80}px) scale(${1 + p * 0.015})`,
          transformOrigin: "left center",
          opacity: a,
          textShadow: "0 20px 60px rgba(0,0,0,.6)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {val}
        <span style={{ fontSize: 70, letterSpacing: 0, marginLeft: 18, color: GOLD, fontWeight: 700 }}>{s.unit}</span>
      </div>
      <Reveal key={s.sub} text={s.sub} p={ui - 0.1} size={42} font={SERIF} italic weight={400} style={{ left: 60, top: 610 }} />
      <Meter k={i} p={ramp(ui, 0.05, 0.7)} x={60} y={740} w={960} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 56, display: "flex", gap: 10 }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: k < i ? GOLD : k === i ? `linear-gradient(90deg, ${GOLD} ${ramp(ui, 0, 2 * g.beat) * 100}%, rgba(255,255,255,.15) 0)` : "rgba(255,255,255,.15)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- STUDIO SET
const Set: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const bi = Math.min(3, Math.max(0, Math.floor(u / g.beat)));
  const open = expo(ramp(u - g.beat, 0, 0.3));
  const mounts = expo(ramp(u - 2 * g.beat, 0, 0.35));
  const tiles = expo(ramp(u - 3 * g.beat, 0, 0.35));
  const items = ["TLM 107 MICROPHONE", "EA 4 ELASTIC SHOCK MOUNT", "WOODEN PRESENTATION CASE", "READY FOR THE STUDIO"];
  const boxX = lerp(540, 380, mounts);
  const boxW = lerp(820, 600, mounts);
  return (
    <AbsoluteFill>
      <Stage g={g} warm={0.8} />
      <Product src={im("box_closed")} x={boxX} y={480} w={boxW} h={boxW * 0.62} scale={lerp(0.8, 1, expo(ramp(u, 0, 0.35)))} opacity={1 - open} />
      <Product src={im("box_open")} x={boxX} y={470} w={boxW * 0.9} h={boxW * 0.9} opacity={open} scale={lerp(1.08, 1, open)} shine={ramp(u - g.beat, 0.1, 1.2)} />
      <Product src={im("ea4_black")} x={lerp(1200, 840, mounts)} y={330} w={330} h={330} rot={lerp(20, -4, mounts)} opacity={mounts} />
      <Product src={im("ea4_nickel")} x={lerp(1200, 860, mounts)} y={620} w={320} h={320} rot={lerp(-20, 3, mounts)} opacity={mounts} />
      {["kit", "box_small", "box_mic", "ea4_adapters"].map((k, j) => {
        const tj = expo(ramp(u - 3 * g.beat, j * 0.05, j * 0.05 + 0.3));
        const photo = k === "kit";
        return (
          <div key={k} style={{ position: "absolute", left: 60 + j * 245, top: 840, width: 225, height: 150, borderRadius: 14, overflow: "hidden", background: photo ? "#fff" : "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", opacity: tj, transform: `translateY(${(1 - tj) * 70}px)` }}>
            <Img src={im(k)} style={{ width: "100%", height: "100%", objectFit: photo ? "cover" : "contain", padding: photo ? 0 : 8 }} />
          </div>
        );
      })}
      <Reveal text="The Studio Set." p={u} size={78} font={SERIF} italic weight={400} style={{ left: 60, top: 56 }} />
      <div style={{ position: "absolute", left: 64, top: 160, opacity: 1 - tiles * 0.0 }}>
        {items.map((it, k) =>
          k <= bi ? (
            <Scramble key={it} text={`+ ${it}`} p={u - k * g.beat} size={18} color={k === bi ? GOLD : "rgba(244,240,232,.7)"} spacing={3} style={{ position: "relative", height: 30 }} />
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- FAMILY wall
const FAM = ["fam_u87", "fam_hp", "fam_kh_a", "fam_tube", "fam_kms", "fam_sub", "fam_ma1", "fam_black", "fam_clip", "fam_hp2", "fam_kh_b", "fam_hang", "ea4_cream", "n_white", "fam_kh_c", "n_boom"];
const Family: React.FC<{ g: G; u: number; d: number }> = ({ g, u, d }) => {
  const zoom = easeIO(ramp(u, 2.6 * g.beat, d));
  const hero = expo(ramp(u - 2 * g.beat, 0, 0.4));
  return (
    <AbsoluteFill>
      <Stage g={g} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1, 0.86, hero) + zoom * 0.05})`, filter: hero > 0.01 ? `blur(${hero * 5}px) brightness(${1 - hero * 0.5})` : undefined }}>
        {FAM.map((k, j) => {
          const col = j % 4;
          const row = Math.floor(j / 4);
          const tIn = ((col + row) / 6) * g.beat * 1.6;
          const a = expo(ramp(u, tIn, tIn + 0.35));
          return (
            <div key={k} style={{ position: "absolute", left: 40 + col * 252, top: 40 + row * 252, width: 240, height: 240, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02))", border: "1px solid rgba(255,255,255,.1)", opacity: a, transform: `translateY(${(1 - a) * 60}px) scale(${lerp(0.85, 1, a)})`, overflow: "hidden" }}>
              <Img src={im(k)} style={{ position: "absolute", inset: 18, width: 204, height: 204, objectFit: k === "n_white" ? "cover" : "contain", borderRadius: k === "n_white" ? 10 : 0 }} />
            </div>
          );
        })}
      </div>
      <Product src={im("n_mount")} x={540} y={lerp(700, 560, hero)} w={560} h={720} opacity={hero} scale={lerp(1.2, 1, hero) + zoom * 0.04} shine={ramp(u - 2 * g.beat, 0.1, 1.1)} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: hero }}>
        <Reveal text="From the Neumann studio family." p={u - 2 * g.beat} size={50} font={SERIF} italic weight={400} style={{ position: "relative", display: "inline-block" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- OUTRO
const Outro: React.FC<{ g: G; u: number; d: number }> = ({ g, u }) => {
  const s = (k: number) => expo(ramp(u, k, k + 0.6));
  const p = pulse(g) * 0.6;
  return (
    <AbsoluteFill>
      <Stage g={g} warm={0.5} />
      <AbsoluteFill style={{ background: `radial-gradient(520px 380px at 540px 560px, rgba(225,38,47,${0.12 + p * 0.08}), transparent 70%)` }} />
      <Product src={im("b_mount2")} x={lerp(160, 320, s(0))} y={548 - u * 5} w={380} h={460} rot={lerp(-12, -4, s(0))} opacity={s(0)} shine={ramp(u, 0.4, 1.6)} />
      <Product src={im("n_mount2")} x={lerp(920, 760, s(0.08))} y={548 - u * 5} w={380} h={460} rot={lerp(12, 4, s(0.08))} opacity={s(0.08)} shine={ramp(u, 0.6, 1.8)} />
      <Img src={LOGO_NEUMANN} style={{ position: "absolute", width: 380, left: 350, top: 54, borderRadius: 14, opacity: s(0.15), transform: `translateY(${(1 - s(0.15)) * -30}px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: DISP, fontWeight: 900, fontSize: 150, letterSpacing: lerp(40, -4, s(0.1)), color: PAPER, opacity: s(0.1), lineHeight: 1 }}>
        TLM 107
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 796, textAlign: "center" }}>
        <Reveal text="Available now at" p={u - 0.35} size={40} font={SERIF} italic weight={400} style={{ position: "relative", display: "inline-block" }} />
      </div>
      <Img src={LOGO_SHIVANSH} style={{ position: "absolute", width: 360, left: 360, top: 850, borderRadius: 14, opacity: s(0.5), transform: `scale(${lerp(0.9, 1, s(0.5))})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 982, textAlign: "center", fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: "rgba(244,240,232,.85)", opacity: s(0.7) }}>
        shivanshelectronics.in · +91 98316 62458 · +91 91477 00677
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<{ g: G; u: number; d: number }>> = {
  hero: Hero,
  montage: Montage,
  split: Split,
  craft: Craft,
  patterns: Patterns,
  context: Context,
  stats: Stats,
  set: Set,
  family: Family,
};

export const schedule = (bpm: number, drop: number) => {
  const bar = (4 * 60) / bpm;
  let b = 0;
  const rows = PLAN.map(([id, n]) => {
    const s = drop + b * bar;
    b += n;
    return { id, s, e: drop + b * bar };
  });
  return { bar, rows, outro: drop + b * bar };
};

export const Reel: React.FC<ReelProps> = ({ bpm, drop }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const end = durationInFrames / fps;
  const { bar, rows, outro } = schedule(bpm, drop);
  const g: G = { t, beat: 60 / bpm, bar, drop };
  const cuts = [drop, ...rows.map((r) => r.e)];
  const cam = t >= drop ? 1 + pulse(g, 0.1) * 0.012 + barPulse(g) * 0.02 : 1;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {rows.map((r) => {
          const C = SCENES[r.id];
          return (
            <Scene key={r.id} g={g} s={r.s} e={r.e}>
              {(u, d) => <C g={g} u={u} d={d} />}
            </Scene>
          );
        })}
        <Scene g={g} s={outro} e={end + 1}>
          {(u, d) => <Outro g={g} u={u} d={d} />}
        </Scene>
      </AbsoluteFill>
      <Intro g={g} />
      <Blades g={g} cuts={cuts} />
      <Vignette />
    </AbsoluteFill>
  );
};

