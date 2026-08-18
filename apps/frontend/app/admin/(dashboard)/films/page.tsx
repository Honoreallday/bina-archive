"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

interface AdminFilm {
  id: number
  title: string
  slug: string
  year: number
  director: string
  published: boolean
  created_at: string
}

const STATUS_OPTIONS = ["All", "Published", "Draft"] as const

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<AdminFilm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All")
  const [sortBy, setSortBy] = useState<"title" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const PER_PAGE = 10

  const fetchFilms = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/films`, { headers: authHeaders() })
      if (!res.ok) throw new Error(`${res.status}`)
      setFilms(await res.json())
    } catch {
      setError("Failed to load films.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFilms() }, [fetchFilms])

  const handleTogglePublish = async (film: AdminFilm) => {
    const updated = { ...film, published: !film.published }
    setFilms((prev) => prev.map((f) => (f.id === film.id ? updated : f)))
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${film.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ published: !film.published }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setFilms((prev) => prev.map((f) => (f.id === film.id ? film : f)))
    }
  }

  const handleDelete = async (film: AdminFilm) => {
    if (!confirm(`Delete "${film.title}"? This cannot be undone.`)) return
    setFilms((prev) => prev.filter((f) => f.id !== film.id))
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${film.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
    } catch {
      setFilms((prev) =>
        [...prev, film].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      )
    }
  }

  const filtered = films
    .filter((f) => {
      const matchSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && f.published) ||
        (statusFilter === "Draft" && !f.published)
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      const cmp =
        sortBy === "title"
          ? a.title.localeCompare(b.title)
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortOrder === "asc" ? cmp : -cmp
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const toggleSort = (field: "title" | "date") => {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    else { setSortBy(field); setSortOrder("desc") }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--almanac-border)] pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            {films.length} records
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Films</h1>
        </div>
        <Link
          href="/admin/upload"
          className="border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
        >
          + Add Film
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-3 py-2 text-xs text-[var(--almanac-ink-mid)]">
          <span>{error}</span>
          <button
            onClick={fetchFilms}
            className="ml-4 font-bold uppercase tracking-wide hover:text-[var(--almanac-ink)]"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input
            type="text"
            placeholder="Search films…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="w-full border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
          />
        </div>
        <div className="flex border-2 border-[var(--almanac-ink)]">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1) }}
              className={`border-r border-[var(--almanac-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] last:border-r-0 ${
                statusFilter === s
                  ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                  : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-[var(--almanac-ink)]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--almanac-ink)] text-left text-[var(--almanac-parchment)]">
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] w-10">
                No.
              </th>
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2">
                <button
                  onClick={() => toggleSort("title")}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] hover:text-[var(--almanac-gold)]"
                >
                  Title {sortBy === "title" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                </button>
              </th>
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                Year
              </th>
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                Director
              </th>
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                Status
              </th>
              <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2">
                <button
                  onClick={() => toggleSort("date")}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] hover:text-[var(--almanac-gold)]"
                >
                  Created {sortBy === "date" ? (sortOrder === "asc" ? "↑" : "↓") : "↕"}
                </button>
              </th>
              <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-[var(--almanac-ink-light)]">
                  Loading…
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-[var(--almanac-ink-light)]">
                  No films found.
                </td>
              </tr>
            ) : (
              paginated.map((film, i) => (
                <tr
                  key={film.id}
                  className={`${
                    i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                  } hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]`}
                >
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums opacity-60">
                    {String((currentPage - 1) * PER_PAGE + i + 1).padStart(3, "0")}
                  </td>
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2 font-bold">
                    <Link href={`/admin/films/${film.id}/edit`} className="hover:underline">
                      {film.title}
                    </Link>
                  </td>
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums">
                    {film.year}
                  </td>
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2">{film.director}</td>
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2">
                    <button
                      onClick={() => handleTogglePublish(film)}
                      className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                        film.published
                          ? "border-[var(--almanac-blue)] text-[var(--almanac-blue)] hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
                          : "border-[var(--almanac-border)] text-[var(--almanac-ink-light)] hover:border-[var(--almanac-ink)] hover:text-[var(--almanac-ink)]"
                      }`}
                    >
                      {film.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums">
                    {new Date(film.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-3">
                      <Link
                        href={`/films/${film.slug}`}
                        className="text-[11px] uppercase tracking-[0.1em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-blue)]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/films/${film.id}/edit`}
                        className="text-[11px] font-bold uppercase tracking-[0.1em] hover:text-[var(--almanac-blue)]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(film)}
                        className="text-[11px] uppercase tracking-[0.1em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-red)]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--almanac-ink-light)]">
            {(currentPage - 1) * PER_PAGE + 1}–
            {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length} films
          </span>
          <div className="flex border-2 border-[var(--almanac-ink)]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-r border-[var(--almanac-ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-30"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`border-r border-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold last:border-r-0 ${
                  p === currentPage
                    ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                    : "hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <p className="font-[family-name:var(--font-almanac-script)] text-base text-[var(--almanac-blue)]">
        {films.length} films on file — click any title to edit.
      </p>
    </div>
  )
}
