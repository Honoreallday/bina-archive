# Development Roadmap

Ordered by dependency and proximity to the immediate need (video upload endpoint).

---

## Phase 1 — Backend Foundation

Everything else depends on this.

1. **Express server skeleton** — `apps/backend/src/index.js`: basic server, env loading, CORS, health check route
2. **PostgreSQL connection** — `src/db/client.js`: pool setup, test connection on startup
3. **Films table migration** — schema: `id`, `title`, `year`, `director`, `description`, `genre`, `duration_seconds`, `hls_manifest_url`, `thumbnail_url`, `created_at`

---

## Phase 2 — Upload Endpoint (immediate priority)

4. **AWS SDK setup** — install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`, configure with env vars
5. **Presigned URL endpoint** — `POST /api/admin/upload-url`: generates a presigned S3 PUT URL for a given filename; returns the URL and the final S3 key
6. **MediaConvert trigger** — ✅ Done. Lambda function at `apps/backend/lambda/transcode/index.js` (deployed ZIP: `index.js-MediaConvertTrigger.zip`). Triggered by S3 `raw/` prefix put events; kicks off a MediaConvert job that outputs HLS to `hls/` prefix.
7. **Film metadata endpoint** — `POST /api/admin/films`: saves title, director, description, and the resulting CloudFront HLS URL to the database after transcoding completes

At this point the upload pipeline is functional end-to-end, even without a UI.

---

## Phase 3 — Admin Auth

8. **bcrypt + JWT** — install `bcryptjs` and `jsonwebtoken`; implement `POST /api/admin/login`
9. **Auth middleware** — JWT verification middleware applied to all `/api/admin/*` routes
10. Lock the upload and film endpoints behind this middleware

Auth is placed after the upload endpoint is working so you can develop and test the pipeline without auth friction, then secure it before any UI is built.


---

## Phase 4 — Public API

11. **Film listing** — `GET /api/films`: returns all published films with metadata (no HLS URL — that comes separately)
12. **Single film + signed URL** — `GET /api/films/:id`: returns metadata + a fresh CloudFront signed URL valid for ~2 hours
13. **CloudFront signing** — install `@aws-sdk/cloudfront-signer`; generate signed URLs server-side on every film page request

---

## Phase 5 — Frontend Migration & Public UI

14. **Migrate to Next.js** — replace CRA with a Next.js app in `apps/frontend/`; do this before building any real frontend so you don't migrate half-built pages
15. **Film index page** — grid/list of films from `GET /api/films`
16. **Film detail page** — metadata display + video player; fetches signed HLS URL from `GET /api/films/:id`
17. **HLS player** — integrate Video.js or HLS.js to consume the `.m3u8` signed URL

---

## Phase 6 — Admin CMS UI

18. **Login page** — simple form, stores JWT in memory or httpOnly cookie
19. **Upload page** — form for metadata + file picker; calls presigned URL endpoint, uploads directly to S3, then posts metadata
20. **Film management** — list of uploaded films with remove/unpublish actions
21. **Film deletion** — ⚠️ Not yet implemented. Deleting a film must: (a) remove the DB record, (b) delete the `raw/` object from S3, (c) delete all `hls/` objects for that film from S3. A backend endpoint `DELETE /api/admin/films/:id` is needed that handles all three steps. The admin films UI needs a corresponding delete button. See also: known_issues.md for the orphaned S3 objects issue.

---

## Phase 7 — Feature Completeness

Unscheduled. These are user-facing features that build on the existing foundation and should be prioritised before or alongside infrastructure work.

---

### Thumbnails

**Auto-generation**
MediaConvert supports a frame capture output group — add a second `OutputGroup` of type `FILE_GROUP_SETTINGS` to the Lambda job config that captures a handful of frames (e.g. at 5s, 30s, 60s intervals) as JPEGs into a `thumbnails/{filename}/` S3 prefix. No separate tool needed.

**DB + API**
The `thumbnail_url` column already exists on the `films` table. The EventBridge → completion Lambda (see known_issues.md) should populate it with the CloudFront URL of the primary frame when it updates `status`.

**Public films page**
Display the primary thumbnail on each film row/card. Use Next.js `<Image>` with the existing CloudFront remote pattern already configured in `next.config.js`.

**Hover frame cycling**
Store multiple frame URLs (e.g. as a `TEXT[]` column `thumbnail_urls`, or a separate `film_thumbnails` table). On hover, cycle through them client-side with a `setInterval`. Requires a frontend-only change once the URLs are available in the API response.

---

### Film Filtering & Sorting

**Backend**
Extend `GET /api/films` to accept query parameters: `?genre=`, `?year=`, `?director=`, `?sort=year_asc|year_desc|title_asc|created_desc`. Build the WHERE/ORDER BY clauses dynamically in `src/db/films.js`. Sanitise all inputs — use parameterised queries for filter values, a whitelist for sort fields.

**Frontend**
Add a filter/sort bar above the film list on `/films`. Reasonable filter fields: genre (dropdown of distinct values), year range, director. Reasonable sort options: newest, oldest, title A–Z, title Z–A. Can be client-side if the total film count stays small (<500); move to server-side query params if the archive grows.

---

### Edit Film Metadata

**Backend**
The existing `PATCH /api/admin/films/:id` only handles the `published` boolean. Extend it (or add a separate `PUT /api/admin/films/:id`) to accept and update all metadata fields: `title`, `year`, `director`, `description`, `genre`, `tags`, `duration_seconds`. Requires adding `updated_at = NOW()` on write (column already exists in the schema).

**Frontend**
Add an edit action to each row in `/admin/films`. Either navigate to a dedicated `/admin/films/:id/edit` page (reuses the upload form layout) or open an inline modal/sheet. Pre-populate fields from the existing record.

---

### Film Search

**Backend**
Add `GET /api/films/search?q=` (or extend `GET /api/films?q=`). Use PostgreSQL `ILIKE` across `title`, `director`, `description`, and `tags` for simple fuzzy matching. For more capable search, use `tsvector`/`tsquery` full-text search with a `GIN` index on a generated column combining those fields — this is the recommended path if the archive grows beyond a few dozen films.

**Frontend**
Add a search input to the `/films` page header. Debounce the input (~300ms) and either filter client-side (acceptable for small archives) or hit the search endpoint. Show a "no results" state. Search state should be reflected in the URL (`?q=`) so results are linkable.

---

## Phase 8 — Infrastructure & Hardening

22. **Infrastructure as code** — define S3 buckets, CloudFront distribution, RDS instance, MediaConvert presets in `infrasturcture/` using Terraform or AWS CDK (fix directory typo when setting this up)
23. **Environment separation** — dev/staging/prod env configs
24. **CloudFront signed URL enforcement** — ensure the S3 bucket is not publicly accessible; all access goes through CloudFront
