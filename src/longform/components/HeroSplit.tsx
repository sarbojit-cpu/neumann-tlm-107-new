import React from "react";
import { AbsoluteFill } from "remotion";
import { LF_SPACE } from "../theme";
import { SceneHeading } from "../../components/Heading";
import { FloatIn, Chip } from "../../components/Ui";
import { Cutout, FramedImage } from "../../components/Product";
import { GlowOrb } from "../../components/Bits";

type ImageSpec =
  | { kind: "cutout"; src: string; height?: number; rotate?: number; floatAmp?: number }
  | {
      kind: "framed";
      src: string;
      width?: number;
      height?: number;
      objectPosition?: string;
      panX?: number;
      panY?: number;
      zoomFrom?: number;
      zoomTo?: number;
    };

/**
 * The workhorse landscape layout: one hero image on one side, a text column
 * on the other, both vertically centered within the safe canvas (above the
 * reserved caption band). Covers most single-image beats across the video.
 */
export const HeroSplit: React.FC<{
  side: "left" | "right";
  image: ImageSpec;
  eyebrow?: string;
  headingLines: (string | { text: string; color?: string; italic?: boolean })[];
  headingSize?: number;
  support?: string;
  chips?: string[];
  chipTone?: "dark" | "light" | "red";
  delay?: number;
  maxTextWidth?: number;
  glow?: { color: string; x: number; y: number; size: number };
}> = ({
  side,
  image,
  eyebrow,
  headingLines,
  headingSize = 68,
  support,
  chips,
  chipTone = "dark",
  delay = 6,
  maxTextWidth = 760,
  glow,
}) => {
  const imageOnRight = side === "right";
  return (
    <AbsoluteFill>
      {glow && <GlowOrb x={glow.x} y={glow.y} size={glow.size} color={glow.color} opacity={0.16} seed={3} />}

      {/* Image column — right-side images get extra top clearance so tall
          framed images (with corner-tick decorations right at their edge)
          never reach up into the persistent top-right brand badge. */}
      <AbsoluteFill
        style={{
          alignItems: imageOnRight ? "flex-end" : "flex-start",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop + (imageOnRight ? 90 : 0),
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div style={{ [imageOnRight ? "marginRight" : "marginLeft"]: LF_SPACE.marginX + 40 } as React.CSSProperties}>
          {image.kind === "cutout" ? (
            <Cutout
              src={image.src}
              height={image.height ?? 640}
              delay={delay + 4}
              rotate={image.rotate ?? 0}
              floatAmp={image.floatAmp ?? 10}
            />
          ) : (
            <FramedImage
              src={image.src}
              width={image.width ?? 760}
              height={image.height ?? 620}
              delay={delay + 4}
              objectPosition={image.objectPosition ?? "center"}
              panX={image.panX}
              panY={image.panY}
              zoomFrom={image.zoomFrom}
              zoomTo={image.zoomTo}
            />
          )}
        </div>
      </AbsoluteFill>

      {/* Text column */}
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
            maxWidth: maxTextWidth,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignItems: imageOnRight ? "flex-start" : "flex-end",
          } as React.CSSProperties}
        >
          <SceneHeading
            eyebrow={eyebrow}
            lines={headingLines}
            size={headingSize}
            support={support}
            delay={delay}
            maxWidth={maxTextWidth}
            align={imageOnRight ? "left" : "left"}
          />
          {chips && chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {chips.map((c, i) => (
                <FloatIn key={c} delay={delay + 22 + i * 5} y={14}>
                  <Chip tone={chipTone} size={22}>
                    {c}
                  </Chip>
                </FloatIn>
              ))}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LF_SPACE_HEIGHT = LF_SPACE.height;
