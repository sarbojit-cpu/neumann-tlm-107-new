import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile } from "remotion";

export const im = (k: string) => staticFile(`sq/img/${k}.webp`);
export const LOGO_NEUMANN = staticFile("sq/logos/logo-neumann.png");
export const LOGO_SHIVANSH = staticFile("sq/logos/logo-shivansh.png");

export const RED = "#E1262F";
export const NICKEL = "#D9CFBD";
export const GOLD = "#E3B873";
export const INK = "#07080A";
export const PAPER = "#F4F0E8";
export const DISP = "'Archivo', sans-serif";
export const SERIF = "'Fraunces', serif";
export const MONO = "'JetBrains Mono', monospace";

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const expo = (x: number) => (clamp(x) >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
export const easeIO = (x: number) => {
  x = clamp(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const back = (x: number) => {
  x = clamp(x);
  const c1 = 1.5;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** Deterministic hash noise in [0,1). */
export const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---------- fonts ----------
let fontPromise: Promise<void> | null = null;
const loadFonts = () => {
  if (!fontPromise) {
    const faces = [
      new FontFace("Archivo", `url(${staticFile("sq/fonts/Archivo-normal-100_900.woff2")})`, { weight: "100 900" }),
      new FontFace("Fraunces", `url(${staticFile("sq/fonts/fraunces-normal.woff2")})`, { weight: "100 900" }),
      new FontFace("Fraunces", `url(${staticFile("sq/fonts/fraunces-italic.woff2")})`, { weight: "100 900", style: "italic" }),
      new FontFace("JetBrains Mono", `url(${staticFile("sq/fonts/JetBrainsMono-normal-400.woff2")})`, { weight: "400" }),
    ];
    fontPromise = Promise.all(faces.map((f) => f.load())).then((loaded) => {
      loaded.forEach((f) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(f));
    });
  }
  return fontPromise;
};
export const useFonts = () => {
  const [h] = React.useState(() => delayRender("tlm fonts"));
  React.useEffect(() => {
    loadFonts().then(
      () => continueRender(h),
      () => continueRender(h),
    );
  }, [h]);
};

// ---------- building blocks ----------

/** Product image (object-fit contain) with optional specular sweep masked to its alpha. */
export const Product: React.FC<{
  src: string;
  x: number; // centre
  y: number;
  w: number;
  h: number;
  rot?: number;
  scale?: number;
  opacity?: number;
  shine?: number; // 0..1 sweep phase; undefined = no sweep
  shadow?: boolean;
  blur?: number;
  style?: React.CSSProperties;
}> = ({ src, x, y, w, h, rot = 0, scale = 1, opacity = 1, shine, shadow = true, blur = 0, style }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      transform: `rotate(${rot}deg) scale(${scale})`,
      opacity,
      filter: [shadow ? "drop-shadow(0 28px 44px rgba(0,0,0,.65))" : "", blur > 0.2 ? `blur(${blur}px)` : ""].join(" ") || undefined,
      ...style,
    }}
  >
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    {shine !== undefined && shine > 0 && shine < 1 ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${lerp(-40, 110, shine) - 14}%, rgba(255,255,255,.55) ${lerp(-40, 110, shine)}%, transparent ${lerp(-40, 110, shine) + 14}%)`,
          WebkitMaskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          mixBlendMode: "screen",
        }}
      />
    ) : null}
  </div>
);

/** Full-bleed cover photo with Ken Burns. */
export const Cover: React.FC<{ src: string; z?: number; x?: number; y?: number; opacity?: number; filter?: string; pos?: string }> = ({
  src,
  z = 1,
  x = 0,
  y = 0,
  opacity = 1,
  filter,
  pos = "center",
}) => (
  <AbsoluteFill style={{ overflow: "hidden", opacity }}>
    <Img
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        transform: `translate(${x}px, ${y}px) scale(${z})`,
        filter,
      }}
    />
  </AbsoluteFill>
);

/** Masked word-by-word rise. p = progress seconds since start, out = seconds since exit start (<0 = not exiting). */
export const Reveal: React.FC<{
  text: string;
  p: number;
  out?: number;
  size: number;
  font?: string;
  weight?: number;
  italic?: boolean;
  color?: string;
  spacing?: number;
  stagger?: number;
  upper?: boolean;
  style?: React.CSSProperties;
  lh?: number;
}> = ({ text, p, out = -1, size, font = DISP, weight = 800, italic, color = PAPER, spacing = 0, stagger = 0.05, upper, style, lh = 1.02 }) => {
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", fontFamily: font, fontSize: size, fontWeight: weight, fontStyle: italic ? "italic" : "normal", color, letterSpacing: spacing, lineHeight: lh, textTransform: upper ? "uppercase" : "none", whiteSpace: "nowrap", ...style }}>
      {words.map((w, i) => {
        const a = expo(ramp(p, i * stagger, i * stagger + 0.45));
        const o = out >= 0 ? easeIO(ramp(out, i * 0.025, i * 0.025 + 0.22)) : 0;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - a) * 110 - o * 110}%)` }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Decoding monospace text. */
export const Scramble: React.FC<{ text: string; p: number; size?: number; color?: string; style?: React.CSSProperties; spacing?: number }> = ({
  text,
  p,
  size = 16,
  color = "rgba(244,240,232,.75)",
  style,
  spacing = 3,
}) => {
  const n = text.length;
  const shown = Math.floor(clamp(p / 0.4) * n);
  const glyphs = "01<>/#=+*";
  let s = "";
  for (let i = 0; i < n; i++) {
    if (text[i] === " ") s += " ";
    else if (i < shown) s += text[i];
    else if (i < shown + 4 && p > 0) s += glyphs[Math.floor(rnd(i + Math.floor(p * 30)) * glyphs.length)];
    else s += " ";
  }
  return <div style={{ position: "absolute", fontFamily: MONO, fontSize: size, color, letterSpacing: spacing, whiteSpace: "pre", ...style }}>{s}</div>;
};

/** Thin technical corner brackets. */
export const Brackets: React.FC<{ x: number; y: number; w: number; h: number; p: number; color?: string; len?: number }> = ({ x, y, w, h, p, color = "rgba(244,240,232,.55)", len = 26 }) => {
  const a = expo(p);
  const L = len * a;
  const st: React.CSSProperties = { position: "absolute", borderColor: color, borderStyle: "solid", width: L, height: L, opacity: a };
  return (
    <>
      <div style={{ ...st, left: x, top: y, borderWidth: "2px 0 0 2px" }} />
      <div style={{ ...st, left: x + w - L, top: y, borderWidth: "2px 2px 0 0" }} />
      <div style={{ ...st, left: x, top: y + h - L, borderWidth: "0 0 2px 2px" }} />
      <div style={{ ...st, left: x + w - L, top: y + h - L, borderWidth: "0 2px 2px 0" }} />
    </>
  );
};

/** Polar pattern radius for a first-order pattern with omni coefficient a (1 = omni, 0 = figure-8). */
export const polarPath = (a: number, cx: number, cy: number, R: number) => {
  let d = "";
  for (let i = 0; i <= 180; i++) {
    const th = (i / 180) * Math.PI * 2;
    const r = Math.abs(a + (1 - a) * Math.cos(th)) * R;
    const px = cx + r * Math.sin(th);
    const py = cy - r * Math.cos(th);
    d += (i ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1);
  }
  return d + "Z";
};
