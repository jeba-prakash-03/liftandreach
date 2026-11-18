const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-1024', width: 1024, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-375', width: 375, height: 812 }
  ];

  const consoleErrors = [];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(`[${vp.name}] ${msg.text()}`);
    });

    // 1. Home page hero & categories
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `screenshots/v4-fixed-home-hero-${vp.name}.png` });

    // Scroll to categories section
    await page.evaluate(() => {
      const el = document.getElementById('equipment-categories');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/v4-fixed-home-categories-${vp.name}.png` });

    // 2. Products page
    await page.goto('http://localhost:5173/products');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `screenshots/v4-fixed-products-top-${vp.name}.png` });

    // Scroll 350px down on products page
    await page.evaluate(() => window.scrollTo(0, 350));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/v4-fixed-products-scrolled-${vp.name}.png` });

    // Measure overlap / stacking
    const metrics = await page.evaluate(() => {
      const header = document.querySelector('header');
      const bar = document.querySelector('.results-bar');
      const aside = document.querySelector('aside');
      const main = document.querySelector('main');
      const hRect = header ? header.getBoundingClientRect() : null;
      const bRect = bar ? bar.getBoundingClientRect() : null;
      const aRect = aside ? aside.getBoundingClientRect() : null;
      const mRect = main ? main.getBoundingClientRect() : null;

      // Sidebar overlap check if aside is visible
      let sidebarOverlap = false;
      if (aRect && mRect && aRect.width > 0 && mRect.width > 0) {
        sidebarOverlap = aRect.right > mRect.left;
      }

      return {
        hHeight: hRect ? hRect.height : 0,
        barTop: bRect ? bRect.top : 0,
        gap: (bRect && hRect) ? Math.round(bRect.top - hRect.bottom) : 0,
        sidebarOverlap
      };
    });

    console.log(`[${vp.name}] Products scroll metrics:`, metrics);
    await page.close();
  }

  console.log('Console errors found:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  }
  await browser.close();
})();
