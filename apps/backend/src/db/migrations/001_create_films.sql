CREATE TABLE films (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  year             SMALLINT,
  director         TEXT,
  description      TEXT,
  genre            TEXT,
  tags             TEXT[],
  duration_seconds INTEGER,
  raw_s3_key       TEXT,
  hls_manifest_url TEXT,
  thumbnail_url    TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  view_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
