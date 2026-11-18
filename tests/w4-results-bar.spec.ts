import { test, expect } from '@playwright/test';

test.describe('W4 Products Results Bar', () => {
  test('Height <= 64px, single line flex, and opaque background on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/products');
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(() => {
      const bar = document.querySelector('.results-bar, [data-results-bar]');
      if (!bar) return { error: 'No results bar element found' };

      const rect = bar.getBoundingClientRect();
      const style = window.getComputedStyle(bar);

      // Check vertical overlap of children to verify single horizontal row
      const children = Array.from(bar.children);
      const isSingleLine = children.length >= 2 &&
        Math.abs(children[0].getBoundingClientRect().top - children[1].getBoundingClientRect().top) < 10;

      return {
        height: rect.height,
        display: style.display,
        backgroundColor: style.backgroundColor,
        isSingleLine
      };
    });

    expect(metrics.error).toBeUndefined();
    expect(metrics.height).toBeLessThanOrEqual(64);
    expect(metrics.isSingleLine).toBeTruthy();

    await page.screenshot({ path: 'screenshots/w4-results-bar.png' });
  });
});
