import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { env } from '../src/config/env.js';
import { prisma } from '../src/services/prisma.service.js';

describe('Admin Authentication & Moderation API (/api/admin/*)', () => {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  it('rejects login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: adminEmail, password: 'WrongPassword123!' })
      .expect(401);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('successfully logs in with valid credentials and sets httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin.email).toBe(adminEmail);

    // Verify Set-Cookie header contains admin_token
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('admin_token=');
  });

  it('rejects access to protected admin route without token', async () => {
    const res = await request(app)
      .get('/api/admin/auth/me')
      .expect(401);

    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows access to protected routes with Authorization Bearer header', async () => {
    // 1. Login to retrieve token
    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: adminEmail, password: adminPassword });

    const token = loginRes.body.token;

    // 2. Access /api/admin/auth/me using Bearer header
    const meRes = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meRes.body.admin).toBeDefined();
    expect(meRes.body.admin.email).toBe(adminEmail);
  });

  it('allows admin to view contacts and moderate guestbook entries', async () => {
    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: adminEmail, password: adminPassword });

    const token = loginRes.body.token;

    // Create a temporary guestbook entry
    const entry = await prisma.guestbookEntry.create({
      data: {
        name: 'Mod Test',
        message: 'A note waiting for approval',
        status: 'pending',
      },
    });

    // 1. Admin gets all guestbook entries
    const listRes = await request(app)
      .get('/api/admin/guestbook')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    const found = listRes.body.some((e: any) => e.id === entry.id);
    expect(found).toBe(true);

    // 2. Admin approves entry
    const approveRes = await request(app)
      .patch(`/api/admin/guestbook/${entry.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' })
      .expect(200);

    expect(approveRes.body.status).toBe('approved');
    expect(approveRes.body.approvedAt).toBeDefined();

    // 3. Admin deletes entry
    await request(app)
      .delete(`/api/admin/guestbook/${entry.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // 4. Admin checks stats
    const statsRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statsRes.body.totals).toBeDefined();
    expect(statsRes.body.dailyEvents).toBeDefined();
  });
});
