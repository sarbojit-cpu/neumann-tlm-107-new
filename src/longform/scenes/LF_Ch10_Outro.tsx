import React from "react";
import { AbsoluteFill } from "remotion";
import { LFBeatProps } from "./types";
import { LFShell } from "../components/LFShell";
import { DarkBase, Particles, Vignette } from "../../components/Backgrounds";
import { KenBurns } from "../../components/KenBurns";
import { IMG } from "../../assets";
import { COLORS, LF_SPACE, PRODUCT, RADII } from "../theme";
import { FloatIn, Eyebrow } from "../../components/Ui";
import { displayStyle, labelStyle } from "../../fonts";
import { LogoPlate } from "../../components/LogoPlate";
import { LFBrandRow } from "../components/LFBrand";
import { Cutout } from "../../components/Product";
import { GlowOrb } from "../../components/Bits";
import { hexA } from "../../components/Backgrounds";
import {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Threads,
  TwitterX,
  Youtube,
  Chat,
  Pin,
} from "../../components/icons";

/** Beat 33 — Brand recap & full contact/social block. */
export const LF33_ContactBlock: React.FC<LFBeatProps> = ({ enter, sweep }) => {
  const col1: ("website" | "instagram" | "facebook")[] = ["website", "instagram", "facebook"];
  const col2: ("linkedin" | "threads" | "twitter")[] = ["linkedin", "threads", "twitter"];
  const col3: ("youtube" | "whatsapp" | "community")[] = ["youtube", "whatsapp", "community"];
  return (
    <LFShell
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <KenBurns src={IMG.macroGrilleDark} from={1.15} to={1.3} panY={-16} duration={280} style={{ opacity: 0.2 }} />
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={26} />
          <Particles seed={101} count={22} opacity={0.18} />
          <Vignette strength={0.52} />
        </AbsoluteFill>
      }
    >
      {/* header: dual logo */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: LF_SPACE.marginTop, display: "flex", alignItems: "center", gap: 34 }}>
          <FloatIn delay={4} y={14}>
            <LogoPlate which="neumann" width={260} />
          </FloatIn>
          <FloatIn delay={10} y={8}>
            <div style={{ ...displayStyle(30, 500), color: COLORS.champagneSoft, fontStyle: "italic" }}>at</div>
          </FloatIn>
          <FloatIn delay={14} y={14}>
            <LogoPlate which="shivansh" width={290} />
          </FloatIn>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 234 }}>
          <Eyebrow delay={22} accent={COLORS.amber}>Follow along · reach out anytime</Eyebrow>
        </div>
      </AbsoluteFill>

      {/* 3-column contact grid — every value wraps rather than truncates,
          so the "full" contact block genuinely shows everything in full. */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 320, display: "flex", gap: 70 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {col1.map((m, i) => (
              <LFBrandRow key={m} mode={m} delay={30 + i * 5} width={480} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {col2.map((m, i) => (
              <LFBrandRow key={m} mode={m} delay={34 + i * 5} width={480} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            {col3.map((m, i) => (
              <LFBrandRow
                key={m}
                mode={m}
                delay={38 + i * 5}
                wide={m === "whatsapp" || m === "community"}
                width={m === "youtube" ? 480 : 560}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      {/* address row */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 760 }}>
          <LFBrandRow mode="address" delay={58} wide />
        </div>
      </AbsoluteFill>
    </LFShell>
  );
};

const socialRow = [Facebook, Instagram, Youtube, Linkedin, Threads, TwitterX, Chat, Globe, Pin];

const IconBadge: React.FC<{ Icon: React.FC<{ size?: number; color?: string }> }> = ({ Icon }) => (
  <div
    style={{
      width: 36,
      height: 36,
      borderRadius: 10,
      background: hexA(COLORS.ivory, 0.08),
      border: `1px solid ${COLORS.lineStrong}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Icon size={18} color={COLORS.champagneSoft} />
  </div>
);

/** Beat 34 — Final CTA & community invitation. */
export const LF34_FinalCTA: React.FC<LFBeatProps> = ({ enter, sweep }) => (
  <LFShell
    enter={enter}
    sweep={sweep}
    sweepColor={COLORS.champagne}
    bg={
      <AbsoluteFill>
        <DarkBase glow={COLORS.champagne} glowX={64} glowY={44} />
        <GlowOrb x={1500} y={480} size={700} color={COLORS.champagne} opacity={0.18} seed={6} />
        <Particles seed={103} count={22} opacity={0.2} />
        <Vignette strength={0.55} />
      </AbsoluteFill>
    }
  >
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ marginRight: -180, opacity: 0.42 }}>
        <Cutout src={IMG.mountBlackB} height={700} delay={6} floatAmp={9} shadow={false} />
      </div>
    </AbsoluteFill>

    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: LF_SPACE.marginTop,
        paddingBottom: LF_SPACE.bottomPad,
      }}
    >
      <div style={{ marginLeft: LF_SPACE.marginX, display: "flex", flexDirection: "column", gap: 22, maxWidth: 760 }}>
        <FloatIn delay={6} y={14}>
          <span style={{ ...labelStyle(24, 700, "0.3em"), color: COLORS.amber }}>Ready when you are</span>
        </FloatIn>
        <FloatIn delay={12} y={30}>
          <div style={{ ...displayStyle(76, 700), color: COLORS.ivory }}>
            Record the <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>whole truth.</span>
          </div>
        </FloatIn>
        <FloatIn delay={22} y={16}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ ...displayStyle(44, 600), color: COLORS.ivoryDim }}>{PRODUCT.price}</span>
            <span style={{ ...labelStyle(18, 600, "0.1em"), color: COLORS.steel }}>{PRODUCT.priceNote}</span>
          </div>
        </FloatIn>
        <FloatIn delay={28} y={16}>
          <div
            style={{
              padding: "18px 36px",
              borderRadius: RADII.chip,
              background: COLORS.red,
              ...labelStyle(24, 700, "0.12em"),
              color: "#fff",
              boxShadow: `0 18px 44px ${hexA(COLORS.red, 0.45)}`,
              display: "inline-block",
              marginTop: 4,
            }}
          >
            {PRODUCT.cta}
          </div>
        </FloatIn>
        <FloatIn delay={36} y={12}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            <span style={{ ...labelStyle(18, 600, "0.12em"), color: COLORS.ivoryDim }}>
              Join the WhatsApp Community · Follow us everywhere
            </span>
            <div style={{ display: "flex", gap: 14 }}>
              {socialRow.map((Icon, i) => (
                <IconBadge key={i} Icon={Icon} />
              ))}
            </div>
          </div>
        </FloatIn>
      </div>
    </AbsoluteFill>
  </LFShell>
);
