# Known Issues & Fixes

A running log of bugs encountered, their root cause, and how they were resolved.

---

## Film Stills upload never actually uploaded anything (fixed 2026-08-18)

**Symptom**
The Admin Upload page's "Film Stills" drop zone let you select multiple images and previewed them in a grid with individual remove buttons — looked fully functional. But no still images ever showed up on a film's detail page, and no stills-related network requests ever fired during upload.

**Root cause**
`stillFiles` (the selected `File[]`) was only ever used to generate local `URL.createObjectURL()` previews. `handleSubmit` never looped over it, never requested a presigned URL for any still, and never included a `stills` field in the `POST /api/admin/films` body. This was true in **both** `app/admin/(dashboard)/upload/page.tsx` (the real MVP page) and `app/examples/almanac/admin/(dashboard)/upload/page.tsx` (the prototype) — not something introduced during the almanac restyle, a pre-existing gap that predates it.

**Fix**
Found while porting the admin pages (2026-08-18, same pass as the film-detail schema extension that added the `stills` column). `handleSubmit` in the real Upload page now loops over `stillFiles`, requests a presigned URL per file (`prefix: "stills"`, same flow already used for the thumbnail), uploads each to S3, collects the resulting CDN URLs, and sends them as `stills: string[]` in the film-creation request.

**What to watch for**
The almanac prototype's Upload page (`app/examples/almanac/`) still has the old preview-only behavior — it was intentionally left alone since prototype pages aren't restyled/fixed in place. Also: the Edit page has no stills management UI at all (can't view, add, or remove an existing film's stills after initial upload) — that's a separate, still-open gap, not fixed here.

---

## PostgreSQL SSL handshake failure on local dev

**Symptom**
Server crashes on startup (or Postman request fails) with:
```
Error: write EPROTO 16175616:error:100000f7:SSL routines:OPENSSL_internal:WRONG_VERSION_NUMBER
```

**When it appeared**
First attempt to connect to local PostgreSQL after the backend server was stood up.

**Root cause**
The `pg` library attempts an SSL handshake by default when a `DATABASE_URL` connection string is provided. Local PostgreSQL instances typically don't have SSL configured, so the handshake fails with a version mismatch error.

**Fix**
`apps/backend/src/db/client.js` — added conditional `ssl` option to the pool config:

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

- `false` locally — no SSL, matches standard local Postgres setup
- `{ rejectUnauthorized: false }` in production — enables SSL for AWS RDS but skips certificate verification, which is required because RDS uses self-signed certificates

**What to watch for**
When deploying to production, ensure `NODE_ENV=production` is set in the environment. Without it, the pool will connect to RDS without SSL, which may be blocked depending on the RDS parameter group configuration.

---

## Orphaned S3 objects on failed DB insertion

**Symptom**
A raw video file exists in S3 under `raw/` (and a MediaConvert job may have already started) but no corresponding record exists in the `films` table. Upload page shows "Failed to save film record."

**Root cause**
The upload flow is: (1) get presigned URL → (2) PUT file to S3 → (3) POST metadata to Express/DB. Steps 2 and 3 are not atomic. If step 3 fails for any reason (DB error, validation error, network issue), the S3 upload from step 2 is not rolled back. The S3 event also fires on step 2 completion, so MediaConvert may begin transcoding even though no DB record will exist.

**Current state**
No automatic cleanup. Orphaned `raw/` and potentially `hls/` objects accumulate silently. No retry or rollback logic exists in the upload flow.

**To do**
Implement one or both of:
- S3 Lifecycle rule to auto-delete objects in `raw/` that have no corresponding `hls/` output after N days
- On failed step 3, issue a `DELETE` request from the frontend to a backend endpoint that removes the orphaned `raw/` key from S3

---

## Film `status` field never updates after MediaConvert completes

**Symptom**
All films in the DB permanently show `status = 'pending'` regardless of whether MediaConvert has finished transcoding.

**Root cause**
The Lambda at `apps/backend/lambda/transcode/index.js` only creates the MediaConvert job — it does not update the DB. There is no mechanism that listens for MediaConvert job completion and writes back to the `films` table. The `published` toggle (Draft/Published) is a separate, unrelated field that controls public visibility only.

**To do**
Add an EventBridge rule that fires when a MediaConvert job reaches `COMPLETE` or `ERROR` status, triggering a second Lambda that updates `films.status` (and optionally `films.hls_manifest_url`) for the corresponding record. Match the film record via the output S3 key, which encodes the original raw filename.

---

## Migration 003 (credits + stills columns) not yet run against any real database

**Symptom**
`app/films/[slug]/page.tsx` requests `cinematography`, `editor`, `sound`, `music`, and `stills` from `GET /api/films/:slug`, and `src/db/films.js` selects those columns — but as of 2026-08-18 the columns don't exist in any deployed database yet, only in the migration file.

**Root cause**
`apps/backend/src/db/migrations/003_add_credits_and_stills_to_films.sql` was added during the film-detail schema-extension work (see `pickupleftoff.md`, 2026-08-18) but `npm run` for the migration runner (`src/db/migrate.js`) was never executed against local dev, Neon, or any other environment this session — only local `tsc`/`node -c` checks were run.

