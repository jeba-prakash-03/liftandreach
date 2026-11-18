import { test, expect } from '@playwright/test';

test.describe('W16 Admin Settings Single Source of Truth', () => {
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

  test('Public settings endpoint returns original business details', async ({ request }) => {
    const res = await request.get('http://localhost:5000/api/settings');
    expect(res.status()).toBe(200);
    const settings = await res.json();

    expect(settings.email).toBe('liftnreach@gmail.com');
    expect(settings.address).toContain('No.419/9-1, Pillaiyar Koil Street');
    expect(settings.phone_1).toBe('(+91) 89393 59592');
    expect(settings.phone_2).toBe('(+91) 97893 97504');
    expect(settings.whatsapp).toBe('918939359592');
  });
});
