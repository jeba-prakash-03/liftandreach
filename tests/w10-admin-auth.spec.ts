import { test, expect } from '@playwright/test';

test.describe('W10 Admin Auth Security Verification', () => {
  test('Admin login fails on invalid credentials and succeeds on valid credentials', async ({ request }) => {
    // 1. Invalid login
    const badRes = await request.post('http://localhost:5000/api/admin/auth/login', {
      data: {
        email: 'admin@liftandreach.in',
        password: 'WrongPassword123!'
      }
    });
    expect(badRes.status()).toBe(401);

    // 2. Valid login
    const goodRes = await request.post('http://localhost:5000/api/admin/auth/login', {
      data: {
        email: 'admin@liftandreach.in',
        password: 'Admin@LiftReach2026!'
      }
    });
    expect(goodRes.status()).toBe(200);
    const body = await goodRes.json();
    expect(body.token).toBeDefined();
  });

  test('Protected admin routes reject unauthenticated requests', async ({ request }) => {
    const res = await request.get('http://localhost:5000/api/admin/categories');
    expect(res.status()).toBe(401);
  });
});
