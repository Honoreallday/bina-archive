# Page Inventory & Transition Tracker

Target: restyle all MVP pages (public + admin) to the Almanac design language.
Reference: `.claude/docs/almanac-design-system.md`
Functionality gap audit (read this before porting any page): `.claude/docs/almanac-vs-mvp-functionality-audit.md`

This tracker has two independent tracks per page:
- **Status** — whether the *real* page (`app/...`) has actually been restyled. As of 2026-08-17, this is `[ ]` for every page below — no real page has been touched yet. All work so far has happened in the parallel prototype set.
- **Almanac Prototype** — whether a fully-styled reference version exists under `app/examples/almanac/`. This is where the design language gets worked out before porting it into the real page. As of 2026-08-17, **all 13 real MVP pages now have a corresponding built-out almanac prototype**, and as of the same day, **every functionality gap identified in the audit has been closed** — the prototypes are now functionally equivalent to (or a superset of) the real pages they'll replace, not just visual shells. See `almanac-vs-mvp-functionality-audit.md` for the record of what was fixed.

Skip: anything under `app/examples/` is never restyled in place — it's scratch space for design exploration (almanac is one of several themes explored there: archive, catalog, dusk, editorial, poetic, terminal). Only the almanac direction was carried all the way through to a full page set.

**Important caveat:** the almanac prototypes for public pages (home, films, collections, about, contact) render static fixture data from `lib/films-data.ts`, NOT the real API — same as several real MVP pages already do (collections pages are fixture-driven in the real MVP too). The admin prototypes (login, films, edit, upload) ARE wired to the real backend (`fetch` calls to `NEXT_PUBLIC_API_URL`, real `lib/auth`) — so porting those is more "move the JSX" and less "reconnect the data." Dashboard and settings prototypes are static stubs, matching their real-page counterparts. The film detail prototype's video player now points at a public HLS test stream since the fixture data has no real backing media — swap that for a real `hls_url` when wiring to the live API during the port.

Status key: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Public Pages

