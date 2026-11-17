import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Capture responsive screenshots for documentation', async ({ page }) => {
  const screenshotDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Desktop 1440px - Home & Mega Menu
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-1440-home.png'), fullPage: false });

  const productsLink = page.getByRole('link', { name: 'PRODUCTS', exact: true });
  await productsLink.hover();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-1440-megamenu.png'), fullPage: false });

  // 2. Desktop 1440px - Product Catalog Listing
  await page.goto('http://localhost:5173/products');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-1440-products.png'), fullPage: false });

  // 3. Desktop 1440px - Product Detail with Sticky Panel
  await page.goto('http://localhost:5173/products/scissor-lift/scissor-lift-hydraulic/pit-mounted-floor-mounted');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-1440-product-detail.png'), fullPage: false });

  // 4. Desktop 1440px - Isolated Admin Login
  await page.goto('http://localhost:5173/admin');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'desktop-1440-admin-login.png'), fullPage: false });

  // 5. Mobile 360px - Mobile Home & Navigation
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'mobile-360-home.png'), fullPage: false });

  // 6. Mobile 360px - Product Catalog
  await page.goto('http://localhost:5173/products');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotDir, 'mobile-360-products.png'), fullPage: false });
});
