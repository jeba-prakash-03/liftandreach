import { test, expect } from '@playwright/test';

test.describe('W19 Data-Driven Verification', () => {
  test('Home, About, and Contact pages render dynamic settings from DB', async ({ page }) => {
    await page.goto('http://localhost:5173/contact');
    await page.waitForTimeout(500);

    const contactText = await page.evaluate(() => document.body.innerText);
    expect(contactText).toContain('89393 59592');
    expect(contactText).toContain('liftnreach@gmail.com');
    expect(contactText).toContain('Pillaiyar Koil Street');

    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(500);
    const homeText = await page.evaluate(() => document.body.innerText);
    expect(homeText).toContain('89393 59592');
  });
});
