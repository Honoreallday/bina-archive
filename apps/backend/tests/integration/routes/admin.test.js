jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://test-bucket.s3.amazonaws.com/raw/film.mp4?presigned'),
}));

jest.mock('../../../src/lib/s3', () => ({
  s3: { send: jest.fn().mockResolvedValue({}) },
}));

jest.mock('../../../src/db/client', () => ({
  pool: { query: jest.fn() },
}));

jest.mock('../../../src/db/films', () => ({
  getAllFilms: jest.fn(),
  getAdminFilmById: jest.fn(),
  updateFilm: jest.fn(),
}));

jest.mock('../../../src/lib/slug', () => ({
  uniqueSlug: jest.fn().mockResolvedValue('test-film'),
}));

const request = require('supertest');
const app = require('../../../src/app');
const { authHeader } = require('../../helpers/auth');
const { pool } = require('../../../src/db/client');
const { getAllFilms, getAdminFilmById, updateFilm } = require('../../../src/db/films');
const { uniqueSlug } = require('../../../src/lib/slug');

const mockFilmRow = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Film',
  slug: 'test-film',
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

// ---------------------------------------------------------------------------
// POST /api/admin/upload-url
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/admin/films
// ---------------------------------------------------------------------------
describe('POST /api/admin/films', () => {
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

  it('uses the generated slug when creating a film', async () => {
    pool.query.mockResolvedValue({ rows: [mockFilmRow] });

    await request(app)
      .post('/api/admin/films')
      .set('Authorization', authHeader())
      .send({ rawKey: 'raw/film.mp4', title: 'Test Film' });

    expect(uniqueSlug).toHaveBeenCalledWith('Test Film');
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

// ---------------------------------------------------------------------------
// GET /api/admin/films
// ---------------------------------------------------------------------------
describe('GET /api/admin/films', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/admin/films');
    expect(res.status).toBe(401);
  });

  it('returns all films including unpublished', async () => {
    getAllFilms.mockResolvedValue([mockFilmRow]);

    const res = await request(app)
      .get('/api/admin/films')
      .set('Authorization', authHeader());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test Film');
  });

  it('returns an empty array when no films exist', async () => {
    getAllFilms.mockResolvedValue([]);

    const res = await request(app)
      .get('/api/admin/films')
      .set('Authorization', authHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// GET /api/admin/films/:id
// ---------------------------------------------------------------------------
describe('GET /api/admin/films/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get(`/api/admin/films/${mockFilmRow.id}`);
    expect(res.status).toBe(401);
  });

  it('returns the full film record including draft fields', async () => {
    getAdminFilmById.mockResolvedValue(mockFilmRow);

    const res = await request(app)
      .get(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader());

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(mockFilmRow.id);
    expect(res.body).toHaveProperty('raw_s3_key');
    expect(res.body).toHaveProperty('published');
  });

  it('returns 404 when the film does not exist', async () => {
    getAdminFilmById.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/admin/films/nonexistent-id')
      .set('Authorization', authHeader());

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/admin/films/:id
// ---------------------------------------------------------------------------
describe('PATCH /api/admin/films/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .send({ published: true });

    expect(res.status).toBe(401);
  });

  it('publishes a film', async () => {
    updateFilm.mockResolvedValue({ ...mockFilmRow, published: true });

    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ published: true });

    expect(res.status).toBe(200);
    expect(res.body.published).toBe(true);
  });

  it('unpublishes a film', async () => {
    updateFilm.mockResolvedValue({ ...mockFilmRow, published: false });

    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ published: false });

    expect(res.status).toBe(200);
    expect(res.body.published).toBe(false);
  });

  it('updates film metadata fields', async () => {
    const updated = { ...mockFilmRow, title: 'New Title', slug: 'new-title', year: 2025 };
    updateFilm.mockResolvedValue(updated);
    uniqueSlug.mockResolvedValue('new-title');

    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ title: 'New Title', year: 2025 });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
    expect(res.body.slug).toBe('new-title');
  });

  it('regenerates the slug when title changes', async () => {
    updateFilm.mockResolvedValue({ ...mockFilmRow, title: 'New Title', slug: 'new-title' });
    uniqueSlug.mockResolvedValue('new-title');

    await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ title: 'New Title' });

    expect(uniqueSlug).toHaveBeenCalledWith('New Title', mockFilmRow.id);
  });

  it('returns 404 when the film does not exist', async () => {
    updateFilm.mockResolvedValue(null);

    const res = await request(app)
      .patch('/api/admin/films/nonexistent-id')
      .set('Authorization', authHeader())
      .send({ published: true });

    expect(res.status).toBe(404);
  });

  it('returns 400 when published is not a boolean', async () => {
    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ published: 'yes' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when no valid fields are provided', async () => {
    const res = await request(app)
      .patch(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader())
      .send({ unknownField: 'value' });

    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/films/:id
// ---------------------------------------------------------------------------
describe('DELETE /api/admin/films/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).delete(`/api/admin/films/${mockFilmRow.id}`);
    expect(res.status).toBe(401);
  });

  it('deletes the film and returns { deleted: true }', async () => {
    getAdminFilmById.mockResolvedValue(mockFilmRow);
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app)
      .delete(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  it('deletes the DB record before attempting S3 cleanup', async () => {
    getAdminFilmById.mockResolvedValue(mockFilmRow);
    pool.query.mockResolvedValue({ rows: [] });

    await request(app)
      .delete(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader());

    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM films WHERE id = $1',
      [mockFilmRow.id]
    );
  });

  it('returns 404 when the film does not exist', async () => {
    getAdminFilmById.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/admin/films/nonexistent-id')
      .set('Authorization', authHeader());

    expect(res.status).toBe(404);
  });

  it('still returns 200 when there is no S3 key to clean up', async () => {
    getAdminFilmById.mockResolvedValue({ ...mockFilmRow, raw_s3_key: null });
    pool.query.mockResolvedValue({ rows: [] });

    const res = await request(app)
      .delete(`/api/admin/films/${mockFilmRow.id}`)
      .set('Authorization', authHeader());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});
