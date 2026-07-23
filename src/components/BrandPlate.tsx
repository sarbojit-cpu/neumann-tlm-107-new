import React from "react";
import { COLORS, RADII, BRAND, SPACE } from "../theme";
import { LABEL, labelStyle } from "../fonts";
import { FloatIn } from "./Ui";
import { LogoPlate } from "./LogoPlate";
import {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Whatsapp,
  Pin,
  Chat,
} from "./icons";

export type BrandMode =
  | "logo"
  | "website"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "whatsapp"
  | "community"
  | "address";

type Pos = "bottomCenter" | "bottomLeft" | "topRight" | "topLeft";

const CONTENT: Record<
  Exclude<BrandMode, "logo">,
  { icon: React.FC<{ size?: number; color?: string }>; label: string; value: string }
> = {
  website: { icon: Globe, label: "Website", value: BRAND.website },
  instagram: { icon: Instagram, label: "Instagram", value: BRAND.instagram },
  facebook: { icon: Facebook, label: "Facebook", value: BRAND.facebook },
  linkedin: { icon: Linkedin, label: "LinkedIn", value: BRAND.linkedin },
  youtube: { icon: Youtube, label: "YouTube", value: BRAND.youtube },
  whatsapp: { icon: Whatsapp, label: "WhatsApp", value: BRAND.whatsapp.join("  ·  ") },
  community: { icon: Chat, label: "WhatsApp Community", value: BRAND.community },
  address: { icon: Pin, label: "Visit us", value: BRAND.address },
};

const posStyle: Record<Pos, React.CSSProperties> = {
  bottomCenter: {
    left: 0,
    right: 0,
    bottom: SPACE.marginBottom - 40,
    justifyContent: "center",
  },
  bottomLeft: { left: SPACE.marginX, bottom: SPACE.marginBottom - 40, justifyContent: "flex-start" },
  topRight: { right: SPACE.marginX, top: SPACE.marginTop, justifyContent: "flex-end" },
  topLeft: { left: SPACE.marginX, top: SPACE.marginTop, justifyContent: "flex-start" },
};

/**
 * The persistent, rotating Shivansh Electronics presence. Each scene mounts one
 * with a `mode` — logo or a contact detail — so brand awareness builds
 * continuously without the same element repeating back-to-back.
 */
export const BrandPlate: React.FC<{
  mode: BrandMode;
  pos?: Pos;
  appearAt?: number;
  exitAt?: number;
  logoWidth?: number;
}> = ({ mode, pos = "bottomCenter", appearAt = 10, exitAt, logoWidth = 300 }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        ...posStyle[pos],
      }}
    >
      <FloatIn delay={appearAt} y={20} dur={16} exitAt={exitAt} exitDur={12}>
        {mode === "logo" ? (
          <LogoPlate which="shivansh" width={logoWidth} padX={30} padY={22} />
        ) : (
          <DetailCard mode={mode} />
        )}
      </FloatIn>
    </div>
  );
};

const DetailCard: React.FC<{ mode: Exclude<BrandMode, "logo"> }> = ({ mode }) => {
  const c = CONTENT[mode];
  const Icon = c.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        maxWidth: 940,
        padding: "22px 34px",
        borderRadius: RADII.plate,
        background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.paperEdge} 100%)`,
        boxShadow: "0 22px 54px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 16,
          background: COLORS.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={32} color={COLORS.paper} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
        <span
          style={{
            ...labelStyle(19, 700, "0.24em"),
            color: COLORS.red,
          }}
        >
          {BRAND.name} · {c.label}
        </span>
        <span
          style={{
            fontFamily: LABEL,
            fontWeight: 600,
            fontSize: mode === "address" ? 24 : mode === "whatsapp" ? 25 : 30,
            letterSpacing: "0.01em",
            color: COLORS.ink,
            whiteSpace: mode === "address" ? "normal" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: mode === "address" ? 1.28 : 1.15,
            maxWidth: mode === "address" ? 620 : undefined,
          }}
        >
          {c.value}
        </span>
      </div>
    </div>
  );
};
