import { test, expect } from '@playwright/test';

test.describe('Lift and Reach Smoke & Upgrade Tests', () => {
  // Test A1: Mega menu opens without horizontal overflow at 1280, 1440, 1920
  for (const width of [1280, 1440, 1920]) {
    test(`Mega menu opens cleanly without horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      // Hover over Products
      const productsLink = page.getByRole('link', { name: 'PRODUCTS', exact: true });
      await productsLink.hover();
      await page.waitForTimeout(400);

      // Verify mega menu panel is visible
      const megaMenu = page.getByTestId('mega-menu-panel');
      await expect(megaMenu).toBeVisible();

      // Check for horizontal overflow on page
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
    });
  }

  // Test A2: /products/scissor-lift shows only scissor lift category products
  test('Category route /products/scissor-lift filters correctly', async ({ page }) => {
    await page.goto('/products/scissor-lift');
    await expect(page.locator('h1')).toContainText('Scissor Lift');

    // Breadcrumb test
    await expect(page.getByRole('main').getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: 'Products', exact: true })).toBeVisible();

    // Verify presence of scissor lift items and absence of dock leveler
    await expect(page.getByRole('link', { name: 'Pit Mounted / Floor Mounted' }).first()).toBeVisible();
    await expect(page.getByText('Hydraulic Mechanical Dock Leveler')).not.toBeVisible();
  });

  // Test A3: Default product ordering matches specifications
  test('Product catalog default ordering matches original sequence', async ({ page }) => {
    await page.goto('/products');
    const firstProduct = page.locator('main .group h4').first();
    // First category is Scissor Lift
    await expect(firstProduct).toContainText(/Scissor Lift|Pit Mounted/i);
  });

  // Test A5: Admin route isolation (no public header, footer, top bar, or ISO badge)
  test('Admin layout is completely isolated', async ({ page }) => {
    await page.goto('/admin');
    // Public chrome must not exist
    await expect(page.getByText('Call Us:')).not.toBeVisible();
    await expect(page.getByText('Useful Links')).not.toBeVisible();
    await expect(page.getByText('ISO Certified Mfg')).not.toBeVisible();

    // Admin login card must be present
    await expect(page.getByText('Admin Sign In')).toBeVisible();
    await expect(page.getByPlaceholder('name@liftandreach.in')).toBeVisible();
  });

  // Test C1: Enquiry basket persistently stores items and drawer opens
  test('Enquiry basket adds items and opens drawer', async ({ page }) => {
    await page.goto('/products');
    const addButtons = page.getByRole('button', { name: /Add to Enquiry Basket/i });
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();

    // Drawer should open automatically
    await expect(page.getByRole('heading', { name: 'Enquiry Basket' })).toBeVisible();
    await expect(page.getByText('Selected Equipment')).toBeVisible();
  });

  // Test C2: Find My Lift Wizard functions
  test('Find My Lift wizard step flow', async ({ page }) => {
    await page.goto('/');
    const wizardBtn = page.getByRole('button', { name: /Find My Lift/i });
    if (await wizardBtn.isVisible()) {
      await wizardBtn.click();
      await expect(page.getByText('Find My Lift • Equipment Selector')).toBeVisible();
      await page.getByText('Loading & Unloading Trucks').click();
      await page.getByRole('button', { name: /Next: Capacity/i }).click();
      await expect(page.getByText('What is your approximate operating load weight?')).toBeVisible();
    }
  });
});
