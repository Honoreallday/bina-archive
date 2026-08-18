# Almanac Prototype vs. Current MVP — Functionality Audit

Corrects an earlier version of this document that mistakenly benchmarked the almanac prototypes against `apps/frontend/_old/` (a pre-MVP mockup superseded before MVP 1.0 ever shipped). `_old/` is not relevant to this transition. The correct baseline is the current MVP itself — everything in `apps/frontend/app/` **excluding** `_old/` and `examples/`.

Purpose: before porting each almanac-styled prototype (`app/examples/almanac/`) into its real page, know exactly what functionality the prototype already reproduces and what it drops. Porting is not just a style copy — several prototypes were visually complete but functionally thinner than the page they're meant to replace.

Read against actual code on 2026-08-17 (both sides read in full, not sampled).

**Update, same day:** every gap below has been closed directly in the prototype set. The sections below are kept as a record of what was fixed and why — they no longer describe outstanding work. See `page-inventory.md` for current per-page status.

---

## Summary — now closed

| Page | Prototype fidelity (original) | Gap (original) | Status |
|---|---|---|---|
| Home | High | Hero had no rotating background image carousel | **Closed** — carousel added |
| Films index | **Low** | Split into 2 pages; no search; year filter gone; category filter buttons were decorative | **Closed** — consolidated to one page at `/examples/almanac/films` with working search, category filter, year filter, and grid/list toggle |
| Film detail | **Low** | No real video player — literally a placeholder box; no share button | **Closed** — real `<VideoPlayer>` wired with a test HLS stream per fixture film; share button added |
| Collections index | High | none | n/a |
| Collection detail | High | none | n/a |
| About | High | none (prototype adds a bonus Colophon section) | n/a |
| Contact | **Low** | Form had no submit handler at all — not wired, no inquiry-type selector, no FAQ section | **Closed** — real `POST /api/contact` wiring, inquiry-type pill selector, success/error states, FAQ section all added |
| Admin login | High | none | n/a |
| Admin dashboard | High | none (both are static placeholders) | n/a |
| Admin films list | High | none | n/a |
| Admin edit film | Medium | Dropped the Film File / Thumbnail media panels (even as stubs) | **Closed** — stub cards added |
| Admin upload | Medium | Dropped the Film Stills upload zone entirely | **Closed** — stills zone added (drag-drop, preview grid, remove) |
| Admin settings | High | Missing the Twitter/X field | **Closed** — field added |
| Header / Footer | Medium | Prototype nav had no mobile hamburger menu; footer lost the 3-column nav/inquiries layout | **Closed** — mobile menu toggle added to header; footer nav links restored |
| Admin sidebar layout | High | Same nav items, same auth gate; not mobile-responsive (no collapse) | **Closed** — mobile hamburger + slide-in + overlay added |

Below is the original detailed writeup for context on what each gap looked like before the fix.

---

## Public pages

