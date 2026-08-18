"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

const ALL_COLLECTIONS = [
  { id: "shorts", label: "Shorts" },
  { id: "installations", label: "Installations" },
  { id: "documentary", label: "Documentary" },
  { id: "2020-2024", label: "2020–2024" },
]

function secsToDuration(s: number | null): string {
  if (!s) return ""
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`
}

function parseDuration(dur: string): number | null {
  const parts = dur.trim().split(":").map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

export default function EditFilmPage() {
  const params = useParams()
  const router = useRouter()
  const filmId = params.id as string

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [slug, setSlug] = useState("")
  const [metadata, setMetadata] = useState({
    title: "",
    year: "",
    duration: "",
    description: "",
    director: "",
    genre: "",
    cinematography: "",
    editor: "",
    sound: "",
    music: "",
  })
  const [published, setPublished] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
          headers: authHeaders(),
        })
        if (!res.ok) throw new Error(`${res.status}`)
        const film = await res.json()
        setSlug(film.slug ?? "")
        setMetadata({
          title: film.title ?? "",
          year: film.year ? String(film.year) : "",
          duration: secsToDuration(film.duration_seconds),
          description: film.description ?? "",
          director: film.director ?? "",
          genre: film.genre ?? "",
          cinematography: film.cinematography ?? "",
          editor: film.editor ?? "",
          sound: film.sound ?? "",
          music: film.music ?? "",
        })
        setPublished(film.published ?? false)
        setSelectedCollections(Array.isArray(film.tags) ? film.tags : [])
      } catch {
        setLoadError("Failed to load film.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filmId])

  const toggleCollection = (id: string) =>
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title: metadata.title,
          year: metadata.year ? Number(metadata.year) : null,
          director: metadata.director,
          cinematography: metadata.cinematography || null,
          editor: metadata.editor || null,
          sound: metadata.sound || null,
          music: metadata.music || null,
          description: metadata.description,
          genre: metadata.genre || null,
          tags: selectedCollections.length > 0 ? selectedCollections : null,
          duration_seconds: parseDuration(metadata.duration),
          published,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setSaveError("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this film? This cannot be undone.")) return
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      router.push("/admin/films")
    } catch {
      setSaveError("Failed to delete film.")
    }
  }

  const inputCls =
    "w-full border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"

  if (loading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)]">Loading…</p>
      </div>
    )

  if (loadError)
    return (
      <div className="border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-4 py-3 text-sm text-[var(--almanac-ink-mid)]">
        {loadError}
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--almanac-border)] pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/films"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
          >
            ← Films
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">ID {filmId}</p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight">Edit Film</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <Link
              href={`/films/${slug}`}
              target="_blank"
              className="border border-[var(--almanac-border)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] hover:border-[var(--almanac-ink)]"
            >
              Preview →
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-40"
          >
            {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save changes →"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-3 py-2 text-xs text-[var(--almanac-ink-mid)]">
          {saveError}
        </div>
      )}

      {/* Publication status */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Publication status
        </header>
        <div className="flex gap-0 border-t-0 p-4">
          <button
            onClick={() => setPublished(false)}
            className={`border-2 border-r border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
              !published ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]" : "hover:bg-[var(--almanac-parchment-alt)]"
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setPublished(true)}
            className={`border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
              published
                ? "bg-[var(--almanac-blue)] text-[var(--almanac-parchment)]"
                : "hover:bg-[var(--almanac-parchment-alt)]"
            }`}
          >
            Published
          </button>
        </div>
      </section>

      {/* Media */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            Film File
          </header>
          <div className="flex aspect-video flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-xs text-[var(--almanac-ink-light)]">film-{filmId}.mp4</p>
            <button
              type="button"
              className="border border-[var(--almanac-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] hover:border-[var(--almanac-ink)]"
            >
              Replace file
            </button>
          </div>
        </section>

        <section className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            Thumbnail
          </header>
          <div className="flex aspect-video flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-xs text-[var(--almanac-ink-light)]">No thumbnail</p>
            <button
              type="button"
              className="border border-[var(--almanac-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] hover:border-[var(--almanac-ink)]"
            >
              Upload thumbnail
            </button>
          </div>
        </section>
      </div>

      {/* Metadata */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Metadata
        </header>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Title <span className="text-[var(--almanac-red)]">*</span>
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata((p) => ({ ...p, title: e.target.value }))}
              placeholder="Film title"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Year</label>
            <input
              type="text"
              value={metadata.year}
              onChange={(e) => setMetadata((p) => ({ ...p, year: e.target.value }))}
              placeholder="2024"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Duration (mm:ss)
            </label>
            <input
              type="text"
              value={metadata.duration}
              onChange={(e) => setMetadata((p) => ({ ...p, duration: e.target.value }))}
              placeholder="12:34"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Genre</label>
            <input
              type="text"
              value={metadata.genre}
              onChange={(e) => setMetadata((p) => ({ ...p, genre: e.target.value }))}
              placeholder="Documentary, Short, Experimental…"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Director
            </label>
            <input
              type="text"
              value={metadata.director}
              onChange={(e) => setMetadata((p) => ({ ...p, director: e.target.value }))}
              placeholder="Director's name"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Description
            </label>
            <textarea
              rows={4}
              value={metadata.description}
              onChange={(e) => setMetadata((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of the film…"
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Credits <span className="normal-case text-[var(--almanac-border)]">(optional)</span>
        </header>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Cinematography
            </label>
            <input
              type="text"
              value={metadata.cinematography}
              onChange={(e) => setMetadata((p) => ({ ...p, cinematography: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Editor</label>
            <input
              type="text"
              value={metadata.editor}
              onChange={(e) => setMetadata((p) => ({ ...p, editor: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Sound</label>
            <input
              type="text"
              value={metadata.sound}
              onChange={(e) => setMetadata((p) => ({ ...p, sound: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Music</label>
            <input
              type="text"
              value={metadata.music}
              onChange={(e) => setMetadata((p) => ({ ...p, music: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Collections
        </header>
        <div className="flex flex-wrap gap-px bg-[var(--almanac-ink)] border-t-0">
          {ALL_COLLECTIONS.map((col) => {
            const active = selectedCollections.includes(col.id)
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleCollection(col.id)}
                className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] ${
                  active ? "bg-[var(--almanac-blue)] text-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment)] hover:bg-[var(--almanac-parchment-alt)]"
                }`}
              >
                {active ? "✓ " : ""}{col.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Danger zone */}
      <section className="border-2 border-[var(--almanac-red)]">
        <header className="border-b border-[var(--almanac-red)] bg-[var(--almanac-red)]/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-red)]">
          Danger zone
        </header>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-bold">Delete this film</p>
            <p className="mt-0.5 text-xs text-[var(--almanac-ink-light)]">
              Once deleted, this film cannot be recovered.
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="border-2 border-[var(--almanac-red)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-red)] hover:bg-[var(--almanac-red)] hover:text-[var(--almanac-parchment)]"
          >
            Delete film
          </button>
        </div>
      </section>
    </div>
  )
}
