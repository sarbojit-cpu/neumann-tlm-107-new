import React from "react";
import { Img } from "remotion";
import { LOGO } from "../assets";
import { COLORS, RADII } from "../theme";

type Which = "neumann" | "shivansh";

// Native aspect ratios of the supplied transparent PNGs.
const AR: Record<Which, number> = {
  neumann: 2000 / 437, // 4.58
  shivansh: 1186 / 357, // 3.32
};

type Props = {
  which: Which;
  /** width of the LOGO ARTWORK in px (not the card). Kept large for legibility. */
  width: number;
  /** card | bare (bare only for already-light backgrounds) */
  variant?: "card" | "bare";
  padX?: number;
  padY?: number;
  style?: React.CSSProperties;
  opacity?: number;
};

/**
 * The Neumann & Shivansh logos are black artwork on transparent. To guarantee
 * contrast + legibility on any background, we seat them on a warm "paper" plate
 * by default. `width` is the artwork width — never let it fall below ~300px on
 * screen so a phone-feed viewer can read it.
 */
export const LogoPlate: React.FC<Props> = ({
  which,
  width,
  variant = "card",
  padX,
  padY,
  style,
  opacity = 1,
}) => {
  const h = width / AR[which];
  const px = padX ?? Math.round(width * 0.09);
  const py = padY ?? Math.round(h * 0.34);
  const art = (
    <Img
      src={LOGO[which]}
      style={{ width, height: h, display: "block", objectFit: "contain" }}
    />
  );
  if (variant === "bare") {
    return <div style={{ opacity, ...style }}>{art}</div>;
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${py}px ${px}px`,
        background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.paperEdge} 100%)`,
        borderRadius: RADII.plate,
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.06)",
        opacity,
        ...style,
      }}
    >
      {art}
    </div>
  );
};
