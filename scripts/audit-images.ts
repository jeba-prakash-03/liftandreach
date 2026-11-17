import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface ImageUsage {
  file: string;
  width: number;
  height: number;
  components: string[];
  isLowRes: boolean;
}

const clientDir = path.resolve(__dirname, '../client');
const publicImagesDir = path.resolve(clientDir, 'public/images');
const srcDir = path.resolve(clientDir, 'src');

function getAllFiles(dir: string, ext = ['.tsx', '.ts', '.jsx', '.js', '.json', '.html']): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, ext));
    } else {
      if (ext.some(e => file.endsWith(e))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function findImageReferences(): Map<string, Set<string>> {
  const references = new Map<string, Set<string>>();
  const codeFiles = getAllFiles(srcDir).concat(getAllFiles(path.resolve(__dirname, '../server/prisma')));

  for (const file of codeFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativeSrc = path.relative(process.cwd(), file);

    // Look for image paths like /images/... or images/...
    const matches = content.matchAll(/(?:\/)?images\/([a-zA-Z0-9_\-\s./%]+\.(?:jpg|jpeg|png|webp|JPG|PNG))/gi);
    for (const match of matches) {
      let imgPath = match[1];
      try {
        imgPath = decodeURIComponent(imgPath);
      } catch (e) {}

      if (!references.has(imgPath)) {
        references.set(imgPath, new Set<string>());
      }
      references.get(imgPath)!.add(relativeSrc);
    }
  }

  return references;
}

async function auditImages() {
  console.log('====================================================');
  console.log('       LIFT AND REACH EQUIPMENTS - IMAGE AUDIT       ');
  console.log('====================================================\n');

  const references = findImageReferences();
  const imageFiles: string[] = [];

  function scanImages(dir: string, base = '') {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      const rel = base ? `${base}/${item}` : item;
      if (fs.statSync(full).isDirectory()) {
        scanImages(full, rel);
      } else if (/\.(jpg|jpeg|png|webp|JPG|PNG)$/i.test(item)) {
        imageFiles.push(rel);
      }
    }
  }

  scanImages(publicImagesDir);

  const results: ImageUsage[] = [];
  let lowResCount = 0;

  for (const imgRel of imageFiles) {
    const fullPath = path.join(publicImagesDir, imgRel);
    try {
      const metadata = await sharp(fullPath).metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;
      const isLowRes = width < 600;

      // Find components referencing this image
      const comps = new Set<string>();
      for (const [refPath, callers] of references.entries()) {
        if (refPath.toLowerCase() === imgRel.toLowerCase() || refPath.endsWith(imgRel) || imgRel.endsWith(refPath)) {
          callers.forEach(c => comps.add(c));
        }
      }

      if (isLowRes) lowResCount++;

      results.push({
        file: imgRel,
        width,
        height,
        components: Array.from(comps),
        isLowRes
      });
    } catch (err: any) {
      console.error(`Error reading ${imgRel}:`, err.message);
    }
  }

  console.log(`Audited ${results.length} total image files.`);
  console.log(`Flagged ${lowResCount} images with naturalWidth < 600px.\n`);

  console.log('--- ALL IMAGES AUDIT TABLE ---');
  for (const r of results) {
    const flag = r.isLowRes ? '[FLAG: <600px]' : '[PASS]        ';
    console.log(`${flag} ${r.file.padEnd(45)} ${r.width}x${r.height} | Used in ${r.components.length} files`);
    if (r.components.length > 0) {
      for (const c of r.components) {
        console.log(`        └─ ${c}`);
      }
    }
  }

  console.log('\n--- RECOMMENDATION & ACTION PLAN ---');
  console.log('1. Never upscale images smaller than display size (<600px).');
  console.log('2. Display product photos centered on #F4F7FB blueprint tile using object-contain.');
  console.log('3. Remove deprecated /images/home/ thumbnails (50x50). Map categories to 250x250 product photos.');
  console.log('4. Generate multi-resolution srcset WebP versions (480, 800, 1200) with withoutEnlargement: true.');
}

auditImages().catch(console.error);
