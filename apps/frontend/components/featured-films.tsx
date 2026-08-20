"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
const FEATURED_COUNT = 3

interface Film {
  id: number
  title: string
  slug: string
  year: number
  description: string
  duration_seconds: number
  thumbnail_url: string | null
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}

export function FeaturedFilms() {
  const [films, setFilms] = useState<Film[]>([])

  useEffect(() => {
    fetch(`${API_URL}/api/films`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setFilms)
      .catch(() => setFilms([]))
  }, [])

  const featured = films.slice(0, FEATURED_COUNT)

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-14 md:px-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Plates of note
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Featured</h2>
        </div>
        <Link
          href="/films"
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
        >
          All {films.length} film{films.length === 1 ? "" : "s"} →
        </Link>
      </div>

      <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
        <div className="grid gap-px sm:grid-cols-3">
          {featured.map((film, i) => (
            <article key={film.id} className="group flex flex-col bg-[var(--almanac-parchment)]">
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
                <span className="text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <h3 className="mt-1 text-sm font-bold leading-tight">{film.title}</h3>
                <p className="mt-1 font-[family-name:var(--font-almanac-script)] text-base text-[var(--almanac-blue)]">
                  {film.year} · {formatDuration(film.duration_seconds)}
                </p>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--almanac-ink-mid)]">
                  {film.description}
                </p>
                <Link
                  href={`/films/${film.slug}`}
                  className="mt-3 border-t border-[var(--almanac-border)] pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-blue)]"
                >
                  Open record →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
