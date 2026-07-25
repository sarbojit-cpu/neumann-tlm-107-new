import React from "react";
import { AbsoluteFill } from "remotion";
import { LF_SPACE } from "../theme";
import { COLORS } from "../theme";
import { SceneHeading } from "../../components/Heading";
import { FloatIn } from "../../components/Ui";
import { Cutout, FramedImage } from "../../components/Product";
import { labelStyle } from "../../fonts";

type ImageSpec =
  | { kind: "cutout"; src: string; height?: number; rotate?: number; floatAmp?: number }
  | { kind: "framed"; src: string; width?: number; height?: number; objectPosition?: string };

// Fixed vertical zones (not flex-anchored) so a long support line can never
// push into the image row, and the image row can never reach the caption
// band, regardless of per-beat content length.
const HEADING_TOP = LF_SPACE.marginTop + 6; // 70
const IMAGE_ROW_TOP = 420; // guaranteed clear of the heading zone above
const IMAGE_MAX_HEIGHT = 420; // 420 + label(~56) ends at 896, under safeBottom (910)

/**
 * Two images shown together for a genuine compositional/comparative reason
 * (e.g. Black vs Nickel, two craftsmanship macros, two accessories). Heading
 * sits in a fixed top zone; images sit in a fixed lower zone — the two zones
 * never compete for space no matter how long the support copy runs.
 */
export const ComparePair: React.FC<{
  eyebrow?: string;
  headingLines: (string | { text: string; color?: string; italic?: boolean })[];
  headingSize?: number;
  support?: string;
  left: ImageSpec;
  right: ImageSpec;
  leftLabel?: string;
  rightLabel?: string;
  delay?: number;
  gap?: number;
}> = ({
  eyebrow,
  headingLines,
  headingSize = 54,
  support,
  left,
  right,
  leftLabel,
  rightLabel,
  delay = 6,
  gap = 90,
}) => {
  return (
    <AbsoluteFill>
      {/* Heading, fixed top zone */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: HEADING_TOP, textAlign: "center", maxWidth: 1240 }}>
          <SceneHeading
            eyebrow={eyebrow}
            lines={headingLines}
            size={headingSize}
            support={support}
            delay={delay}
            align="center"
            maxWidth={1240}
          />
        </div>
      </AbsoluteFill>

      {/* Image pair, fixed lower zone — independent of heading height */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: IMAGE_ROW_TOP, display: "flex", alignItems: "flex-start", gap }}>
          <ImageColumn spec={left} label={leftLabel} delay={delay + 14} />
          <ImageColumn spec={right} label={rightLabel} delay={delay + 20} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ImageColumn: React.FC<{ spec: ImageSpec; label?: string; delay: number }> = ({ spec, label, delay }) => {
  const h = Math.min(spec.height ?? IMAGE_MAX_HEIGHT, IMAGE_MAX_HEIGHT);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {spec.kind === "cutout" ? (
        <Cutout src={spec.src} height={h} delay={delay} rotate={spec.rotate ?? 0} floatAmp={spec.floatAmp ?? 9} />
      ) : (
        <FramedImage src={spec.src} width={spec.width ?? 460} height={h} delay={delay} objectPosition={spec.objectPosition ?? "center"} />
      )}
      {label && (
        <FloatIn delay={delay + 12} y={12}>
          <span style={{ ...labelStyle(20, 700, "0.18em"), color: COLORS.ivoryDim }}>{label}</span>
        </FloatIn>
      )}
    </div>
  );
};
