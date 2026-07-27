import React from "react";
import { COLORS, RADII } from "../theme";
import { labelStyle } from "../fonts";
import { hexA } from "./Backgrounds";

export type ThumbLang = "english" | "hindi" | "bengali";

export const LANG_LABEL: Record<ThumbLang, string> = {
  english: "ENGLISH",
  hindi: "HINDI",
  bengali: "BENGALI",
};

/**
 * Consistent language-variant badge for thumbnails — same placement, size and
 * style across all three languages; only the label text differs. A small dot
 * + "AUDIO" microcopy makes clear it denotes the narration language, not a
 * translated version of the whole thumbnail.
 */
export const LanguageBadge: React.FC<{ lang: ThumbLang; scale?: number }> = ({
  lang,
  scale = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10 * scale,
      padding: `${14 * scale}px ${26 * scale}px`,
      borderRadius: RADII.chip,
      background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.paperEdge} 100%)`,
      border: `1.5px solid ${hexA(COLORS.champagne, 0.55)}`,
      boxShadow: "0 16px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
    }}
  >
    <span
      style={{
        width: 9 * scale,
        height: 9 * scale,
        borderRadius: "50%",
        background: COLORS.red,
        boxShadow: `0 0 ${10 * scale}px ${COLORS.red}`,
        flexShrink: 0,
      }}
    />
    <span style={{ ...labelStyle(18 * scale, 700, "0.22em"), color: COLORS.ink }}>
      {LANG_LABEL[lang]}
    </span>
    <span style={{ ...labelStyle(13 * scale, 600, "0.14em"), color: COLORS.steelDim }}>
      AUDIO
    </span>
  </div>
);
