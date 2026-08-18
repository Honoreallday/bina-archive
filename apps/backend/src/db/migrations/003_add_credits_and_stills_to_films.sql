-- Richer credits + stills gallery, needed by the almanac-styled film detail page
ALTER TABLE films
  ADD COLUMN cinematography TEXT,
  ADD COLUMN editor         TEXT,
  ADD COLUMN sound          TEXT,
  ADD COLUMN music          TEXT,
  ADD COLUMN stills         TEXT[];
