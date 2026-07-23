// Renders QA still frames from the MainReel (and the Thumbnail) so we can
// eyeball layout / overlap at true 1080x1920 without a full video render.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const qaDir = path.join(root, "qa");
const outDir = path.join(root, "out");
fs.mkdirSync(qaDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

// scene → representative frame (mid-scene)
const FRAMES = {
  s01: 150, s02: 380, s03: 620, s04: 900, s05: 1150, s06: 1360,
  s07: 1640, s08: 1880, s09: 2120, s10: 2360, s11: 2560, s12: 2820,
  s13: 3080, s14: 3360, s15: 3620, s16: 3820, s17: 4080, s18: 4380,
  s19: 4640, s20: 4980, s21: 5240,
};

// allow: node qa-stills.mjs s02 s07 s20   (subset)  OR  all
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

  // Thumbnail (unless a subset that excludes it)
  if (!args.length || args[0] === "all" || args.includes("thumb")) {
    const thumb = await selectComposition({ ...common, id: "Thumbnail" });
    await renderStill({ ...common, composition: thumb, frame: 0, output: path.join(outDir, "thumbnail.png") });
    console.log("✓ out/thumbnail.png");
  }

  if (which.some((w) => w.startsWith("s"))) {
    const comp = await selectComposition({ ...common, id: "MainReel" });
    for (const key of which) {
      if (!(key in FRAMES)) continue;
      const frame = FRAMES[key];
      await renderStill({ ...common, composition: comp, frame, output: path.join(qaDir, `${key}.png`) });
      console.log(`✓ qa/${key}.png (frame ${frame})`);
    }
  }
  console.log("Done.");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
