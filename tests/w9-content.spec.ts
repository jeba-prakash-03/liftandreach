import { test, expect } from '@playwright/test';

const BANNED_COPY_PATTERNS = [
  /factory hours/i,
  /mon-sat 9:00/i,
  /sunday: closed/i,
  /since 2000/i,
  /engineered for safety, stability and industrial durability/i,
  /factory direct inquiries/i,
  /industrial engineering catalog/i
];

const PAGES_TO_CHECK = [
  '/',
  '/about',
  '/products',
  '/contact'
];

test.describe('W9 Site Content Purity & Banned Copy Check', () => {
  for (const p of PAGES_TO_CHECK) {
    test(`Zero banned copy on ${p}`, async ({ page }) => {
      await page.goto(`http://localhost:5173${p}`);
      await page.waitForTimeout(500);

      const bodyText = await page.evaluate(() => document.body.innerText);

      for (const pattern of BANNED_COPY_PATTERNS) {
        expect(bodyText).not.toMatch(pattern);
      }
    });
  }
});
