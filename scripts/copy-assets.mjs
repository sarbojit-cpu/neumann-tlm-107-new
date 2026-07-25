// Copies the source product images + logos from the repo root into
// public/ with clean, code-friendly names. Idempotent.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outImg = path.join(root, "public", "images");
const outLogo = path.join(root, "public", "logos");

fs.mkdirSync(outImg, { recursive: true });
fs.mkdirSync(outLogo, { recursive: true });

// original filename -> clean destination (relative to public/)
const map = {
  // --- Black heroes (isolated, white bg) ---
  "NEUMANN TLM 107 IMAGE-1.jpg": "images/hero-black-front.jpg",
  "61b723914db7e35bad5b1561489e7331.jpg": "images/hero-black-front-hi.jpg",
  "8299ad54bcf6fe9de88267d1cdd7ea28.jpg": "images/black-3q-xlr.jpg",
  // --- Nickel heroes ---
  "NEUMANN TLM 107 IMAGE-1 (2).jpg": "images/hero-nickel-front.jpg",
  "2d32ea0fb60e3f053fd48e5738d08be5.jpg": "images/nickel-front-sq.jpg",
  "7ae5839f3cd12c1c9c46f9edeb237174.jpg": "images/nickel-top-angle.jpg",
  "e66d46f7393c33cb08afc98a06fa358f.jpg": "images/nickel-on-stand.jpg",
  // --- In EA 4 shock mount (transparent PNG cutouts) ---
  "NEUMANN TLM 107 IMAGE-1 (1).png": "images/mount-black-a.png",
  "NEUMANN TLM 107 IMAGE-1 (31).png": "images/mount-black-b.png",
  "NEUMANN TLM 107 IMAGE-1 (21).png": "images/mount-nickel-a.png",
  "NEUMANN TLM 107 IMAGE-1 (33).png": "images/mount-nickel-b.png",
  "2518c9e88e2cc5eeb29585277472f010.jpg": "images/mount-nickel-detail.jpg",
  // --- Cinematic context / real world ---
  "9493dccf8113453552622360f6c04135.jpg": "images/ctx-purple-fabric.jpg",
  "8d0d8b89c4bd4eb0c14b4f763c1ea185.jpg": "images/ctx-console.jpg",
  "1e26fff23b3ee3cbf204a7abf6ca6f9b.jpg": "images/ctx-studio-pair.jpg",
  "3a0c40981d3f3bbb170bf0681da01f4a.jpg": "images/ctx-dark-branded.jpg",
  // --- Macro / craftsmanship ---
  "NEUMANN TLM 107 IMAGE-1 (14).jpg": "images/macro-grille-dark.jpg",
  "NEUMANN TLM 107 IMAGE-1 (23).jpg": "images/macro-badge-dark.jpg",
  "NEUMANN TLM 107 IMAGE-1 (22).jpg": "images/macro-badge-white.jpg",
  "341e0e7b583e3f30b11ed0d2e9acca9a.jpg": "images/macro-nickel-grille.jpg",
  "a3dd24a959546ae37f72d0c908a1cd09.jpg": "images/macro-nickel-xlr.jpg",
  // --- Controls & polar patterns ---
  "NEUMANN TLM 107 IMAGE-1 (19).jpg": "images/controls-black.jpg",
  "NEUMANN TLM 107 IMAGE-1 (10).jpg": "images/controls-nickel.jpg",
  "NEUMANN TLM 107 IMAGE-1 (24).jpg": "images/controls-black-angle.jpg",
  "NEUMANN TLM 107 IMAGE-1 (2).png": "images/polar-diagram.png",
  // --- Accessories / packaging ---
  "bdd213873e23660d8aac9d7f36b5430c.jpg": "images/box-open.jpg",
  "c83d63e9753ba6cef6686ee4bacd3f26.jpg": "images/box-closed.jpg",
  "00b283988aadf5be2c1cb31919d1b80c.jpg": "images/mount-black-alone.jpg",
  "ec666c0acbe1505260317821cea77c52.jpg": "images/mount-nickel-alone.jpg",
  "612422292819227d896edac5df6275ed.jpg": "images/mount-nickel-adapters.jpg",
  "8996d3000b18ffc8d358db19cc42e892.jpg": "images/windscreen.jpg",
  // --- Neumann studio ecosystem (brand family) ---
  "NEUMANN TLM 107 IMAGE-1 (29).png": "images/eco-headphones-a.png",
  "NEUMANN TLM 107 IMAGE-1 (37).png": "images/eco-headphones-b.png",
  "NEUMANN TLM 107 IMAGE-1 (35).png": "images/eco-monitor-a.png",
  "NEUMANN TLM 107 IMAGE-1 (36).png": "images/eco-monitor-b.png",
  "NEUMANN TLM 107 IMAGE-1 (4).png": "images/eco-monitor-c.png",
  "NEUMANN TLM 107 IMAGE-1 (39).png": "images/eco-subwoofer.png",
  "NEUMANN TLM 107 IMAGE-1 (30).png": "images/eco-ma1-graph.png",
  "NEUMANN TLM 107 IMAGE-1 (26).png": "images/eco-tube-psu.png",
  "NEUMANN TLM 107 IMAGE-1 (17).png": "images/eco-u87.png",
  "NEUMANN TLM 107 IMAGE-1 (34).png": "images/eco-clip-mic.png",
  // --- Logos (black artwork on transparent) ---
  "NEUMANN BERLIN LOGO.png": "logos/logo-neumann.png",
  "SHIVANSH ELECTRONICS LOGO.png": "logos/logo-shivansh.png",
  // --- Long-form-only additions: genuinely new material not used in the reel ---
  "1008b9dd90dd07439c6f2be5eccbad97.jpg": "images/mount-nickel-branded.jpg",
  "1d1485b8b4deb0946d3c5b6fe2596167.jpg": "images/kit-composite.jpg",
  "NEUMANN TLM 107 IMAGE-1 (9).jpg": "images/nickel-boom-mount.jpg",
  "4e364760ab308f5df484a0e760f17c48.jpg": "images/control-diagram-annotated.jpg",
  "image_5szcJVlpZ.jpg": "images/candid-home-studio.jpg",
};

let copied = 0;
let missing = [];
for (const [src, dest] of Object.entries(map)) {
  const from = path.join(root, src);
  const to = path.join(root, "public", dest);
  if (!fs.existsSync(from)) {
    missing.push(src);
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied++;
}

console.log(`Copied ${copied} assets into public/.`);
if (missing.length) {
  console.warn(`WARNING: ${missing.length} source files missing:`);
  for (const m of missing) console.warn("  - " + m);
}
