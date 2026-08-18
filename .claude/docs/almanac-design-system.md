# Almanac Design System

Extracted from `apps/frontend/app/examples/almanac`. This is the target design language for the bina-archive MVP redesign.

---

## Identity

**Concept:** A printed almanac / reference ledger. Everything reads as if set in ink on paper — no shadows, no gradients (on components), no roundness. Depth is achieved purely through borders and alternating ruled backgrounds.

**Typefaces (Google Fonts):**
- `Space Mono` — primary workhorse. All body, nav, tables, labels. CSS var: `--font-almanac-mono`
- `Kalam` — handwritten script. Used sparingly for poetic captions, pull quotes, subtitles. CSS var: `--font-almanac-script`

---

## Color Palette

**As of 2026-08-17, these are no longer hardcoded hex values in each page — they're CSS custom properties defined once in `app/globals.css` (under `:root`), referenced everywhere via Tailwind arbitrary-value syntax, e.g. `bg-[var(--almanac-parchment)]`.** To re-color the whole almanac section, edit the values in `globals.css` — no need to touch individual page files.

| Token | CSS Variable | Hex | Role |
|---|---|---|---|
| `parchment` | `--almanac-parchment` | `#efe9dd` | Primary background, light text on dark |
| `ink` | `--almanac-ink` | `#211f1a` | Primary text, all borders, dark backgrounds |
| `ink-mid` | `--almanac-ink-mid` | `#3d382f` | Body copy (slightly softer than ink) |
| `ink-light` | `--almanac-ink-light` | `#6b6559` | Labels, tertiary text, metadata |
| `ink-divider` | `--almanac-ink-divider` | `#4a463d` | Divider lines on dark (ink) backgrounds — e.g. table header cell borders |
| `border-light` | `--almanac-border` | `#c9c2b2` | Light dividers, secondary borders |
| `parchment-alt` | `--almanac-parchment-alt` | `#e6dfd0` | Alternating row background (even rows use `parchment`) |
| `blue` | `--almanac-blue` | `#2f43c9` | Accent 2 — links, script captions, selection bg, hover states |
| `red` | `--almanac-red` | `#d95b43` | Accent 1 — section labels, pull captions |
| `gold` | `--almanac-gold` | `#e0b64a` | Accent — counted badges, hover on top strip links |

**Selection state:** `bg-[var(--almanac-blue)] text-[var(--almanac-parchment)]`

**Typography is already centralized too** — both fonts are loaded once via `next/font/google` in `app/examples/almanac/layout.tsx` (`Space_Mono` → `--font-almanac-mono`, `Kalam` → `--font-almanac-script`), and every page references those two CSS variables rather than importing fonts themselves. Swapping either typeface site-wide only requires changing the two font-loader calls in that one file.

---

## Typography Scale

All sizes below in Tailwind shorthand. Space Mono is the default; Kalam always requires `font-[family-name:var(--font-almanac-script)]`.

| Usage | Classes |
|---|---|
| Page title / masthead | `text-3xl md:text-4xl font-bold leading-none tracking-tight` |
| Section heading | `text-2xl font-bold tracking-tight` |
| Sub-heading | `text-xl font-bold leading-snug` (often `text-balance`) |
| Section label (overline) | `text-[11px] uppercase tracking-[0.24em] text-[#6b6559]` — or red variant `text-[#d95b43]`, blue `text-[#2f43c9]` |
| Nav / button text | `text-[11px] font-bold uppercase tracking-[0.2em]` |
| Table header | `text-[11px] font-bold uppercase tracking-[0.14em]` |
| Body copy | `text-sm leading-relaxed text-[#3d382f]` |
| Table / small | `text-xs` |
| Tiny metadata | `text-[11px] uppercase tracking-[0.18em] text-[#6b6559]` |
| Script caption (Kalam) | `font-[family-name:var(--font-almanac-script)] text-2xl` (or `text-xl`, `text-lg`) |
| Tabular numbers | add `tabular-nums` |
| Padded index numbers | `String(n).padStart(3, "0")` or `padStart(2, "0")` |

---

## Spacing System

**Container:** `mx-auto max-w-6xl px-6 md:px-10`

**Section rhythm:**
- Between major sections: `mt-12`, `gap-10`
- Section bottom edge: `pb-10`, `border-b border-[#c9c2b2]`
- Component internal padding: `px-3 py-2` (compact), `px-4 py-3` (medium), `px-5 py-4` (loose)

**Component gaps:**
- Card/column grids: `gap-px` (creates ruled ink-colored separators between cells)
- Two-col prose layouts: `gap-8` or `gap-10`
- Form fields: `gap-5`
- Within form field: `gap-1.5`

---

## Layout Patterns

### Full-width page wrapper
```
mx-auto max-w-6xl px-6 md:px-10
```

### Two-column (prose + register)
```
grid gap-10 md:grid-cols-[1fr_1.1fr]
```
or flipped `md:grid-cols-[1.1fr_1fr]`

### Three-column data grid (gap-px separated)
```
grid gap-px border border-[#211f1a] bg-[#211f1a] sm:grid-cols-3
```
Each cell: `bg-[#efe9dd]` — the `bg-[#211f1a]` parent shows through the `gap-px` to create ink dividers.

