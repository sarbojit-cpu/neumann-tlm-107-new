// Renders QA still frames from the LongForm composition — one per beat by
// default — so we can eyeball layout / overlap / caption-band clearance at
// true 1920x1080 without a full video render.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const qaDir = path.join(root, "qa-longform");
fs.mkdirSync(qaDir, { recursive: true });

const FPS = 30;
const SECS = [
  15, 22, 20, 18, 25, 20, 20, 20, 20, 15, 16, 10, 14, 13, 13, 11, 18, 23, 21, 21, 17, 14, 15, 15, 14, 18, 18, 18, 16,
  14, 16, 25, 27, 18,
];

const starts = [];
let acc = 0;
for (const s of SECS) {
  starts.push(acc);
  acc += Math.round(s * FPS);
}

// mid-beat frame for each of the 34 beats
const FRAMES = {};
SECS.forEach((s, i) => {
  const dur = Math.round(s * FPS);
  FRAMES[`b${String(i + 1).padStart(2, "0")}`] = starts[i] + Math.floor(dur / 2);
});

const args = process.argv.slice(2);
const which = args.length && args[0] !== "all" ? args : Object.keys(FRAMES);

const run = async () => {
  console.log("Bundling…");
  const serveUrl = await bundle({
    entryPoint: path.join(root, "src", "index.ts"),
    onProgress: () => {},
  });

  const common = {
    serveUrl,
    browserExecutable: BROWSER,
    chromiumOptions: { gl: "swangle" },
    imageFormat: "png",
  };

  const comp = await selectComposition({ ...common, id: "LongForm" });
  for (const key of which) {
    if (!(key in FRAMES)) {
      console.warn(`skip unknown key ${key}`);
      continue;
    }
    const frame = FRAMES[key];
    await renderStill({ ...common, composition: comp, frame, output: path.join(qaDir, `${key}.png`) });
    console.log(`✓ qa-longform/${key}.png (frame ${frame})`);
  }
  console.log("Done.");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
