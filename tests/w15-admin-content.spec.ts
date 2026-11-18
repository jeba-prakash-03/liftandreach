import { test, expect } from '@playwright/test';

test.describe('W15 Admin Site Content Dynamic Sync', () => {
  let token = '';

  test.beforeAll(async ({ request }) => {
    const res = await request.post('http://localhost:5000/api/admin/auth/login', {
      data: {
        email: 'admin@liftandreach.in',
        password: 'Admin@LiftReach2026!'
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    token = body.token;
  });

  test('Page content API retrieves dynamic page records', async ({ request }) => {
    const res = await request.get('http://localhost:5000/api/pages/about');
    expect(res.status()).toBe(200);
    const page = await res.json();
    expect(page.title).toBeDefined();
    expect(page.content).toBeDefined();
  });
});
