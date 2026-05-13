"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  Play,
  ArrowLeft,
  Clock,
  Calendar,
  Film,
  Share2,
} from "lucide-react"
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
  description: string
  genre: string
  tags: string[] | null
  duration_seconds: number
  thumbnail_url: string | null
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
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (missing) notFound()

  if (loading || !film) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Video Player */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto">
            <VideoPlayer hlsUrl={film.hls_url ?? ""} />
          </div>
        </div>

        {/* Film Details */}
        <div className="px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all films
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="text-accent">{film.genre}</span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(film.duration_seconds)}
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {film.year}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-4">
                    {film.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {film.description}
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>

                {/* Credits */}
                <div className="border border-border p-6">
                  <h2 className="text-sm tracking-widest uppercase text-accent mb-4">
                    Credits
                  </h2>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Director
                      </dt>
                      <dd className="text-foreground">{film.director}</dd>
                    </div>
                  </dl>
                </div>

                {/* Tags */}
                {film.tags && film.tags.length > 0 && (
                  <div>
                    <h2 className="text-sm tracking-widest uppercase text-accent mb-4">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {film.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border text-muted-foreground"
                        >
                          <Film className="h-3.5 w-3.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Films */}
            {relatedFilms.length > 0 && (
              <div className="mt-16 pt-16 border-t border-border">
                <h2 className="text-sm tracking-widest uppercase text-accent mb-6">
                  Related Films
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedFilms.map((related) => (
                    <Link
                      key={related.id}
                      href={`/films/${related.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-video overflow-hidden bg-secondary mb-3">
                        {related.thumbnail_url && (
                          <Image
                            src={related.thumbnail_url}
                            alt={related.title}
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
                          <span>{related.genre}</span>
                          <span className="text-border">|</span>
                          <span>{formatDuration(related.duration_seconds)}</span>
                        </div>
                        <h3 className="text-base font-medium text-foreground group-hover:text-accent transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{related.year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
