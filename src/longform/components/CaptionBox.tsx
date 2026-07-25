import React from "react";
import { useCurrentFrame } from "remotion";
import { CAPTION_BOX, CAPTION_GLOW } from "../theme";
import { hexA } from "../../components/Backgrounds";

/**
 * Persistent, empty caption placeholder — 1704x108px, rounded, centered,
 * anchored near the bottom. The interior stays completely blank (captions
 * are added manually later); only a soft neon glow outline marks it as a
 * deliberate design element. A gentle breathing pulse keeps it feeling
 * alive rather than static, without ever drawing focus from narration.
 */
export const CaptionBox: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(frame / 55));
  return (
    <div
      style={{
        position: "absolute",
        left: CAPTION_BOX.left,
        top: CAPTION_BOX.top,
        width: CAPTION_BOX.width,
        height: CAPTION_BOX.height,
        borderRadius: CAPTION_BOX.radius,
        pointerEvents: "none",
        border: `1.5px solid ${hexA(CAPTION_GLOW.core, 0.4 + 0.25 * pulse)}`,
        boxShadow: [
          `0 0 ${14 + 10 * pulse}px ${hexA(CAPTION_GLOW.core, 0.28 * pulse)}`,
          `0 0 ${32 + 18 * pulse}px ${hexA(CAPTION_GLOW.soft, 0.16 * pulse)}`,
          `inset 0 0 18px ${hexA(CAPTION_GLOW.core, 0.06)}`,
        ].join(", "),
        background: hexA("#0A0B0D", 0.16),
      }}
    />
  );
};
