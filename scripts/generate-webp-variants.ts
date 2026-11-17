import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve(__dirname, '../client/public/images');
const productDir = path.join(imagesDir, 'product');

const widths = [480, 800, 1200];

async function generateVariants() {
  console.log('Generating responsive WebP variants for all product images...');
  const files = fs.readdirSync(productDir);

  for (const file of files) {
    // Only process original master images (.jpg, .jpeg, .png, .JPG, .PNG)
    if (file.includes('-480w') || file.includes('-800w') || file.includes('-1200w') || file.endsWith('.webp')) {
      continue;
    }
    if (!/\.(jpg|jpeg|png|JPG|PNG)$/i.test(file)) {
      continue;
    }

    const fullPath = path.join(productDir, file);
    const parsed = path.parse(file);
    const baseName = parsed.name; // e.g. "scissor lift"

    // 1. Generate base WebP at native size if not exists
    const nativeWebpPath = path.join(productDir, `${baseName}.webp`);
    try {
      await sharp(fullPath)
        .webp({ quality: 82 })
        .toFile(nativeWebpPath);
    } catch (err: any) {
      console.error(`Failed native webp for ${file}:`, err.message);
    }

    // 2. Generate multi-resolution srcset WebP versions (480, 800, 1200) with withoutEnlargement: true
    for (const w of widths) {
      const outWebp = path.join(productDir, `${baseName}-${w}w.webp`);
      const outJpg = path.join(productDir, `${baseName}-${w}w.jpg`);

      try {
        await sharp(fullPath)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(outWebp);

        await sharp(fullPath)
          .resize({ width: w, withoutEnlargement: true })
          .jpeg({ quality: 82, progressive: true })
          .toFile(outJpg);
      } catch (err: any) {
        console.error(`Error generating ${w}w for ${file}:`, err.message);
      }
    }
    console.log(`Processed: ${file}`);
  }
  console.log('Finished generating image variants.');
}

generateVariants().catch(console.error);
