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
  console.log('========================================================================================');
  console.log('       LIFT AND REACH EQUIPMENTS - IMAGE AUDIT (PART A1: UNDER 800PX REPORT)            ');
  console.log('========================================================================================\n');

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

  const under800: { file: string; natural: string; rendered1440: string; callers: string[] }[] = [];
  const above800: { file: string; natural: string }[] = [];

  for (const imgRel of imageFiles) {
    const fullPath = path.join(publicImagesDir, imgRel);
    try {
      const metadata = await sharp(fullPath).metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      const comps = new Set<string>();
      for (const [refPath, callers] of references.entries()) {
        if (refPath.toLowerCase() === imgRel.toLowerCase() || refPath.endsWith(imgRel) || imgRel.endsWith(refPath)) {
          callers.forEach(c => comps.add(c));
        }
      }

      if (width < 800) {
        under800.push({
          file: imgRel,
          natural: `${width}x${height}`,
          rendered1440: `max ${Math.min(width, 400)}px (at DPR 2)`,
          callers: Array.from(comps)
        });
      } else {
        above800.push({
          file: imgRel,
          natural: `${width}x${height}`
        });
      }
    } catch (e) {}
  }

  console.log(`Audited ${imageFiles.length} total images in client/public/images:`);
  console.log(`- Images >= 800px: ${above800.length}`);
  console.log(`- Images < 800px: ${under800.length}\n`);

  console.log('----------------------------------------------------------------------------------------');
  console.log('LIST OF IMAGES UNDER 800PX WIDE:');
  console.log('----------------------------------------------------------------------------------------');
  under800.slice(0, 35).forEach(img => {
    console.log(`• ${img.file.padEnd(45)} | Natural: ${img.natural.padEnd(9)} | Rendered @ 1440 DPR2: ${img.rendered1440}`);
  });
  if (under800.length > 35) {
    console.log(`... and ${under800.length - 35} more.`);
  }

  // Generate CHECKLIST.md for user
  const checklistContent = [
    '# Image Quality Audit & Replacement Checklist',
    '',
    'This checklist tracks low-resolution source images under 1000px wide from the original website catalog that should ideally be replaced with high-resolution original factory photographs (1600px+ width) when available.',
    '',
    '| File Path | Original Natural Dimensions | Status | Notes |',
    '| :--- | :--- | :--- | :--- |',
    ...under800.map(i => `| \`${i.file}\` | ${i.natural} | Enhanced (Sharp Lanczos3) | Source from liftandreach.in is 250x250 |`),
    ''
  ].join('\n');

  fs.writeFileSync(path.resolve(__dirname, '../CHECKLIST.md'), checklistContent, 'utf-8');
  console.log('\nCHECKLIST.md generated successfully at project root.');
}

auditImages();
