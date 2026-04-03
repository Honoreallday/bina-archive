jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://test-bucket.s3.amazonaws.com/raw/film.mp4?presigned'),
}));

jest.mock('../../../src/lib/s3', () => ({
  s3: {},
}));

jest.mock('../../../src/db/client', () => ({
  pool: { query: jest.fn() },
}));

const request = require('supertest');
const app = require('../../../src/app');
const { authHeader } = require('../../helpers/auth');
const { pool } = require('../../../src/db/client');

describe('POST /api/admin/upload-url', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/admin/upload-url')
      .send({ filename: 'film.mp4', contentType: 'video/mp4' });

    expect(res.status).toBe(401);
  });

  it('returns a presigned S3 URL with a valid token', async () => {
    const res = await request(app)
      .post('/api/admin/upload-url')
      .set('Authorization', authHeader())
      .send({ filename: 'film.mp4', contentType: 'video/mp4' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body).toHaveProperty('key');
    expect(res.body.key).toMatch(/^raw\//);
  });

  it('returns 400 when filename is missing', async () => {
    const res = await request(app)
      .post('/api/admin/upload-url')
      .set('Authorization', authHeader())
      .send({ contentType: 'video/mp4' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when contentType is missing', async () => {
    const res = await request(app)
      .post('/api/admin/upload-url')
      .set('Authorization', authHeader())
      .send({ filename: 'film.mp4' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/admin/films', () => {
  const mockFilmRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Film',
    year: 2024,
    director: 'Test Director',
    description: null,
    genre: null,
    tags: null,
    duration_seconds: null,
    raw_s3_key: 'raw/1234567890-film.mp4',
    hls_manifest_url: 'https://test.cloudfront.net/hls/1234567890-film/1234567890-film.m3u8',
    status: 'pending',
    published: false,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/admin/films')
      .send({ rawKey: 'raw/film.mp4', title: 'Test Film' });

    expect(res.status).toBe(401);
  });

  it('creates a film record and returns 201', async () => {
    pool.query.mockResolvedValue({ rows: [mockFilmRow] });

    const res = await request(app)
      .post('/api/admin/films')
      .set('Authorization', authHeader())
      .send({ rawKey: 'raw/1234567890-film.mp4', title: 'Test Film', year: 2024, director: 'Test Director' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Film');
    expect(res.body).toHaveProperty('id');
  });

  it('returns 400 when rawKey is missing', async () => {
    const res = await request(app)
      .post('/api/admin/films')
      .set('Authorization', authHeader())
      .send({ title: 'Test Film' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/admin/films')
      .set('Authorization', authHeader())
      .send({ rawKey: 'raw/film.mp4' });

    expect(res.status).toBe(400);
  });
});
