import { test, expect } from '@playwright/test';

const VIEWPORTS = [390, 768, 1024, 1280, 1440, 1920, 2560];

test.describe('Part B & C Verification: Widths, Overflow & Scroll Mechanics', () => {
  for (const width of VIEWPORTS) {
    test(`Width ${width}px: No horizontal scroll and 100% full-bleed`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
        };
      });

      console.log(`Viewport ${width}px: scrollWidth = ${overflow.scrollWidth}, innerWidth = ${overflow.innerWidth}`);
      expect(overflow.hasHorizontalScroll).toBe(false);
    });
  }

  test('Part C Scroll: List scrolling, back navigation position restoration & drawer locks', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Scroll down to 800px
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(400);

    const initialScrollY = await page.evaluate(() => window.scrollY);
    console.log('Scrolled products page to:', initialScrollY);
    expect(initialScrollY).toBeGreaterThan(600);

    // Click into first product detail
    const detailLink = page.locator('a:has-text("View Details")').first();
    await detailLink.click();
    await page.waitForURL(/\/products\//);
    await page.waitForTimeout(600);

    // Detail page sticky gallery check
    const gallery = page.locator('.lg\\:sticky');
    expect(await gallery.count()).toBeGreaterThan(0);

    // Go back and verify scroll position restoration
    await page.goBack();
    await page.waitForTimeout(800);

    const restoredScrollY = await page.evaluate(() => window.scrollY);
    console.log('Restored scrollY after browser Back:', restoredScrollY);
    const delta = Math.abs(restoredScrollY - initialScrollY);
    console.log(`Scroll restoration delta: ${delta}px`);
    expect(delta).toBeLessThanOrEqual(20);
  });

  test('Drawer body overflow lock and restore', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Open enquiry drawer
    const enquiryBtn = page.locator('header button:has-text("Enquiry list")');
    await enquiryBtn.click();
    await page.waitForTimeout(400);

    const drawer = page.locator('h3:has-text("Enquiry List")');
    await expect(drawer).toBeVisible();

    // Close via Esc
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    console.log('Body overflow after closing drawer:', bodyOverflow || 'default (unlocked)');
    expect(bodyOverflow).not.toBe('hidden');
  });
});
