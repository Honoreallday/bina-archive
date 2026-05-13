"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Search, Grid, List, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"

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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Page Header */}
        <div className="px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent text-sm tracking-widest uppercase mb-2">Browse</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
              All Films
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore the complete archive of works spanning documentary, experimental, and short-form cinema.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search films..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() =>
                        setSelectedGenre(selectedGenre === genre ? null : genre)
                      }
                      className={`px-3 py-1.5 text-sm border transition-colors ${
                        selectedGenre === genre
                          ? "border-accent text-accent"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedYear ?? ""}
                  onChange={(e) =>
                    setSelectedYear(e.target.value ? Number(e.target.value) : null)
                  }
                  className="px-3 py-1.5 text-sm border border-border bg-secondary text-muted-foreground hover:text-foreground focus:outline-none focus:border-muted-foreground"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <div className="flex border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">
                  {filteredFilms.length} result{filteredFilms.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Films Grid/List */}
        <div className="px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : filteredFilms.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No films found matching your criteria.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-accent hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFilms.map((film) => (
                  <Link
                    key={film.id}
                    href={`/films/${film.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video overflow-hidden bg-secondary mb-3">
                      {film.thumbnail_url && (
                        <Image
                          src={film.thumbnail_url}
                          alt={film.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center">
                          <Play
                            className="h-5 w-5 text-background ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{film.genre}</span>
                        <span className="text-border">|</span>
                        <span>{formatDuration(film.duration_seconds)}</span>
                      </div>
                      <h3 className="text-base font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {film.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{film.year}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFilms.map((film) => (
                  <Link
                    key={film.id}
                    href={`/films/${film.slug}`}
                    className="group flex gap-6 p-4 border border-border hover:border-muted-foreground transition-colors"
                  >
                    <div className="relative w-48 aspect-video flex-shrink-0 overflow-hidden bg-secondary">
                      {film.thumbnail_url && (
                        <Image
                          src={film.thumbnail_url}
                          alt={film.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-foreground/90 flex items-center justify-center">
                          <Play
                            className="h-4 w-4 text-background ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 py-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>{film.genre}</span>
                        <span className="text-border">|</span>
                        <span>{film.year}</span>
                        <span className="text-border">|</span>
                        <span>{formatDuration(film.duration_seconds)}</span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-2">
                        {film.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {film.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
