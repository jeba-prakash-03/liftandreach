import { test, expect } from '@playwright/test';

test.describe('W17 Enquiries Anti-Spam & Management', () => {
  test('Submission with incorrect anti-spam fails with 400', async ({ request }) => {
    // 1. Fetch real captcha
    const capRes = await request.get('http://localhost:5000/api/captcha');
    expect(capRes.status()).toBe(200);
    const { token } = await capRes.json();

    const res = await request.post('http://localhost:5000/api/enquiries', {
      data: {
        name: 'Spam Bot',
        email: 'spambot@example.com',
        phone: '1234567890',
        subject: 'Buy cheap items',
        message: 'This is spam',
        captchaToken: token,
        captchaAnswer: 999
      }
    });

    expect(res.status()).toBe(400);
  });

  test('Submission with correct anti-spam succeeds with 201', async ({ request }) => {
    // 1. Fetch real captcha
    const capRes = await request.get('http://localhost:5000/api/captcha');
    expect(capRes.status()).toBe(200);
    const { token, question } = await capRes.json();

    // Parse question "X + Y = ?"
    const match = question.match(/(\d+)\s*\+\s*(\d+)/);
    expect(match).not.toBeNull();
    const sum = parseInt(match[1], 10) + parseInt(match[2], 10);

    const res = await request.post('http://localhost:5000/api/enquiries', {
      data: {
        name: 'Real Customer',
        email: 'customer@example.com',
        phone: '9876543210',
        subject: 'Scissor Lift Inquiry',
        message: 'Requesting quote for 2T scissor lift',
        captchaToken: token,
        captchaAnswer: sum
      }
    });

    expect(res.status()).toBe(201);
  });
});
