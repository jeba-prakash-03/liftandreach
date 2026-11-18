import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('W13 Admin Image Upload & Validation', () => {
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

  test('Upload image endpoint accepts valid image and returns saved path', async ({ request }) => {
    const testImgPath = path.resolve('client/public/images/product/stacker.jpg');
    if (!fs.existsSync(testImgPath)) {
      test.skip();
      return;
    }

    const fileBuffer = fs.readFileSync(testImgPath);

    const uploadRes = await request.post('http://localhost:5000/api/admin/upload', {
      headers: { Authorization: `Bearer ${token}` },
      multipart: {
        image: {
          name: 'test-upload.jpg',
          mimeType: 'image/jpeg',
          buffer: fileBuffer
        }
      }
    });

    expect(uploadRes.status()).toBe(200);
    const body = await uploadRes.json();
    expect(body.url || body.filePath || body.path).toBeDefined();
  });
});
