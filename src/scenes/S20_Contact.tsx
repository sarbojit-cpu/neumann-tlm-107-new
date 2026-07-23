import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneProps } from "./types";
import { Scene } from "../components/Scene";
import { DarkBase, Particles, Vignette, hexA } from "../components/Backgrounds";
import { COLORS, SPACE, BRAND, RADII, PRODUCT } from "../theme";
import { FloatIn, Eyebrow } from "../components/Ui";
import { displayStyle, labelStyle, bodyStyle } from "../fonts";
import { LogoPlate } from "../components/LogoPlate";
import { Globe, Instagram, Facebook, Linkedin, Youtube, Whatsapp, Chat, Pin } from "../components/icons";
import { GlowOrb } from "../components/Bits";

type Row = { icon: React.FC<{ size?: number; color?: string }>; label: string; value: string };

const ContactRow: React.FC<{ row: Row; delay: number; width: number }> = ({ row, delay, width }) => {
  const Icon = row.icon;
  return (
    <FloatIn delay={delay} x={-18} y={0}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, width }}>
        <div style={{ width: 62, height: 62, borderRadius: 15, background: hexA(COLORS.ivory, 0.08), border: `1px solid ${COLORS.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={30} color={COLORS.champagneSoft} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 }}>
          <span style={{ ...labelStyle(16, 700, "0.2em"), color: COLORS.champagneSoft }}>{row.label}</span>
          <span style={{ ...bodyStyle(24, 600), color: COLORS.ivory, lineHeight: 1.2, wordBreak: "break-word", overflowWrap: "anywhere" }}>{row.value}</span>
        </div>
      </div>
    </FloatIn>
  );
};

/** Full contact & social block + community / follow CTA. */
export const S20_Contact: React.FC<SceneProps> = ({ enter, sweep }) => {
  const left: Row[] = [
    { icon: Globe, label: "Website", value: BRAND.website },
    { icon: Instagram, label: "Instagram", value: BRAND.instagram },
    { icon: Facebook, label: "Facebook", value: BRAND.facebook },
    { icon: Linkedin, label: "LinkedIn", value: BRAND.linkedin },
  ];
  const right: Row[] = [
    { icon: Youtube, label: "YouTube", value: BRAND.youtube },
    { icon: Whatsapp, label: "WhatsApp", value: BRAND.whatsapp.join("  ·  ") },
    { icon: Chat, label: "WhatsApp Community", value: BRAND.community },
  ];
  return (
    <Scene
      enter={enter}
      sweep={sweep}
      bg={
        <AbsoluteFill>
          <DarkBase glow={COLORS.champagne} glowX={50} glowY={28} />
          <GlowOrb x={540} y={520} size={720} color={COLORS.champagne} opacity={0.12} seed={2} />
          <GlowOrb x={200} y={1300} size={560} color={COLORS.steel} opacity={0.1} seed={5} />
          <Particles seed={53} count={24} opacity={0.16} />
          <Vignette strength={0.55} />
        </AbsoluteFill>
      }
    >
      <AbsoluteFill style={{ padding: `${SPACE.marginTop}px ${SPACE.marginX}px` }}>
        {/* header */}
        <div style={{ position: "absolute", top: 120, left: SPACE.marginX }}>
          <Eyebrow delay={4} accent={COLORS.amber}>Reach out</Eyebrow>
          <FloatIn delay={10} y={28}>
            <div style={{ ...displayStyle(120, 700), color: COLORS.ivory, marginTop: 14 }}>
              Let's <span style={{ fontStyle: "italic", color: COLORS.champagneSoft }}>talk.</span>
            </div>
          </FloatIn>
        </div>
        <div style={{ position: "absolute", top: 150, right: SPACE.marginX }}>
          <FloatIn delay={6} y={14}><LogoPlate which="shivansh" width={320} /></FloatIn>
        </div>

        {/* grid */}
        <div style={{ position: "absolute", top: 500, left: SPACE.marginX, display: "flex", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {left.map((r, i) => <ContactRow key={r.label} row={r} delay={22 + i * 5} width={430} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {right.map((r, i) => <ContactRow key={r.label} row={r} delay={28 + i * 5} width={430} />)}
          </div>
        </div>

        {/* address full width */}
        <div style={{ position: "absolute", top: 1200, left: SPACE.marginX }}>
          <ContactRow row={{ icon: Pin, label: "Visit us", value: BRAND.address }} delay={48} width={936} />
        </div>

        {/* community CTA */}
        <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <FloatIn delay={54} y={20}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "26px 44px",
                borderRadius: RADII.chip,
                background: COLORS.red,
                boxShadow: `0 20px 50px ${hexA(COLORS.red, 0.4)}`,
              }}
            >
              <Chat size={34} color="#fff" />
              <span style={{ ...labelStyle(30, 700, "0.12em"), color: "#fff" }}>Follow us · Join the WhatsApp Community</span>
            </div>
          </FloatIn>
        </div>

        {/* recap line */}
        <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <FloatIn delay={60} y={12}>
            <span style={{ ...labelStyle(24, 600, "0.14em"), color: COLORS.champagneSoft }}>
              Neumann TLM 107 Studio Set · {PRODUCT.price} incl. GST
            </span>
          </FloatIn>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
