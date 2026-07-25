// Central design tokens — one place for the whole reel's visual language.

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 178,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds);
  },
};

export const COLORS = {
  // Base
  ink: "#0C0D10", // near-black charcoal base
  inkSoft: "#14161B", // slightly raised panels
  inkDeep: "#060708", // deepest wells
  // Warm neutrals
  ivory: "#F4EFE6", // primary warm off-white text
  ivoryDim: "#C9C3B6",
  paper: "#FBF8F2", // light "brand plate" cards
  paperEdge: "#E7E0D2",
  // Brand accents
  red: "#C1121C", // Neumann badge red
  redBright: "#E23142",
  champagne: "#C7A253", // premium nickel/gold hairline
  champagneSoft: "#E4CE9A",
  steel: "#8A93A0", // secondary cool grey
  steelDim: "#5A626D",
  amber: "#E8820C", // Neumann chevron orange (sparing motion accent)
  // Utility
  line: "rgba(244,239,230,0.14)",
  lineStrong: "rgba(244,239,230,0.26)",
} as const;

export const RADII = {
  card: 34,
  chip: 999,
  plate: 26,
  sm: 14,
} as const;

export const SPACE = {
  // safe margins for 1080x1920 — keep all critical content inside
  marginX: 72,
  marginTop: 96,
  marginBottom: 150,
} as const;

// Shared timing (in frames @30fps)
export const TIMING = {
  transition: 22, // ~0.73s cross-scene overlap
  in: 18,
  hold: 8,
  out: 16,
} as const;

// Brand contact block — used across the reel + outro (from the brief).
export const BRAND = {
  name: "Shivansh Electronics",
  website: "www.shivanshelectronics.in",
  instagram: "instagram.com/@shivanshelectronics.in",
  facebook: "facebook.com/@shivanshelectronics.in",
  linkedin: "linkedin.com/@shivanshelectronics-in",
  threads: "threads.com/@shivanshelectronics.in",
  twitter: "x.com/sarbo_shivansh",
  youtube: "youtube.com/@shivanshelectronics-in",
  whatsapp: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
  community: "whatsapp.com/channel/0029VbBzlQH3rZZfQBHsf20K",
  address:
    "3, Rama Nath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal 700031",
} as const;

export const PRODUCT = {
  name: "TLM 107",
  full: "Neumann TLM 107",
  set: "Studio Set",
  price: "₹1,44,900",
  priceNote: "incl. GST · per unit",
  cta: "DM or Call for best price",
} as const;
