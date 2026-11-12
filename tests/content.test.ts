import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Public Content & Mascots Endpoints', () => {
  it('GET /api/health returns healthy system status', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
    expect(res.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/projects returns seeded project list', async () => {
    const res = await request(app)
      .get('/api/projects')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const first = res.body[0];
    expect(first.title).toBeDefined();
    expect(first.slug).toBeDefined();
    expect(Array.isArray(first.techStack)).toBe(true);
  });

  it('GET /api/skills returns skills grouped/ordered', async () => {
    const res = await request(app)
      .get('/api/skills')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBeDefined();
  });

  it('GET /api/achievements returns achievements', async () => {
    const res = await request(app)
      .get('/api/achievements')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
  });

  it('GET /api/experiments returns experiments', async () => {
    const res = await request(app)
      .get('/api/experiments')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].status).toBeDefined();
  });

  it('GET /api/currently returns current learning, building, listening status', async () => {
    const res = await request(app)
      .get('/api/currently')
      .expect(200);

    expect(res.body.learning).toBeDefined();
    expect(res.body.building).toBeDefined();
    expect(res.body.listeningTo).toBeDefined();
  });

  it('GET /api/numi/lines returns random witty line for section', async () => {
    const res = await request(app)
      .get('/api/numi/lines?section=hero')
      .expect(200);

    expect(res.body.line).toBeDefined();
    expect(res.body.section).toBe('hero');
  });

  it('POST /api/events logs privacy-friendly analytics event', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        type: 'page_view',
        path: '/projects',
      })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('GET /api/cv downloads PDF document and logs download event', async () => {
    const res = await request(app)
      .get('/api/cv')
      .expect(200);

    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('attachment');
  });
});
