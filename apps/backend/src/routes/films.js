const { Router } = require('express');
const { getPublishedFilms, getFilmById } = require('../db/films');
const { signUrl } = require('../lib/cloudfront');

const router = Router();

// GET /api/films
// Returns all published films — no video URL, metadata only
router.get('/', async (req, res) => {
  const films = await getPublishedFilms();
  res.json(films);
});

// GET /api/films/:id
// Returns a single film's metadata + a fresh signed CloudFront HLS URL
router.get('/:id', async (req, res) => {
  const film = await getFilmById(req.params.id);

  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  const { hls_manifest_url, ...metadata } = film;
  const signedUrl = signUrl(hls_manifest_url);

  res.json({ ...metadata, hls_url: signedUrl });
});

module.exports = router;
