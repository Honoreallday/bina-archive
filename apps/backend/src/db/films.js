const { pool } = require('./client');

async function getPublishedFilms() {
  const { rows } = await pool.query(
    `SELECT id, title, slug, year, director, description, genre, tags, duration_seconds, thumbnail_url, created_at
     FROM films
     WHERE published = TRUE
     ORDER BY created_at DESC`
  );
  return rows;
}

async function getFilmById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, slug, year, director, description, genre, tags, duration_seconds, thumbnail_url, hls_manifest_url, created_at
     FROM films
     WHERE id = $1 AND published = TRUE`,
    [id]
  );
  return rows[0] ?? null;
}

async function getFilmBySlug(slug) {
  const { rows } = await pool.query(
    `SELECT id, title, slug, year, director, description, genre, tags, duration_seconds, thumbnail_url, hls_manifest_url, created_at
     FROM films
     WHERE slug = $1 AND published = TRUE`,
    [slug]
  );
  return rows[0] ?? null;
}

async function getAdminFilmById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, slug, year, director, description, genre, tags, duration_seconds,
            thumbnail_url, hls_manifest_url, raw_s3_key, status, published, created_at, updated_at
     FROM films
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// Accepts any subset of updatable fields — only touches what's provided.
async function updateFilm(id, fields) {
  const allowed = ['title', 'slug', 'year', 'director', 'description', 'genre', 'tags', 'duration_seconds', 'published'];
  const setClauses = [];
  const values = [];
  let i = 1;

  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = $${i++}`);
      values.push(fields[key]);
    }
  }

  if (setClauses.length === 0) return null;

  setClauses.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE films SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0] ?? null;
}

async function getAllFilms() {
  const { rows } = await pool.query(
    `SELECT id, title, slug, year, director, status, published, created_at
     FROM films
     ORDER BY created_at DESC`
  );
  return rows;
}

async function setPublished(id, published) {
  const { rows } = await pool.query(
    `UPDATE films SET published = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [published, id]
  );
  return rows[0] ?? null;
}

module.exports = { getPublishedFilms, getFilmById, getFilmBySlug, getAdminFilmById, getAllFilms, updateFilm, setPublished };
