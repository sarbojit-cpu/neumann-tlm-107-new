#!/usr/bin/env python3
"""Bakes the film's grade into the prepared photographs once (instead of a
per-frame CSS filter): photographs contrast 1.08 / saturation 1.06 /
brightness 0.98; cut-outs contrast 1.04. Idempotent via public/img/.graded."""
import json, os
from PIL import Image, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
IMG = os.path.join(ROOT, "public", "img")
mark = os.path.join(IMG, ".graded")
done = set(open(mark).read().split()) if os.path.exists(mark) else set()
for a in json.load(open(os.path.join(HERE, "assets.json"))):
    if a["slug"] in done or a["kind"] in ("l", "g"):
        continue
    p = os.path.join(ROOT, "public", a["file"])
    im = Image.open(p)
    alpha = im.split()[-1] if im.mode == "RGBA" else None
    rgb = im.convert("RGB")
    if a["kind"] == "i":
        rgb = ImageEnhance.Brightness(ImageEnhance.Color(ImageEnhance.Contrast(rgb).enhance(1.08)).enhance(1.06)).enhance(0.98)
    else:
        rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    if alpha is not None:
        rgb.putalpha(alpha)
        rgb.save(p, compress_level=4)
    else:
        rgb.save(p, quality=93, subsampling=0)
    done.add(a["slug"])
open(mark, "w").write("\n".join(sorted(done)))
print("graded", len(done))
