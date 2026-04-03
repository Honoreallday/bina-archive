const request = require('supertest');
const app = require('../../../src/app');

describe('POST /api/admin/login', () => {
  it('returns a JWT token with the correct password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ password: 'testpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 401 with the wrong password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty('token');
  });

  it('returns 400 when no password is provided', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({});

    expect(res.status).toBe(400);
  });
});
