# Pick Up Left Off

Last updated: 2026-08-18

---

## Current Direction

MVP 1.0 (deployed 2026-06-10, see below) proved the pipeline works end to end but shipped with known hardcoded-data gaps (see "Code Gaps Remaining" below — never fixed, still open). Rather than patch those in place, the plan is now to fix them **at the same time** as the Almanac restyle, and ship the result as the first production-ready version of the site — a restyled MVP with the original gaps closed, not two separate efforts. That combined plan lives in `development_roadmap.md` Phase 9; the page-by-page mechanics of the restyle live in `page-inventory.md`.

---

## Session 2026-08-18 — Phase 9 Complete: Every Page Ported (Header/Footer through Admin CMS)

First session actually touching real `app/` routes (everything before this was prototype work under `app/examples/almanac/`). Followed `development_roadmap.md` Phase 9's suggested order. Started with "public pages first" (the user's initial scope choice), then the user asked for the admin CMS pages too later in the same session — by the end, every page in Phase 9 is ported.

### Important context: why this was a rewrite, not a file move
The user's original intent was to build the whole site out under `app/examples/almanac/` and then just *move* those files into the real `app/` routes once done. That's not what "porting" ended up meaning, and this was clarified with the user mid-session: the real site's pages have a different code structure than the prototype (e.g. `app/page.tsx` composes separate `components/hero-section.tsx` etc., rather than one inlined prototype file; `app/films/page.tsx` is live-API-driven while the prototype used static fixtures). So each page was **rewritten** into the real site's existing structure using the prototype as the design/content reference, not copy-pasted or moved. Internal links were repointed from `/examples/almanac/...` to real routes throughout.

### Almanac branding confusion, mid-session
After the Header/Footer + Home port, the user reported the live header still said "ALMANAC" and that a featured film linked to an unfamiliar video with "a giant rabbit." Both traced back to things already known/expected, not bugs in the port: (1) the user was looking at `app/examples/almanac/home`, not the real `/` — the prototype's own masthead (still "THE ALMANAC") was never touched, by design, since `app/examples/` is scratch space; (2) the "rabbit" is Big Buck Bunny, the public Mux test HLS stream added to every fixture film's `videoUrl` in the *previous* (2026-08-17) session so the video player had something playable — confirmed via web search, not something this session added.

This surfaced that the user had actually been developing the whole site under `app/examples/almanac/` with the intent to move those files into `app/` once finished, rather than treating it as disposable design-exploration scratch space the way `page-inventory.md` describes it. That's the reason this session pivoted from "just Header/Footer" to "port everything," and prompted the renaming pass below.

### Renaming pass (this session's second request)
The user flagged the prototype's persona-flavored naming as "too pretentious" after seeing it live. Applied throughout every page ported this session:
- "Correspond" → "Contact", "Colophon" → "About" (nav labels were already plain from the previous session; this pass fixed the *page content* — h1s, section headers — which still said the old names)
- Dropped "Section II/III/V/VI/VII/VIII/IX" numbering and "Vol. 04" framing everywhere
- Dropped self-referential "almanac as object" copy — most notably the About page's "Colophon" section ("An almanac is not a website that happens to hold films..." + a fake "Publication record" box listing things like "Binding: Screen-bound, no backend") and Contact's personified-archive copy ("The archive reads every letter. It replies slowly, and with care.")
- Kept the visual design system as-is (ruled ledger tables, ink-grid cards, Kalam script accents on real content like mission statements) — the complaint was about pretentious *copy*, not the visual language itself

