const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const filmsRoutes = require('./routes/films');
const { requireAuth } = require('./middleware/auth');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/films', filmsRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', requireAuth, adminRoutes);

module.exports = app;