### `/` — Home
**File:** `app/page.tsx`
**Status:** `[x]` ported 2026-08-18 — `<Header>`/`<Footer>` restyled first, then Home. `<HeroSection>`, `<FeaturedFilms>`, `<CollectionsPreview>`, `<AboutPreview>` rewritten to almanac styling, each now importing from `lib/films-data.ts` (`getPublishedFilms`/`getFeaturedFilms`/`getFilmsByCollection`) instead of hardcoded fake Unsplash slugs — closes the Phase 6 `FeaturedFilms` 404 gap per `development_roadmap.md` step 26. Site brand settled as "Dream Chambers Public Access" (not the prototype's "THE ALMANAC" persona/nav labels) — root `<title>` and header/footer updated to match; nav trimmed to the 4 routes that exist today (Films/Collections/About/Contact), Distribution/Submissions/Pricing left out until those pages are ported (step 33). Header changed from `fixed` to static in-flow, so the old `pt-16`/`pt-24` header-offset padding was removed from every public page's `<main>`.
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/home/page.tsx`, static fixture data. Now includes the same 6-image auto-cycling background carousel (crossfade every 6s + indicator dots) as the real hero. Featured films / collections preview / about preview are equal or better than the real page (fixture films have real slugs, unlike the MVP's hardcoded fake ones).
**Functionality:**
- Composed entirely of section components: `<HeroSection>`, `<FeaturedFilms>`, `<CollectionsPreview>`, `<AboutPreview>`
- No direct API calls in page — data lives in child components
- Uses shared `<Header>` and `<Footer>`

**What the sections do:**
- `HeroSection` — large headline + CTA button(s) linking to `/films`
- `FeaturedFilms` — card grid of featured/highlighted films
- `CollectionsPreview` — teaser cards for the 4 collections linking to `/collections`
- `AboutPreview` — short artist statement block with a link to `/about`

**Notes for redesign:** This page is all composition — the real work is in the section components under `components/`. The page file itself stays thin. Nav and footer also need restyling.

---

### `/films` — All Films
**File:** `app/films/page.tsx`
**Status:** `[x]` ported 2026-08-18 — kept the real page's live `GET /api/films` fetch and `Film` shape (genre/tags/duration_seconds/thumbnail_url), restyled to almanac (ruled ink-grid cards + ledger table view). Dropped the prototype's "Section II"/"The Catalogue" persona labels for a plain "Browse" / "All Films" header per user request to de-pretentious-ify page titles.
**Almanac Prototype:** `[x]` built, functionally equivalent — consolidated into one page, `app/examples/almanac/films/page.tsx` ("The Catalogue"). The old two-page split (Documents table / Catalogue grid) was merged per product decision so the prototype matches the real page's IA. Now has: search (title + description), category filter buttons (dynamic via `getCategories()`), year filter dropdown (dynamic via `getYears()`), grid/list view toggle, results count, and clear-filters — all wired and functional, not decorative.
**Functionality:**
- Client component. Fetches all films from `GET /api/films` on mount
- Search bar filters by title and description
- Genre filter buttons (derived dynamically from the fetched data)
- Year dropdown filter (derived dynamically)
- Grid/List view toggle
- Loading, error, and empty states
- Each film card/row links to `/films/[slug]`
- Clear filters button when any filter is active

**Notes for redesign:** The filter strip and the two view modes (grid / list) are the main complexity here. The almanac has a category filter strip and card grid pattern that maps cleanly to this. The list view may become a ruled ledger table.

---

### `/films/[slug]` — Film Detail / Player
**File:** `app/films/[slug]/page.tsx`
**Status:** `[x]` ported 2026-08-18 — schema decision resolved: **extended**, not trimmed. Migration `apps/backend/src/db/migrations/003_add_credits_and_stills_to_films.sql` adds `cinematography`/`editor`/`sound`/`music`/`stills` columns; `src/db/films.js` (getFilmById/getFilmBySlug/getAdminFilmById/updateFilm) and `src/routes/admin.js` (POST/PATCH) read and write them. No admin form UI to populate them yet (deferred to the admin CMS pass) — real films uploaded today will have these fields `null`, and the page renders correctly either way (credits register only shows rows that are present, stills gallery only renders if `stills` is non-empty).
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/films/[slug]/page.tsx`, static fixture data. Now renders the real `<VideoPlayer>` component (HLS.js/native-Safari) against a public HLS test stream added to every fixture film's `videoUrl` field — swap for a real `hls_url` during the port to the live API. Share button added (Web Share API + clipboard fallback). Retains its bonus richer credits (director/cinematography/editor/sound/music vs. the real page's director-only) and stills gallery.
**Functionality:**
- Client component. Fetches film by slug from `GET /api/films/:slug`
- Fetches all films to compute "related films" (same genre, different id)
- Renders `<VideoPlayer hlsUrl={...} />` for HLS stream playback (full-width, black bg)
- Film metadata: title, genre, duration, year
- Share button (Web Share API, falls back to clipboard)
- Credits sidebar: director (and potentially more fields)
- Tags display (from `film.tags[]`)
- Related films grid (up to 3, same genre)
- 404 redirect if slug not found

**Notes for redesign:** The video player sits above the fold in a full-width black container — keep that zone unstyled (black). Everything below it gets the almanac treatment. The credits block maps to the key-value register pattern.

---

