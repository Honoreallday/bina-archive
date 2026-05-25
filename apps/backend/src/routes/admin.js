const { Router } = require('express');
const {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3 } = require('../lib/s3');
const { pool } = require('../db/client');
const { getAllFilms, getAdminFilmById, updateFilm } = require('../db/films');
const { uniqueSlug } = require('../lib/slug');

const router = Router();

// POST /api/admin/upload-url
// Body: { filename: string, contentType: string, prefix?: string }
// prefix defaults to 'raw' for video files; pass 'thumbnails' for images.
// Returns a presigned S3 PUT URL, the resulting S3 key, and a cdnUrl for non-raw uploads.
router.post('/upload-url', async (req, res) => {
  const { filename, contentType, prefix = 'raw' } = req.body;

  if (!filename || !contentType) {
    return res.status(400).json({ error: 'filename and contentType are required' });
  }

  const key = `${prefix}/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const cdnUrl = cloudfrontDomain ? `https://${cloudfrontDomain}/${key}` : null;

  res.json({ url, key, cdnUrl });
});

// POST /api/admin/films
// Body: { rawKey, title, year, director, description, genre, tags, duration_seconds, thumbnail_url?, published? }
// Derives the HLS manifest URL from the raw S3 key and saves the film to the DB
router.post('/films', async (req, res) => {
  const { rawKey, title, year, director, description, genre, tags, duration_seconds, thumbnail_url, published } = req.body;

  if (!rawKey || !title) {
    return res.status(400).json({ error: 'rawKey and title are required' });
  }

  const filename = rawKey.replace('raw/', '').replace(/\.[^/.]+$/, '');
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
  const hls_manifest_url = cloudfrontDomain
    ? `https://${cloudfrontDomain}/hls/${filename}/${filename}.m3u8`
    : `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.APP_AWS_REGION}.amazonaws.com/hls/${filename}/${filename}.m3u8`;

  const slug = await uniqueSlug(title);

  const { rows } = await pool.query(
    `INSERT INTO films
      (title, slug, year, director, description, genre, tags, duration_seconds, raw_s3_key, hls_manifest_url, thumbnail_url, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [title, slug, year, director, description, genre, tags, duration_seconds, rawKey, hls_manifest_url, thumbnail_url ?? null, published === true]
  );

  res.status(201).json(rows[0]);
});

// GET /api/admin/films
// Returns all films regardless of published status — admin view only
router.get('/films', async (req, res) => {
  const films = await getAllFilms();
  res.json(films);
});

// GET /api/admin/films/:id
// Returns a single film's full record for the edit form — includes drafts
router.get('/films/:id', async (req, res) => {
  const film = await getAdminFilmById(req.params.id);

  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  res.json(film);
});

// PATCH /api/admin/films/:id
// Body: any subset of { title, year, director, description, genre, tags, duration_seconds, published }
// Updates only the fields that are provided. Regenerates slug if title changes.
router.patch('/films/:id', async (req, res) => {
  const { title, year, director, description, genre, tags, duration_seconds, published } = req.body;

  const fields = {};

  if (title !== undefined) {
    fields.title = title;
    fields.slug = await uniqueSlug(title, req.params.id);
  }
  if (year !== undefined)             fields.year = year;
  if (director !== undefined)         fields.director = director;
  if (description !== undefined)      fields.description = description;
  if (genre !== undefined)            fields.genre = genre;
  if (tags !== undefined)             fields.tags = tags;
  if (duration_seconds !== undefined) fields.duration_seconds = duration_seconds;
  if (published !== undefined) {
    if (typeof published !== 'boolean') {
      return res.status(400).json({ error: 'published must be a boolean' });
    }
    fields.published = published;
  }

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided' });
  }

  const film = await updateFilm(req.params.id, fields);

  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  res.json(film);
});

// DELETE /api/admin/films/:id
// Removes the DB record then cleans up S3 (raw file + all HLS objects).
// S3 cleanup is best-effort — DB deletion still succeeds if S3 fails.
router.delete('/films/:id', async (req, res) => {
  const film = await getAdminFilmById(req.params.id);

  if (!film) {
    return res.status(404).json({ error: 'Film not found' });
  }

  // Delete DB record first so the film immediately disappears from public view
  await pool.query('DELETE FROM films WHERE id = $1', [req.params.id]);

  // Best-effort S3 cleanup — log failures but don't error the response
  if (film.raw_s3_key) {
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: film.raw_s3_key,
      }));
    } catch (err) {
      console.error(`S3 raw delete failed (${film.raw_s3_key}):`, err.message);
    }

    try {
      const hlsPrefix = 'hls/' + film.raw_s3_key.replace('raw/', '').replace(/\.[^/.]+$/, '') + '/';
      const listed = await s3.send(new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: hlsPrefix,
      }));

      if (listed.Contents?.length) {
        await s3.send(new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Delete: { Objects: listed.Contents.map(o => ({ Key: o.Key })) },
        }));
      }
    } catch (err) {
      console.error(`S3 HLS delete failed for film ${req.params.id}:`, err.message);
    }
  }

  res.json({ deleted: true });
});

module.exports = router;
