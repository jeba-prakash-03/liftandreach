import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

test.describe('W7 Header Stability & Contrast Verification', () => {
  for (const p of PAGES) {
    test(`Header fixed pill and logo stability on ${p.name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`http://localhost:5173${p.path}`);
      await page.waitForTimeout(500);

      const headerState = await page.evaluate(() => {
        const header = document.querySelector('header, .v4-header-pill, [data-v4-header]');
        const logo = document.querySelector('header a[href="/"], .header__logo');
        if (!header || !logo) return { error: 'Header or logo not found' };

        const hRect = header.getBoundingClientRect();
        const lRect = logo.getBoundingClientRect();

        return {
          hRect,
          logoLeft: Math.round(lRect.left),
          isFixed: window.getComputedStyle(header).position === 'fixed' ||
                   window.getComputedStyle(header.parentElement!).position === 'fixed'
        };
      });

      expect(headerState.error).toBeUndefined();
      expect(headerState.isFixed).toBeTruthy();

      // Scroll 400px down and verify header does not vanish
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(300);

      const scrolledState = await page.evaluate(() => {
        const header = document.querySelector('header, .v4-header-pill, [data-v4-header]');
        const logo = document.querySelector('header a[href="/"], .header__logo');
        if (!header || !logo) return null;

        const hRect = header.getBoundingClientRect();
        const lRect = logo.getBoundingClientRect();

        return {
          headerVisible: hRect.bottom > 0,
          logoLeft: Math.round(lRect.left)
        };
      });

      expect(scrolledState).not.toBeNull();
      expect(scrolledState!.headerVisible).toBeTruthy();
      // Logo left coordinate invariant
      expect(Math.abs(scrolledState!.logoLeft - headerState.logoLeft)).toBeLessThanOrEqual(2);

      await page.screenshot({ path: `screenshots/w7-header-${p.name.toLowerCase()}.png` });
    });
  }
});
