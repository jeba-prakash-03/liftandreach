import { test, expect } from '@playwright/test';

test.describe('W5 Spec Formatter & Highlights Verification', () => {
  test('API returns clean highlights and zero internal note leaks', async ({ request }) => {
    const res = await request.get('http://localhost:5000/api/products');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    const products = data.data || data;

    expect(products.length).toBeGreaterThanOrEqual(25);

    for (const p of products) {
      // 1. Verify highlights array is present
      expect(p.highlights).toBeDefined();
      expect(Array.isArray(p.highlights)).toBeTruthy();

      // 2. Check no leak of "(Note:" in highlights
      for (const h of p.highlights) {
        expect(h.label).toBeDefined();
        expect(h.value).toBeDefined();
        expect(h.value).not.toContain('(Note:');
      }

      // 3. Check specTables has no raw leaks of "(Note:"
      if (p.specTables) {
        const specStr = JSON.stringify(p.specTables);
        expect(specStr).not.toContain('(Note:');
      }
    }
  });
});