**To do**
Run the migration (`node src/db/migrate.js` from `apps/backend`, with `DATABASE_URL` pointed at the target DB) against local dev before testing the film detail page end-to-end, and against the Neon production database before deploying. Until this runs, `SELECT`s referencing the new columns will fail against a real Postgres instance — local `tsc`/`node -c` checks can't catch this since it's a runtime DB-schema mismatch, not a type or syntax error.

---

## Placeholder / filler content inventory — Almanac (`app/examples/almanac/`)

Not a bug log entry — a running list of every piece of placeholder content still in the almanac prototype, so it's clear what still needs real material. Started 2026-08-17 when real DCPA copy began replacing the generic "b/na field archive" placeholder identity; updated same day once that first content pass landed.

**Status key:** `[ ]` still placeholder · `[~]` partially real · `[x]` real content in place

### Resolved in the 2026-08-17 content pass
- `[x]` Org identity — "b/na field archive" replaced with "Dream Chambers Public Access" everywhere (masthead, About Colophon, Home About Preview, Contact register, Admin Settings default, and the site-wide nav/footer)
- `[x]` About page — Founding, Mission, and Values sections now hold real DCPA text (previously generic solo-artist "Artist Statement"/"Biography" copy)
- `[x]` Catalogue page intro paragraph — now the real Archive description + contact line (previously no intro at all)
- `[x]` Three new pages with real content — Distribution, Submissions, Pricing (previously didn't exist)
- `[x]` Contact page "Archive record" register — Region/Focus/Founded/Submissions/Licensing/Correspondence now reflect real facts (previously factually **contradicted** the org's actual submissions process — said "Closed — staff curated" when submissions are in fact open with published criteria)
- `[x]` Home page hero + About Preview — reworded around the real founding story and mission (previously generic "kept slowly and with care" copy)
- `[x]` Admin Settings defaults — site name/description/contact email now DCPA values
- `[~]` **Selected Press** (About page) — fabricated quotes replaced with explicit `"Insert quote here"` / `"[Publication]"` / `"[Year]"` placeholders per client request, as a reminder to follow up for real press quotes. Still needs real quotes before launch.

### Still placeholder
- `[ ]` **Fixture film catalogue** (`lib/films-data.ts`) — all 8 films are entirely fabricated: titles, directors, cinematographers, editors, sound/music credits (e.g. "James Chen", "Maria Santos", "Archive Artist"), synopses, descriptions, and Unsplash stock photography. There is no real DCPA film data anywhere on the site yet — every film card, table row, and detail page is demo content. This is now the single largest content gap on the site.
- `[ ]` **Film video streams** — every fixture film's `videoUrl` points at the same public Mux test HLS stream (`test-streams.mux.dev`), added only to make the video player functional during development. None of it is real DCPA footage.
- `[ ]` **Hero background images** (`public/images/hero/`, used on the almanac home page) — stock photography of Chicago/Detroit/Minneapolis skylines and generic portraits. Minneapolis is at least regionally correct; Chicago/Detroit are not DCPA-relevant and should probably be swapped or dropped.
- `[ ]` **Collection category taxonomy** (Documentary / Shorts / Installations / 2020–2024, with generic descriptions) — inherited from the original fictional archive concept. Unclear whether this maps to how DCPA actually organizes its catalogue; needs confirmation, not just reworded copy.
- `[ ]` **Admin Dashboard stats & activity** (`admin/(dashboard)/page.tsx`) — Total Films/Views/Watch Time counts, "Recent Films" table rows, and "Recent Activity" log are all hardcoded fake numbers/events (e.g. "1,847 views", "Untitled Film #12"). Real once the admin dashboard is wired to a live backend — tracked separately in `page-inventory.md`.
- `[ ]` **Footer stat line** ("08 records · 182 min total") — static hardcoded text, not computed from the actual fixture data. Worth fixing to compute live, or removing once real film data replaces fixtures.
- `[x]` ~~`dreamchambers.proton.me` contact string~~ — resolved 2026-08-17: confirmed as `dreamchambers@proton.me`, now a real `mailto:` link everywhere it appears (Films intro, Submissions, Pricing, Contact, Admin Settings).

### Stylistic / house-voice copy (lower priority — these are the almanac concept's intentional flavor text, not factual placeholders)
- `[ ]` "Vol. 04 — Moving Image Almanac" / "Vol. 04 — Opening entry" / "indexed 2024" metadata-strip flavor text
- `[ ]` "Section I–VI" numbering and script-font captions ("every entry, in order", "kept slowly and with care", "printed on paper that remembers", etc.)
- `[ ]` The "Colophon" page's Publication Record box (Method: "Slow looking, hand indexing", Binding: "Screen-bound, no backend", etc.) — describes the almanac-as-artifact conceit, not DCPA as an org
- `[ ]` "THE ALMANAC" masthead title itself, and the "Index" landing page's poetic preface copy

These stylistic items are a deliberate design voice, not accidental filler — flagged here only so the option to simplify/de-conceptualize them later is visible, not because they need drafting.
