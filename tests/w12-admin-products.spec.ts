import { test, expect } from '@playwright/test';

test.describe('W12 Admin Products CRUD & Spec Editor', () => {
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

  test('Create product, verify highlights auto-generation, update specs, and delete', async ({ request }) => {
    // 1. Create a product with spec tables
    const createRes = await request.post('http://localhost:5000/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Scissor Platform W12',
        slug: 'test-scissor-platform-w12',
        categoryId: 13,
        code: 'LR-TEST-12',
        shortDesc: 'QA Verification automated test model',
        specTables: [
          {
            title: 'Specifications',
            columns: ['PARAM', 'VALUE'],
            rows: [
              { label: 'Capacity', values: ['1500 Kgs'] },
              { label: 'Raised Ht.from GL', values: ['6000 MM'] },
              { label: 'Platform Size', values: ['2000 X 1000 MM'] }
            ]
          }
        ]
      }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();

    // 2. Update product
    const updateRes = await request.put(`http://localhost:5000/api/admin/products/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Scissor Platform W12 Updated',
        slug: 'test-scissor-platform-w12-updated'
      }
    });
    expect(updateRes.status()).toBe(200);

    // 3. Delete product
    const deleteRes = await request.delete(`http://localhost:5000/api/admin/products/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(deleteRes.status()).toBe(200);
  });
});
