import { test, expect } from '@playwright/test';

test.describe('W14 Admin Hero Slides Management', () => {
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

  test('Hero slides can be listed and retrieved', async ({ request }) => {
    const res = await request.get('http://localhost:5000/api/admin/hero-slides', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.status()).toBe(200);
    const slides = await res.json();
    expect(Array.isArray(slides)).toBeTruthy();
  });
});
