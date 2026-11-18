import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1920x1080', width: 1920, height: 1080 }
];

test.describe('W1 Hero Strip Verification', () => {
  for (const vp of VIEWPORTS) {
    test(`Hero strip bbox and centering @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const metrics = await page.evaluate(() => {
        const strip = document.querySelector('.hero__strip');
        const hero = document.querySelector('section[data-header-tone="dark"]');
        if (!strip || !hero) return null;

        const sRect = strip.getBoundingClientRect();
        const hRect = hero.getBoundingClientRect();
        const vpW = window.innerWidth;
        const vpH = window.innerHeight;

        const stripCenterX = sRect.left + sRect.width / 2;
        const vpCenterX = vpW / 2;
        const centerOffsetFraction = Math.abs(stripCenterX - vpCenterX) / vpW;

        return {
          left: sRect.left,
          right: sRect.right,
          bottom: sRect.bottom,
          heroBottom: hRect.bottom,
          vpW,
          vpH,
          centerOffsetFraction,
          isBottomClear: sRect.bottom <= hRect.bottom - 32
        };
      });

      expect(metrics).not.toBeNull();
      // 1. left >= 0
      expect(metrics!.left).toBeGreaterThanOrEqual(0);
      // 2. right <= viewport width
      expect(metrics!.right).toBeLessThanOrEqual(metrics!.vpW + 1);
      // 3. horizontal center within 2% of viewport center
      expect(metrics!.centerOffsetFraction).toBeLessThanOrEqual(0.02);
      // 4. strip bottom <= hero bottom - 32px
      expect(metrics!.isBottomClear).toBeTruthy();

      await page.screenshot({ path: `screenshots/w1-hero-${vp.name}.png` });
    });
  }
});
