import fs from 'fs';
import path from 'path';

export function runLinkCutouts() {
  const manifestPath = path.resolve(__dirname, '../client/public/images/cutout/manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Manifest not found at', manifestPath);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log(`[link-cutouts] Verified cutout manifest with ${Object.keys(manifest).length} entries.`);
}

if (require.main === module) {
  runLinkCutouts();
}
