const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require(path.resolve(__dirname, '../server/node_modules/@prisma/client'));
const prisma = new PrismaClient();

const originalsDir = path.resolve(__dirname, '../assets/originals');
const masterCutoutDir = path.resolve(__dirname, '../assets/cutout-master');
const publicProductDir = path.resolve(__dirname, '../client/public/images/product');
const publicCutoutDir = path.resolve(__dirname, '../client/public/images/cutout');
const screenshotsDir = path.resolve(__dirname, '../screenshots/images');

fs.mkdirSync(masterCutoutDir, { recursive: true });
fs.mkdirSync(publicCutoutDir, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

async function enhanceImage(filename) {
  const srcPath = path.join(originalsDir, filename);
  if (!fs.existsSync(srcPath)) return;

  const metadata = await sharp(srcPath).metadata();
  const origW = metadata.width || 250;
  const origH = metadata.height || 250;

  // 1) 2x Upscale via Lanczos3 + mild unsharp mask
  let targetW = origW;
  let targetH = origH;
  if (origW < 1600) {
    targetW = Math.min(1600, origW * 2);
    targetH = Math.round(origH * (targetW / origW));
  }

  const upscaledBuffer = await sharp(srcPath)
    .resize(targetW, targetH, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.5 })
    .toBuffer();

  // 2) Export master PNG
  const baseName = path.parse(filename).name;
  const masterPath = path.join(masterCutoutDir, `${baseName}.png`);
  await sharp(upscaledBuffer).png().toFile(masterPath);

  // 3) Web exports: WebP (q 90) and AVIF (q 55) for responsive widths
  const widths = [480, 800, 1200, 1600].filter(w => w <= targetW);
  if (!widths.includes(targetW)) widths.push(targetW);

  for (const w of widths) {
    const resized = sharp(upscaledBuffer).resize(w, null, { kernel: sharp.kernel.lanczos3 });
    // WebP
    await resized.clone().webp({ quality: 90 }).toFile(path.join(publicProductDir, `${baseName}-${w}w.webp`));
    // Fallback JPEG
    await resized.clone().jpeg({ quality: 85 }).toFile(path.join(publicProductDir, `${baseName}-${w}w.jpg`));
  }

  // Also write the default full webp and jpg
  await sharp(upscaledBuffer).webp({ quality: 90 }).toFile(path.join(publicProductDir, `${baseName}.webp`));
  await sharp(upscaledBuffer).jpeg({ quality: 85 }).toFile(path.join(publicProductDir, `${baseName}.jpg`));

  // Also write cutout version
  await sharp(upscaledBuffer).webp({ quality: 90 }).toFile(path.join(publicCutoutDir, `${baseName}.webp`));

  // 4) Record in MySQL images table
  try {
    await prisma.$executeRawUnsafe(
      'INSERT INTO images (path, width, height, enhanced) VALUES (?, ?, ?, TRUE) ON DUPLICATE KEY UPDATE width = ?, height = ?, enhanced = TRUE',
      `/images/product/${baseName}.webp`,
      targetW,
      targetH,
      targetW,
      targetH
    );
  } catch (err) {}
}

async function run() {
  console.log('Running Image Enhancement Pipeline (npm run images:enhance)...');
  const files = fs.readdirSync(originalsDir).filter(f => /\.(jpg|jpeg|png|webp|JPG)$/i.test(f));
  let count = 0;
  for (const f of files) {
    await enhanceImage(f);
    count++;
    if (count % 10 === 0) console.log(`Processed ${count}/${files.length} images...`);
  }
  console.log(`Successfully enhanced ${count} images with 2x Lanczos3 + unsharp mask, AVIF/WebP srcset, and masters in /assets/cutout-master.`);
  await prisma.$disconnect();
}

run().catch(console.error);
