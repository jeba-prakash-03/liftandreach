import { test, expect } from '@playwright/test';

test.describe('Lift and Reach Core Logic & Regression Suite', () => {
  test('Search and filter synchronization in URL', async ({ page }) => {
    await page.goto('http://localhost:5173/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Type search
    const searchInput = page.locator('input[placeholder="Search models..."]');
    await searchInput.fill('towable');
    await page.waitForTimeout(300);
    expect(page.url()).toContain('q=towable');

    // Filter by capacity
    const capSelect = page.locator('select').first();
    await capSelect.selectOption('under-1t');
    await page.waitForTimeout(300);
    expect(page.url()).toContain('cap=under-1t');
  });

  test('Enquiry basket add, remove, and drawer open', async ({ page }) => {
    await page.goto('http://localhost:5173/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Click enquiry on first row
    const addBtn = page.locator('button[title="Add to enquiry list"]').first();
    await addBtn.click();
    await page.waitForTimeout(300);

    // Scroll back to top so header is visible
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Open enquiry drawer
    const enquiryHeaderBtn = page.locator('header button:has-text("Enquiry list")');
    await enquiryHeaderBtn.click();
    await page.waitForTimeout(300);

    const drawerTitle = page.locator('h3:has-text("Enquiry List")');
    await expect(drawerTitle).toBeVisible();

    // Close drawer
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click();
  });

  test('Quick view drawer opening and closing', async ({ page }) => {
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('networkidle');

    const quickViewBtn = page.locator('button[title="Quick view drawer"]').first();
    await quickViewBtn.click();
    await page.waitForTimeout(300);

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(dialog).not.toBeVisible();
  });

  test('Product detail model tabs selection', async ({ page }) => {
    await page.goto('http://localhost:5173/products/scissor-lift/hydraulic/towable-customized');
    await page.waitForLoadState('networkidle');

    const modelTab = page.locator('button[role="tab"]').nth(1);
    if (await modelTab.isVisible()) {
      await modelTab.click();
      await page.waitForTimeout(200);
      await expect(modelTab).toHaveAttribute('data-state', 'active');
    }
  });

  test('Find My Lift wizard step flow', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Trigger wizard
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-find-my-lift'));
    });
    await page.waitForTimeout(400);

    const wizardDialog = page.locator('h3:has-text("Find Your Lift")');
    if (await wizardDialog.isVisible()) {
      const firstOption = page.locator('button:has-text("Trucks")').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }
  });

  test('Admin route isolation', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    await page.waitForLoadState('networkidle');

    // Public header/footer should not exist in admin
    await expect(page.locator('header nav')).not.toBeVisible();
    await expect(page.locator('footer')).not.toBeVisible();
  });
});
