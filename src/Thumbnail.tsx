import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { IMG } from "./assets";
import { COLORS, SPACE, PRODUCT, RADII } from "./theme";
import { displayStyle, labelStyle } from "./fonts";
import { DarkBase, Particles, Vignette, hexA, ChevronField } from "./components/Backgrounds";
import { LogoPlate } from "./components/LogoPlate";
import { GlowOrb, CornerTicks, Watermark } from "./components/Bits";
import { Tag } from "./components/Ui";

/** Standalone premium 9:16 thumbnail — fully static (looks complete at any frame). */
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.inkDeep }}>
      <DarkBase glow={COLORS.champagne} glowX={50} glowY={48} />
      <AbsoluteFill style={{ opacity: 0.22 }}>
        <Img src={IMG.macroGrilleDark} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.3)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: hexA(COLORS.ink, 0.32) }} />
      <GlowOrb x={330} y={860} size={820} color={COLORS.champagne} opacity={0.22} seed={4} />
      <Watermark top={700} size={640} color={hexA(COLORS.ivory, 0.04)}>107</Watermark>
      <ChevronField opacity={0.05} />
      <Particles seed={9} count={40} opacity={0.4} />

      {/* mic cutout */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <Img
          src={IMG.mountNickelA}
          style={{ position: "absolute", top: 600, height: 820, width: "auto", filter: "drop-shadow(0 50px 70px rgba(0,0,0,0.6))" }}
        />
      </AbsoluteFill>

      {/* Neumann plate top */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 118 }}>
          <LogoPlate which="neumann" width={470} />
        </div>
      </AbsoluteFill>

      {/* Title */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ position: "absolute", top: 312, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ ...labelStyle(30, 700, "0.5em"), color: COLORS.amber, paddingLeft: "0.5em" }}>Neumann</div>
          <div style={{ ...displayStyle(200, 700), color: COLORS.ivory }}>
            TLM <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>107</span>
          </div>
          <div style={{ marginTop: 6 }}><Tag bg={COLORS.red}>Studio Set</Tag></div>
        </div>
      </AbsoluteFill>

      {/* price + CTA bottom */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ marginBottom: 366, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              padding: "22px 44px",
              borderRadius: RADII.card,
              background: hexA(COLORS.inkDeep, 0.7),
              border: `1px solid ${hexA(COLORS.champagne, 0.45)}`,
              backdropFilter: "blur(6px)",
            }}
          >
            <span style={{ ...displayStyle(104, 700), color: COLORS.ivory }}>{PRODUCT.price}</span>
            <span style={{ ...labelStyle(24, 600, "0.12em"), color: COLORS.ivoryDim }}>{PRODUCT.priceNote}</span>
          </div>
          <div
            style={{
              padding: "20px 40px",
              borderRadius: RADII.chip,
              background: COLORS.red,
              ...labelStyle(30, 700, "0.14em"),
              color: "#fff",
              boxShadow: `0 20px 50px ${hexA(COLORS.red, 0.5)}`,
            }}
          >
            DM / Call for best price
          </div>
        </div>
      </AbsoluteFill>

      {/* Shivansh plate bottom */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <div style={{ position: "absolute", bottom: 96 }}>
          <LogoPlate which="shivansh" width={500} />
        </div>
      </AbsoluteFill>

      <CornerTicks inset={40} size={54} color={hexA(COLORS.champagne, 0.6)} />
      <Vignette strength={0.62} />
    </AbsoluteFill>
  );
};
