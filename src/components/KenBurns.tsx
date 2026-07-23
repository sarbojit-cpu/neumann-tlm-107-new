import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, mapClamp } from "../lib/anim";

type Props = {
  src: string;
  /** starting scale */
  from?: number;
  /** ending scale */
  to?: number;
  /** pan in px across the whole clip */
  panX?: number;
  panY?: number;
  duration: number;
  objectFit?: React.CSSProperties["objectFit"];
  objectPosition?: string;
  style?: React.CSSProperties;
  /** overlay a darkening gradient (for text legibility) */
  scrim?: "none" | "bottom" | "top" | "full" | "left";
  rotate?: number;
};

/** Full-bleed image with a slow cinematic push/pan. */
export const KenBurns: React.FC<Props> = ({
  src,
  from = 1.08,
  to = 1.2,
  panX = 0,
  panY = -30,
  duration,
  objectFit = "cover",
  objectPosition = "center",
  scrim = "none",
  rotate = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = mapClamp(frame, [0, duration], [0, 1], EASE.inOut);
  const scale = from + (to - from) * p;
  const x = panX * p;
  const y = panY * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition,
          transform: `scale(${scale}) translate(${x}px, ${y}px) rotate(${rotate}deg)`,
          willChange: "transform",
        }}
      />
      {scrim !== "none" && <Scrim kind={scrim} />}
    </AbsoluteFill>
  );
};

const Scrim: React.FC<{ kind: "bottom" | "top" | "full" | "left" }> = ({
  kind,
}) => {
  const map: Record<string, string> = {
    bottom:
      "linear-gradient(180deg, rgba(6,7,8,0) 40%, rgba(6,7,8,0.55) 74%, rgba(6,7,8,0.9) 100%)",
    top: "linear-gradient(180deg, rgba(6,7,8,0.9) 0%, rgba(6,7,8,0.4) 26%, rgba(6,7,8,0) 55%)",
    full: "linear-gradient(180deg, rgba(6,7,8,0.72) 0%, rgba(6,7,8,0.35) 45%, rgba(6,7,8,0.78) 100%)",
    left: "linear-gradient(90deg, rgba(6,7,8,0.82) 0%, rgba(6,7,8,0.3) 45%, rgba(6,7,8,0) 72%)",
  };
  return <AbsoluteFill style={{ background: map[kind] }} />;
};