### Home (`/` vs `app/examples/almanac/home/page.tsx`)
- **MVP has:** `HeroSection` with 6 background images auto-cycling every 6s with crossfade, plus manual indicator dots. `FeaturedFilms` shows 3 **hardcoded fake films** with Unsplash images and slugs that don't exist in the real DB (known bug, tracked in `pickupleftoff.md`). `CollectionsPreview` and `AboutPreview` are static.
- **Prototype has:** Static poetic hero (no image carousel at all — just headline + two buttons). Featured films pulled from `lib/films-data.ts` fixtures (3 films, real fixture slugs — actually more correct than the MVP's broken hardcoded ones, since fixture slugs resolve within the prototype). Collections preview computes real counts from fixture data. About preview stats quad.
- **Gap:** The rotating hero image carousel — a real interactive mechanic — is absent from the prototype. Everything else is equal or better (fixture films instead of fake ones).

### Films index (`/films` vs `app/examples/almanac/films/page.tsx` + `catalogue/page.tsx`)
- **MVP has one page** with: live `GET /api/films` fetch, text search (title + description), genre filter buttons, year `<select>`, grid/list view toggle, "N results" count, clear-filters button, loading/error/empty states.
- **Prototype splits this into two separate pages**, both against static fixtures:
  - `films/page.tsx` ("The Documents") — a register/table (No., Title, Year, Runtime, Subject, Director). No search, no filter, no sort control.
  - `catalogue/page.tsx` ("The Catalogue") — card grid with a category filter strip (`All / Documentary / Experimental / Short`). **The filter buttons have no `onClick` handler at all** — only the first ("All") is styled active by index position; clicking any button does nothing. No search, no year filter, no view toggle (it doesn't need one since it's already split), no result count logic (just total film count), no loading/error states (not applicable, static data).
- **Gap:** This is the largest functional regression in the set. Search is gone. Year filtering is gone. The category filter *looks* interactive but isn't wired. Porting needs a decision (see `page-inventory.md`) on whether to merge these two prototypes back into one page with a real toggle, and either way needs the search/genre/year logic re-added from the real page — none of it carries over from the prototype JSX.

### Film detail (`/films/[slug]` vs `app/examples/almanac/films/[slug]/page.tsx`)
- **MVP has:** Real API fetch by slug, `<VideoPlayer hlsUrl>` (HLS.js/native-Safari playback), related films (same genre, up to 3), a working Share button (`navigator.share` with clipboard fallback), credits (director only), tags list, back link.
- **Prototype has:** Static fixture lookup by slug. **The video player is a literal placeholder `<div>`** reading "Video Player / HLS stream loads here" — no `<video>` element, no HLS.js, nothing playable. No share button at all. Credits register is richer than the MVP (director, cinematography, editor, sound, music vs. director-only). Adds a stills gallery (grayscale-hover image grid) the MVP doesn't have. Related films and collection tag links both present.
- **Gap:** The single most important interactive element on the entire site — the actual video player — does not exist in the prototype. This is not a style port; `<VideoPlayer>` needs to be dropped into the ported page from scratch, same as share functionality. The extra credit fields and stills gallery are net-new and worth keeping if the data model supports them (it currently only stores a single `director` field, not cinematographer/editor/sound/music).

### Collections index (`/collections` vs `.../collections/page.tsx`)
- **MVP has:** 4 hardcoded collections with hardcoded counts (8/12/5/15).
- **Prototype has:** Same 4 collections, but counts and total-minutes-per-collection are computed live from `lib/films-data.ts` fixtures.
- **Gap:** None functionally — prototype is a straightforward, slightly more dynamic equivalent.

### Collection detail (`/collections/[slug]` vs `.../collections/[slug]/page.tsx`)
- **MVP has:** Hardcoded collection metadata + `getFilmsByCollection()` from the same `lib/films-data.ts` the prototype uses (the real page already runs on fixture data here, not the live DB — this is a known Phase-6 gap, see `development_roadmap.md`). Film grid, "Other Collections" strip (3, excluding current).
- **Prototype has:** Same fixture source, same filtering logic, same "other collections" pattern, plus a running total-minutes stat the MVP doesn't show.
- **Gap:** None — near 1:1, both already static/fixture-driven on the real side too.

### About (`/about` vs `.../about/page.tsx`)
- **MVP has:** Hero, Artist Statement, Biography, stats block (38/12/4/24, all hardcoded), 3 press blockquotes, CTA.
- **Prototype has:** Same sections, same press quotes verbatim, stats block with film count computed from fixtures (others still hardcoded) — plus a bonus "Colophon" section (publication record: title, editor, records, running time, method, typography, binding, revised) not present in the MVP at all.
- **Gap:** None blocking — prototype is a superset.

### Contact (`/contact` vs `.../contact/page.tsx`)
- **MVP has:** Real `POST /api/contact` wiring, 5-option inquiry-type pill selector (submit disabled until one is picked), name/email/org/message fields, success state that replaces the form, inline error state, sidebar (direct email, location, response time, representation), 4-question FAQ grid.
- **Prototype has:** A **static, non-interactive form** — no `"use client"`, no `useState`, no `onSubmit`. Fields are name/email/subject/message (subject replaces the 5-option inquiry-type selector with a single free-text field). No success/error states. Sidebar replaced with a differently-scoped "Archive record" key-value block (archive name, region, focus, response, submissions, licensing, correspondence) — thematically similar to "Response Time" but not a real mapping of the MVP's sidebar fields. **No FAQ section at all.**
- **Gap:** Second-largest regression after the films index. The entire submission flow, the inquiry-type selector, and the FAQ section all need to be rebuilt on top of the prototype's visual shell during the port — none of that logic exists in the prototype today.

---

## Admin pages

### Admin login (`/admin/login` vs `.../admin/login/page.tsx`)
- Both wired to the real `POST /api/admin/login`, both have a show/hide password toggle, both save the token via the real `lib/auth` and redirect on success. Functionally identical. Only redirect target differs (`/admin` vs `/examples/almanac/admin`, expected).

### Admin dashboard (`/admin` vs `.../admin/(dashboard)/page.tsx`)
- Both fully static/hardcoded (same stat values, same recent-films list, same recent-activity list, same quick-actions grid). The prototype renamed the `status: "Published"/"Draft"` string field to a `published: boolean`, rendered equivalently. No functional gap — neither talks to the backend for this page yet.

### Admin films list (`/admin/films` vs `.../admin/(dashboard)/films/page.tsx`)
- Both wired to real `GET /api/admin/films`, both implement: search by title, status filter (All/Published/Draft), sortable Title/Created columns with asc/desc toggle, 10-per-page pagination, inline publish/draft toggle (optimistic with rollback), delete with `confirm()`, and per-row View/Edit/Delete actions. Functionally a near 1:1 port already — only surface difference is the MVP uses a shadcn dropdown menu for row actions and a `DropdownMenu` for the status filter, where the prototype uses plain inline buttons (equivalent behavior, different widget).

### Admin edit film (`/admin/films/[id]/edit` vs `.../admin/(dashboard)/films/[id]/edit/page.tsx`)
- Both wired to real `GET`/`PATCH`/`DELETE /api/admin/films/:id`, identical field set (title, year, duration in mm:ss with the same `secondsToDuration`/`parseDurationToSeconds` helpers, description, director), identical collections multi-select (4 toggle buttons keyed to the same 4 collection ids), identical published/draft toggle, identical danger-zone delete-with-confirm.
- **Gap:** The MVP's Film File and Thumbnail cards (non-functional "Replace File" / "Upload Thumbnail" stub buttons, per `development_roadmap.md` Phase 6) are **entirely absent** from the prototype — not even as stubs. Minor since they're non-functional either way, but worth re-adding for visual/informational parity (shows the current file exists) even before they're made to actually work.

### Admin upload (`/admin/upload` vs `.../admin/(dashboard)/upload/page.tsx`)
- Both run the identical 4-step flow: `POST /api/admin/upload-url` → `PUT` to S3 via XHR with real progress events → optional thumbnail presign+upload → `POST /api/admin/films` to save the record. Same metadata fields, same collections multi-select, same Save-as-Draft/Publish split buttons, same progress bar.
- **Gap:** The MVP has a third upload zone — **Film Stills** (multiple images, drag-and-drop, preview grid, individual remove) — that the prototype drops completely. Film File and Thumbnail zones are both present and equivalent in the prototype.

### Admin settings (`/admin/settings` vs `.../admin/(dashboard)/settings/page.tsx`)
- Both static stubs, not wired to any backend (none exists yet). MVP fields: Site Name, Site Description, Contact Email, Instagram, Vimeo, **Twitter/X**. Prototype fields: same minus Twitter/X (5 fields instead of 6). MVP shows `alert()` on save; prototype shows an inline "Settings saved." message (arguably better UX, note during port).
- **Gap:** Missing Twitter/X field — trivial to add back.

---

## Shared chrome

### Header / Footer
- MVP `<Header>`: fixed top bar, Films/Collections/About/Contact links, a working mobile hamburger menu that expands a stacked nav panel. `<Footer>`: 3-column layout (brand blurb / Navigation links / Inquiries links) plus a copyright line.
- Almanac `layout.tsx`: masthead + ruled nav bar with 7 links (Home/Index/Documents/Catalogue/Collections/Correspond/Colophon — more entries because the prototype exposes both films views and its own bonus Index page). **No mobile menu at all** — the nav bar doesn't collapse or expose a hamburger; on narrow viewports it will simply overflow or wrap. Footer is a single ruled status line (font credit, record count, script tagline) with no navigational links, a simplification from the MVP's 3-column footer.
- **Gap:** Mobile nav collapse needs to be (re)built during the port — it doesn't exist in the prototype shell. Footer nav links need to be added back if link redundancy in the footer is still wanted (product decision, not just a style question).

### Admin layout (sidebar)
- MVP: collapsible sidebar (`fixed lg:static`, slides in/out on mobile via a hamburger + overlay), same 4 nav items (Dashboard/Upload/Films/Settings), View Site + Sign Out.
- Prototype: fixed-width (`w-44`) always-visible sidebar, same 4 nav items, same View Site + Sign out actions, same `getToken()`-based auth gate redirecting to login.
- **Gap:** Not mobile-responsive — no collapse/overlay behavior on narrow viewports. Functionally equivalent otherwise.

---

## Reading this against `page-inventory.md`

`page-inventory.md` tracks per-page port status and links back here for the gap detail. As of the fixes above, "Almanac Prototype: built" can now be read as functionally equivalent for every page in this set — the remaining work in `page-inventory.md` is genuinely a style/structure port (moving JSX into the real `app/` pages and reconnecting them to the real API instead of `lib/films-data.ts` fixtures where applicable), not a rebuild of missing functionality.
