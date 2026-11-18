import { test, expect } from '@playwright/test';

test.describe('Part 1 - Data Correctness and Count Consistency', () => {
  const EXPECTED_ADDRESS = 'No.419/9-1, Pillaiyar Koil Street, Kuthambakkam, Chennai - 600124, Tamil Nadu';
  const EXPECTED_PHONE1 = '(+91) 89393 59592';
  const EXPECTED_PHONE2 = '(+91) 97893 97504';
  const EXPECTED_EMAIL = 'liftnreach@gmail.com';
  const EXPECTED_TOTAL_PRODUCTS = 27;

  test('Footer displays verbatim contact details and single-source values', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    await expect(footer).toContainText(EXPECTED_ADDRESS);
    await expect(footer).toContainText(EXPECTED_PHONE1);
    await expect(footer).toContainText(EXPECTED_PHONE2);
    await expect(footer).toContainText(EXPECTED_EMAIL);
    await expect(footer).toContainText("Lift and Reach Equipments is Hydraulic equipment Manufacturing Company, located in Sriperumpudur, Chennai, in the state of Tamil Nadu registered under the laws of 'The Republic of India'.");
  });

  test('Contact Page displays authentic contact details', async ({ page }) => {
    await page.goto('http://localhost:5173/contact');
    await page.waitForLoadState('networkidle');

    const content = await page.content();
    expect(content).toContain(EXPECTED_ADDRESS);
    expect(content).toContain(EXPECTED_PHONE1);
    expect(content).toContain(EXPECTED_PHONE2);
    expect(content).toContain(EXPECTED_EMAIL);
  });

  test('Category counts and nav badge equality', async ({ page }) => {
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('networkidle');

    // Check navbar model badge
    const headerPill = page.locator('header span.font-mono').first();
    await expect(headerPill).toHaveText(String(EXPECTED_TOTAL_PRODUCTS));

    // Check "All Equipment" in sidebar
    const allEquipCount = page.locator('aside a[href="/products"] span.font-mono');
    await expect(allEquipCount).toHaveText(String(EXPECTED_TOTAL_PRODUCTS));
  });

  test('No grep hits for invented contact numbers and phrases on live pages', async ({ page }) => {
    const pagesToCheck = ['/', '/about', '/products', '/contact'];
    const forbiddenPhrases = [
      '98400 49052',
      '98402 77052',
      'Mugalivakkam',
      'Porur, Chennai - 600125',
      'sales@liftandreach',
      'since 2000',
      'Factory hours',
      'Factory direct inquiries'
    ];

    for (const p of pagesToCheck) {
      await page.goto(`http://localhost:5173${p}`);
      await page.waitForLoadState('networkidle');
      const bodyText = await page.innerText('body');
      for (const phrase of forbiddenPhrases) {
        expect(bodyText, `Page ${p} should not contain "${phrase}"`).not.toContain(phrase);
      }
    }
  });
});
