import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Flood-fill threshold to make white/off-white background transparent
async function processCutouts() {
  const productDir = path.join(process.cwd(), 'client', 'public', 'images', 'product');
  const files = fs.readdirSync(productDir);
  const sourceImages = files.filter(
    (f) =>
      (f.endsWith('.jpg') || f.endsWith('.JPG') || f.endsWith('.png')) &&
      !f.includes('-480w') &&
      !f.includes('-800w') &&
      !f.includes('-1200w') &&
      !f.includes('banner')
  );

  console.log(`Processing cutouts for ${sourceImages.length} product images...`);

  for (const file of sourceImages) {
    const inputPath = path.join(productDir, file);
    const baseName = file.replace(/\.(jpg|jpeg|png|JPG|PNG)$/i, '');
    const outputPath = path.join(productDir, `${baseName}-cutout.webp`);

    try {
      // Read raw pixel data
      const { data, info } = await sharp(inputPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const width = info.width;
      const height = info.height;
      const channels = info.channels; // 4 (RGBA)

      // Sample corner color (assume top-left is background)
      const r0 = data[0];
      const g0 = data[1];
      const b0 = data[2];

      // Replace pixels close to background color or high brightness (> 242) with transparent
      for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from corner or near-white test
        const dist = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);
        const isNearWhite = r > 242 && g > 242 && b > 242;

        if (dist < 22 || isNearWhite) {
          // Feather or transparent
          if (dist < 14 || (r > 248 && g > 248 && b > 248)) {
            data[i + 3] = 0; // Alpha 0
          } else {
            // Soft feather edge
            data[i + 3] = Math.round(((dist - 14) / 8) * 255);
          }
        }
      }

      await sharp(data, {
        raw: {
          width,
          height,
          channels
        }
      })
        .webp({ quality: 90 })
        .toFile(outputPath);

      console.log(`Created cutout: ${baseName}-cutout.webp`);
    } catch (err) {
      console.error(`Failed cutout for ${file}:`, err);
    }
  }
}

processCutouts();
