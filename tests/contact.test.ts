import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/services/prisma.service.js';

describe('Contact Form API (POST /api/contact)', () => {
  const testEmail = 'tester@example.com';

  beforeEach(async () => {
    // Clean up test contact entries
    await prisma.contactMessage.deleteMany({
      where: { email: testEmail },
    });
  });

  it('successfully submits genuine contact message and saves to database', async () => {
    const payload = {
      name: 'Alice Developer',
      email: testEmail,
      message: 'Hello Anum! I really admire your systems engineering projects.',
      website: '', // empty honeypot
    };

    const res = await request(app)
      .post('/api/contact')
      .send(payload)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Message sent successfully');
    expect(res.body.data.id).toBeDefined();

    // Verify it is actually in the DB
    const stored = await prisma.contactMessage.findUnique({
      where: { id: res.body.data.id },
    });
    expect(stored).not.toBeNull();
    expect(stored?.name).toBe('Alice Developer');
    expect(stored?.read).toBe(false);
  });

  it('triggers honeypot: returns fake success 200 and discards bot submission', async () => {
    const initialCount = await prisma.contactMessage.count({
      where: { email: 'spambot@example.com' },
    });

    const botPayload = {
      name: 'Spam Bot 3000',
      email: 'spambot@example.com',
      message: 'Click this link for free followers and crypto investments!',
      website: 'https://malicious-spam-site.com', // Filled honeypot!
    };

    const res = await request(app)
      .post('/api/contact')
      .send(botPayload)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Message sent successfully');

    // Confirm it was NOT stored in the database
    const postCount = await prisma.contactMessage.count({
      where: { email: 'spambot@example.com' },
    });
    expect(postCount).toBe(initialCount);
  });

  it('rejects invalid submission with 400 validation error', async () => {
    const invalidPayload = {
      name: '',
      email: 'not-an-email',
      message: 'hi', // too short
    };

    const res = await request(app)
      .post('/api/contact')
      .send(invalidPayload)
      .expect(400);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });
});
