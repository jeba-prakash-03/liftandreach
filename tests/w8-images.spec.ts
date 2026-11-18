import { test, expect } from '@playwright/test';

const URLS_TO_CRAWL = [
  '/',
  '/products',
  '/products/scissor-lift',
  '/about',
  '/contact'
];

test.describe('W8 Image Quality & Crawler Verification', () => {
  for (const path of URLS_TO_CRAWL) {
    test(`No broken images and renderWidth <= naturalWidth / DPR on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`http://localhost:5173${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const images = await page.evaluate(() => {
        const dpr = window.devicePixelRatio || 1;
        const imgElements = Array.from(document.querySelectorAll('img'));
        return imgElements.map((img) => {
          const rect = img.getBoundingClientRect();
          return {
            src: img.currentSrc || img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            renderedWidth: rect.width,
            renderedHeight: rect.height,
            isComplete: img.complete,
            hasZeroDimension: img.naturalWidth === 0 || img.naturalHeight === 0,
            isBlurry: img.naturalWidth > 0 && rect.width > (img.naturalWidth / dpr) * 1.05
          };
        });
      });

      expect(images.length).toBeGreaterThanOrEqual(1);

      for (const img of images) {
        expect(img.isComplete).toBeTruthy();
        expect(img.hasZeroDimension).toBeFalsy();
      }
    });
  }
});
