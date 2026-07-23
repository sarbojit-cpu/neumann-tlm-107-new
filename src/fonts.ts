import { staticFile } from "remotion";

// Self-hosted variable fonts (no network at render → deterministic & portable).
//  - Fraunces → characterful high-contrast editorial serif (display headlines)
//  - Archivo  → clean technical grotesque (labels, specs, contact, numerals)
export const DISPLAY = "Fraunces";
export const LABEL = "Archivo";

/** @font-face CSS injected once at the root of every composition. */
export const FONT_FACE_CSS = `
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-normal.woff2")}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-italic.woff2")}') format('woff2');
  font-weight: 100 900;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-normal.woff2")}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-italic.woff2")}') format('woff2');
  font-weight: 100 900;
  font-style: italic;
  font-display: block;
}
`;

/** Resolves once all required weights/styles are loaded in the document. */
export async function loadFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const probes = [
    "400 32px Fraunces",
    "600 32px Fraunces",
    "700 32px Fraunces",
    "900 32px Fraunces",
    "italic 600 32px Fraunces",
    "400 32px Archivo",
    "600 32px Archivo",
    "700 32px Archivo",
    "800 32px Archivo",
  ];
  await Promise.all(probes.map((p) => (document as Document).fonts.load(p)));
  await (document as Document).fonts.ready;
}

// Convenience style presets ---------------------------------------------------
export const displayStyle = (size: number, weight = 600): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: "-0.02em",
});

export const labelStyle = (
  size: number,
  weight = 600,
  tracking = "0.22em"
): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: tracking,
  textTransform: "uppercase",
});

export const bodyStyle = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: "0.01em",
  lineHeight: 1.25,
});
