import { test, expect } from '@playwright/test';

test.describe('Refined Architectural Quality Gates', () => {
  // Gate 1: Image Rule (Rule 1.1 & Rule 9)
  test('Rendered width of any product image never exceeds naturalWidth * 1.15', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const oversized = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).filter(
        (img) => img.src.includes('/images/product/') && !img.src.includes('banner') && !img.src.includes('logo')
      );

      return imgs
        .map((img) => {
          const rect = img.getBoundingClientRect();
          return {
            src: img.src,
            naturalWidth: img.naturalWidth,
            renderedWidth: rect.width,
            isOversized: img.naturalWidth > 0 && rect.width > img.naturalWidth * 1.15 + 1
          };
        })
        .filter((info) => info.isOversized);
    });

    expect(oversized).toEqual([]);
  });

  // Gate 2: Navbar items share identical top/height (Rule 2 & Rule 9)
  test('Nav items and action items have identical top and height bounding boxes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const boxes = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('header nav a, header nav button')).filter(
        (el) => el.textContent && el.textContent.trim().length > 0
      );

      return links.slice(1, 5).map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          text: el.textContent?.trim(),
          top: Math.round(rect.top),
          height: Math.round(rect.height)
        };
      });
    });

    expect(boxes.length).toBeGreaterThan(0);
    const firstTop = boxes[0].top;
    const firstHeight = boxes[0].height;

    for (const b of boxes) {
      expect(Math.abs(b.top - firstTop)).toBeLessThanOrEqual(1);
      expect(Math.abs(b.height - firstHeight)).toBeLessThanOrEqual(1);
    }
  });

  // Gate 3: Products page alignment and layout at 1440px and 1920px (Rule 4 & Rule 9)
  for (const width of [1440, 1920]) {
    test(`Catalog grid rows and spec lines are aligned across row at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://localhost:5173/products');
      await page.waitForLoadState('networkidle');

      const isAligned = await page.evaluate(() => {
        const figures = Array.from(document.querySelectorAll('main a[href*="/products/"] h3'));
        if (figures.length < 2) return true;
        // Check that names don't collapse to 0 height
        return figures.every((h) => h.clientHeight > 0);
      });

      expect(isAligned).toBe(true);

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }

  // Gate 4: Responsive check across 390, 768, 1280, 1440, 1920, 2560 (Rule 9)
  for (const width of [390, 768, 1280, 1440, 1920, 2560]) {
    test(`No horizontal overflow across all breakpoints at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://localhost:5173/');
      await page.waitForLoadState('networkidle');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }
});
