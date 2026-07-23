import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { DarkBase, Vignette, Particles, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn } from "../components/Ui";
import { labelStyle } from "../fonts";
import { FreqCurve } from "../components/Waveform";
import { Watermark } from "../components/Bits";
import { ramp, EASE } from "../lib/anim";

/** Natural, transformerless sound — a flat, honest response curve draws on. */
export const S11_Sound: React.FC<SceneProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const prog = ramp(frame, 24, 90, EASE.inOut);
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={50} />
          <KenBurns src={IMG.macroGrilleDark} from={1.2} to={1.4} panY={-24} duration={180} style={{ opacity: 0.24 }} />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.4) }} />
          <Watermark top={150} size={360} rotate={0}>TRUE</Watermark>
          <Particles seed={29} count={26} opacity={0.24} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px`, justifyContent: "center" }}>
        <div style={{ marginTop: -160 }}>
          <SceneHeading
            eyebrow="Transformerless circuit"
            lines={["Flat. Honest.", { text: "True.", color: COLORS.champagneSoft, italic: true }]}
            size={100}
            support="A neutral response with a gentle presence lift — detailed, natural, and faithful to the source."
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      {/* frequency curve */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 300 }}>
          <FloatIn delay={18} y={20}>
            <div style={{ position: "relative" }}>
              <FreqCurve width={936} height={300} progress={prog} color={COLORS.champagne} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ ...labelStyle(20, 600, "0.12em"), color: COLORS.steel }}>20 Hz</span>
                <span style={{ ...labelStyle(20, 600, "0.12em"), color: COLORS.steel }}>1 kHz</span>
                <span style={{ ...labelStyle(20, 600, "0.12em"), color: COLORS.steel }}>20 kHz</span>
              </div>
            </div>
          </FloatIn>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
