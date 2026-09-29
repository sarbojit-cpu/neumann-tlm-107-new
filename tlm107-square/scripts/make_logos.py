"""Turn the white-plate logos into transparent, dark-background versions:
black ink -> near-white, grey ink stays grey, orange accents keep their colour.
Alpha is un-mixed from the white plate using the local ink level (min filter)."""
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/sq/logos/"


def convert(name, out):
    im = Image.open(SRC + name).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    rgb = np.asarray(bg.convert("RGB")).astype(np.float32)
    L = rgb.mean(2)
    sat = rgb.max(2) - rgb.min(2)
    ink = ndimage.minimum_filter(L, size=7)
    a = np.clip((255 - L) / np.maximum(255 - ink, 30), 0, 1)
    # colour by ink darkness: black -> 246, dark grey -> light grey, mid grey stays
    tone = np.where(ink < 70, 246, np.where(ink < 150, np.interp(ink, [70, 150], [238, 200]), ink + 5))
    col = np.stack([tone] * 3, 2)
    # saturated accents: recover the pure ink colour from the white mix
    s = sat > 40
    pure = 255 - (255 - rgb) / np.maximum(a[..., None], 1e-3)
    col[s] = np.clip(pure[s], 0, 255)
    a[s] = np.maximum(a[s], np.clip(sat[s] / 180, 0, 1))
    # drop the plate outline/antialias noise
    a[a < 0.04] = 0
    outim = Image.fromarray(np.dstack([col, a * 255]).astype(np.uint8), "RGBA")
    bb = outim.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    outim = outim.crop((max(bb[0] - 6, 0), max(bb[1] - 6, 0), bb[2] + 6, bb[3] + 6))
    outim.save(SRC + out)
    print(out, outim.size)


convert("logo-neumann.png", "neumann-dark.png")
convert("logo-shivansh.png", "shivansh-dark.png")
