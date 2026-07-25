import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LF_SPACE } from "../theme";
import { COLORS } from "../theme";
import { SceneHeading } from "../../components/Heading";
import { PolarGlyph, Pattern, PATTERN_LABEL } from "../../components/PolarPattern";
import { labelStyle } from "../../fonts";
import { ramp, EASE } from "../../lib/anim";
import { FloatIn } from "../../components/Ui";
import { GlowOrb } from "../../components/Bits";

/**
 * Diagram-led beat: one or two polar-pattern vector glyphs drawn on, paired
 * with an explanatory text column — used across the Controls chapter's
 * pattern-by-pattern walkthrough.
 */
export const PatternShowcase: React.FC<{
  patterns: Pattern[];
  side: "left" | "right";
  eyebrow?: string;
  headingLines: (string | { text: string; color?: string; italic?: boolean })[];
  support?: string;
  delay?: number;
  glyphSize?: number;
}> = ({ patterns, side, eyebrow, headingLines, support, delay = 6, glyphSize = 340 }) => {
  const frame = useCurrentFrame();
  const imageOnRight = side === "right";
  return (
    <AbsoluteFill>
      <GlowOrb
        x={imageOnRight ? 1400 : 400}
        y={LF_SPACE.safeBottom / 2}
        size={640}
        color={COLORS.champagne}
        opacity={0.12}
        seed={5}
      />
      <AbsoluteFill
        style={{
          alignItems: imageOnRight ? "flex-end" : "flex-start",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop,
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 60,
            [imageOnRight ? "marginRight" : "marginLeft"]: LF_SPACE.marginX + 60,
          } as React.CSSProperties}
        >
          {patterns.map((pat, i) => {
            const d = delay + 14 + i * 10;
            const draw = ramp(frame, d, 26, EASE.out);
            const active = ramp(frame, d + 6, 14);
            return (
              <div key={pat} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <PolarGlyph pattern={pat} size={glyphSize} draw={draw} active={active} />
                <span style={{ ...labelStyle(24, 700, "0.14em"), color: COLORS.ivoryDim }}>
                  {PATTERN_LABEL[pat]}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: imageOnRight ? "flex-start" : "flex-end",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop,
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div
          style={{
            [imageOnRight ? "marginLeft" : "marginRight"]: LF_SPACE.marginX,
            maxWidth: 700,
          } as React.CSSProperties}
        >
          <SceneHeading eyebrow={eyebrow} lines={headingLines} size={58} support={support} delay={delay} maxWidth={700} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
