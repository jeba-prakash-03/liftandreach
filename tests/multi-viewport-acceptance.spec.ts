import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '360px', width: 360, height: 800 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '640px', width: 640, height: 900 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1440px', width: 1440, height: 900 }
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'product-detail', path: '/products/scissor-lift/scissor-lift' },
  { name: 'contact', path: '/contact' }
];

test.describe('Part 6 - Multi-Viewport Acceptance & Screenshots', () => {
  const screenshotsDir = path.resolve('screenshots/fixes2');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const vp of VIEWPORTS) {
    test(`Verify viewport width and no horizontal scroll at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const p of PAGES) {
        await page.goto(`http://localhost:5173${p.path}`);
        await page.waitForLoadState('networkidle');

        // Check horizontal overflow
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth, `${p.name} at ${vp.name} should not have horizontal overflow`).toBeLessThanOrEqual(clientWidth + 1);

        // Take screenshot at selected key viewports
        if (['390px', '768px', '1440px'].includes(vp.name)) {
          await page.screenshot({
            path: path.join(screenshotsDir, `${p.name}-${vp.name}.png`),
            fullPage: false
          });
        }
      }
    });
  }
});
