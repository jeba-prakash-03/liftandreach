import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 }
];

test.describe('W3 Home Carousel Image/Text Overlap & Flow', () => {
  for (const vp of VIEWPORTS) {
    test(`Category cards structure and separation @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('http://localhost:5173/');
      await page.waitForTimeout(600);

      const results = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.cat-card, [data-category-card]'));
        if (cards.length === 0) return { error: 'No category cards found' };

        const cardDetails = cards.map((c, i) => {
          const img = c.querySelector('img');
          const info = c.querySelector('.cat-card__info, [data-card-info]');
          const chips = c.querySelector('.cat-card__chips, [data-card-chips]');

          if (!img || !info) {
            return { index: i, hasRequiredElements: false };
          }

          const imgRect = img.getBoundingClientRect();
          const infoRect = info.getBoundingClientRect();

          // Image should not overlap info panel
          const isImageAboveInfo = imgRect.bottom <= infoRect.top + 2;

          let isImageBelowChips = true;
          if (chips) {
            const chipRect = chips.getBoundingClientRect();
            isImageBelowChips = imgRect.top >= chipRect.bottom - 2;
          }

          return {
            index: i,
            hasRequiredElements: true,
            isImageAboveInfo,
            isImageBelowChips,
            imgBottom: imgRect.bottom,
            infoTop: infoRect.top
          };
        });

        return { cards: cardDetails };
      });

      expect(results.error).toBeUndefined();
      expect(results.cards?.length).toBeGreaterThanOrEqual(5);

      for (const c of results.cards!) {
        expect(c.hasRequiredElements).toBeTruthy();
        expect(c.isImageAboveInfo).toBeTruthy();
      }

      await page.screenshot({ path: `screenshots/w3-carousel-${vp.name}.png` });
    });
  }
});
