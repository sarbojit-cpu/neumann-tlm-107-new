import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { KenBurns } from "../components/KenBurns";
import { DarkBase, Particles, Vignette, ChevronField, hexA } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE } from "../theme";
import { Eyebrow, FloatIn } from "../components/Ui";
import { displayStyle } from "../fonts";
import { ramp, EASE } from "../lib/anim";
import { GlowOrb } from "../components/Bits";

/** Cold-open: extreme grille macro pulling back, red capsule glow, scan line. */
export const S01_Hook: React.FC<SceneProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const scan = ramp(frame, 8, 60, EASE.inOut);
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.red} glowX={50} glowY={46} />
          <KenBurns src={IMG.macroGrilleDark} from={1.5} to={1.05} panY={20} duration={210} objectPosition="center" />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.35) }} />
          <GlowOrb x={430} y={780} size={620} color={COLORS.red} opacity={0.4} seed={2} />
          <Particles seed={5} count={40} opacity={0.4} />
          <ChevronField opacity={0.05} />
          <Vignette strength={0.62} />
        </AbsoluteFill>
      }
    >
      {/* sweeping scan line */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scan * 100}%`,
            height: 3,
            background: `linear-gradient(90deg, ${hexA(COLORS.champagne, 0)}, ${hexA(COLORS.champagne, 0.8)}, ${hexA(COLORS.champagne, 0)})`,
            opacity: 0.6 * (1 - ramp(frame, 60, 30)),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px`, justifyContent: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 26, marginBottom: 360 }}>
          <Eyebrow delay={14} accent={COLORS.red} color={COLORS.ivory} size={26}>
            Berlin-engineered sound
          </Eyebrow>
          <FloatIn delay={22} y={40}>
            <div style={{ ...displayStyle(150, 700), color: COLORS.ivory }}>
              The&nbsp;whole
              <br />
              <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>truth.</span>
            </div>
          </FloatIn>
          <FloatIn delay={40} y={16}>
            <div style={{ ...displayStyle(40, 500), color: hexA(COLORS.ivory, 0.7), letterSpacing: "0.02em" }}>
              A studio condenser, uncoloured.
            </div>
          </FloatIn>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
