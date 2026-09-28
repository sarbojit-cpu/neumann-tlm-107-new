// Render a list of frames as stills (bundle once) for review.
//   node scripts/stills.mjs <Composition> <outDir> <scale> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [comp, outDir, scale, ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => c });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable, inputProps: {} });
for (const fr of frames) {
  const out = path.join(outDir, `${comp}_${String(fr).padStart(5, "0")}.jpg`);
  const t = Date.now();
  await renderStill({ composition, serveUrl, output: out, frame: Number(fr), scale: Number(scale), imageFormat: "jpeg", jpegQuality: 88, browserExecutable, chromiumOptions: { gl: "swiftshader" }, overwrite: true });
  console.log(out, Date.now() - t, "ms");
}
