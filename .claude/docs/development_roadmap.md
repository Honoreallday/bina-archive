# Development Roadmap

Ordered by dependency and proximity to the immediate need (video upload endpoint) — **except Phase 9, which is the current active priority as of 2026-08-17** despite being numbered last. Phases 1–8 below were written during MVP 1.0 build-out and are kept as history; Phase 9 supersedes Phase 6's "Remaining gaps" and folds them into the restyle work instead of treating them as a separate cleanup pass. See `pickupleftoff.md` for session-by-session narrative.

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

18. ✅ **Login page** — `/admin/login`, JWT stored in sessionStorage
19. ✅ **Upload page** — `/admin/upload`, full presigned S3 upload flow + thumbnail + DB save
20. ✅ **Film management** — `/admin/films`, sortable/filterable table, publish toggle, delete
21. ✅ **Film deletion** — `DELETE /api/admin/films/:id`, removes DB record + S3 raw + HLS objects
22. ✅ **Film edit** — `/admin/films/[id]/edit`, metadata PATCH; "Replace File" and thumbnail upload on edit are UI stubs only (non-functional)

**Remaining gaps in Phase 6:** (superseded by Phase 9 below — these are now being fixed as part of the restyle port rather than as a standalone cleanup pass)
- ⚠️ No `genre` field on upload or edit forms — every film saves with `null` genre, breaking the public genre filter → Phase 9 step 29
- ⚠️ Homepage `FeaturedFilms` component is hardcoded with fake slugs that will 404 against the real DB → Phase 9 step 26
- ⚠️ Collections pages (`/collections/[slug]`) still use hardcoded mock data from `lib/films-data.ts`, not the real DB → Phase 9 step 30

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

### Real Aggregate Statistics (Admin Dashboard + About/Home)

Planned 2026-08-18, not yet implemented — full page-by-page audit and design decisions below, confirmed with the user, ready to build whenever this gets picked up.

**What's currently fake:**
- Admin Dashboard (`app/admin/(dashboard)/page.tsx`) — all 4 stat cards (Total Films, Total Views, Watch Time, Collections), the entire Recent Films table, and the entire Recent Activity log are hardcoded arrays, not real queries.
- About page (`app/about/page.tsx`) and Home's About Preview (`components/about-preview.tsx`) — "Years" (`"12"`) and "Streaming" (`"24"`) are hardcoded literals; "Films" is already computed (from fixture data) and "Collections" (`"4"`) is a stable configuration fact, not really a fake stat — lower priority to touch.

**Confirmed design decisions:**
- **Watch Time** → cheap proxy: `SUM(view_count × duration_seconds) / 3600`, i.e. assume every recorded view watches the whole film. Not accurate, but requires no new tracking infrastructure. Real tracking (player reporting watch progress back to the server) was considered and explicitly deferred — bigger feature, not worth it yet.
- **Recent Activity** → new `activity_log` table, written to by the admin endpoints themselves (real distinct events), not inferred from `films.created_at`/`updated_at` timestamps.

**Migration needed:**
```sql
CREATE TABLE activity_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action     TEXT NOT NULL,   -- 'film_uploaded' | 'film_updated' | 'film_published' | 'film_unpublished' | 'film_deleted'
  detail     TEXT NOT NULL,   -- film title at time of the event
  film_id    UUID REFERENCES films(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX activity_log_created_at_idx ON activity_log (created_at DESC);
```
No new column needed for views — `films.view_count` has existed since `001_create_films.sql` but nothing has ever incremented or read it.

**Backend work:**
- `routes/films.js` — `GET /api/films/:slug` increments `view_count` on each load (fire-and-forget, must not block or fail the response if the write errors).
- `routes/admin.js` — POST/PATCH/DELETE on films each write an `activity_log` row (upload → `film_uploaded`; PATCH where `published` is the only changed field → `film_published`/`film_unpublished`; PATCH with other fields → `film_updated`; DELETE → `film_deleted`, title captured before the row is removed).
- New `GET /api/admin/stats` (auth-protected like the rest of `/api/admin/*`) returning `totalFilms`, `totalViews` (`SUM(view_count)`), `watchTimeHours`, `recentFilms` (last 5, real rows), `recentActivity` (last 5 from `activity_log`).

**Frontend work:**
- Admin Dashboard becomes a client component fetching `GET /api/admin/stats`, replacing all three hardcoded blocks, with loading/error states matching the other admin pages.
- About page + Home About Preview: replace the "Years" and "Streaming" literals with computed values (`currentYear − 2019`; count of fixture films with a video URL) — small, no backend dependency, can happen independently of the rest of this.

---

## Phase 8 — Infrastructure & Hardening

22. **Infrastructure as code** — define S3 buckets, CloudFront distribution, RDS instance, MediaConvert presets in `infrasturcture/` using Terraform or AWS CDK (fix directory typo when setting this up)
23. **Environment separation** — dev/staging/prod env configs
24. **CloudFront signed URL enforcement** — ensure the S3 bucket is not publicly accessible; all access goes through CloudFront

---

## Phase 9 — MVP 2.0: Almanac Restyle + Real-Data Completion (current priority)

