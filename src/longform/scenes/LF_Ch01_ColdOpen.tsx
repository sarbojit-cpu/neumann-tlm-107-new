import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette, ChevronField, hexA } from "../../components/Backgrounds";
import { KenBurns } from "../../components/KenBurns";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { FloatIn, Eyebrow } from "../../components/Ui";
import { displayStyle, labelStyle } from "../../fonts";
import { LogoPlate } from "../../components/LogoPlate";
import { LFBrandCorner } from "../components/LFBrand";
import { GlowOrb } from "../../components/Bits";
import { ramp, EASE } from "../../lib/anim";

/** Beat 1 — Cold open: extreme grille macro, brand mark reveal, title lockup. */
export const LF01_ColdOpen: React.FC<LFBeatProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const scan = ramp(frame, 10, 70, EASE.inOut);
  return (
    <LFShell
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={46} />
          <KenBurns src={IMG.macroGrilleDark} from={1.45} to={1.08} panY={18} duration={280} objectPosition="center" />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.34) }} />
          <GlowOrb x={960} y={560} size={780} color={COLORS.champagne} opacity={0.22} seed={2} />
          <Particles seed={5} count={48} opacity={0.35} />
          <ChevronField opacity={0.045} />
          <Vignette strength={0.58} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scan * 78}%`,
            height: 3,
            background: `linear-gradient(90deg, ${hexA(COLORS.champagne, 0)}, ${hexA(COLORS.champagne, 0.75)}, ${hexA(COLORS.champagne, 0)})`,
            opacity: 0.55 * (1 - ramp(frame, 70, 30)),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: LF_SPACE.marginTop + 10 }}>
          <FloatIn delay={10} y={16}>
            <LogoPlate which="neumann" width={340} />
          </FloatIn>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, marginTop: 30 }}>
          <Eyebrow delay={22} accent={COLORS.amber} color={COLORS.ivory} size={26}>
            A complete deep dive
          </Eyebrow>
          <FloatIn delay={30} y={44}>
            <div style={{ ...displayStyle(160, 700), color: COLORS.ivory, letterSpacing: "-0.03em", textAlign: "center" }}>
              TLM <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>107</span>
            </div>
          </FloatIn>
          <FloatIn delay={44} y={16}>
            <div style={{ ...labelStyle(28, 600, "0.14em"), color: hexA(COLORS.ivory, 0.72) }}>
              The Neumann TLM 107 Studio Set, in full
            </div>
          </FloatIn>
        </div>
      </AbsoluteFill>

      <LFBrandCorner mode="logo" appearAt={60} />
    </LFShell>
  );
};
