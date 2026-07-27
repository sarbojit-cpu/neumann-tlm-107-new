// Renders all 6 language-variant thumbnails (3 reel portrait + 3 long-form
// landscape) to out/ with their final delivery filenames.
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const outDir = path.join(root, "out");
fs.mkdirSync(outDir, { recursive: true });

const JOBS = [
  { id: "ThumbnailReel-English", file: "thumbnail-neumann-reel-english.png" },
  { id: "ThumbnailReel-Hindi", file: "thumbnail-neumann-reel-hindi.png" },
  { id: "ThumbnailReel-Bengali", file: "thumbnail-neumann-reel-bengali.png" },
  { id: "ThumbnailLongform-English", file: "thumbnail-neumann-longform-english.png" },
  { id: "ThumbnailLongform-Hindi", file: "thumbnail-neumann-longform-hindi.png" },
  { id: "ThumbnailLongform-Bengali", file: "thumbnail-neumann-longform-bengali.png" },
];

const run = async () => {
  console.log("Bundling…");
  const serveUrl = await bundle({ entryPoint: path.join(root, "src", "index.ts"), onProgress: () => {} });
  const common = { serveUrl, browserExecutable: BROWSER, chromiumOptions: { gl: "swangle" }, imageFormat: "png" };

  for (const job of JOBS) {
    const comp = await selectComposition({ ...common, id: job.id });
    await renderStill({ ...common, composition: comp, frame: 0, output: path.join(outDir, job.file) });
    console.log(`✓ out/${job.file}`);
  }
  console.log("Done.");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
