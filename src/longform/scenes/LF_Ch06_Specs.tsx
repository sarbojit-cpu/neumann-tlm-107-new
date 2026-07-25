import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette, hexA } from "../../components/Backgrounds";
import { KenBurns } from "../../components/KenBurns";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE } from "../theme";
import { LFBrandCorner } from "../components/LFBrand";
import { Cutout, FramedImage } from "../../components/Product";
import { SceneHeading } from "../../components/Heading";
import { FloatIn, CountUp } from "../../components/Ui";
import { SpecTile } from "../../components/Bits";
import { WaveBars, FreqCurve } from "../../components/Waveform";
import { displayStyle, labelStyle } from "../../fonts";
import { EASE, ramp } from "../../lib/anim";

/** Beat 18 — Self-noise. */
export const LF18_SelfNoise: React.FC<LFBeatProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const quiet = interpolate(frame, [30, 150], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
  return (
    <LFShell
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={70} glowY={44} />
          <Particles seed={53} count={18} opacity={0.16} />
          <Vignette strength={0.52} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop,
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div style={{ marginLeft: LF_SPACE.marginX, maxWidth: 700, display: "flex", flexDirection: "column", gap: 24 }}>
          <SceneHeading
            eyebrow="Silent by design"
            lines={["Whisper", { text: "quiet.", color: COLORS.champagneSoft, italic: true }]}
            size={72}
            delay={8}
            maxWidth={700}
          />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            <FloatIn delay={22} y={26}>
              <CountUp to={10} dur={32} style={{ ...displayStyle(160, 700), color: COLORS.ivory }} />
            </FloatIn>
            <FloatIn delay={30} y={14}>
              <div style={{ ...displayStyle(46, 600), color: COLORS.champagneSoft, marginBottom: 16 }}>dB-A</div>
            </FloatIn>
          </div>
          <FloatIn delay={36} y={12}>
            <span style={{ ...labelStyle(22, 700, "0.16em"), color: COLORS.ivoryDim }}>
              Self-noise · quieter than a silent room
            </span>
          </FloatIn>
          <FloatIn delay={40} y={16}>
            <WaveBars width={560} height={110} count={40} quiet={quiet} color={COLORS.champagne} />
          </FloatIn>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "flex-end",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop,
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div style={{ marginRight: LF_SPACE.marginX + 20 }}>
          <Cutout src={IMG.mountNickelB} height={640} delay={14} floatAmp={10} />
        </div>
      </AbsoluteFill>

      <LFBrandCorner mode="logo" appearAt={44} />
    </LFShell>
  );
};

/** Beat 19 — Max SPL & dynamic range. */
export const LF19_Headroom: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.red} glowX={30} glowY={44} />
        <Particles seed={57} count={18} opacity={0.16} />
        <Vignette strength={0.5} />
      </AbsoluteFill>
    }
  >
    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: LF_SPACE.marginTop,
        paddingBottom: LF_SPACE.bottomPad,
      }}
    >
      <div style={{ marginLeft: LF_SPACE.marginX }}>
        <FramedImage src={IMG.mountNickelDetail} width={560} height={680} delay={10} objectPosition="center" />
      </div>
    </AbsoluteFill>

    <AbsoluteFill
      style={{
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: LF_SPACE.marginTop,
        paddingBottom: LF_SPACE.bottomPad,
      }}
    >
      <div style={{ marginRight: LF_SPACE.marginX, display: "flex", flexDirection: "column", gap: 28, alignItems: "flex-end" }}>
        <SceneHeading
          eyebrow="Enormous headroom"
          lines={["Nothing it", { text: "can't handle.", color: COLORS.champagneSoft, italic: true }]}
          size={64}
          align="left"
          delay={14}
          maxWidth={620}
        />
        <div style={{ display: "flex", gap: 20 }}>
          <SpecTile value={<CountUp to={141} dur={30} delay={26} />} unit="dB" label="Max SPL" delay={26} width={280} />
          <SpecTile value={<CountUp to={131} dur={30} delay={32} />} unit="dB" label="Dynamic range" delay={32} width={280} />
        </div>
      </div>
    </AbsoluteFill>

    <LFBrandCorner mode="community" appearAt={40} />
  </LFShell>
);

/** Beat 20 — Frequency response character. */
export const LF20_Frequency: React.FC<LFBeatProps> = ({ enter, sweep }) => {
  const frame = useCurrentFrame();
  const prog = ramp(frame, 26, 90, EASE.inOut);
  return (
    <LFShell
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={46} />
          <KenBurns src={IMG.macroGrilleDark} from={1.2} to={1.36} panY={-20} duration={210} style={{ opacity: 0.22 }} />
          <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.4) }} />
          <Vignette strength={0.5} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: LF_SPACE.marginTop,
          paddingBottom: LF_SPACE.bottomPad,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: -30 }}>
          <SceneHeading
            eyebrow="Transformerless circuit"
            lines={["Flat. Honest.", { text: "True.", color: COLORS.champagneSoft, italic: true }]}
            size={68}
            align="center"
            support="A neutral response with a gentle presence lift above 8kHz — detailed, natural, and faithful to the source."
            delay={10}
            maxWidth={880}
          />
          <FloatIn delay={22} y={20}>
            <div style={{ position: "relative" }}>
              <FreqCurve width={880} height={230} progress={prog} color={COLORS.champagne} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ ...labelStyle(18, 600, "0.12em"), color: COLORS.steel }}>20 Hz</span>
                <span style={{ ...labelStyle(18, 600, "0.12em"), color: COLORS.steel }}>1 kHz</span>
                <span style={{ ...labelStyle(18, 600, "0.12em"), color: COLORS.steel }}>20 kHz</span>
              </div>
            </div>
          </FloatIn>
        </div>
      </AbsoluteFill>
      <LFBrandCorner mode="linkedin" appearAt={40} />
    </LFShell>
  );
};
