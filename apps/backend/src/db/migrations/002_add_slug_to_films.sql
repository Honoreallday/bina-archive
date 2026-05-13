-- Add slug column for human-readable public URLs (/films/dissolving-boundaries)
ALTER TABLE films ADD COLUMN slug TEXT;

-- Backfill existing rows: lowercase title, strip non-alphanumeric, replace spaces with hyphens
UPDATE films
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;

-- Fallback: any row with an empty slug gets the id as its slug
UPDATE films SET slug = id::text WHERE slug IS NULL OR slug = '';

ALTER TABLE films ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX films_slug_unique ON films (slug);
