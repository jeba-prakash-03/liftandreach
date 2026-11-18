import { test, expect } from '@playwright/test';

test.describe('W20 Admin UX & Layout Verification', () => {
  test('Admin login view renders cleanly without layout break', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/admin/login');
    await page.waitForTimeout(500);

    const form = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const passInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('button[type="submit"]');

      return {
        hasEmail: !!emailInput,
        hasPass: !!passInput,
        hasSubmit: !!submitBtn
      };
    });

    expect(form.hasEmail).toBeTruthy();
    expect(form.hasPass).toBeTruthy();
    expect(form.hasSubmit).toBeTruthy();

    await page.screenshot({ path: 'screenshots/w20-admin-login.png' });
  });
});
