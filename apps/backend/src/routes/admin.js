const { Router } = require('express');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../lib/s3');
const { pool } = require('../db/client');
const { getAllFilms, setPublished } = require('../db/films');

const router = Router();

// POST /api/admin/upload-url
// Body: { filename: string, contentType: string }
// Returns a presigned S3 PUT URL and the resulting S3 key
router.post('/upload-url', async (req, res) => {
  const { filename, contentType } = req.body;

  if (!filename || !contentType) {
    return res.status(400).json({ error: 'filename and contentType are required' });
  }

  const key = `raw/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.json({ url, key });
});

// POST /api/admin/films
// Body: { rawKey, title, year, director, description, genre, tags, duration_seconds }
// Derives the HLS manifest URL from the raw S3 key and saves the film to the DB
router.post('/films', async (req, res) => {
  const { rawKey, title, year, director, description, genre, tags, duration_seconds } = req.body;

  if (!rawKey || !title) {
    return res.status(400).json({ error: 'rawKey and title are required' });
  }

  // Derive HLS manifest path from raw key
  // raw/1743534821234-myfilm.mp4 → hls/1743534821234-myfilm/1743534821234-myfilm.m3u8
  const filename = rawKey.replace('raw/', '').replace(/\.[^/.]+$/, '');
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const hls_manifest_url = cloudfrontDomain
    ? `https://${cloudfrontDomain}/hls/${filename}/${filename}.m3u8`
    : `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION}.amazonaws.com/hls/${filename}/${filename}.m3u8`;

  const { rows } = await pool.query(
    `INSERT INTO films
      (title, year, director, description, genre, tags, duration_seconds, raw_s3_key, hls_manifest_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [title, year, director, description, genre, tags, duration_seconds, rawKey, hls_manifest_url]
  );

  res.status(201).json(rows[0]);
});

// GET /api/admin/films
// Returns all films regardless of published status — admin view only
router.get('/films', async (req, res) => {
  const films = await getAllFilms();
  res.json(films);
});

// PATCH /api/admin/films/:id
// Body: { published: boolean }
// Publishes or unpublishes a film
router.patch('/films/:id', async (req, res) => {
  const { published } = req.body;

  if (typeof published !== 'boolean') {
    return res.status(400).json({ error: 'published must be a boolean' });
  }

  const film = await setPublished(req.params.id, published);

  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  res.json(film);
});

module.exports = router;
