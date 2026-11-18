import { test, expect } from '@playwright/test';

test.describe('V4 UI Verification & Measurements', () => {
  test('Capture screenshots and measure design tokens on Home V4', async ({ page }) => {
    // Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);

    // Save 1440px screenshot
    await page.screenshot({ path: 'screenshots/v4-phase1/home-1440px.png', fullPage: true });

    // Measurements on Desktop
    const measurements = await page.evaluate(() => {
      const hero = document.querySelector('section');
      const heroH1 = document.querySelector('h1');
      const h2s = Array.from(document.querySelectorAll('h2')).map(el => ({
        text: el.textContent?.trim(),
        fontSize: window.getComputedStyle(el).fontSize,
        fontFamily: window.getComputedStyle(el).fontFamily
      }));
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      const h1Style = heroH1 ? window.getComputedStyle(heroH1) : null;
      const bentoCards = Array.from(document.querySelectorAll('.rounded-\\[28px\\]')).map(el => ({
        height: el.getBoundingClientRect().height,
        width: el.getBoundingClientRect().width,
        borderRadius: window.getComputedStyle(el).borderRadius
      }));

      return {
        heroHeight: heroRect ? heroRect.height : 0,
        h1FontSize: h1Style ? h1Style.fontSize : '',
        h1FontFamily: h1Style ? h1Style.fontFamily : '',
        h2s,
        bentoCount: bentoCards.length
      };
    });

    console.log('--- MEASUREMENT RESULTS (1440px) ---');
    console.log(JSON.stringify(measurements, null, 2));

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000);

    // Save 390px screenshot
    await page.screenshot({ path: 'screenshots/v4-phase1/home-390px.png', fullPage: true });
    console.log('Screenshots saved to screenshots/v4-phase1/');
  });
});
