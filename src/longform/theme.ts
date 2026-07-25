// Long-form (landscape deep-dive) specific dimensions and layout constants.
// Colors, radii and BRAND are shared with the reel (src/theme.ts) for visual
// continuity — only the frame geometry and safe-zone differ.
export { COLORS, RADII, BRAND, PRODUCT } from "../theme";

export const LF_VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 600,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds);
  },
};

/**
 * The persistent caption placeholder box (reserved for manually-added
 * captions after narration is recorded). Exact spec: 1704x108px, rounded,
 * centered horizontally, 40px above the frame bottom.
 */
export const CAPTION_BOX = {
  width: 1704,
  height: 108,
  bottomMargin: 40,
  radius: 22,
  get top() {
    return LF_VIDEO.height - this.bottomMargin - this.height; // 932
  },
  get left() {
    return (LF_VIDEO.width - this.width) / 2; // 108
  },
};

/**
 * Hard layout rule: every other element in every scene must end at or above
 * this Y coordinate. 22px clean gap above the box's top edge (932 - 22).
 * Treat the working canvas as 1920 x LF_SAFE_HEIGHT, not 1920x1080.
 */
export const LF_SAFE_BOTTOM = CAPTION_BOX.top - 22; // 910

export const LF_SPACE = {
  width: LF_VIDEO.width,
  height: LF_VIDEO.height,
  marginX: 96,
  marginTop: 64,
  safeBottom: LF_SAFE_BOTTOM,
  safeHeight: LF_SAFE_BOTTOM, // usable canvas height from y=0
  /** padding-bottom to hand a flex container so justifyContent:"center" centers within [marginTop, safeBottom]. */
  bottomPad: LF_VIDEO.height - LF_SAFE_BOTTOM,
} as const;

// Caption box glow — a cool cyan-mint neon, deliberately distinct from the
// warm champagne/red palette so it reads as an intentional design element.
export const CAPTION_GLOW = {
  core: "#8FF3E4",
  soft: "#5FD8CE",
} as const;
