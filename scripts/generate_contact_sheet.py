import pathlib
from PIL import Image

OUT = pathlib.Path("client/public/images/cutout")
SCREENSHOTS = pathlib.Path("screenshots/images")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

pngs = sorted([p for p in OUT.glob("*.png") if not p.stem.startswith("banner")])
print(f"Generating contact sheet for {len(pngs)} cutouts...")

cols = 5
rows = (len(pngs) + cols - 1) // cols
cell_w, cell_h = 240, 240

sheet_w = cols * cell_w
sheet_h = rows * cell_h * 2  # top half dark-blue, bottom half light

sheet = Image.new("RGBA", (sheet_w, sheet_h), (255, 255, 255, 255))

# Draw dark-blue top background
dark_bg = Image.new("RGBA", (sheet_w, sheet_h // 2), (14, 26, 51, 255)) # #0E1A33
sheet.paste(dark_bg, (0, 0))

# Draw light bottom background
light_bg = Image.new("RGBA", (sheet_w, sheet_h // 2), (243, 245, 248, 255)) # #F3F5F8
sheet.paste(light_bg, (0, sheet_h // 2))

for idx, p in enumerate(pngs):
    c = idx % cols
    r = idx // cols
    im = Image.open(p).convert("RGBA")
    im.thumbnail((cell_w - 20, cell_h - 20), Image.LANCZOS)
    
    # Paste on dark
    x = c * cell_w + (cell_w - im.width) // 2
    y = r * cell_h + (cell_h - im.height) // 2
    sheet.alpha_composite(im, (x, y))

    # Paste on light
    y_light = (sheet_h // 2) + r * cell_h + (cell_h - im.height) // 2
    sheet.alpha_composite(im, (x, y_light))

contact_sheet_path = SCREENSHOTS / "contact-sheet.png"
sheet.convert("RGB").save(contact_sheet_path)
print(f"Saved contact sheet to {contact_sheet_path} ({sheet_w}x{sheet_h})")
