const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  const client = await pool.connect();
  console.log('PostgreSQL connected');
  client.release();
}

module.exports = { pool, testConnection };