### Branding decision made this session
Asked the user whether the real site should adopt "THE ALMANAC" as its title (the prototype's demo persona), just use "Dream Chambers Public Access," or keep the old generic "Archive" placeholder. **User chose "Dream Chambers Public Access."** Consequences applied throughout:
- Root `<title>`/description in `app/layout.tsx` updated
- Header masthead title is the org name, not "THE ALMANAC"
- Nav labels kept plain (Films/Collections/About/Contact), not the prototype's persona-flavored ones (Catalogue/Correspond/Colophon) — those were tied to the Almanac-persona concept that wasn't adopted
- Nav only links to routes that exist today; Distribution/Submissions/Pricing (prototype-only pages, Phase 9 step 33) are deliberately left out to avoid 404s until they're ported

### `components/header.tsx` / `components/footer.tsx` restyled
Ported from `app/examples/almanac/layout.tsx`'s masthead/nav/footer markup (that file is a reference, not something reused directly — it's the prototype's own inlined shell). Notable structural change: the old header was `fixed`; the almanac masthead is static/in-flow (metadata strip + masthead + ruled nav all push content down). Removed the now-obsolete `pt-16`/`pt-24` header-offset padding from every public page's `<main>` (`app/page.tsx`, `app/films/page.tsx`, both `<main>`s in `app/films/[slug]/page.tsx`; about/contact/collections already had none). Dropped the prototype's fabricated footer stat ("08 records · 182 min total") rather than porting fake numbers into production — known_issues.md already flagged that line as placeholder.

### `app/layout.tsx`
Added `Space_Mono`/`Kalam` font loading (once, globally, via CSS variables on `<body>`) so any page using the new Header/Footer gets correct fonts without each component reloading them separately.

### Home ported (`app/page.tsx` + its 4 section components)
Rewrote `components/hero-section.tsx`, `components/featured-films.tsx`, `components/collections-preview.tsx`, `components/about-preview.tsx` to almanac styling, each now sourcing from `lib/films-data.ts` (`getPublishedFilms`/`getFeaturedFilms`/`getFilmsByCollection`) instead of the old hardcoded fake Unsplash slugs — this closes the Phase 6 gap where `FeaturedFilms` would 404 against the real DB (`development_roadmap.md` step 26). Collection slugs/keys in `collections-preview.tsx` were matched exactly against the real routing table in `app/collections/[slug]/page.tsx` (lowercase route slugs like `documentary`, `2020-2024`, vs. the title-case tags used in `lib/films-data.ts` for filtering — these differ and both were needed).

**Still fixture-driven, not live-API-driven** — this is intentional per `page-inventory.md`'s explicit caveat, not an oversight: Home (like Collections/About) reads `lib/films-data.ts` fixtures, not `GET /api/films`. Populating real DCPA films through the live admin flow is explicitly out of scope for Phase 9 (tracked separately). **Films index and Film detail are the exception** — both kept the real page's existing live `GET /api/films` / `GET /api/films/:slug` wiring; only the visuals were ported from the prototype, not its fixture data source.

### Films index + Film detail ported
`app/films/page.tsx` restyled in place, live API fetch preserved. `app/films/[slug]/page.tsx` restyled, live API fetch preserved, plus a real schema decision (see below).

### Film detail schema decision: extended (not trimmed)
Asked the user; they chose to extend the schema so the richer credits (cinematography/editor/sound/music) and stills gallery the prototype has are backed by real data going forward, rather than trimming the ported page back to director-only. Implemented:
- New migration `apps/backend/src/db/migrations/003_add_credits_and_stills_to_films.sql` — adds `cinematography`, `editor`, `sound`, `music` (all `TEXT`) and `stills` (`TEXT[]`) to the `films` table. **Not yet applied to any real database** — migrations run via `apps/backend/src/db/migrate.js`, which the user needs to run against dev/prod when ready.
- `apps/backend/src/db/films.js` — `getFilmById`, `getFilmBySlug`, `getAdminFilmById` now select the new columns; `updateFilm`'s allowlist includes them.
- `apps/backend/src/routes/admin.js` — `POST /api/admin/films` and `PATCH /api/admin/films/:id` now accept the new fields optionally.
- **No admin form UI to populate them yet** — that's the deferred admin-CMS work. Real films uploaded through the current admin flow will have these fields `null`; the film detail page handles that fine (credits register only shows present rows, stills gallery only renders if non-empty).

### Collections index + detail ported
`app/collections/page.tsx`, `app/collections/[slug]/page.tsx` — restyled, left fixture-driven (matches pre-port behavior; live-DB tag filtering was optional per `development_roadmap.md` step 30 and wasn't done).

### About, Contact ported
Both restyled and de-pretentious-ified per the renaming pass above. About's Selected Press section still carries the `"Insert quote here"` placeholders — real quotes are still needed from the client before launch, nothing changed there.

### Three new pages built: Distribution, Submissions, Pricing
`app/distribution/page.tsx`, `app/submissions/page.tsx`, `app/pricing/page.tsx` — new routes, ported near-verbatim from the almanac prototype (real client-supplied DCPA content: distribution terms, submission eligibility, rental/purchase rate tables). Added to `<Header>`/`<Footer>` nav, which now has 7 links (Films/Collections/Distribution/Submissions/Pricing/About/Contact).

`tsc --noEmit` clean after every step; backend files syntax-checked with `node -c`. Did not start `next dev` per the standing operational note below — left runtime verification to the user.

### Admin CMS ported (second half of this session, after the user asked for it explicitly)
All 7 admin files restyled: `app/admin/login/page.tsx`, `app/admin/(dashboard)/layout.tsx` (sidebar), `page.tsx` (Dashboard), `films/page.tsx` (list), `films/[id]/edit/page.tsx`, `upload/page.tsx`, `settings/page.tsx`. Sidebar identity string fixed from the prototype's leftover "b/na archive" (the original pre-DCPA fictional-archive name, never updated in that file) to "Dream Chambers Public Access."

Beyond restyling, closed real gaps on Upload + Edit:
- **`genre` field added to both forms** — closes the original Phase 6 gap where every film saved with `null` genre, breaking the public genre filter.
- **Cinematography/Editor/Sound/Music fields added to both forms** — completes the film-detail schema extension from earlier this session; the backend already accepted these fields, only the UI was missing.
- **Found and fixed a real bug**: the Upload page's "Film Stills" drop zone existed in both the real page and the prototype, but neither ever uploaded the selected files — `stillFiles` was preview-only dead state, nothing was ever sent to the backend. Now wired through the same presigned-upload flow already used for the thumbnail. Full writeup in `known_issues.md`.
- **Deliberately left open**: the Edit page has no stills management UI — an existing film's stills can't be viewed, added, or removed after initial upload. Flagged in `page-inventory.md`, not fixed this session.

Dashboard and Settings ported as pure restyles — their hardcoded-stats and no-backend-yet limitations are unchanged, matching the pre-existing scope note that those are separate backend tasks.

`tsc --noEmit` clean after every file.

### Where this leaves things
**Every page in `page-inventory.md` is now `[x]`** — Phase 9 (the almanac restyle + gap-closing port) is content-complete. What's left is backend-only work, not more porting:
- **Run migration 003** against the real database(s) — the `cinematography`/`editor`/`sound`/`music`/`stills` columns only exist in the migration file so far, not in any deployed database. See `known_issues.md`.
- **Admin dashboard stats endpoint** (`GET /api/admin/stats` or similar) — hardcoded stats/recent-activity are still fake; explicitly scoped as its own backend task, not blocking anything else.
- **Stills management on the Edit page** — can currently only be set at upload time.
- **Favicon** — still waiting on the client's file.
- Real Selected Press quotes for About, real DCPA film catalogue — both pre-existing, tracked separately, untouched this session.

### Post-port: Railway outage debugging, non-issue
User's Railway free trial expired mid-session, backend went down, then got redeployed on a proper (paid) account, same project. Films page came up empty afterward with no error — traced by curling `GET /api/films` directly (`200 OK`, `[]`) to confirm the backend and its DB connection are both healthy; it's a genuinely empty result, not a broken connection. Root cause per the user: the Neon prod `films` table was simply never populated — real footage was always local-Postgres-only during development, never pushed to prod. **Not a bug, no fix needed** — the client will upload their own catalogue through the real admin flow once it's live, matching the already-documented "real DCPA film catalogue" gap.

### Real-statistics planning session (no code written)
User asked for a page-by-page audit of every hardcoded/fake aggregate stat (Admin Dashboard's stat cards + Recent Films + Recent Activity, About/Home's stat quads), plus a concrete migration+endpoint plan, **to review before any implementation** — explicitly deferred to a future sprint. Full plan (schema, decisions, backend/frontend work) written up in `development_roadmap.md` under Phase 7 → "Real Aggregate Statistics." Two design forks were raised and the user decided: Watch Time uses the cheap `view_count × duration` proxy (not real player-reported tracking), and Recent Activity gets a real new `activity_log` table (not inferred from `films` timestamps). Nothing implemented yet — this is scoped, confirmed, and ready to pick up.

---

## Session 2026-08-17 — Almanac Content & Functionality Pass

This was a documentation-and-prototype session — no real `app/` pages were touched yet, only the `app/examples/almanac/` prototype set and its supporting docs. Full detail is spread across four docs; this is the summary.

### 1. Corrected a wrong functionality benchmark
An earlier pass had compared the almanac prototypes against `apps/frontend/_old/` (an unrelated pre-MVP-1.0 mockup). Redid the comparison against the actual current MVP. Findings and full page-by-page detail: `almanac-vs-mvp-functionality-audit.md`.

### 2. Closed every functionality gap the audit found
The almanac prototypes were visually complete but functionally thinner than the real pages in several places. All closed, in `app/examples/almanac/`:
- **Films index** — was split into two non-functional pages; consolidated into one page (`films/page.tsx`) with real search, category filter, year filter, and grid/list toggle. Old `catalogue/` route removed.
- **Film detail** — video player was a literal placeholder `<div>`; now renders the real `<VideoPlayer>` component. Added a `videoUrl` field to every fixture film in `lib/films-data.ts` (all point at the same public Mux test HLS stream, `test-streams.mux.dev` — **not real footage**, just enough to make playback functional). Added a working share button.
- **Contact** — form had no submit handler at all; now wired to `POST /api/contact`, with the inquiry-type selector, success/error states, and FAQ section restored.
- **Home** — hero regained its rotating background-image carousel.
- **Admin upload** — regained the Film Stills drag-drop zone.
- **Admin edit** — regained the Film File / Thumbnail stub cards.
- **Admin settings** — regained the Twitter/X field.
- **Header/footer + admin sidebar** — both gained mobile hamburger/collapse behavior they were missing.

### 3. Replaced placeholder content with real DCPA copy
The client (Dream Chambers Public Access) supplied real organizational copy. Applied across the almanac prototype:
- Org identity swapped everywhere ("b/na field archive" → "Dream Chambers Public Access")
- About page: Founding, Mission, and Values sections (real text, replacing generic solo-artist copy)
- Selected Press quotes replaced with explicit `"Insert quote here"` placeholders **on purpose** — client wants a visible reminder to follow up for real press quotes, not fabricated ones
- Catalogue page gained a real intro paragraph
- Contact page's info register corrected — it had been asserting "Submissions: Closed" when DCPA's actual process is open with published criteria
- **Three new pages built from scratch** (no real-MVP equivalent yet): `distribution/`, `submissions/`, `pricing/` — the last includes real rental/purchase rate tables. Added to nav (desktop, mobile, footer).
- Contact email confirmed as `dreamchambers@proton.me`, wired as real `mailto:` links everywhere it appears (was previously guessed/malformed)
- Full inventory of what's real vs. still-placeholder content across the whole almanac set: `known_issues.md` → "Placeholder / filler content inventory"

### 4. Parameterized color & typography
All ~775 hardcoded hex color references across the 19 almanac page files replaced with 10 CSS custom properties defined once in `apps/frontend/app/globals.css` (`--almanac-parchment`, `--almanac-ink`, `--almanac-blue`, etc., each commented with its role). Re-coloring the whole section is now a one-file edit. Typography was already effectively centralized (both fonts load once in `app/examples/almanac/layout.tsx`) — documented that clearly in `almanac-design-system.md` rather than changing anything.

### Operational note — don't repeat this
Twice this session, running a second `next dev` process (even against a different port) against the same project directory corrupted the user's live dev server's `.next` build output (shared per-project-directory, not per-port). **Do not start a `next dev` process in this repo while the user's own dev server might be running.** Verify changes with `tsc --noEmit` and code review instead; leave runtime verification to the user's own running server.

---

## Where We Stopped

Nothing is broken or mid-edit. The almanac prototype set is now both visually complete and functionally/content-complete (bar the items in "Still open" below). The next unit of work is **starting the actual port** — moving pages from `app/examples/almanac/` into their real `app/` routes, using `page-inventory.md`'s page-by-page tracker, and fixing the original MVP 1.0 hardcoded-data gaps as each relevant page is ported (see `development_roadmap.md` Phase 9 for the merged plan and suggested order).

### Still open (not blocking, but not done)
- **Favicon** — user has a graphic ready; waiting on the file and a decision on scope (whole-site `app/icon.png` vs. almanac-only `app/examples/almanac/icon.png`)
- **Real press quotes** — About page has 3 intentional `"Insert quote here"` placeholders
- **Real film catalogue** — all 8 films across the site are still fabricated demo data (titles, credits, synopses, stock photos, and a shared test video stream) — the single largest remaining content gap, tracked in `known_issues.md`

---

## Known Environment Variable Issue to Watch

`ADMIN_PASSWORD_HASH` in Railway — the bcrypt hash starts with `$2b$12$` and Railway's variable input was stripping the `$` signs on first entry, causing a 500 on login. Was fixed by re-pasting the raw value carefully. If auth breaks after a Railway redeploy, check this variable first.

---

## Deployment Reference

| Service     | Platform  | Notes                                              |
|-------------|-----------|----------------------------------------------------|
| Frontend    | Vercel    | Root: `apps/frontend`. Env: `NEXT_PUBLIC_API_URL`  |
| Backend     | Railway   | Root: `apps/backend`. All env vars set in dashboard |
| Database    | Neon      | `DATABASE_URL` in Railway + local `.env`           |
| Video       | AWS       | S3 + MediaConvert + CloudFront — already set up    |

### Railway env vars set
```
NODE_ENV=production
PORT=4000
FRONTEND_URL=<vercel url>
DATABASE_URL=<neon url>
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
APP_AWS_REGION=us-east-2
S3_BUCKET_NAME=bina-media-archive-dev
CLOUDFRONT_DOMAIN
CLOUDFRONT_KEY_PAIR_ID
CLOUDFRONT_PRIVATE_KEY
AWS_MEDIACONVERT_ROLE_ARN
AWS_MEDIACONVERT_QUEUE_ARN
JWT_SECRET
ADMIN_PASSWORD_HASH
```

### Vercel env vars set
```
NEXT_PUBLIC_API_URL=<railway url>
```

---

## Suggested Next Session Order

1. **Start porting pages**, highest-impact first per `page-inventory.md`: `<Header>`/`<Footer>` shared components, then Home, then Films index.
2. **Fold in the original MVP 1.0 gaps as each relevant page is ported** rather than as a separate pass — see `development_roadmap.md` Phase 9 for exactly which gap belongs to which page:
   - Genre field on upload/edit forms → do while porting Admin Upload / Admin Edit
   - Homepage hardcoded fake `FeaturedFilms` → fixed automatically once Home is ported (the almanac prototype's featured-films section already pulls from real film data, not hardcoded fakes)
   - Collections pages wired to real DB instead of `lib/films-data.ts` fixtures → do while porting Collections
   - Admin Dashboard's hardcoded stats/activity → do while porting Admin Dashboard (needs new backend aggregation endpoints — see roadmap)
3. **Decide the film-detail schema question**: the almanac prototype's film detail page shows richer credits (cinematography/editor/sound/music) and a stills gallery that the real `films` table doesn't have columns for. Decide whether to extend the schema now or drop those fields when porting.
4. Once the port is far enough along to look and function like a real site, get the favicon in and do a first end-to-end pass with at least one or two real (non-fixture) films uploaded through the real admin flow.
