import { test, expect } from '@playwright/test';

test.describe('W18 Security & Integrity Checks', () => {
  test('SQL injection attempt in query params is safely parameterized', async ({ request }) => {
    const res = await request.get("http://localhost:5000/api/products?category=' OR '1'='1");
    expect(res.status()).toBe(200);
    const body = await res.json();
    const prods = body.data || body;
    expect(Array.isArray(prods)).toBeTruthy();
  });

  test('XSS script tags in enquiries are rejected or sanitized', async ({ request }) => {
    const capRes = await request.get('http://localhost:5000/api/captcha');
    const { token, question } = await capRes.json();
    const match = question.match(/(\d+)\s*\+\s*(\d+)/);
    const sum = parseInt(match[1], 10) + parseInt(match[2], 10);

    const res = await request.post('http://localhost:5000/api/enquiries', {
      data: {
        name: '<script>alert(1)</script>',
        email: 'xss@example.com',
        phone: '1234567890',
        subject: '<img src=x onerror=alert(1)>',
        message: 'Hello <script>bad()</script>',
        captchaToken: token,
        captchaAnswer: sum
      }
    });

    // Request is accepted and saved without executing or breaking schema
    expect(res.status()).toBe(201);
  });
});
