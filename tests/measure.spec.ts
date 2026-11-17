import { test, expect } from '@playwright/test';

test.describe('Part 9 - Precise Geometry, Typography and Layout Measurements', () => {
  test('Capture and print Part 9 measurement table', async ({ page }) => {
    // Set 1440px desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. HOME PAGE MEASUREMENTS
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const homeHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    // Hero section height
    const heroHeight = await page.evaluate(() => {
      const hero = document.querySelector('section');
      return hero ? hero.getBoundingClientRect().height : 0;
    });

    // Hero H1 font size
    const heroH1FontSize = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? parseFloat(window.getComputedStyle(h1).fontSize) : 0;
    });

    // Home H2 font size
    const homeH2FontSize = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? parseFloat(window.getComputedStyle(h2).fontSize) : 0;
    });

    // Body font family
    const bodyFontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });

    // Heading font family
    const headingFontFamily = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? window.getComputedStyle(h1).fontFamily : '';
    });

    // Section padding check
    const sectionPaddings = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.map(s => {
        const style = window.getComputedStyle(s);
        return {
          pt: parseFloat(style.paddingTop),
          pb: parseFloat(style.paddingBottom)
        };
      });
    });
    const maxSectionPt = Math.max(...sectionPaddings.map(s => s.pt));
    const maxSectionPb = Math.max(...sectionPaddings.map(s => s.pb));

    // Category tile plate width
    const categoryTilePlateWidth = await page.evaluate(() => {
      const plate = document.querySelector('section:nth-of-type(3) a div');
      return plate ? plate.getBoundingClientRect().width : 0;
    });

    // Check for deleted items: scissor drawing, height gauge, forbidden eyebrows
    const forbiddenElementsCount = await page.evaluate(() => {
      const drawings = document.querySelectorAll('[class*="drawing"], svg.lift-drawing');
      const textMatches = Array.from(document.querySelectorAll('*')).filter(el => {
        const t = el.textContent || '';
        return (
          t.includes('ENGINEERING PROVENANCE') ||
          t.includes('01 / CLASSIFICATION') ||
          t === 'OVERVIEW'
        );
      });
      return drawings.length + textMatches.length;
    });

    // 2. PRODUCTS PAGE MEASUREMENTS
    await page.goto('http://localhost:5173/products');
    await page.waitForLoadState('networkidle');

    // Products H1 font size
    const productsH1FontSize = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? parseFloat(window.getComputedStyle(h1).fontSize) : 0;
    });

    // Products List Row min-height & thumbnail width
    const listRowMeasurements = await page.evaluate(() => {
      const row = document.querySelector('main a');
      if (!row) return { height: 0, thumbWidth: 0 };
      const rect = row.getBoundingClientRect();
      const thumb = row.querySelector('img');
      const thumbRect = thumb ? thumb.getBoundingClientRect() : { width: 0 };
      return {
        height: rect.height,
        thumbWidth: thumbRect.width
      };
    });

    // Check model code split artifacts
    const modelCodesWithSplitBugs = await page.evaluate(() => {
      const codeElements = Array.from(document.querySelectorAll('main div.font-mono div'));
      return codeElements.filter(el => {
        const t = (el.textContent || '').trim();
        return t === '9.0' || t === '11.0M' || t === '8.0M' || t === '6.0';
      }).length;
    });

    // Check horizontal overflow across breakpoints
    const breakpoints = [390, 768, 1280, 1440, 1920];
    const overflowResults: Record<number, boolean> = {};

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://localhost:5173/');
      const hasOverflowHome = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      await page.goto('http://localhost:5173/products');
      const hasOverflowProducts = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      overflowResults[width] = hasOverflowHome || hasOverflowProducts;
    }

    // Screenshots
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.screenshot({ path: 'screenshots/home-1440px.png', fullPage: false });
    await page.goto('http://localhost:5173/products');
    await page.screenshot({ path: 'screenshots/products-1440px.png', fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5173/');
    await page.screenshot({ path: 'screenshots/home-390px.png', fullPage: false });
    await page.goto('http://localhost:5173/products');
    await page.screenshot({ path: 'screenshots/products-390px.png', fullPage: false });

    // PRINT FORMATTED TABLE TO LOG
    console.log('\n================== PART 9 MEASUREMENT TABLE ==================');
    console.log(`Body font-family starts with Public Sans: ${bodyFontFamily.startsWith('"Public Sans"') || bodyFontFamily.includes('Public Sans')}`);
    console.log(`Heading font-family starts with Archivo: ${headingFontFamily.startsWith('"Archivo"') || headingFontFamily.includes('Archivo')}`);
    console.log(`Hero H1 font-size: ${heroH1FontSize}px (Target <= 52px)`);
    console.log(`Products Page H1 font-size: ${productsH1FontSize}px (Target <= 36px)`);
    console.log(`Section H2 font-size: ${homeH2FontSize}px (Target <= 28px)`);
    console.log(`Max section padding-top: ${maxSectionPt}px (Target <= 64px)`);
    console.log(`Max section padding-bottom: ${maxSectionPb}px (Target <= 64px)`);
    console.log(`Home page total height: ${homeHeight}px (Target <= 3400px)`);
    console.log(`Hero section height: ${heroHeight}px (Target <= 560px)`);
    console.log(`Products list row height: ${listRowMeasurements.height}px (Target <= 100px)`);
    console.log(`Category tile plate width: ${categoryTilePlateWidth}px (Target <= 300px)`);
    console.log(`Forbidden deleted elements count: ${forbiddenElementsCount} (Target == 0)`);
    console.log(`Model codes with / split artifacts: ${modelCodesWithSplitBugs} (Target == 0)`);
    console.log(`Horizontal overflow (390-1920px): ${JSON.stringify(overflowResults)} (Target all false)`);
    console.log('==============================================================\n');

    // ASSERTIONS
    expect(bodyFontFamily).toContain('Public Sans');
    expect(headingFontFamily).toContain('Archivo');
    expect(heroH1FontSize).toBeLessThanOrEqual(52);
    expect(productsH1FontSize).toBeLessThanOrEqual(36);
    expect(homeH2FontSize).toBeLessThanOrEqual(28);
    expect(maxSectionPt).toBeLessThanOrEqual(64);
    expect(maxSectionPb).toBeLessThanOrEqual(64);
    expect(homeHeight).toBeLessThanOrEqual(3400);
    expect(heroHeight).toBeLessThanOrEqual(560);
    expect(categoryTilePlateWidth).toBeLessThanOrEqual(300);
    expect(forbiddenElementsCount).toBe(0);
    expect(modelCodesWithSplitBugs).toBe(0);
    for (const width of breakpoints) {
      expect(overflowResults[width]).toBe(false);
    }
  });
});
