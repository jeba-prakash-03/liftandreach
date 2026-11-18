import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { name: '360x780', width: 360, height: 780 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 }
];

test.describe('W21 Mobile Full Verification', () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test(`Mobile viewport ${vp.name} has 0 horizontal scroll and responsive layout`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:5173/');
      await page.waitForTimeout(500);

      const scrollInfo = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });

      expect(scrollInfo.hasHorizontalScroll).toBeFalsy();

      await page.screenshot({ path: `screenshots/w21-mobile-${vp.name}.png` });
    });
  }
});
