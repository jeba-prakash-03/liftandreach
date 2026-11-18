import pathlib
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

SRC = pathlib.Path("assets/originals")
OUT = pathlib.Path("client/public/images/cutout")
OUT.mkdir(parents=True, exist_ok=True)

# List of photos that are full rectangular pictures (not studio cutouts)
FULL_FRAME_PHOTOS = {
    "GOODS LIFT 3.jpg",
    "GOODS LIFT 3.webp",
    "GOODS LIFT wall mounted.jpg",
    "GOODS LIFT wall mounted.webp",
    "bannerhome.jpg",
    "bannerhome1.jpg",
    "bannerhome2.jpg"
}

DEFAULT_WHITE_MIN = 235

def cutout_fullframe(im):
    # Rounded rect with zero alpha at the 4 corners
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, w, h], radius=32, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out

def cutout(p, white_min=DEFAULT_WHITE_MIN):
    im = Image.open(p).convert("RGB")
    if p.name in FULL_FRAME_PHOTOS:
        return cutout_fullframe(im)
    if im.width < 1400:
        im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    lab, _ = ndi.label(a.min(axis=2) > white_min)
    edge = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    edge = edge[edge > 0]
    fg = ~np.isin(lab, edge)
    lab2, n = ndi.label(fg)
    sizes = ndi.sum(fg, lab2, range(1, n + 1))
    fg = np.isin(lab2, 1 + np.where(sizes > fg.size * 0.0002)[0])
    band = ndi.binary_dilation(fg, iterations=2) & ~ndi.binary_erosion(fg, iterations=2)
    soft = np.clip((250 - a.min(axis=2)) / 45.0, 0, 1)
    alpha = ndi.gaussian_filter(np.where(band, soft, fg.astype(np.float32)), 0.7)
    A = np.maximum(alpha, 0.04)[..., None]
    rgb = np.where(band[..., None], np.clip((a - 255 * (1 - A)) / A, 0, 255), a)
    out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), "RGBA")
    box = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    res = out.crop(box) if box else out
    # Final safety: guarantee the exact 4 corner pixels have alpha == 0
    w, h = res.size
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        r, g, b, _ = res.getpixel(corner)
        res.putpixel(corner, (r, g, b, 0))
    return res

def main():
    print(f"Reading from {SRC}...")
    for p in sorted(SRC.glob("*.*")):
        if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        try:
            im = cutout(p)
            stem = p.stem.lower().replace(" ", "-")
            im.save(OUT / f"{stem}.png")
            for w in (480, 800, 1200, 1600):
                if w <= im.width:
                    resized = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
                    resized.save(OUT / f"{stem}-{w}.webp", quality=90, method=6)
            im.save(OUT / f"{stem}.webp", quality=90, method=6)
            print(f"Processed cutout: {stem} (size: {im.width}x{im.height})")
        except Exception as e:
            print(f"Error processing {p.name}: {e}")

if __name__ == "__main__":
    main()
