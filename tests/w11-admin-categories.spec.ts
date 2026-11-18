import { test, expect } from '@playwright/test';

test.describe('W11 Admin Categories CRUD & Hierarchy', () => {
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

  test('Create category, fetch hierarchy, toggle active, and delete', async ({ request }) => {
    // 1. Create a test subcategory under Scissor Lift (id 13)
    const createRes = await request.post('http://localhost:5000/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Category W11',
        slug: 'test-category-w11',
        description: 'Test category for W11 automated QA verification',
        parentId: 13,
        sortOrder: 99
      }
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeDefined();

    // 2. Fetch categories list and verify hierarchy
    const listRes = await request.get('http://localhost:5000/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    const found = list.find((c: any) => c.id === created.id);
    expect(found).toBeDefined();
    expect(found.parentId).toBe(13);

    // 3. Toggle / update category
    const updateRes = await request.put(`http://localhost:5000/api/admin/categories/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Test Category W11 Updated',
        slug: 'test-category-w11-updated',
        isActive: false
      }
    });
    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.isActive).toBeFalsy();

    // 4. Delete category
    const deleteRes = await request.delete(`http://localhost:5000/api/admin/categories/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(deleteRes.status()).toBe(200);
  });
});