Goal: ship the first production-ready version of the site as the Almanac-restyled MVP, with the Phase 6 hardcoded-data gaps closed **in the same pass**, not as separate follow-up work. The design/content/functionality work for every page has already been done in prototype form under `app/examples/almanac/` (see `page-inventory.md` for full status and `almanac-vs-mvp-functionality-audit.md` for what was verified). What remains is porting each prototype into its real `app/` route, and — because porting means touching each page's code anyway — fixing that page's known data gap at the same time.

### Port order, with the Phase 6 gap folded into each step where one exists

25. ✅ **Shared `<Header>` / `<Footer>`** (`components/header.tsx`, `components/footer.tsx`) — done 2026-08-18. Restyled from `app/examples/almanac/layout.tsx`'s masthead/nav/footer, changed from `fixed` to static in-flow. Brand settled as "Dream Chambers Public Access" (not the prototype's "THE ALMANAC" persona name) per user decision.
26. ✅ **Home** (`app/page.tsx` + its section components) — done 2026-08-18, ported from `app/examples/almanac/home/page.tsx`. **Closed the Phase 6 gap**: `components/featured-films.tsx` and the other section components now source from `lib/films-data.ts` instead of the hardcoded fake Unsplash slugs.
27. ✅ **Films index** (`app/films/page.tsx`) — done 2026-08-18. Kept the real page's live `GET /api/films` fetch (the almanac prototype used fixtures; the real page's existing live-API wiring was preserved, not replaced), restyled to almanac.
28. ✅ **Film detail** (`app/films/[slug]/page.tsx`) — done 2026-08-18. **Schema decision made: extended.** Migration `003_add_credits_and_stills_to_films.sql` adds `cinematography`/`editor`/`sound`/`music`/`stills` columns; `src/db/films.js` and `src/routes/admin.js` (POST/PATCH) read and write them. The admin upload/edit *form UI* to populate these fields is not built yet — deferred to the admin CMS pass (#29) — so real DB rows have these fields `null` until then; the page handles that gracefully (credits register and stills gallery only render present values).
29. ✅ **Admin Upload + Admin Edit** — done 2026-08-18 (second pass, after the user asked for the full admin port). Closed the Phase 6 `genre` gap on both forms. Added Cinematography/Editor/Sound/Music fields on both forms, matching the film-detail schema extension. **Discovered and fixed a pre-existing bug**: the Film Stills drop zone on Upload existed in both the real page and the almanac prototype, but neither ever actually uploaded the selected files or sent them to the backend — `stillFiles` was preview-only dead state. Now wired through the same presigned-URL flow as the thumbnail. Edit page still has no stills management UI (can't view/add/remove stills after initial upload) — open gap, see `page-inventory.md`.
30. ✅ **Collections index + detail** (`app/collections/page.tsx`, `app/collections/[slug]/page.tsx`) — done 2026-08-18, restyled. Left fixture-driven (`lib/films-data.ts`) rather than wiring to live `GET /api/films` tag filtering — that backend work was noted as optional in this step and wasn't done.
31. ✅ **About** (`app/about/page.tsx`) — done 2026-08-18. Founding/Mission/Values/Selected Press ported verbatim (real, client-verified copy). Real Selected Press quotes still needed from the client — the placeholder `"Insert quote here"` entries are still in place and should not go to production as-is. Per user request, dropped the self-referential "Colophon" section/framing and renamed the page back to plain "About the Archive."
32. ✅ **Contact** (`app/contact/page.tsx`) — done 2026-08-18. Per user request, renamed from "Correspond" to plain "Contact" and dropped the personified-archive copy voice.
33. ✅ **Three new pages with no real-MVP counterpart** (`app/distribution/`, `app/submissions/`, `app/pricing/`) — done 2026-08-18, added to nav.
34. ✅ **Admin Login, Admin Dashboard, Admin Settings, Admin Films list** — done 2026-08-18. Login and Films list were near-1:1 restyles. Dashboard's hardcoded-stats gap is **unchanged and still open** — full plan (migration, endpoints, design decisions) written up in "Real Aggregate Statistics" under Phase 7 above; explicitly out of scope for this pass, tracked as its own backend task. Settings remains a non-functional stub (no backend endpoint exists for it yet).
35. **Favicon** — drop the client-supplied graphic in per the format Claude specified in the current conversation; small, independent task, do whenever convenient.

### Phase 9 complete as of 2026-08-18
Every page in the almanac prototype set is now ported into the real `app/` routes. What's left is backend-only work, not restyling: the admin dashboard stats endpoint (step 34), running migration 003 against a real database (see `known_issues.md`), and stills management on the Edit page (step 29). The favicon (step 35) is still waiting on the client.

### Explicitly out of scope for this phase
- Populating the real DCPA film catalogue (replacing all fixture/demo film data with the client's actual films) — tracked separately, will happen incrementally as films get uploaded through the real admin flow once it's live
- The video-replacement flow on Admin Edit ("Replace File") — still genuinely hard (new upload + re-transcode), stays a UI stub post-port same as it is today
- Everything in Phase 8 (infra-as-code, env separation, CloudFront hardening) — unrelated to this restyle push, can happen in parallel or after
