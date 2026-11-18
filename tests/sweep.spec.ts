import { test, expect } from '@playwright/test';

const ROUTES = [
  '/',
  '/about',
  '/products',
  '/products/scissor-lift',
  '/products/scissor-lift/hydraulic/towable-customized',
  '/contact',
  '/non-existent-page-404',
  '/admin/login'
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

test.describe('Part 7 UI Sweep Verification', () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`Sweep ${route} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`http://localhost:5173${route}`);
        await page.waitForTimeout(600);

        // 1. Assert no horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
        });
        expect(overflow, `Horizontal overflow on ${route} at ${vp.name}`).toBeFalsy();

        // 2. Assert zero occurrences of banned copy
        const bodyText = await page.innerText('body');
        const bannedPhrases = [
          'Engineered for safety, stability and industrial durability',
          'Factory direct inquiries',
          'Industrial engineering catalog',
          'Mon-Sat 9:00 AM - 6:30 PM',
          'Sunday: Closed',
          'Rapid Response Guarantee',
          'Technical Consultation Guarantee',
          'Direct Engineering Response',
          'since 2000'
        ];
        for (const phrase of bannedPhrases) {
          expect(bodyText.includes(phrase), `Found banned phrase "${phrase}" on ${route}`).toBeFalsy();
        }

        // 3. For pages with floating widgets (public pages), check widget collision & spacing
        if (!route.startsWith('/admin')) {
          const btt = page.locator('button[aria-label="Back to top"]');
          const wa = page.locator('a[aria-label="Contact us on WhatsApp"]');

          if (await btt.isVisible() && await wa.isVisible()) {
            const bttBox = await btt.boundingBox();
            const waBox = await wa.boundingBox();
            if (bttBox && waBox) {
              // Should not collide
              const collides = !(
                bttBox.x + bttBox.width <= waBox.x ||
                bttBox.x >= waBox.x + waBox.width ||
                bttBox.y + bttBox.height <= waBox.y ||
                bttBox.y >= waBox.y + waBox.height
              );
              expect(collides, 'Back-to-top and WhatsApp buttons collide').toBeFalsy();
              // Back to top must sit above WhatsApp
              expect(bttBox.y + bttBox.height).toBeLessThanOrEqual(waBox.y);
            }
          }
        }

        // 4. On Home hero at 1440x900, check product lineup does not exceed viewport
        if (route === '/' && vp.name === 'desktop') {
          const hero = page.locator('section').first();
          const heroBox = await hero.boundingBox();
          if (heroBox) {
            expect(heroBox.height).toBeLessThanOrEqual(920);
          }
        }

        // 5. Check sticky offset delta on Products page when scrolled
        if (route === '/products' && vp.name === 'desktop') {
          await page.evaluate(() => window.scrollTo(0, 1500));
          await page.waitForTimeout(400);
          const { actualTop, stickyTopVar } = await page.evaluate(() => {
            const el = document.querySelector('aside');
            if (!el) return { actualTop: null, stickyTopVar: null };
            const actualTop = el.getBoundingClientRect().top;
            const stickyTopVar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-top')) || 12;
            return { actualTop, stickyTopVar };
          });
          if (actualTop !== null && stickyTopVar !== null) {
            expect(Math.abs(actualTop - stickyTopVar)).toBeLessThanOrEqual(2);
          }
        }
      });
    }
  }

  test('Capture screenshots across key pages', async ({ page }) => {
    const pagesToCapture = [
      { path: '/', name: 'home' },
      { path: '/products', name: 'products' },
      { path: '/products/scissor-lift/hydraulic/towable-customized', name: 'detail' },
      { path: '/contact', name: 'contact' },
      { path: '/about', name: 'about' }
    ];

    for (const p of pagesToCapture) {
      // Desktop
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`http://localhost:5173${p.path}`);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `screenshots/one-pass/${p.name}-1440.png`, fullPage: false });

      // Mobile
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`http://localhost:5173${p.path}`);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `screenshots/one-pass/${p.name}-390.png`, fullPage: false });
    }
  });
});
