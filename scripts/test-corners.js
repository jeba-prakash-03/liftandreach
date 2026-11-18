const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'client/public/images/cutout';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !f.startsWith('banner'));

(async () => {
  let issues = 0;
  for (const f of files) {
    const full = path.join(dir, f);
    const { data, info } = await sharp(full).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const corners = [
      { name: 'TL', idx: 0 },
      { name: 'TR', idx: (width - 1) * channels },
      { name: 'BL', idx: ((height - 1) * width) * channels },
      { name: 'BR', idx: ((height - 1) * width + (width - 1)) * channels }
    ];
    for (const c of corners) {
      const r = data[c.idx], g = data[c.idx+1], b = data[c.idx+2];
      // Delta to pure white (255, 255, 255)
      const diff = Math.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2);
      if (diff > 10) {
        issues++;
        console.log(`Image ${f} corner ${c.name} has diff ${diff.toFixed(1)} (RGB: ${r}, ${g}, ${b})`);
      }
    }
  }
  console.log(`Total corner issues: ${issues}`);
})();
