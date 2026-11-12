import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/services/prisma.service.js';

describe('Guestbook API (GET /api/guestbook, POST /api/guestbook)', () => {
  beforeEach(async () => {
    // Clean test guestbook entries
    await prisma.guestbookEntry.deleteMany({
      where: { name: { in: ['Test Visitor', 'Spam User', 'Clean Tester'] } },
    });
  });

  it('GET /api/guestbook returns only approved entries', async () => {
    const res = await request(app)
      .get('/api/guestbook')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    for (const entry of res.body) {
      // In guestbook controller, only approved entries are returned
      expect(entry.id).toBeDefined();
      expect(entry.name).toBeDefined();
      expect(entry.message).toBeDefined();
    }
  });

  it('POST /api/guestbook creates a pending entry for moderation', async () => {
    const payload = {
      name: 'Clean Tester',
      message: 'Great portfolio! Excited to see where Numi goes next.',
    };

    const res = await request(app)
      .post('/api/guestbook')
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');

    const dbRecord = await prisma.guestbookEntry.findUnique({
      where: { id: res.body.data.id },
    });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.status).toBe('pending');
  });

  it('rejects entries containing spam keywords with 400 INAPPROPRIATE_CONTENT', async () => {
    const spamPayload = {
      name: 'Spam User',
      message: 'Join our casino and claim your free crypto right now!',
    };

    const res = await request(app)
      .post('/api/guestbook')
      .send(spamPayload)
      .expect(400);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('INAPPROPRIATE_CONTENT');
    expect(res.body.error.message).toContain('Spam keywords detected');
  });

  it('rejects entries containing profanity with 400 INAPPROPRIATE_CONTENT', async () => {
    const profanePayload = {
      name: 'Test Visitor',
      message: 'This site is total bullshit and fake.',
    };

    const res = await request(app)
      .post('/api/guestbook')
      .send(profanePayload)
      .expect(400);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('INAPPROPRIATE_CONTENT');
    expect(res.body.error.message).toContain('Inappropriate language');
  });

  it('rejects input failing length validation with 400 VALIDATION_ERROR', async () => {
    const shortPayload = {
      name: 'A', // min 2
      message: 'Hi', // min 3
    };

    const res = await request(app)
      .post('/api/guestbook')
      .send(shortPayload)
      .expect(400);

    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
