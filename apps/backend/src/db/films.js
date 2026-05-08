const { pool } = require('./client');

async function getPublishedFilms() {
  const { rows } = await pool.query(
    `SELECT id, title, year, director, description, genre, tags, duration_seconds, thumbnail_url, created_at
     FROM films
     WHERE published = TRUE
     ORDER BY created_at DESC`
  );
  return rows;
}

async function getFilmById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, year, director, description, genre, tags, duration_seconds, thumbnail_url, hls_manifest_url, created_at
     FROM films
     WHERE id = $1 AND published = TRUE`,
    [id]
  );
  return rows[0] ?? null;
}

async function getAllFilms() {
  const { rows } = await pool.query(
    `SELECT id, title, year, director, status, published, created_at
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

module.exports = { getPublishedFilms, getFilmById, getAllFilms, setPublished };
