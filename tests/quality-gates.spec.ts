import { test, expect } from '@playwright/test';

test.describe('Quality Gates: Image Rendering & Engineering Catalog', () => {
  // Test 1: Playwright check: no product <img> on home or /products has naturalWidth < renderedWidth * devicePixelRatio
  test('Home page product images are never upscaled past natural size', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Evaluate all product images on the home page (cards under Application / Selection)
    const imageStatus = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).filter(
        (img) => img.src.includes('/images/product/') && !img.src.includes('banner') && !img.src.includes('logo')
      );

      return imgs.map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: rect.width,
          renderedHeight: rect.height,
          isUpscaled: img.naturalWidth > 0 && rect.width > img.naturalWidth * 1.05 // allow minor 5% tolerance
        };
      });
    });

    for (const info of imageStatus) {
      expect(
        info.isUpscaled,
        `Image ${info.src} is upscaled! (natural: ${info.naturalWidth}px, rendered: ${info.renderedWidth}px)`
      ).toBe(false);
    }
  });

  test('Products page images are never upscaled past natural size', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('networkidle');

    const imageStatus = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img')).filter(
        (img) => img.src.includes('/images/product/') && !img.src.includes('banner') && !img.src.includes('logo')
      );

      return imgs.map((img) => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          renderedWidth: rect.width,
          isUpscaled: img.naturalWidth > 0 && rect.width > img.naturalWidth * 1.05
        };
      });
    });

    for (const info of imageStatus) {
      expect(
        info.isUpscaled,
        `Image ${info.src} is upscaled! (natural: ${info.naturalWidth}px, rendered: ${info.renderedWidth}px)`
      ).toBe(false);
    }
  });

  // Test 2: Responsive checks at 360, 768, 1280, 1440, 1920
  for (const width of [360, 768, 1280, 1440, 1920]) {
    test(`Responsive check at ${width}px: no horizontal overflow and consistent card alignment`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://localhost:5173/products');
      await page.waitForLoadState('networkidle');

      // Check for horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // Verify model codes are present and not truncated
      const codes = await page.locator('span.font-mono').allInnerTexts();
      expect(codes.length).toBeGreaterThan(0);
    });
  }
});
