import React from "react";
import { COLORS } from "../theme";
import { DISPLAY, LABEL, displayStyle } from "../fonts";
import { Eyebrow, FloatIn, Rule } from "./Ui";

/** Consistent scene heading: eyebrow → display headline → optional support line. */
export const SceneHeading: React.FC<{
  eyebrow?: string;
  lines: (string | { text: string; color?: string; italic?: boolean })[];
  support?: string;
  size?: number;
  align?: "left" | "center";
  color?: string;
  accent?: string;
  delay?: number;
  maxWidth?: number;
}> = ({
  eyebrow,
  lines,
  support,
  size = 92,
  align = "left",
  color = COLORS.ivory,
  accent = COLORS.champagne,
  delay = 0,
  maxWidth = 940,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: align === "center" ? "center" : "flex-start", maxWidth }}>
      {eyebrow && <Eyebrow delay={delay} accent={COLORS.amber} color={color}>{eyebrow}</Eyebrow>}
      <div style={{ textAlign: align }}>
        {lines.map((l, i) => {
          const text = typeof l === "string" ? l : l.text;
          const c = typeof l === "string" ? color : l.color ?? color;
          const italic = typeof l === "string" ? false : l.italic;
          return (
            <FloatIn key={i} delay={delay + 6 + i * 5} y={30}>
              <div
                style={{
                  ...displayStyle(size, 600),
                  color: c,
                  fontStyle: italic ? "italic" : "normal",
                }}
              >
                {text}
              </div>
            </FloatIn>
          );
        })}
      </div>
      {support && (
        <FloatIn delay={delay + 6 + lines.length * 5 + 3} y={16}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: align === "center" ? "center" : "flex-start" }}>
            <Rule w={140} color={accent} />
            <div
              style={{
                fontFamily: LABEL,
                fontWeight: 500,
                fontSize: 30,
                lineHeight: 1.35,
                letterSpacing: "0.01em",
                color: COLORS.ivoryDim,
                maxWidth: 820,
                textAlign: align,
              }}
            >
              {support}
            </div>
          </div>
        </FloatIn>
      )}
    </div>
  );
};

export { DISPLAY };
