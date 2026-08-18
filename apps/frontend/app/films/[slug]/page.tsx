"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import VideoPlayer from "@/components/VideoPlayer"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

interface FilmDetail {
  id: number
  title: string
  slug: string
  year: number
  director: string
  cinematography: string | null
  editor: string | null
  sound: string | null
  music: string | null
  description: string
  genre: string
  tags: string[] | null
  duration_seconds: number
  thumbnail_url: string | null
  stills: string[] | null
  hls_url: string | null
  created_at: string
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}min` : `${m} min`
}

interface FilmPageProps {
  params: Promise<{ slug: string }>
}

export default function FilmPage({ params }: FilmPageProps) {
  const { slug } = use(params)

  const [film, setFilm] = useState<FilmDetail | null>(null)
  const [relatedFilms, setRelatedFilms] = useState<FilmDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/films/${slug}`)
        if (res.status === 404) { setMissing(true); return }
        if (!res.ok) throw new Error()
        const data: FilmDetail = await res.json()
        setFilm(data)

        const allRes = await fetch(`${API_URL}/api/films`)
        if (allRes.ok) {
          const all: FilmDetail[] = await allRes.json()
          setRelatedFilms(
            all.filter((f) => f.genre === data.genre && f.id !== data.id).slice(0, 3)
          )
        }
      } catch {
        // leave film null — shows loading indefinitely; could add an error state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleShare = async () => {
    if (!film) return
    if (navigator.share) {
      try {
        await navigator.share({ title: film.title, text: film.description, url: window.location.href })
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (missing) notFound()

  if (loading || !film) {
    return (
      <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)]">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[var(--almanac-ink-light)]">Loading…</p>
        </main>
        <Footer />
      </div>
    )
  }

  const creditRows: [string, string][] = [
    ["Director", film.director],
    ...(film.cinematography ? ([["Cinematography", film.cinematography]] as [string, string][]) : []),
    ...(film.editor ? ([["Editor", film.editor]] as [string, string][]) : []),
    ...(film.sound ? ([["Sound", film.sound]] as [string, string][]) : []),
    ...(film.music ? ([["Music", film.music]] as [string, string][]) : []),
    ["Year", String(film.year)],
    ["Duration", formatDuration(film.duration_seconds)],
    ["Genre", film.genre],
  ]

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main>
        {/* Video player — full-width, black */}
        <div className="border-b-2 border-[var(--almanac-ink)] bg-black">
          <div className="mx-auto max-w-6xl">
            <VideoPlayer hlsUrl={film.hls_url ?? ""} />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
          <Link
            href="/films"
            className="mb-8 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
          >
            ← back to films
          </Link>

          {/* Film header */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--almanac-border)] pb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-red)]">{film.genre}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{film.title}</h1>
              <p className="mt-2 font-[family-name:var(--font-almanac-script)] text-2xl text-[var(--almanac-blue)]">
                {film.year} · {formatDuration(film.duration_seconds)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
            >
              {copied ? "Link copied ✓" : "Share →"}
            </button>
          </div>

          {/* Two-column: synopsis + credits */}
          <div className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]">
            <section>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Synopsis</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">{film.description}</p>

              {film.stills && film.stills.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
                    Stills
                  </p>
                  <div className="grid grid-cols-2 gap-px border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
                    {film.stills.map((src, i) => (
                      <div key={src} className="relative aspect-video">
                        <Image
                          src={src}
                          alt={`Still ${i + 1}`}
                          fill
                          className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Credits register + tags */}
            <section>
              <div className="border-2 border-[var(--almanac-ink)]">
                <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
                  Film record
                </header>
                <dl>
                  {creditRows.map(([label, value], i) => (
                    <div
                      key={label}
                      className={`grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-xs ${
                        i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                      }`}
                    >
                      <dt className="uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">{label}</dt>
                      <dd className="font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {film.tags && film.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {film.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--almanac-border)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Related films */}
          {relatedFilms.length > 0 && (
            <section className="mt-12 border-t border-[var(--almanac-border)] pt-8">
              <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
                Related — {film.genre}
              </p>
              <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
                <div className="grid gap-px sm:grid-cols-3">
                  {relatedFilms.map((r, i) => (
                    <Link
                      key={r.id}
                      href={`/films/${r.slug}`}
                      className="group flex flex-col bg-[var(--almanac-parchment)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--almanac-ink)] bg-[var(--almanac-parchment-alt)]">
                        {r.thumbnail_url && (
                          <Image
                            src={r.thumbnail_url}
                            alt={r.title}
                            fill
                            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <span className="text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                          {String(i + 1).padStart(3, "0")}
                        </span>
                        <h3 className="mt-1 text-sm font-bold leading-tight">{r.title}</h3>
                        <p className="mt-0.5 font-[family-name:var(--font-almanac-script)] text-sm text-[var(--almanac-blue)]">
                          {r.year} · {formatDuration(r.duration_seconds)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
