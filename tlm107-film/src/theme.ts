// ─────────────────────────────────────────────────────────────────────────────
// "BERLIN SIGNAL" — the design system of this film.
//
// Everything is derived from the TLM 107 itself:
//   · the chrome ring and its five lit pattern glyphs  → the HUD progress, the
//     ring wipe, the circular measurement graphics
//   · the red rhombus badge                            → the only accent colour,
//     the rhombus iris, the bullet in every slate
//   · the woven head grille                            → the mesh dissolve, the
//     dot-grid of every plot
//   · sound pressure itself                            → the caption face is a
//     variable-width grotesk (Anybody) whose width axis is hit like a membrane:
//     words arrive compressed and snap open, then settle
//
// Palette: graphite night, nickel, LED white, one red. Gold only ever appears
// on the capsule, because that is the only gold part of the microphone.
// ─────────────────────────────────────────────────────────────────────────────

export const C = {
  ink: "#050608",
  night: "#0A0C10",
  graphite: "#12151B",
  slate: "#1B2029",
  steel: "#7E8793",
  mist: "#B9C0C9",
  nickel: "#E8EBEF",
  led: "#DDF6FF",
  ledGlow: "rgba(190,236,255,0.85)",
  red: "#E1263F",
  redHot: "#FF4D63",
  gold: "#D6B474",
  goldDeep: "#8C6A2E",
};

export const FONT = {
  display: "'Anybody', 'Arial Narrow', sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// Burned-in typography is held translucent so the picture always reads
// through the letterforms; the picture itself is never dimmed for it.
export const TYPE_OPACITY = 0.72;

export type Canvas = {
  id: "reel" | "film";
  w: number;
  h: number;
  portrait: boolean;
  fps: number;
  frames: number;
  // platform-safe margins in design px (1080-wide or 1920-wide space)
  safe: { top: number; bottom: number; left: number; right: number };
};

export const REEL: Canvas = {
  id: "reel", w: 1080, h: 1920, portrait: true, fps: 30, frames: 5400,
  // Instagram / Shorts chrome: top bar, right-hand action rail, bottom caption
  safe: { top: 150, bottom: 330, left: 70, right: 130 },
};

export const FILM: Canvas = {
  id: "film", w: 1920, h: 1080, portrait: false, fps: 30, frames: 9000,
  safe: { top: 70, bottom: 80, left: 110, right: 110 },
};

export const CONTACT = {
  brand: "SHIVANSH ELECTRONICS",
  // stated without any zone or region, by instruction
  role: "Shivansh Electronics is the Exclusive Partner of the",
  role2: "Neumann TLM 107 Studio Set",
  site: "www.shivanshelectronics.in",
  whatsapp: ["+91 98316 62458", "+91 89818 07755", "+91 91477 00677"],
  social: [
    ["facebook", "facebook.com/@shivanshelectronics.in"],
    ["instagram", "instagram.com/@shivanshelectronics.in"],
    ["youtube", "youtube.com/@shivanshelectronics-in"],
    ["linkedin", "linkedin.com/@shivanshelectronics-in"],
  ] as [string, string][],
};

export const CHAPTERS_REEL = ["DESIGN", "INSIDE", "PATTERNS", "IN USE", "GET YOURS"];
export const CHAPTERS_FILM = ["LEGACY", "DESIGN", "INSIDE", "CONTROL", "STUDIO"];
