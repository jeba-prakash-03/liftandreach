import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const CUTOUT_DIR = path.resolve('client/public/images/cutout');

test.describe('W2 Cutouts Artifacts & Lossless Alpha', () => {
  test('WebP vs PNG alpha diff and enclosed holes check', async () => {
    const manifestPath = path.join(CUTOUT_DIR, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBeTruthy();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    // Filter to master PNG entries in manifest
    const entries = Object.keys(manifest).filter((k) => k.endsWith('.png'));
    expect(entries.length).toBeGreaterThanOrEqual(10);

    let testedCount = 0;
    for (const key of entries) {
      const pngPath = path.join(CUTOUT_DIR, key);
      const webpPath = path.join(CUTOUT_DIR, key.replace('.png', '.webp'));

      if (!fs.existsSync(pngPath) || !fs.existsSync(webpPath)) {
        continue;
      }

      const pngMeta = await sharp(pngPath).metadata();
      const webpMeta = await sharp(webpPath).metadata();

      expect(pngMeta.hasAlpha).toBeTruthy();
      expect(webpMeta.hasAlpha).toBeTruthy();

      if (pngMeta.width !== webpMeta.width || pngMeta.height !== webpMeta.height) {
        continue;
      }

      testedCount++;
      const pngRaw = await sharp(pngPath).ensureAlpha().raw().toBuffer();
      const webpRaw = await sharp(webpPath).ensureAlpha().raw().toBuffer();

      const numPixels = pngMeta.width! * pngMeta.height!;
      let totalDiff = 0;
      const diffs: number[] = [];

      for (let i = 0; i < numPixels; i++) {
        const pngAlpha = pngRaw[i * 4 + 3];
        const webpAlpha = webpRaw[i * 4 + 3];
        const diff = Math.abs(pngAlpha - webpAlpha);
        totalDiff += diff;
        diffs.push(diff);
      }

      const meanDiff = totalDiff / numPixels;
      diffs.sort((a, b) => a - b);
      const p99_9 = diffs[Math.floor(numPixels * 0.999)];

      // Mean abs difference < 1.5/255 and 99.9th percentile < 24/255
      expect(meanDiff).toBeLessThan(1.5);
      expect(p99_9).toBeLessThan(24);
    }

    expect(testedCount).toBeGreaterThanOrEqual(10);
  });
});
