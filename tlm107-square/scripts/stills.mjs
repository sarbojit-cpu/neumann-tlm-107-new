// QA stills: node scripts/stills.mjs <comp> <outdir> <scale> <sec> [sec...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [comp, outDir, scale, ...secs] = process.argv.slice(2);
const chrome = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable: chrome });
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = path.join(outDir, `${comp}-${String(s).replace(".", "_")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, scale: Number(scale), imageFormat: "jpeg", jpegQuality: 85, browserExecutable: chrome, chromiumOptions: { gl: "angle" } });
  console.log(output);
}
