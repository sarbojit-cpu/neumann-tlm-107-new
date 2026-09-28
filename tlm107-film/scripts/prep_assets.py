#!/usr/bin/env python3
"""Every photograph in the repo -> a 4K-ready asset + src/assets.generated.ts.

  kind "c"  cut-out: a whole product, background removed (rembg isnet), shown
            on a lit stage. Sources that already carry alpha keep theirs.
  kind "i"  photograph: shown full frame with a camera move.
  kind "l"  logo.

Every image is rebuilt 4x by Real-ESRGAN general-x4v3 (the 730 px product
shots become ~2900 px) and capped at 3200 px on the long side, so no still is
ever enlarged by the browser on a 4K canvas.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
REPO = os.path.dirname(ROOT)
WORK = "/home/user/work"
sys.path.insert(0, WORK)
OUT = os.path.join(ROOT, "public", "img")
os.makedirs(OUT, exist_ok=True)

N = "NEUMANN TLM 107 IMAGE-1"
ASSETS = [
    # slug, file, kind, label
    ("mount_black", "00b283988aadf5be2c1cb31919d1b80c.jpg", "c", "EA 4 elastic mount · black"),
    ("mount_nickel", "1008b9dd90dd07439c6f2be5eccbad97.jpg", "c", "EA 4 elastic mount · nickel"),
    ("box_trio", "1d1485b8b4deb0946d3c5b6fe2596167.jpg", "i", "TLM 107 · wooden case"),
    ("heritage_vintage", "1e26fff23b3ee3cbf204a7abf6ca6f9b.jpg", "i", "Neumann heritage"),
    ("nickel_ea4_stand", "2518c9e88e2cc5eeb29585277472f010.jpg", "c", "TLM 107 nickel · EA 4"),
    ("nickel_front", "2d32ea0fb60e3f053fd48e5738d08be5.jpg", "c", "TLM 107 · nickel"),
    ("nickel_grille_macro", "341e0e7b583e3f30b11ed0d2e9acca9a.jpg", "i", "Head grille · nickel"),
    ("black_ea4_brand", "3a0c40981d3f3bbb170bf0681da01f4a.jpg", "i", "TLM 107 bk · EA 4"),
    ("nav_callouts", "4e364760ab308f5df484a0e760f17c48.jpg", "i", "Navigation switch"),
    ("mount_nickel_parts", "612422292819227d896edac5df6275ed.jpg", "c", "EA 4 · nickel"),
    ("black_front", "61b723914db7e35bad5b1561489e7331.jpg", "c", "TLM 107 · black"),
    ("eco_black_mic", "67aed9abac0f6c330c04b3dc775bd988.jpg", "c", "Neumann studio microphone"),
    ("nickel_clip_angle", "7ae5839f3cd12c1c9c46f9edeb237174.jpg", "c", "TLM 107 · nickel"),
    ("black_xlr_angle", "8299ad54bcf6fe9de88267d1cdd7ea28.jpg", "c", "TLM 107 · black"),
    ("white_ea4", "8996d3000b18ffc8d358db19cc42e892.jpg", "c", "TLM 107 · EA 4"),
    ("nickel_console", "8d0d8b89c4bd4eb0c14b4f763c1ea185.jpg", "i", "TLM 107 in the studio"),
    ("nickel_purple", "9493dccf8113453552622360f6c04135.jpg", "i", "TLM 107 · nickel"),
    ("logo_neumann", "NEUMANN BERLIN LOGO.png", "l", "Neumann.Berlin"),
    ("black_ea4_stand", f"{N} (1).png", "c", "TLM 107 bk · EA 4"),
    ("nickel_ring_macro", f"{N} (10).jpg", "i", "Control ring · nickel"),
    ("box_black_small", f"{N} (12).jpg", "i", "TLM 107 bk · wooden case"),
    ("grille_abstract", f"{N} (14).jpg", "i", "Head grille · black"),
    ("u87_eco", f"{N} (17).png", "c", "Neumann studio microphone"),
    ("black_ring_macro", f"{N} (19).jpg", "i", "Control ring · black"),
    ("nickel_front_tall", f"{N} (2).jpg", "c", "TLM 107 · nickel"),
    ("polar_chart", f"{N} (2).png", "g", "Polar diagram"),
    ("nickel_ea4", f"{N} (21).png", "c", "TLM 107 · EA 4"),
    ("badge_black_macro", f"{N} (22).jpg", "i", "Neumann badge"),
    ("grille_badge_dark", f"{N} (23).jpg", "i", "TLM 107 bk"),
    ("black_leds_macro", f"{N} (24).jpg", "i", "Pad & pattern LEDs"),
    ("tube_mic_psu", f"{N} (26).png", "c", "Neumann tube microphone"),
    ("eco_headphones_a", f"{N} (29).png", "c", "Neumann headphones"),
    ("eco_ma1", f"{N} (30).png", "c", "Neumann monitor alignment"),
    ("black_ea4", f"{N} (31).png", "c", "TLM 107 bk · EA 4"),
    ("nickel_ea4_b", f"{N} (33).png", "c", "TLM 107 · EA 4"),
    ("eco_clip_kk", f"{N} (34).png", "c", "Neumann clip microphone"),
    ("eco_monitor_a", f"{N} (35).png", "c", "Neumann studio monitor"),
    ("eco_monitor_b", f"{N} (36).png", "c", "Neumann studio monitor"),
    ("eco_headphones_b", f"{N} (37).png", "c", "Neumann headphones"),
    ("eco_sub", f"{N} (39).png", "c", "Neumann subwoofer"),
    ("badge_black_macro2", f"{N} (4).jpg", "i", "Neumann badge"),
    ("eco_monitor_c", f"{N} (4).png", "c", "Neumann studio monitor"),
    ("grille_badge_dark2", f"{N} (5).jpg", "i", "TLM 107 bk"),
    ("black_leds_macro2", f"{N} (6).jpg", "i", "Pad & pattern LEDs"),
    ("eco_hanging", f"{N} (9).jpg", "c", "Neumann hanging microphone"),
    ("black_front_tall", f"{N}.jpg", "c", "TLM 107 · black"),
    ("logo_shivansh", "SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "l", "Shivansh Electronics"),
    ("nickel_xlr_macro", "a3dd24a959546ae37f72d0c908a1cd09.jpg", "i", "XLR connector"),
    ("box_open_black", "bdd213873e23660d8aac9d7f36b5430c.jpg", "c", "Wooden case"),
    ("box_closed", "c83d63e9753ba6cef6686ee4bacd3f26.jpg", "c", "Wooden case"),
    ("eco_dark_mic", "c9cf8966e9e0a7d1e662aa2af8a775bd.jpg", "c", "Neumann microphone"),
    ("nickel_stand", "e66d46f7393c33cb08afc98a06fa358f.jpg", "c", "TLM 107 · nickel"),
    ("cream_ea4", "ec666c0acbe1505260317821cea77c52.jpg", "c", "EA 4 elastic mount"),
    ("thumb_box_mount", "image_4p3AAAABZ.jpg", "i", "TLM 107 bk · Studio Set"),
    ("black_homestudio", "image_5szcJVlpZ.jpg", "i", "TLM 107 bk · home studio"),
    ("black_ring_top", "image_5vbhB2Q.jpg", "i", "Control ring · black"),
    ("thumb_black_ea4", "image_6tzICIiDZ.jpg", "i", "TLM 107 bk · EA 4"),
]

CAP = 3200


def up4(rgb):
    from sr import load, upscale
    global _net
    if "_net" not in globals():
        _net = load("vgg")
    return upscale(_net, rgb, tile=320)


def fit(im):
    s = CAP / max(im.size)
    if s < 1:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    return im


def main(only=None):
    meta = {}
    mpath = os.path.join(HERE, "assets.json")
    if os.path.exists(mpath):
        meta = {m["slug"]: m for m in json.load(open(mpath))}
    session = None
    for slug, fn, kind, label in ASSETS:
        if only and slug not in only:
            continue
        ext = "png" if kind in ("c", "l", "g") else "jpg"
        dst = os.path.join(OUT, f"{slug}.{ext}")
        src = Image.open(os.path.join(REPO, fn))
        has_alpha = src.mode in ("RGBA", "LA", "P") and np.array(src.convert("RGBA"))[..., 3].min() < 250
        if not os.path.exists(dst):
            rgba = src.convert("RGBA")
            rgb = np.array(rgba.convert("RGB"))
            up = Image.fromarray(up4(rgb)) if kind != "l" else rgba.convert("RGB").resize((rgba.width, rgba.height))
            if kind == "l":
                im = rgba  # logos are already large and crisp
            elif kind in ("c", "g"):
                if has_alpha:
                    a = rgba.split()[-1].resize(up.size, Image.LANCZOS)
                else:
                    if session is None:
                        from rembg import new_session
                        session = new_session("isnet-general-use")
                    from rembg import remove
                    a = remove(up, session=session, only_mask=True)
                    a = a.filter(ImageFilter.GaussianBlur(0.8))
                im = up.copy()
                im.putalpha(a)
                bb = im.split()[-1].point(lambda v: 255 if v > 8 else 0).getbbox()
                if bb:
                    pad = int(0.02 * max(im.size))
                    bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad))
                    im = im.crop(bb)
            else:
                im = up
            im = fit(im)
            if ext == "jpg":
                im.convert("RGB").save(dst, quality=93, subsampling=0)
            else:
                im.save(dst, optimize=False, compress_level=4)
            print(f"{slug:22s} {src.size} -> {im.size}", flush=True)
        im = Image.open(dst)
        rgb = np.array(im.convert("RGB")).astype(np.float32)
        if im.mode == "RGBA":
            a = np.array(im.split()[-1]).astype(np.float32) / 255
            lum = float((rgb @ np.array([0.2126, 0.7152, 0.0722]) * a).sum() / max(1, a.sum()) / 255)
        else:
            lum = float((rgb @ np.array([0.2126, 0.7152, 0.0722])).mean() / 255)
            # how much of the frame border is near-white (a studio packshot)
            e = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
            meta.setdefault(slug, {})["paper"] = float((e.min(1) > 225).mean())
        meta[slug] = {**meta.get(slug, {}), "slug": slug, "file": f"img/{slug}.{ext}", "kind": kind,
                      "label": label, "w": im.width, "h": im.height, "ar": round(im.width / im.height, 4),
                      "lum": round(lum, 3), "src": fn}
    json.dump(sorted(meta.values(), key=lambda m: m["slug"]), open(mpath, "w"), indent=1)
    ts = "// generated by scripts/prep_assets.py — do not edit\nexport type Asset = { slug: string; file: string; kind: \"c\" | \"i\" | \"l\" | \"g\"; label: string; w: number; h: number; ar: number; lum: number; paper?: number };\n"
    ts += "export const ASSETS: Record<string, Asset> = " + json.dumps({m["slug"]: {k: v for k, v in m.items() if k != "src"} for m in meta.values()}, indent=1) + ";\n"
    open(os.path.join(ROOT, "src", "assets.generated.ts"), "w").write(ts)
    print("assets:", len(meta))


if __name__ == "__main__":
    main(set(sys.argv[1:]) or None)
