import { staticFile } from "remotion";

// Semantic keys → public paths. Keeps scene code readable and lets us
// swap sources in one place.
export const IMG = {
  // Black heroes
  heroBlackFront: staticFile("images/hero-black-front.jpg"),
  heroBlackHi: staticFile("images/hero-black-front-hi.jpg"),
  black3qXlr: staticFile("images/black-3q-xlr.jpg"),
  // Nickel heroes
  heroNickelFront: staticFile("images/hero-nickel-front.jpg"),
  nickelFrontSq: staticFile("images/nickel-front-sq.jpg"),
  nickelTopAngle: staticFile("images/nickel-top-angle.jpg"),
  nickelOnStand: staticFile("images/nickel-on-stand.jpg"),
  // Shock-mount cutouts (transparent)
  mountBlackA: staticFile("images/mount-black-a.png"),
  mountBlackB: staticFile("images/mount-black-b.png"),
  mountNickelA: staticFile("images/mount-nickel-a.png"),
  mountNickelB: staticFile("images/mount-nickel-b.png"),
  mountNickelDetail: staticFile("images/mount-nickel-detail.jpg"),
  // Context
  ctxPurpleFabric: staticFile("images/ctx-purple-fabric.jpg"),
  ctxConsole: staticFile("images/ctx-console.jpg"),
  ctxStudioPair: staticFile("images/ctx-studio-pair.jpg"),
  ctxDarkBranded: staticFile("images/ctx-dark-branded.jpg"),
  // Macro
  macroGrilleDark: staticFile("images/macro-grille-dark.jpg"),
  macroBadgeDark: staticFile("images/macro-badge-dark.jpg"),
  macroBadgeWhite: staticFile("images/macro-badge-white.jpg"),
  macroNickelGrille: staticFile("images/macro-nickel-grille.jpg"),
  macroNickelXlr: staticFile("images/macro-nickel-xlr.jpg"),
  // Controls / patterns
  controlsBlack: staticFile("images/controls-black.jpg"),
  controlsNickel: staticFile("images/controls-nickel.jpg"),
  controlsBlackAngle: staticFile("images/controls-black-angle.jpg"),
  polarDiagram: staticFile("images/polar-diagram.png"),
  // Accessories / packaging
  boxOpen: staticFile("images/box-open.jpg"),
  boxClosed: staticFile("images/box-closed.jpg"),
  mountBlackAlone: staticFile("images/mount-black-alone.jpg"),
  mountNickelAlone: staticFile("images/mount-nickel-alone.jpg"),
  mountNickelAdapters: staticFile("images/mount-nickel-adapters.jpg"),
  windscreen: staticFile("images/windscreen.jpg"),
  // Ecosystem (brand family)
  ecoHeadphonesA: staticFile("images/eco-headphones-a.png"),
  ecoHeadphonesB: staticFile("images/eco-headphones-b.png"),
  ecoMonitorA: staticFile("images/eco-monitor-a.png"),
  ecoMonitorB: staticFile("images/eco-monitor-b.png"),
  ecoMonitorC: staticFile("images/eco-monitor-c.png"),
  ecoSubwoofer: staticFile("images/eco-subwoofer.png"),
  ecoMa1Graph: staticFile("images/eco-ma1-graph.png"),
  ecoTubePsu: staticFile("images/eco-tube-psu.png"),
  ecoU87: staticFile("images/eco-u87.png"),
  ecoClipMic: staticFile("images/eco-clip-mic.png"),
} as const;

export const LOGO = {
  neumann: staticFile("logos/logo-neumann.png"),
  shivansh: staticFile("logos/logo-shivansh.png"),
} as const;

export const AUDIO = {
  music: staticFile("audio/music-bed.wav"),
  vo: staticFile("vo/voiceover.mp3"),
  // SFX palette (rotated across transitions/accents)
  whooshUp: staticFile("audio/sfx-whoosh-up.wav"),
  whooshDown: staticFile("audio/sfx-whoosh-down.wav"),
  impact: staticFile("audio/sfx-impact.wav"),
  softImpact: staticFile("audio/sfx-soft-impact.wav"),
  riser: staticFile("audio/sfx-riser.wav"),
  tick: staticFile("audio/sfx-tick.wav"),
  sparkle: staticFile("audio/sfx-sparkle.wav"),
  subDrop: staticFile("audio/sfx-subdrop.wav"),
  reverseSwell: staticFile("audio/sfx-reverse-swell.wav"),
  clickPop: staticFile("audio/sfx-click-pop.wav"),
} as const;
