import { continueRender, delayRender, staticFile } from "remotion";

// Self-hosted (Fontsource builds of the Google Fonts originals, OFL):
//   Anybody            variable — wdth 50-150, wght 100-900: the pressure face
//   Instrument Serif   italic   — the emphasis word
//   JetBrains Mono     variable — slates, readouts, measurement labels
const FACES: [string, string, FontFaceDescriptors][] = [
  ["Anybody", "fonts/anybody.woff2", { weight: "100 900", stretch: "50% 150%", style: "normal" }],
  ["Instrument Serif", "fonts/instrument-serif-italic.woff2", { weight: "400", style: "italic" }],
  ["Instrument Serif", "fonts/instrument-serif.woff2", { weight: "400", style: "normal" }],
  ["JetBrains Mono", "fonts/jetbrains-mono.woff2", { weight: "100 800", style: "normal" }],
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const h = delayRender("fonts");
  Promise.all(
    FACES.map(([family, file, desc]) => {
      const f = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, desc);
      return f.load().then((loaded) => {
        (document.fonts as unknown as { add: (x: FontFace) => void }).add(loaded);
      });
    }),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};
