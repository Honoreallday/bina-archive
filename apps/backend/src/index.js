require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const app = require('./app');
const { testConnection } = require('./db/client');

const PORT = process.env.PORT || 4000;

async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start();
