require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getAllFilms, getPublishedFilms } = require('../src/db/films');
const { pool } = require('../src/db/client');

async function verify() {
  console.log('Connecting to database...\n');

  try {
    const all = await getAllFilms();
    console.log(`All films in DB (${all.length} total):`);
    if (all.length === 0) {
      console.log('  (none)');
    } else {
      all.forEach(f => {
        const status = f.published ? 'PUBLISHED' : 'draft   ';
        console.log(`  [${status}] ${f.id} — "${f.title}" (${f.year ?? 'no year'})`);
      });
    }

    const published = await getPublishedFilms();
    console.log(`\nPublicly visible on GET /api/films: ${published.length} film(s)`);
  } catch (err) {
    console.error('\nDatabase error:', err.message);
    console.error('Make sure DATABASE_URL is set and the migration has been run.');
    console.error('  npm run migrate --workspace=backend');
  } finally {
    await pool.end();
  }
}

verify();
