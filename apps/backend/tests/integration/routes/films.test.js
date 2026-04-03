jest.mock('../../../src/db/films', () => ({
  getPublishedFilms: jest.fn(),
  getFilmById: jest.fn(),
}));

jest.mock('../../../src/lib/cloudfront', () => ({
  signUrl: jest.fn().mockReturnValue('https://test.cloudfront.net/hls/film.m3u8?sig=mocked'),
}));

const request = require('supertest');
const app = require('../../../src/app');
const { getPublishedFilms, getFilmById } = require('../../../src/db/films');

// Full film object as it comes out of the DB (includes hls_manifest_url)
const mockFilmFull = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Film',
  year: 2020,
  director: 'Test Director',
  description: 'A test film about the midwest',
  genre: 'Drama',
  tags: ['midwest', 'documentary'],
  duration_seconds: 5400,
  thumbnail_url: null,
  hls_manifest_url: 'https://test.cloudfront.net/hls/film/film.m3u8',
  created_at: new Date().toISOString(),
};

// Listing shape — no hls_manifest_url, matching what getPublishedFilms returns
const { hls_manifest_url, ...mockFilmListing } = mockFilmFull;

describe('GET /api/films', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns an array of published films', async () => {
    getPublishedFilms.mockResolvedValue([mockFilmListing]);
    const res = await request(app).get('/api/films');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test Film');
  });

  it('does not include hls_manifest_url in the listing', async () => {
    getPublishedFilms.mockResolvedValue([mockFilmListing]);
    const res = await request(app).get('/api/films');

    expect(res.body[0]).not.toHaveProperty('hls_manifest_url');
  });

  it('returns an empty array when no films are published', async () => {
    getPublishedFilms.mockResolvedValue([]);
    const res = await request(app).get('/api/films');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/films/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns film metadata with a signed HLS URL', async () => {
    getFilmById.mockResolvedValue(mockFilmFull);
    const res = await request(app).get(`/api/films/${mockFilmFull.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('hls_url');
    expect(res.body.hls_url).toBe('https://test.cloudfront.net/hls/film.m3u8?sig=mocked');
  });

  it('does not expose the raw hls_manifest_url', async () => {
    getFilmById.mockResolvedValue(mockFilmFull);
    const res = await request(app).get(`/api/films/${mockFilmFull.id}`);

    expect(res.body).not.toHaveProperty('hls_manifest_url');
  });

  it('returns 404 when the film does not exist or is unpublished', async () => {
    getFilmById.mockResolvedValue(null);
    const res = await request(app).get('/api/films/nonexistent-id');

    expect(res.status).toBe(404);
  });
});
