import { test, expect } from '@playwright/test';

test.describe('W6 Category Counts Verification', () => {
  test('Scissor Lift displays 12 products and active top-level sum equals active product count', async ({ page }) => {
    await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const counts = await page.evaluate(() => {
      // Find category sidebar buttons
      const buttons = Array.from(document.querySelectorAll('aside button'));
      const categoryCounts: { name: string; count: number }[] = [];

      for (const btn of buttons) {
        const text = btn.textContent || '';
        const match = text.match(/(.+?)(\d+)$/);
        if (match) {
          categoryCounts.push({
            name: match[1].trim(),
            count: parseInt(match[2], 10)
          });
        }
      }

      const allItem = categoryCounts.find((c) => c.name.toLowerCase().includes('all equipment'));
      const totalAll = allItem ? allItem.count : null;

      return { categoryCounts, totalAll };
    });

    // Check Scissor Lift count = 12
    const scissor = counts.categoryCounts.find((c) => c.name.toLowerCase().includes('scissor lift'));
    expect(scissor).toBeDefined();
    expect(scissor!.count).toBe(12);

    // Check All Equipment count = 27
    expect(counts.totalAll).toBe(27);

    // Check sum of top categories (12 + 2 + 4 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 = 27)
    const topCats = counts.categoryCounts.filter((c) => !c.name.toLowerCase().includes('all equipment'));
    const sum = topCats.reduce((acc, c) => acc + c.count, 0);
    expect(sum).toBe(27);
  });
});
