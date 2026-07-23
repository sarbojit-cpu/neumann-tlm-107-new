import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette } from "../components/Backgrounds";
import { IMG } from "../assets";
import { COLORS, SPACE, RADII } from "../theme";
import { SceneHeading } from "../components/Heading";
import { FloatIn, Chip } from "../components/Ui";
import { labelStyle } from "../fonts";
import { Cutout } from "../components/Product";
import { WaveBars, WaveLine } from "../components/Waveform";
import { BrandPlate } from "../components/BrandPlate";
import { GlowOrb } from "../components/Bits";
import { hexA } from "../components/Backgrounds";

/** Neumann studio ecosystem + a modern, AI-assisted production workflow. */
export const S15_Ecosystem: React.FC<SceneProps> = ({ enter, sweep }) => {
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={64} />
          <GlowOrb x={120} y={860} size={560} color={COLORS.steel} opacity={0.14} seed={2} />
          <GlowOrb x={720} y={900} size={560} color={COLORS.champagne} opacity={0.12} seed={7} />
          <Particles seed={41} count={20} opacity={0.18} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        <div style={{ position: "absolute", top: 150, left: SPACE.marginX }}>
          <SceneHeading
            eyebrow="A complete signal chain"
            lines={["Made for the", { text: "modern studio.", color: COLORS.champagneSoft, italic: true }]}
            size={90}
            maxWidth={900}
          />
        </div>
      </AbsoluteFill>

      {/* ecosystem: monitors flanking, headphones center */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -160 }}>
        <div style={{ position: "relative", width: 980, height: 640 }}>
          <div style={{ position: "absolute", left: -70, top: 120, opacity: 0.96 }}>
            <Cutout src={IMG.ecoMonitorA} height={420} delay={12} floatAmp={7} enterScale={0.85} />
          </div>
          <div style={{ position: "absolute", right: -70, top: 120, opacity: 0.96 }}>
            <Cutout src={IMG.ecoMonitorB} height={420} delay={16} floatAmp={7} enterScale={0.85} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: 60, transform: "translateX(-50%)" }}>
            <Cutout src={IMG.ecoHeadphonesA} height={470} delay={20} floatAmp={9} />
          </div>
        </div>
      </AbsoluteFill>

      {/* DAW / AI workflow strip */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 250, width: 936 }}>
          <FloatIn delay={30} y={22}>
            <div
              style={{
                borderRadius: RADII.card,
                border: `1px solid ${COLORS.line}`,
                background: hexA(COLORS.inkSoft, 0.7),
                backdropFilter: "blur(8px)",
                padding: "22px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ ...labelStyle(20, 700, "0.2em"), color: COLORS.champagneSoft }}>Session · TLM 107</span>
                <span style={{ ...labelStyle(18, 600, "0.16em"), color: COLORS.steel }}>DAW · AI-assisted workflow</span>
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <WaveLine width={620} height={90} amp={0.8} color={COLORS.champagne} strokeWidth={3} />
                <WaveBars width={280} height={90} count={22} color={COLORS.steel} />
              </div>
            </div>
          </FloatIn>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {["Studio Monitors", "Headphones", "AI Tools"].map((c, i) => (
              <FloatIn key={c} delay={40 + i * 4} y={12}><Chip tone="dark" size={24}>{c}</Chip></FloatIn>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <BrandPlate mode="logo" pos="bottomCenter" appearAt={50} logoWidth={280} />
    </Scene>
  );
};
