const { pool } = require('../db/client');

function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generates a slug that doesn't already exist in the films table.
// If "dissolving-boundaries" is taken it tries "dissolving-boundaries-2", etc.
async function uniqueSlug(title, excludeId = null) {
  const base = toSlug(title);
  let candidate = base;
  let n = 2;

  while (true) {
    const query = excludeId
      ? 'SELECT id FROM films WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM films WHERE slug = $1';
    const params = excludeId ? [candidate, excludeId] : [candidate];
    const { rows } = await pool.query(query, params);
    if (rows.length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}

module.exports = { toSlug, uniqueSlug };
