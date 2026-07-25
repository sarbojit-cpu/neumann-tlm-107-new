import React from "react";
import { COLORS, RADII, BRAND } from "../theme";
import { LABEL, labelStyle } from "../../fonts";
import { FloatIn } from "../../components/Ui";
import { LogoPlate } from "../../components/LogoPlate";
import { hexA } from "../../components/Backgrounds";
import {
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Whatsapp,
  Pin,
  Chat,
  Threads,
  TwitterX,
} from "../../components/icons";
import { LF_SPACE } from "../theme";

export type LFBrandMode =
  | "logo"
  | "website"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "threads"
  | "twitter"
  | "youtube"
  | "whatsapp"
  | "community"
  | "address";

const CONTENT: Record<
  Exclude<LFBrandMode, "logo">,
  { icon: React.FC<{ size?: number; color?: string }>; label: string; value: string }
> = {
  website: { icon: Globe, label: "Website", value: BRAND.website },
  instagram: { icon: Instagram, label: "Instagram", value: BRAND.instagram },
  facebook: { icon: Facebook, label: "Facebook", value: BRAND.facebook },
  linkedin: { icon: Linkedin, label: "LinkedIn", value: BRAND.linkedin },
  threads: { icon: Threads, label: "Threads", value: BRAND.threads },
  twitter: { icon: TwitterX, label: "Twitter / X", value: BRAND.twitter },
  youtube: { icon: Youtube, label: "YouTube", value: BRAND.youtube },
  whatsapp: { icon: Whatsapp, label: "WhatsApp", value: BRAND.whatsapp.join("  ·  ") },
  community: { icon: Chat, label: "WhatsApp Community", value: BRAND.community },
  address: { icon: Pin, label: "Visit us", value: BRAND.address },
};

/**
 * Small persistent top-right badge — the long-form's rotating Shivansh
 * presence. Kept compact and out of the way of hero content, and always
 * safely above the caption reserved band (it lives at the top, nowhere
 * near y=910+).
 */
export const LFBrandCorner: React.FC<{ mode: LFBrandMode; appearAt?: number }> = ({
  mode,
  appearAt = 12,
}) => {
  return (
    <div style={{ position: "absolute", top: LF_SPACE.marginTop, right: LF_SPACE.marginX }}>
      <FloatIn delay={appearAt} y={-14} x={14}>
        {mode === "logo" ? (
          <LogoPlate which="shivansh" width={220} padX={22} padY={16} />
        ) : (
          <CornerCard mode={mode} />
        )}
      </FloatIn>
    </div>
  );
};

const CornerCard: React.FC<{ mode: Exclude<LFBrandMode, "logo"> }> = ({ mode }) => {
  const c = CONTENT[mode];
  const Icon = c.icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        maxWidth: mode === "address" ? 560 : 460,
        padding: "14px 22px",
        borderRadius: RADII.plate,
        background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.paperEdge} 100%)`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: COLORS.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={21} color={COLORS.paper} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ ...labelStyle(13, 700, "0.18em"), color: COLORS.red }}>{c.label}</span>
        <span
          style={{
            fontFamily: LABEL,
            fontWeight: 600,
            fontSize: mode === "address" ? 15 : 17,
            color: COLORS.ink,
            whiteSpace: mode === "address" ? "normal" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: mode === "address" ? 1.25 : undefined,
            maxWidth: mode === "address" ? 470 : 380,
          }}
        >
          {c.value}
        </span>
      </div>
    </div>
  );
};

/**
 * Fuller contact row used only in dedicated contact/outro beats, where more
 * vertical room is deliberately given to the brand block. Still respects the
 * safe-bottom boundary — callers position this well above y=910.
 */
export const LFBrandRow: React.FC<{
  mode: Exclude<LFBrandMode, "logo">;
  delay?: number;
  wide?: boolean;
  width?: number;
}> = ({ mode, delay = 0, wide = false, width }) => {
  const c = CONTENT[mode];
  const Icon = c.icon;
  const rowWidth = width ?? (wide ? 720 : 400);
  return (
    <FloatIn delay={delay} x={-16}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, width: rowWidth }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: hexA(COLORS.ivory, 0.08),
            border: `1px solid ${COLORS.lineStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={26} color={COLORS.champagneSoft} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <span style={{ ...labelStyle(14, 700, "0.18em"), color: COLORS.champagneSoft }}>{c.label}</span>
          <span
            style={{
              fontFamily: LABEL,
              fontWeight: 600,
              fontSize: wide ? 22 : 19,
              color: COLORS.ivory,
              lineHeight: 1.25,
              whiteSpace: "normal",
              overflowWrap: "anywhere",
            }}
          >
            {c.value}
          </span>
        </div>
      </div>
    </FloatIn>
  );
};
