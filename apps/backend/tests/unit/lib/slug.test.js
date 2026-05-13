jest.mock('../../../src/db/client', () => ({
  pool: { query: jest.fn() },
}));

const { pool } = require('../../../src/db/client');
const { uniqueSlug } = require('../../../src/lib/slug');

beforeEach(() => jest.clearAllMocks());

describe('uniqueSlug', () => {
  it('returns base slug when no conflict exists', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    expect(await uniqueSlug('My Test Film')).toBe('my-test-film');
  });

  it('appends -2 when the base slug is taken', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [] });
    expect(await uniqueSlug('My Test Film')).toBe('my-test-film-2');
  });

  it('increments suffix until a free slug is found', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })
      .mockResolvedValueOnce({ rows: [] });
    expect(await uniqueSlug('My Test Film')).toBe('my-test-film-3');
  });

  it('passes excludeId in the query when editing', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await uniqueSlug('My Test Film', 42);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('id != $2'),
      ['my-test-film', 42]
    );
  });

  it('strips special characters and lowercases', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    expect(await uniqueSlug('My Film: A Story!')).toBe('my-film-a-story');
  });

  it('collapses multiple spaces and hyphens', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    expect(await uniqueSlug('  My   Film  ')).toBe('my-film');
  });
});
