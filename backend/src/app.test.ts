import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();

describe('AI Hub API', () => {
  it('health check responds ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('lists tools publicly', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('rejects tool creation without auth', async () => {
    const res = await request(app).post('/api/tools').send({ name: 'X' });
    expect(res.status).toBe(401);
  });

  it('allows admin login and tool creation', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@unilever.com', password: 'admin123' });
    expect(login.status).toBe(200);
    const token = login.body.token;
    expect(token).toBeTruthy();

    const create = await request(app)
      .post('/api/tools')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Tool ' + Date.now(),
        shortDescription: 'short',
        fullDescription: 'full',
        url: 'https://example.com/test',
      });
    expect(create.status).toBe(201);
    expect(create.body.slug).toBeTruthy();
  });

  it('rejects invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@unilever.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
