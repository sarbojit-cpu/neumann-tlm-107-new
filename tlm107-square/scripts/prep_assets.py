"""Prepare TLM 107 square-reel assets from the repo-root product photos.

White-background studio shots are cut out (border-connected near-white removed,
edges feathered) so they can sit on the dark stage; photos/macros stay as-is.
Output: public/sq/img/<key>.webp
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sq", "img")
os.makedirs(OUT, exist_ok=True)
N = lambda i: f"NEUMANN TLM 107 IMAGE-1 ({i})"

# key: (source file, mode)   mode: cut = remove white bg, png = already transparent, photo = keep
A = {
    # black finish
    "b_front": ("61b723914db7e35bad5b1561489e7331.jpg", "cut"),
    "b_front2": ("NEUMANN TLM 107 IMAGE-1.jpg", "cut"),
    "b_3q": ("8299ad54bcf6fe9de88267d1cdd7ea28.jpg", "cut"),
    "b_mount": (N(1) + ".png", "png"),
    "b_mount2": (N(31) + ".png", "png"),
    "b_mount3": ("image_6tzICIiDZ.jpg", "cut"),
    "b_controls": (N(19) + ".jpg", "photo"),
    "b_controls_w": ("image_5vbhB2Q.jpg", "photo"),
    "b_badge": (N(22) + ".jpg", "photo"),
    "b_badge_sm": (N(4) + ".jpg", "photo"),
    "b_macro": (N(23) + ".jpg", "photo"),
    "b_ctrl_angle": (N(24) + ".jpg", "photo"),
    "grille_tex": (N(14) + ".jpg", "photo"),
    "ctrl_diagram": ("4e364760ab308f5df484a0e760f17c48.jpg", "photo"),
    "ctx_dark": ("3a0c40981d3f3bbb170bf0681da01f4a.jpg", "photo"),
    "candid": ("image_5szcJVlpZ.jpg", "photo"),
    "ea4_black": ("00b283988aadf5be2c1cb31919d1b80c.jpg", "cut"),
    "box_open": ("bdd213873e23660d8aac9d7f36b5430c.jpg", "cut"),
    "box_closed": ("c83d63e9753ba6cef6686ee4bacd3f26.jpg", "cut"),
    "box_small": (N(12) + ".jpg", "cut"),
    "box_mic": ("image_4p3AAAABZ.jpg", "cut"),
    # nickel finish
    "n_front": ("2d32ea0fb60e3f053fd48e5738d08be5.jpg", "cut"),
    "n_front2": (N(2) + ".jpg", "cut"),
    "n_stand": ("2518c9e88e2cc5eeb29585277472f010.jpg", "cut"),
    "n_grille": ("341e0e7b583e3f30b11ed0d2e9acca9a.jpg", "cut"),
    "n_angle": ("7ae5839f3cd12c1c9c46f9edeb237174.jpg", "cut"),
    "n_white": ("8996d3000b18ffc8d358db19cc42e892.jpg", "photo"),
    "n_boom": ("e66d46f7393c33cb08afc98a06fa358f.jpg", "cut"),
    "n_mount": (N(21) + ".png", "png"),
    "n_mount2": (N(33) + ".png", "png"),
    "n_controls": (N(10) + ".jpg", "photo"),
    "n_xlr": ("a3dd24a959546ae37f72d0c908a1cd09.jpg", "photo"),
    "ea4_nickel": ("1008b9dd90dd07439c6f2be5eccbad97.jpg", "cut"),
    "ea4_adapters": ("612422292819227d896edac5df6275ed.jpg", "cut"),
    "ea4_cream": ("ec666c0acbe1505260317821cea77c52.jpg", "cut"),
    "kit": ("1d1485b8b4deb0946d3c5b6fe2596167.jpg", "photo"),
    "ctx_console": ("8d0d8b89c4bd4eb0c14b4f763c1ea185.jpg", "photo"),
    "ctx_purple": ("9493dccf8113453552622360f6c04135.jpg", "photo"),
    "ctx_pair": ("1e26fff23b3ee3cbf204a7abf6ca6f9b.jpg", "photo"),
    "polar": (N(2) + ".png", "png"),
    # Neumann studio family
    "fam_u87": (N(17) + ".png", "png"),
    "fam_tube": (N(26) + ".png", "png"),
    "fam_hp": (N(29) + ".png", "png"),
    "fam_hp2": (N(37) + ".png", "png"),
    "fam_ma1": (N(30) + ".png", "png"),
    "fam_clip": (N(34) + ".png", "png"),
    "fam_kh_a": (N(35) + ".png", "png"),
    "fam_kh_b": (N(36) + ".png", "png"),
    "fam_kh_c": (N(4) + ".png", "png"),
    "fam_sub": (N(39) + ".png", "png"),
    "fam_black": ("67aed9abac0f6c330c04b3dc775bd988.jpg", "cut"),
    "fam_hang": (N(9) + ".jpg", "cut"),
    "fam_kms": ("c9cf8966e9e0a7d1e662aa2af8a775bd.jpg", "cut"),
}


def cutout(im: Image.Image) -> Image.Image:
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    mx, mn = rgb.max(2), rgb.min(2)
    white = (mn > 232) & (mx - mn < 14)
    lab, _ = ndimage.label(white)
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    bg = np.isin(lab, border[border > 0])
    bg = ndimage.binary_opening(bg, iterations=1)
    # soft edge: distance-based feather + whiteness ramp in the transition band
    fg = ~bg
    d = ndimage.distance_transform_edt(fg)
    band = np.clip(d / 2.2, 0, 1)
    ramp = np.clip((255 - mn) / 40, 0, 1)
    alpha = np.where(d < 3, np.minimum(band + 0.25, 1) * np.maximum(ramp, band * 0.6), 1.0) * fg
    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    out = im.convert("RGBA")
    out.putalpha(a)
    return out


for key, (src, mode) in A.items():
    im = Image.open(os.path.join(ROOT, src))
    if mode == "cut":
        im = cutout(im)
    elif mode == "png":
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    if im.mode == "RGBA":
        bb = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if bb:
            pad = 4
            im = im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))
    im.save(os.path.join(OUT, key + ".webp"), quality=94, method=6)
    print(key, im.size, im.mode)