### `/collections` — Collections Index
**File:** `app/collections/page.tsx`
**Status:** `[x]` ported 2026-08-18 — restyled, still fixture-driven via `lib/films-data.ts` (matches the real page's pre-port behavior and the prototype; live-DB tag filtering was noted as a nice-to-have in `development_roadmap.md` step 30, not done here).
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/collections/page.tsx` (95 lines). Same 4 collections as the real page, but counts and total-minutes-per-collection are computed live from `lib/films-data.ts` fixtures rather than hardcoded — a straightforward, slightly more dynamic port.
**Functionality:**
- Static page (no API calls — collection metadata is hardcoded)
- Displays 4 collections: Documentary, Shorts, Installations, 2020–2024
- Each collection is a link card showing title, long description, and film count
- Links to `/collections/[slug]`

**Notes for redesign:** The 4 collection cards map well to the gap-px ink-grid card pattern from the almanac. Consider a data-column grid showing counts by collection.

---

### `/collections/[slug]` — Collection Detail
**File:** `app/collections/[slug]/page.tsx`
**Status:** `[x]` ported 2026-08-18 — restyled, same fixture-driven data source as before.
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/collections/[slug]/page.tsx` (144 lines). Uses the same `lib/films-data.ts` fixture source and filtering logic the real page already uses (the real page is fixture-driven here too, not live-DB — a known Phase-6 gap per `development_roadmap.md`, not something the prototype introduces). Near 1:1 port; prototype adds a running total-minutes stat the real page doesn't show.
**Functionality:**
- Server component. Collection metadata is hardcoded in the file; films are pulled from `lib/films-data` (static fixture data, not the API yet)
- Shows collection title, long description, total film count, total runtime
- Grid of film cards for that collection, each linking to `/films/[slug]`
- "Other Collections" section (the other 3, minus current)
- 404 if slug not in the hardcoded map

**Notes for redesign:** Film card grid + other-collections strip. The archive table pattern could also work here as a list alternative.

---

### `/about` — About the Archive
**File:** `app/about/page.tsx`
**Status:** `[x]` ported 2026-08-18 — renamed from the prototype's "Colophon" framing back to plain "About the Archive" per user request (nav label was already "About"; the page content now matches). Dropped the self-referential "Colophon" section (the "an almanac is not a website..." copy + fake "Publication record" box listing things like "Binding: Screen-bound, no backend") — that was commentary about the almanac-as-object concept, not about DCPA, and read as overly precious. Founding/Mission/Values/Stats/Selected Press all kept verbatim (real, client-verified copy).
**Almanac Prototype:** `[x]` built, functionally equivalent (superset) — `app/examples/almanac/about/page.tsx` (215 lines, "Colophon"; most recently revised of the set — 187 net lines added in the current uncommitted diff). Same sections and press quotes verbatim; stats block computes film count from fixtures (others still hardcoded like the real page). Adds a bonus "Colophon" publication-record section the real page doesn't have. No blocking gaps.
**Functionality:**
- Fully static. No API calls, no interactivity.
- Sections: Hero, Artist Statement, Biography, About This Archive (with 4 stat counters), Selected Press (blockquotes), CTA

**Notes for redesign:** This maps almost directly to the Colophon pattern. The stat counters (38 films, 12 years, etc.) map to the data-column grid. Press quotes become ruled ledger entries. The two-column label/body layout is used throughout the almanac.

---

### `/contact` — Contact
**File:** `app/contact/page.tsx`
**Status:** `[x]` ported 2026-08-18 — renamed from "Correspond" to plain "Contact" per user request. Dropped the personified-archive copy ("The archive reads every letter. It replies slowly, and with care." / "— the archive, always reading") for plain functional copy. Kept the real "Contact information" register (region/focus/founded/submissions/licensing/email) — more accurate than the pre-port real page's sidebar, which had a fake `archive@example.com` and wrong city (Chicago, not Minneapolis).
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/contact/page.tsx` ("Correspond"). Now a real client component wired to `POST /api/contact`, with a 5-option inquiry-type pill selector (submit disabled until one is picked), success state (replaces form, "Send another" action), inline error state, and a restored FAQ section (4 Q&As, almanac ruled-register style). The sidebar keeps its almanac-flavored "Archive record" framing rather than a literal field-for-field copy of the real sidebar (email/location/response-time/representation) — worth a content pass during the port if exact parity there matters.
**Functionality:**
- Client component. Posts to `POST /api/contact` on submit (already wired to real backend)
- Inquiry type selector (5 options: Screening, Licensing, Press, Institutional, General) — pill toggle buttons
- Form fields: Name (required), Email (required), Organization (optional), Message (required)
- Submit is disabled until an inquiry type is selected
- Success state: replaces form with confirmation message + "Send another" button
- Error state: inline error text
- Left sidebar: direct email, location, response time, representation info
- FAQ grid (4 questions, static)

**Notes for redesign:** This maps cleanly to the Correspond page already built in the almanac examples. The inquiry type selector becomes a filter strip. The sidebar info becomes a key-value register. The FAQ section becomes a ruled table or accordion.

---

## Admin Pages

> Admin pages share a separate layout. The redesign here should feel like a functional CMS tool — still using the almanac palette and typography, but with more utilitarian density. Avoid making it look too precious.

---

### `/admin/login` — Admin Login
**File:** `app/admin/login/page.tsx`
**Status:** `[x]` ported 2026-08-18. Restyled only, no functional changes.
**Almanac Prototype:** `[x]` built and functionally equivalent — `app/examples/almanac/admin/login/page.tsx` (118 lines). Posts to the real `POST /api/admin/login`, has the same show/hide password toggle, saves the token via the real `lib/auth.saveToken()`. Functionally identical to the real page bar the redirect target.
**Functionality:**
- Client component. Posts to `POST /api/admin/login` with password
- Single password field with show/hide toggle
- Saves JWT to storage via `lib/auth.saveToken()` on success, redirects to `/admin`
- Error display for wrong password or server unreachable
- Link back to the public site

**Notes for redesign:** A minimal centered form — border-2 ink card with almanac inputs. Keep it sparse.

---

### `/admin` — Dashboard
**File:** `app/admin/(dashboard)/page.tsx`
**Status:** `[x]` ported 2026-08-18. Restyled only — stats/recent-films/recent-activity are still hardcoded, unchanged. Wiring to real data (`GET /api/admin/stats` or similar aggregation endpoint) is intentionally deferred, per `development_roadmap.md` Phase 9 step 34.
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/admin/(dashboard)/page.tsx` (171 lines). Same hardcoded stats, recent-films list, recent-activity list, and quick-actions grid as the real page. Neither talks to the backend for this page yet.
**Functionality:**
- Currently static/placeholder (no API calls — all data is hardcoded)
- Stats grid: Total Films, Total Views, Watch Time, Collections (4 cards with icons)
- Recent Films table (hardcoded) with title, date, view count, published/draft badge
- Recent Activity list (hardcoded) with action, detail, timestamp
- Quick Actions grid: Upload Film, Manage Films, View Site, Analytics (button links)

**Notes for redesign:** Stats map to the data-column grid pattern. Recent films table maps directly to the almanac ruled register/table. Activity list becomes a ruled dl. Stats are placeholder — wire to real data later.

---

### `/admin/films` — Manage Films
**File:** `app/admin/(dashboard)/films/page.tsx`
**Status:** `[x]` ported 2026-08-18. Restyled only, near 1:1 port — already wired to real endpoints, no functional changes needed.
**Almanac Prototype:** `[x]` built and functionally equivalent — `app/examples/almanac/admin/(dashboard)/films/page.tsx` (328 lines). Confirmed (full read): search by title, status filter (All/Published/Draft), sortable Title/Created columns with asc/desc toggle, 10-per-page pagination, inline publish/draft toggle with optimistic rollback, delete with `confirm()`, and View/Edit/Delete row actions are all present and wired to the real `GET/PATCH/DELETE /api/admin/films` endpoints — a near 1:1 port already. Only surface difference: the MVP uses a shadcn dropdown menu for the status filter and row actions, the prototype uses plain inline buttons (equivalent behavior).
**Functionality:**
- Client component. Fetches all films from `GET /api/admin/films` (requires JWT)
- Search filter by title
- Status filter dropdown (All / Published / Draft)
- Sortable columns: Title, Created (toggle asc/desc)
- Paginated table (10 per page) with: thumbnail placeholder, title (links to edit), year, director, status badge, created date, action menu
- Row actions: View (opens public page), Edit (→ `/admin/films/[id]/edit`), Delete (with confirm dialog)
- Inline toggle to flip published/draft status (optimistic update with rollback)
- Retry on load error

**Notes for redesign:** This is a direct match for the almanac archive table pattern. Status badges and action menus need almanac-appropriate styling (no rounded badges — use small bordered spans).

---

### `/admin/films/[id]/edit` — Edit Film
**File:** `app/admin/(dashboard)/films/[id]/edit/page.tsx`
**Status:** `[x]` ported 2026-08-18. Went beyond a straight restyle: added a **Genre** input (closes the Phase 6 gap where films saved with `null` genre, breaking the public genre filter) and a **Credits** section (Cinematography/Editor/Sound/Music, all optional) to match the schema extension made when Film Detail was ported. Both are read on load and written on save (`PATCH /api/admin/films/:id`, which already accepted these fields as of the film-detail schema work). Film File / Thumbnail stub cards unchanged (still non-functional, matching the original MVP 1.0 gap). **Stills are not editable from this page** — no UI was added to view/add/remove an existing film's stills after upload; that gap is open (stills can only be set at upload time, see Upload page below).
**Almanac Prototype:** `[x]` built and functionally equivalent — `app/examples/almanac/admin/(dashboard)/films/[id]/edit/page.tsx`. Identical field set (title/year/duration mm:ss/description/director), identical duration parsing helpers, identical 4-option collections multi-select, identical published toggle and danger-zone delete, all wired to the real `GET/PATCH/DELETE` endpoints. Now also includes the real page's Film File and Thumbnail stub cards (non-functional "Replace File"/"Upload Thumbnail" buttons, matching `development_roadmap.md` Phase 6 — still not functional on either side, just visually present).
**Functionality:**
- Client component. Fetches film by ID from `GET /api/admin/films/:id` (requires JWT)
- Publication status toggle: Draft / Published
- Media panels: Film File (placeholder, "Replace File" button stub) and Thumbnail (placeholder, "Upload Thumbnail" button stub) — not yet functional
- Metadata form: Title (required), Year, Duration (parsed to/from seconds, formatted as mm:ss or hh:mm:ss), Description, Director
- Collections multi-select (toggle buttons for: Shorts, Installations, Documentary, 2020-2024)
- Save: PATCHes `/api/admin/films/:id`, then navigates back to `/admin/films`
- Delete: DELETEs `/api/admin/films/:id` with confirm dialog, then navigates back
- Preview link opens `/films/[slug]` in a new tab
- Danger zone card for delete action

**Notes for redesign:** Two-column form layout with key-value register style. The danger zone should be clearly delimited — a bordered section with ink-red styling.

---

### `/admin/upload` — Upload Film
**File:** `app/admin/(dashboard)/upload/page.tsx`
**Status:** `[x]` ported 2026-08-18. Closed two real gaps beyond a straight restyle:
- **Genre field added** (was missing from both the real page and the almanac prototype) — text input, sent as `genre` in the `POST /api/admin/films` body.
- **Credits fields added** (Cinematography/Editor/Sound/Music, optional) — matches the film-detail schema extension.
- **Film Stills upload actually wired to S3** — this was a pre-existing gap in *both* the real page and the prototype: the "Film Stills" drop zone let you select and preview multiple images, but neither version ever uploaded them or included them in the film-creation request (`stillFiles` state existed only for client-side preview). Now each selected still is uploaded through the same presigned-URL flow already used for the thumbnail (`prefix: "stills"`), sequentially, with the phase label showing progress (`Uploading stills (n/m)…`), and the resulting CDN URLs are sent as `stills: string[]` in the film-creation POST.
**Almanac Prototype:** `[x]` built and functionally equivalent — `app/examples/almanac/admin/(dashboard)/upload/page.tsx`. Runs the identical 4-step flow (presign → S3 PUT via XHR with real progress events → optional thumbnail presign+upload → save record), same metadata fields, same collections multi-select, same Save-as-Draft/Publish split buttons, same progress bar. Now also includes the third upload zone, **Film Stills** (multiple images, drag-and-drop, preview grid, individual remove), matching the real page.
**Functionality:**
- Client component. Full upload flow wired to real backend.
- Film file upload: drag-and-drop or click, validates video MIME type
- Thumbnail upload: drag-and-drop or click, image preview on select
- Film stills upload: multiple images, preview grid, individual remove
- Metadata form: Title (required), Year, Duration (mm:ss format), Description, Director
- Collections multi-select (same 4 options as edit page)
- Upload flow (4 steps):
  1. `POST /api/admin/upload-url` to get presigned S3 URL
  2. PUT video directly to S3 (XHR with real progress tracking)
  3. Optionally upload thumbnail via same presign flow
  4. `POST /api/admin/films` to save record to DB
- Progress bar with phase label and percentage
- Two submit modes: "Save as Draft" vs "Publish Film"
- Disabled submit until film file + title are filled

**Notes for redesign:** The drag-drop zone should keep its functional clarity — use a dashed border-2 ink zone. The progress bar should be a simple ruled fill bar, no rounded corners. The two-button submit row should match the almanac button pattern.

---

### `/admin/settings` — Settings
**File:** `app/admin/(dashboard)/settings/page.tsx`
**Status:** `[x]` ported 2026-08-18. Restyled only, still a non-functional stub (no backend) — unchanged from prior behavior, matching the documented low-priority note below.
**Almanac Prototype:** `[x]` built, functionally equivalent — `app/examples/almanac/admin/(dashboard)/settings/page.tsx`. Static stub, matching the real page — not wired to a backend (there is none yet). Now has the same 6 fields as the real page (Site Name/Description, Contact Email, Instagram, Vimeo, Twitter/X).
**Functionality:**
- Client component. Currently a stub — save button has a fake 1-second delay and calls `alert()`. Not connected to any backend.
- Fields: Site Name, Site Description, Contact Email, Instagram URL, Vimeo URL, Twitter/X URL

**Notes for redesign:** Simple stacked form in almanac style. Low priority — this is a stub. Wire to a real settings endpoint later.

---

## New pages with no real-MVP counterpart

**Status:** `[x]` all three built 2026-08-18 — `app/distribution/page.tsx`, `app/submissions/page.tsx`, `app/pricing/page.tsx`. Static content, ported near-verbatim from the almanac prototype (real client-supplied DCPA copy — distribution terms, submission eligibility, rate tables), dropping only the "Section VII/VIII/IX" persona numbering. Added to `<Header>`/`<Footer>` nav.

---

## Notes on the Almanac Prototype Set

- `app/examples/almanac/page.tsx` ("Index" in the prototype nav) and `app/examples/almanac/layout.tsx` are **not** 1:1 mappings to any real MVP page — `page.tsx` is a poetic landing/preface for the design-tour itself, and `layout.tsx` is the prototype's own header/nav/footer shell (inlined, not reusing the real `<Header>`/`<Footer>` components). When porting, the masthead/nav/footer markup in `layout.tsx` is the reference for restyling the real `components/header.tsx` and `components/footer.tsx`.
- The prototype nav (now 6 links after the films/catalogue merge: Home/Index/Catalogue/Collections/Correspond/Colophon) has a working mobile hamburger toggle that swaps to a stacked link list below `md`, matching the real `<Header>`'s behavior. The footer now also carries the same nav links (dot-separated, above the status line) so the 3-column-equivalent link redundancy from the real `<Footer>` isn't lost.
- The prototype layout wraps everything in `<CrtScreen>` (`app/examples/_components/crt-screen.tsx`), a toggleable phosphor-green CRT filter. This is a demo-only affordance for browsing the example themes side by side — it should **not** carry over into the real site.
- The admin section prototype (`app/examples/almanac/admin/(dashboard)/layout.tsx`) does real auth-gating: it checks `getToken()` from the real `lib/auth` and redirects to the prototype login if absent, same nav items (Dashboard/Upload/Films/Settings) plus View Site + Sign Out as the real admin sidebar. It now also matches the real sidebar's mobile behavior — a hamburger toggle, slide-in transform, and a click-outside overlay to close it.

---

## Shared Components to Restyle

These are used across multiple public pages and need the almanac treatment before individual pages will look right:

| Component | File | Used by |
|---|---|---|
| `<Header>` | `components/header.tsx` | All public pages |
| `<Footer>` | `components/footer.tsx` | All public pages |
| `<HeroSection>` | `components/hero-section.tsx` | Home |
| `<FeaturedFilms>` | `components/featured-films.tsx` | Home |
| `<CollectionsPreview>` | `components/collections-preview.tsx` | Home |
| `<AboutPreview>` | `components/about-preview.tsx` | Home |
| `<VideoPlayer>` | `components/VideoPlayer.tsx` | Film detail |
| Admin layout/sidebar | `app/admin/(dashboard)/layout.tsx` | All admin pages |

**Note:** Start with `<Header>` and `<Footer>` — they appear on every public page and will immediately make the whole site feel consistent once done.
