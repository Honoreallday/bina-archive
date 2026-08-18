"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

interface Film {
  id: number
  title: string
  slug: string
  year: number
  director: string
  description: string
  genre: string
  tags: string[] | null
  duration_seconds: number
  thumbnail_url: string | null
  created_at: string
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}

type ViewMode = "grid" | "list"

const tableHeaders = ["No.", "Title", "Year", "Runtime", "Genre", "Director"]

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    fetch(`${API_URL}/api/films`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setFilms)
      .catch(() => setError("Failed to load films."))
      .finally(() => setLoading(false))
  }, [])

  const genres = useMemo(
    () => Array.from(new Set(films.map((f) => f.genre).filter(Boolean))),
    [films]
  )
  const years = useMemo(
    () => Array.from(new Set(films.map((f) => f.year))).sort((a, b) => b - a),
    [films]
  )

  const filteredFilms = useMemo(() => {
    return films.filter((film) => {
      const matchesSearch =
        searchQuery === "" ||
        film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        film.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === null || film.genre === selectedGenre
      const matchesYear = selectedYear === null || film.year === selectedYear
      return matchesSearch && matchesGenre && matchesYear
    })
  }, [films, searchQuery, selectedGenre, selectedYear])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedGenre(null)
    setSelectedYear(null)
  }

  const hasActiveFilters = searchQuery !== "" || selectedGenre !== null || selectedYear !== null

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 pb-16 md:px-10">
        <div className="mb-8 border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Browse</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">All Films</h1>
        </div>

        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
          The DCPA archive is an extensive and diverse collection of Black Minnesotan and Midwestern
          works from the early 2000s to the present, and includes historical personal and home video
          from the 1960s and beyond. If you&apos;re a curator, festival programmer, educator, or
          student and need help locating an artist or video, reach us at{" "}
          <a
            href="mailto:dreamchambers@proton.me"
            className="font-bold text-[var(--almanac-blue)] hover:underline"
          >
            dreamchambers@proton.me
          </a>
          .
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search films…"
            className="w-full border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)] sm:max-w-sm"
          />
        </div>

        {/* Filter strip */}
        <div className="mb-8 flex flex-wrap items-stretch gap-3">
          <div className="flex flex-wrap border-2 border-[var(--almanac-ink)]">
            <button
              type="button"
              onClick={() => setSelectedGenre(null)}
              className={`border-r border-[var(--almanac-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
                selectedGenre === null
                  ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                  : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              }`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                className={`border-r border-[var(--almanac-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] last:border-r-0 ${
                  selectedGenre === genre
                    ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                    : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <select
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] outline-none focus:border-[var(--almanac-blue)]"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div className="flex border-2 border-[var(--almanac-ink)]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`border-r border-[var(--almanac-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
                viewMode === "grid"
                  ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                  : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
                viewMode === "list"
                  ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                  : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              }`}
            >
              List
            </button>
          </div>

          <div className="ml-auto flex items-center border-2 border-[var(--almanac-ink)] px-4 text-[11px] text-[var(--almanac-ink-light)]">
            <span className="tabular-nums">{String(filteredFilms.length).padStart(2, "0")}</span>
            <span className="ml-1.5 uppercase tracking-[0.14em]">films</span>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-3 border-b border-[var(--almanac-border)] pb-5">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
              {filteredFilms.length} result{filteredFilms.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--almanac-blue)] hover:underline"
            >
              Clear filters ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="border-2 border-[var(--almanac-ink)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--almanac-ink-light)]">Loading…</p>
          </div>
        ) : error ? (
          <div className="border-2 border-[var(--almanac-ink)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--almanac-ink-light)]">{error}</p>
          </div>
        ) : filteredFilms.length === 0 ? (
          <div className="border-2 border-[var(--almanac-ink)] px-6 py-16 text-center">
            <p className="text-sm text-[var(--almanac-ink-light)]">No films match your search.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--almanac-blue)] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              {filteredFilms.map((film, i) => (
                <Link
                  key={film.id}
                  href={`/films/${film.slug}`}
                  className="group flex flex-col bg-[var(--almanac-parchment)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--almanac-ink)] bg-[var(--almanac-parchment-alt)]">
                    {film.thumbnail_url && (
                      <Image
                        src={film.thumbnail_url}
                        alt={film.title}
                        fill
                        className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2.5 flex items-start justify-between gap-2">
                      <span className="text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                        {String(i + 1).padStart(3, "0")}
                      </span>
                      {film.genre && (
                        <span className="border border-[var(--almanac-border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                          {film.genre}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold leading-tight tracking-tight">{film.title}</h3>
                    <p className="mt-1 font-[family-name:var(--font-almanac-script)] text-lg text-[var(--almanac-blue)]">
                      {film.year} · {formatDuration(film.duration_seconds)}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--almanac-ink-mid)]">
                      {film.description}
                    </p>
                    <div className="mt-4 border-t border-[var(--almanac-border)] pt-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                        Dir.&nbsp;{film.director}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-[var(--almanac-ink)]">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--almanac-ink)] text-left text-[var(--almanac-parchment)]">
                  {tableHeaders.map((h) => (
                    <th
                      key={h}
                      className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFilms.map((film, i) => (
                  <tr
                    key={film.id}
                    className={`${
                      i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                    } hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]`}
                  >
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums opacity-70">
                      {String(i + 1).padStart(3, "0")}
                    </td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 font-bold">
                      <Link href={`/films/${film.slug}`} className="hover:underline">
                        {film.title}
                      </Link>
                    </td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums">{film.year}</td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2">
                      {formatDuration(film.duration_seconds)}
                    </td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 uppercase tracking-wide">
                      {film.genre}
                    </td>
                    <td className="px-3 py-2">{film.director}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
