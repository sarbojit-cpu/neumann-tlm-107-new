import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { IMG } from "../assets";
import { COLORS, PRODUCT, RADII } from "./theme";
import { displayStyle, labelStyle } from "../fonts";
import { DarkBase, Particles, Vignette, hexA, ChevronField } from "../components/Backgrounds";
import { LogoPlate } from "../components/LogoPlate";
import { GlowOrb, CornerTicks, Watermark } from "../components/Bits";
import { Tag } from "../components/Ui";
import { LanguageBadge, ThumbLang } from "../components/LanguageBadge";

/**
 * Standalone premium 16:9-ish (1920x1080) landscape thumbnail for the
 * long-form deep dive. Product hero on the right, brand + price + CTA on the
 * left — the wide frame used deliberately, matching the video's own
 * left-text/right-image compositional language.
 */
export const ThumbnailLongform: React.FC<{ lang?: ThumbLang }> = ({ lang = "english" }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkDeep }}>
      <DarkBase glow={COLORS.champagne} glowX={62} glowY={48} />
      <AbsoluteFill style={{ opacity: 0.2 }}>
        <Img
          src={IMG.macroGrilleDark}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.25)" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.34) }} />
      <GlowOrb x={1500} y={520} size={900} color={COLORS.champagne} opacity={0.22} seed={4} />
      <Watermark top={330} size={520} color={hexA(COLORS.ivory, 0.035)} rotate={0}>
        107
      </Watermark>
      <ChevronField opacity={0.045} />
      <Particles seed={9} count={40} opacity={0.35} />

      {/* mic hero, right side */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center" }}>
        <Img
          src={IMG.mountNickelA}
          style={{
            marginRight: -40,
            height: 920,
            width: "auto",
            filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.6))",
          }}
        />
      </AbsoluteFill>

      {/* language badge — consistent top-right placement, only the label differs */}
      <div style={{ position: "absolute", top: 64, right: 64 }}>
        <LanguageBadge lang={lang} scale={1.15} />
      </div>

      {/* Neumann plate top-left */}
      <div style={{ position: "absolute", top: 64, left: 64 }}>
        <LogoPlate which="neumann" width={340} />
      </div>

      {/* Title + price + CTA, left column */}
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ marginLeft: 64, display: "flex", flexDirection: "column", gap: 22, maxWidth: 820 }}>
          <div style={{ ...labelStyle(24, 700, "0.45em"), color: COLORS.amber, paddingLeft: "0.45em" }}>
            Neumann · Full Deep Dive
          </div>
          <div style={{ ...displayStyle(148, 700), color: COLORS.ivory, lineHeight: 0.95 }}>
            TLM <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>107</span>
          </div>
          <div><Tag bg={COLORS.red}>Studio Set</Tag></div>

          <div
            style={{
              marginTop: 18,
              display: "inline-flex",
              alignItems: "baseline",
              gap: 16,
              padding: "22px 40px",
              borderRadius: RADII.card,
              background: hexA(COLORS.inkDeep, 0.7),
              border: `1px solid ${hexA(COLORS.champagne, 0.45)}`,
              backdropFilter: "blur(6px)",
              alignSelf: "flex-start",
            }}
          >
            <span style={{ ...displayStyle(78, 700), color: COLORS.ivory }}>{PRODUCT.price}</span>
            <span style={{ ...labelStyle(20, 600, "0.12em"), color: COLORS.ivoryDim }}>{PRODUCT.priceNote}</span>
          </div>

          <div
            style={{
              alignSelf: "flex-start",
              padding: "20px 40px",
              borderRadius: RADII.chip,
              background: COLORS.red,
              ...labelStyle(26, 700, "0.14em"),
              color: "#fff",
              boxShadow: `0 20px 50px ${hexA(COLORS.red, 0.5)}`,
            }}
          >
            DM / Call for best price
          </div>
        </div>
      </AbsoluteFill>

      {/* Shivansh plate bottom-left */}
      <div style={{ position: "absolute", bottom: 56, left: 64 }}>
        <LogoPlate which="shivansh" width={360} />
      </div>

      <CornerTicks inset={40} size={54} color={hexA(COLORS.champagne, 0.6)} />
      <Vignette strength={0.58} />
    </AbsoluteFill>
  );
};