### Card grid (films)
```
grid gap-px border-2 border-[#211f1a] bg-[#211f1a] sm:grid-cols-2 lg:grid-cols-3
```

---

## Components

### Metadata strip (top of page, full-bleed)
```
border-b border-[#211f1a] bg-[#211f1a] text-[#efe9dd]
inner: flex max-w-6xl items-center justify-between px-6 py-1.5 text-[11px] uppercase tracking-[0.18em]
```

### Masthead / header
```
border-b-2 border-[#211f1a]
inner: max-w-6xl px-6 py-6 md:px-10
title: text-3xl md:text-4xl font-bold leading-none tracking-tight
subtitle (Kalam): font-[family-name:var(--font-almanac-script)] text-2xl md:text-3xl text-[#d95b43]
```

### Navigation (ruled tab bar)
```
border-t border-[#c9c2b2]
each link: border-r border-[#c9c2b2] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em]
           first:border-l first:border-[#c9c2b2]
           hover:bg-[#211f1a] hover:text-[#efe9dd]
```

### Archive table (register)
```
overflow-x-auto border-2 border-[#211f1a]
table: w-full border-collapse text-xs
thead tr: bg-[#211f1a] text-left text-[#efe9dd]
th: border-r border-[#4a463d] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] last:border-r-0
tbody row even: bg-[#efe9dd] / odd: bg-[#e6dfd0]
row hover: hover:bg-[#2f43c9] hover:text-[#efe9dd]
td: border-r border-[#c9c2b2] px-3 py-2 last:border-r-0
```

### Key-value register (bordered box)
```
border-2 border-[#211f1a]
header: border-b border-[#211f1a] bg-[#211f1a] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#efe9dd]
row even: bg-[#efe9dd] / odd: bg-[#e6dfd0]
row: grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-xs
dt: uppercase tracking-[0.14em] text-[#6b6559]
dd: font-bold
```

### Film card (in grid)
```
group bg-[#efe9dd] (child of gap-px ink grid)
image wrapper: overflow-hidden border-b border-[#211f1a]
img: aspect-[4/3] w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0
body: p-4
```

### Section header block
```
border-b border-[#c9c2b2] pb-5 mb-8
label: text-[11px] uppercase tracking-[0.24em] text-[#6b6559]  (or red)
h2: mt-1 text-2xl font-bold tracking-tight
script caption: font-[family-name:var(--font-almanac-script)] text-xl text-[#d95b43]
```

### Category / tag badge (small)
```
border border-[#c9c2b2] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#6b6559]
```

### Primary button / link button
```
border-2 border-[#211f1a] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em]
hover:bg-[#211f1a] hover:text-[#efe9dd]
```
Inline (as `<Link>`): add `inline-block`

### Form inputs (correspondence style)
```
label: text-[11px] uppercase tracking-[0.2em] text-[#6b6559]
input/textarea: border-2 border-[#211f1a] bg-[#efe9dd] px-3 py-2 text-sm outline-none
                placeholder:text-[#c9c2b2] focus:border-[#2f43c9]
textarea: resize-none
```

### Footer (ruled status line)
```
border-t-2 border-[#211f1a]
inner: flex flex-wrap items-center justify-between gap-2 px-6 py-4
       text-[11px] uppercase tracking-[0.18em] text-[#6b6559]
script element: font-[family-name:var(--font-almanac-script)] text-base normal-case tracking-normal text-[#2f43c9]
```

---

## Image Treatment

- Default: `grayscale` filter on all images
- Hover: `hover:grayscale-0` — reveal color on focus/hover
- Transition: `transition-all duration-700`
- Always: `crossOrigin="anonymous"`, `object-cover`

---

## Interaction States

| Element | Default | Hover |
|---|---|---|
| Nav links | parchment bg | `bg-[#211f1a] text-[#efe9dd]` |
| Table rows | alternating parchment | `bg-[#2f43c9] text-[#efe9dd]` |
| List rows | alternating parchment | `bg-[#2f43c9] text-[#efe9dd]` |
| Buttons | parchment bg, ink border | `bg-[#211f1a] text-[#efe9dd]` |
| Images | grayscale | full color |
| Form inputs focus | ink border | `border-[#2f43c9]` |
| Top strip links | `text-[#efe9dd]` | `text-[#e0b64a]` |

---

## CRT Effect

The `<CrtScreen>` wrapper (at `app/examples/_components/crt-screen.tsx`) adds a toggleable phosphor-green filter over the entire page. No content changes needed — it's a CSS filter applied to `.crt-content`. The toggle button is fixed bottom-right.

---

## Voice & Copy Patterns

- Section labels: `"Section II"`, `"Entry no. 001 — preface"`, `"Plate of the month"` — always in `text-[11px] uppercase tracking`
- Script subtitles (Kalam): poetic, lowercase, reflective — `"a catalogue of small films"`, `"every entry, in order"`
- Footer script: `"printed on paper that remembers"`, `"margins left blank for your own notes"`
- Index numbers: zero-padded (`001`, `08`) with `tabular-nums opacity-70`
- Stats: `"08 documents · indexed 2024"`, `"182 min total"` — always dot-separated
