import os
import pathlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

HERO_DIR = pathlib.Path("client/public/images/hero")
DIST_HERO = pathlib.Path("client/dist/images/hero")
SPLIT_DIR = HERO_DIR / "split"
DIST_SPLIT = DIST_HERO / "split"

HERO_DIR.mkdir(parents=True, exist_ok=True)
DIST_HERO.mkdir(parents=True, exist_ok=True)
SPLIT_DIR.mkdir(parents=True, exist_ok=True)
DIST_SPLIT.mkdir(parents=True, exist_ok=True)

# Load banner 1
im = Image.open(HERO_DIR / "banner-1.png").convert("RGBA")
arr = np.array(im)

# 1. Repair Scissor Lift Platform (y: 95..162, x: 1515..1875)
# In this region, find opaque pixels to determine the color
platform_mask = np.zeros(arr.shape[:2], dtype=bool)
platform_mask[95:162, 1515:1875] = True

# Also the side edge of the platform
# Let's fill the platform table completely
# Top surface has slight gradient from [195, 185, 80] at top to [145, 135, 55] at bottom
for y in range(95, 162):
    row_opaque = (arr[y, 1515:1875, 3] > 200)
    if np.any(row_opaque):
        row_rgb = arr[y, 1515:1875, :3][row_opaque].mean(axis=0)
    else:
        # Interpolate
        t = (y - 95) / (162 - 95)
        row_rgb = np.array([195 * (1 - t) + 145 * t, 185 * (1 - t) + 135 * t, 80 * (1 - t) + 55 * t])
    
    # In this row, the platform spans from left edge to right edge of the table
    # Table bounds at this y:
    left = 1515 + int((y - 95) * 0.2)
    right = 1875 - int((y - 95) * 0.1)
    
    for x in range(left, right):
        if arr[y, x, 3] < 220:
            arr[y, x, :3] = row_rgb
            arr[y, x, 3] = 255

# 2. Repair Scissor Lift Beams (y: 162..450, x: 1510..1880)
# Beam holes are small squares (< 400 px) or near solid beams
legs_mask = np.zeros(arr.shape[:2], dtype=bool)
legs_mask[162:450, 1510:1880] = True
legs_solid = legs_mask & (arr[:, :, 3] >= 200)

# Dilate solid regions by 5 pixels to capture all beam holes
dilated = ndi.binary_dilation(legs_solid, iterations=5)
holes_to_fill = legs_mask & dilated & (arr[:, :, 3] < 200)

# Inpaint from nearest solid pixel in legs
ind = ndi.distance_transform_edt(~legs_solid, return_distances=False, return_indices=True)
arr[holes_to_fill, 0] = arr[ind[0][holes_to_fill], ind[1][holes_to_fill], 0]
arr[holes_to_fill, 1] = arr[ind[0][holes_to_fill], ind[1][holes_to_fill], 1]
arr[holes_to_fill, 2] = arr[ind[0][holes_to_fill], ind[1][holes_to_fill], 2]
arr[holes_to_fill, 3] = 255

# 3. Repair Pallet Truck (y: 150..460, x: 1120..1480)
pallet_mask = np.zeros(arr.shape[:2], dtype=bool)
pallet_mask[150:460, 1120:1480] = True
pallet_solid = pallet_mask & (arr[:, :, 3] >= 200)
dilated_pallet = ndi.binary_dilation(pallet_solid, iterations=4)
pallet_holes = pallet_mask & dilated_pallet & (arr[:, :, 3] < 200)

ind_p = ndi.distance_transform_edt(~pallet_solid, return_distances=False, return_indices=True)
arr[pallet_holes, 0] = arr[ind_p[0][pallet_holes], ind_p[1][pallet_holes], 0]
arr[pallet_holes, 1] = arr[ind_p[0][pallet_holes], ind_p[1][pallet_holes], 1]
arr[pallet_holes, 2] = arr[ind_p[0][pallet_holes], ind_p[1][pallet_holes], 2]
arr[pallet_holes, 3] = 255

# 4. Remove stray artifact pixels between Tripod and Crane (x: 720..740, y: 190..310)
# Clean isolated floating fragments
artifact_mask = np.zeros(arr.shape[:2], dtype=bool)
artifact_mask[190:310, 722:740] = True
arr[artifact_mask, :] = 0

repaired = Image.fromarray(arr, "RGBA")

# Save repaired banner-1 at 1920, 1440, 960
for base_dir in [HERO_DIR, DIST_HERO]:
    repaired.save(base_dir / "banner-1.png")
    repaired.save(base_dir / "banner-1.webp", quality=92, method=6)
    repaired.save(base_dir / "banner-1-1920.webp", quality=92, method=6)
    
    im1440 = repaired.resize((1440, int(550 * 1440 / 1920)), Image.LANCZOS)
    im1440.save(base_dir / "banner-1-1440.png")
    im1440.save(base_dir / "banner-1-1440.webp", quality=92, method=6)
    
    im960 = repaired.resize((960, int(550 * 960 / 1920)), Image.LANCZOS)
    im960.save(base_dir / "banner-1-960.png")
    im960.save(base_dir / "banner-1-960.webp", quality=92, method=6)

print("Saved repaired banner-1 at 1920, 1440, and 960 in public and dist!")

# Also update split products for banner 1
# p4: Pallet truck (x: 1120..1480)
# p5: Scissor lift (x: 1510..1880)
p4_crop = repaired.crop((1120, 150, 1480, 460))
p4_bbox = p4_crop.getchannel("A").getbbox()
if p4_bbox: p4_crop = p4_crop.crop(p4_bbox)

p5_crop = repaired.crop((1500, 90, 1890, 460))
p5_bbox = p5_crop.getchannel("A").getbbox()
if p5_bbox: p5_crop = p5_crop.crop(p5_bbox)

for sdir in [SPLIT_DIR, DIST_SPLIT]:
    p4_crop.save(sdir / "banner-1-p4.png")
    p4_crop.save(sdir / "banner-1-p4.webp", quality=92, method=6)
    p5_crop.save(sdir / "banner-1-p5.png")
    p5_crop.save(sdir / "banner-1-p5.webp", quality=92, method=6)

print("Updated split products banner-1-p4 and banner-1-p5!")
