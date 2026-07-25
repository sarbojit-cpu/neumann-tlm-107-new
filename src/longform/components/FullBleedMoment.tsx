import React from "react";
import { AbsoluteFill } from "remotion";
import { LF_SPACE } from "../theme";
import { SceneHeading } from "../../components/Heading";
import { FloatIn } from "../../components/Ui";
import { labelStyle } from "../../fonts";
import { COLORS } from "../theme";

/**
 * Full-bleed cinematic moment (Ken Burns background supplied by the caller
 * as `bg`) with a text block anchored to one side, safely within the canvas
 * above the caption band. Used for mood/heritage/outro beats where the
 * background image itself IS the hero, not a framed inset.
 */
export const FullBleedMoment: React.FC<{
  align?: "left" | "right" | "center";
  eyebrow?: string;
  headingLines: (string | { text: string; color?: string; italic?: boolean })[];
  headingSize?: number;
  support?: string;
  delay?: number;
  maxWidth?: number;
  kicker?: string;
}> = ({
  align = "left",
  eyebrow,
  headingLines,
  headingSize = 76,
  support,
  delay = 6,
  maxWidth = 900,
  kicker,
}) => {
  const items = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  return (
    <AbsoluteFill
      style={{
        alignItems: items,
        justifyContent: "flex-end",
        paddingLeft: LF_SPACE.marginX,
        paddingRight: LF_SPACE.marginX,
        paddingBottom: LF_SPACE.bottomPad + 60,
      }}
    >
      {kicker && (
        <FloatIn delay={delay - 2} y={14}>
          <span style={{ ...labelStyle(22, 700, "0.34em"), color: COLORS.champagneSoft, marginBottom: 4 }}>
            {kicker}
          </span>
        </FloatIn>
      )}
      <SceneHeading
        eyebrow={eyebrow}
        lines={headingLines}
        size={headingSize}
        support={support}
        delay={delay}
        align="left"
        maxWidth={maxWidth}
      />
    </AbsoluteFill>
  );
};
