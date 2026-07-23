import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, CountUp } from "../components/Ui";
import { labelStyle, displayStyle } from "../fonts";
import { WaveBars } from "../components/Waveform";
import { Cutout } from "../components/Product";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";
import { EASE } from "../lib/anim";

/** Ultra-low self-noise — 10 dB-A, with bars settling into quiet. */
export const S09_Noise: React.FC<SceneProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const quiet = interpolate(frame, [24, 120], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={70} glowY={40} />
          <GlowOrb x={720} y={620} size={560} color={COLORS.champagne} opacity={0.14} seed={9} />
          <Particles seed={27} count={18} opacity={0.18} />
          <Vignette strength={0.58} />
        </AbsoluteFill>
      }
    >
      {/* cutout far right */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ marginRight: -380, marginTop: 90 }}>
          <Cutout src={IMG.mountNickelB} height={900} delay={10} floatAmp={9} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 172, left: SPACE.marginX }}>
          <SceneHeading eyebrow="Silent by design" lines={["Whisper", { text: "quiet.", color: COLORS.champagneSoft, italic: true }]} size={104} maxWidth={560} />
        </div>

        {/* big number */}
        <div style={{ position: "absolute", top: 640, left: SPACE.marginX, display: "flex", alignItems: "flex-end", gap: 18 }}>
          <FloatIn delay={20} y={30}>
            <CountUp to={10} dur={34} style={{ ...displayStyle(300, 700), color: COLORS.ivory }} />
          </FloatIn>
          <FloatIn delay={30} y={16}>
            <div style={{ ...displayStyle(76, 600), color: COLORS.champagneSoft, marginBottom: 28 }}>dB-A</div>
          </FloatIn>
        </div>
        <div style={{ position: "absolute", top: 960, left: SPACE.marginX }}>
          <FloatIn delay={38} y={12}>
            <span style={{ ...labelStyle(28, 700, "0.2em"), color: COLORS.ivoryDim }}>Self-noise · A-weighted</span>
          </FloatIn>
        </div>

        {/* settling bars in the clear left column */}
        <div style={{ position: "absolute", top: 1080, left: SPACE.marginX }}>
          <FloatIn delay={30} y={16}>
            <WaveBars width={560} height={180} count={38} quiet={quiet} color={COLORS.champagne} />
          </FloatIn>
        </div>
        <div style={{ position: "absolute", top: 1290, left: SPACE.marginX }}>
          <FloatIn delay={46} y={12}>
            <span style={{ ...labelStyle(24, 600, "0.16em"), color: COLORS.steel }}>Quieter than a silent room</span>
          </FloatIn>
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomLeft" appearAt={44} logoWidth={290} />
    </Scene>
  );
};
