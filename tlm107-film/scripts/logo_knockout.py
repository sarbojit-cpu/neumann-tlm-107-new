#!/usr/bin/env python3
"""Negative (dark-background) versions of the two partner logos, on a truly
transparent background, for the thumbnails.

The supplied files are black-on-white artwork (the white is opaque). Each
pixel is un-matted against white: it is read as a mix of white and the nearest
of the logo's own colours, which gives its real coverage. Then every colour is
moved to its place on a dark ground — black ink becomes white, Neumann's grey
and orange stay as they are, the Shivansh drop-shadow and tagline keep their
relative weight. Sources live in tlm107-film/brand/."""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BRAND = os.path.join(ROOT, "brand")
IMG = os.path.join(ROOT, "public", "img")

INK_T = np.array([244, 246, 248]) / 255


def load(name):
    a = np.asarray(Image.open(os.path.join(BRAND, name)).convert("RGBA")).astype(float) / 255
    rgb = a[..., :3] * a[..., 3:4] + (1 - a[..., 3:4])  # flatten the outer transparency onto white
    return rgb, rgb @ [0.2126, 0.7152, 0.0722], rgb.max(2) - rgb.min(2)


def unmatte(L, classes, label):
    """classes: list of (g, target_rgb); label: per-pixel class index."""
    h, w = L.shape
    out_rgb = np.zeros((h, w, 3))
    alpha = np.zeros((h, w))
    for i, (g, tgt) in enumerate(classes):
        m = label == i
        a = np.clip((1 - L[m]) / (1 - g), 0, 1)
        col = np.repeat(np.asarray(tgt)[None, :], m.sum(), 0)
        if g > 0:  # darker than this colour = it meets the black ink: opaque, blend toward the ink target
            dk = L[m] < g
            t = (L[m][dk] / g)[:, None]
            col[dk] = INK_T * (1 - t) + np.asarray(tgt) * t
        alpha[m] = a
        out_rgb[m] = col
    return out_rgb, alpha


def nearest(cores):
    """Index of the nearest core mask for every pixel."""
    d = np.stack([ndimage.distance_transform_edt(~c) for c in cores])
    return d.argmin(0), d


def save(rgb, alpha, name):
    a = alpha.copy()
    a[a < 0.012] = 0
    ys, xs = np.where(a > 0)
    pad = 6
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, a.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, a.shape[1])
    px = np.dstack([rgb, a])[y0:y1, x0:x1]
    Image.fromarray((px * 255 + 0.5).clip(0, 255).astype(np.uint8), "RGBA").save(os.path.join(IMG, name), optimize=True)
    print(f"{name}: {x1 - x0}x{y1 - y0}")


# Shivansh Electronics: black ink, a light-grey drop shadow on the S monogram, a mid-grey tagline.
rgb, L, sat = load("shivansh-electronics-logo.webp")
SHADOW_G, TAG_G = 0.733, 0.333
ink = L < 0.15
shadow = np.abs(L - SHADOW_G) < 0.04
lab, d = nearest([ink, shadow])
tag = np.zeros_like(ink)
tag[455:, 640:] = True  # the tagline line sits alone under the wordmark
lab[tag] = 2
# a pixel darker than the shadow, touching it, is ink meeting shadow (not ink meeting white)
lab[(lab == 0) & (d[1] <= 2.5) & (L < SHADOW_G)] = 1
rgb_o, a_o = unmatte(L, [(0.0, INK_T), (SHADOW_G, np.array([98, 102, 108]) / 255), (TAG_G, np.array([184, 188, 194]) / 255)], lab)
save(rgb_o, a_o, "logo_shivansh_k.png")

# Neumann.Berlin: black NEUMANN, grey rhombus + BERLIN, orange double chevron.
rgb, L, sat = load("neumann-berlin-logo.png")
GREY_G = 0.719
ORANGE = np.array([0.906, 0.563, 0.085])
ink = (L < 0.15) & (sat < 0.1)
grey = (np.abs(L - GREY_G) < 0.03) & (sat < 0.1)
orange = sat > 0.4
lab, d = nearest([ink, grey, orange])
rgb_o, a_o = unmatte(L, [(0.0, INK_T), (GREY_G, np.array([0.707, 0.725, 0.747])), (0.0, ORANGE)], lab)
m = lab == 2  # orange: coverage from the blue channel, where it differs most from white
a_o[m] = np.clip((1 - rgb[..., 2][m]) / (1 - ORANGE[2]), 0, 1)
save(rgb_o, a_o, "logo_neumann_k.png")
