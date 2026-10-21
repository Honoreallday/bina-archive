import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getFilmsByCollection, getPublishedFilms } from "@/lib/films-data"

export const metadata: Metadata = {
  title: "Collections | Dream Chambers Public Access",
  description: "Browse the archive by collection — documentary, shorts, installations, and recent works.",
}

const collectionsMeta = [
  {
    slug: "documentary",
    key: "Documentary",
    label: "Documentary",
    longDescription:
      "Non-fiction and essayistic works that prioritize duration and patience. Drawing from traditions of direct cinema while incorporating formal experimentation. Themes of displacement, labor, and landscape recur throughout.",
  },
  {
    slug: "shorts",
    key: "Shorts",
    label: "Shorts",
    longDescription:
      "Some of the most experimental pieces in the archive. Many began as sketches that evolved into standalone works. Others were created for gallery contexts where looping and duration function differently than in theatrical presentation.",
  },
  {
    slug: "installations",
    key: "Installations",
    label: "Installations",
    longDescription:
      "Works requiring physical presence and specific architectural contexts. Multiple screens, spatial audio, and durational loops that unfold over hours. What you find here are excerpts, documentation, and single-channel adaptations.",
  },
  {
    slug: "2020-2024",
    key: "2020-2024",
    label: "2020 – 2024",
    longDescription:
      "Made under conditions of isolation and restriction, reflecting on distance, intimacy, and the mediated nature of human connection. Several pieces incorporate video call footage and other artifacts of pandemic-era communication.",
  },
]

export default function CollectionsPage() {
  const films = getPublishedFilms()

  const collections = collectionsMeta.map((c) => {
    const inCollection = getFilmsByCollection(c.key)
    return {
      ...c,
      count: inCollection.length,
      totalMins: inCollection.reduce((acc, f) => acc + (Number.parseInt(f.duration, 10) || 0), 0),
    }
  })

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 pb-16 md:px-10">
        <div className="mb-8 border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Browse By</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Collections</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            The archive is organized into four collections, each representing a distinct mode of
            working or a particular period of production.
          </p>
        </div>

        <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
          <div className="grid gap-px md:grid-cols-2">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group flex flex-col bg-[var(--almanac-parchment)] hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
              >
                <header className="flex items-center justify-between border-b border-[var(--almanac-ink)] px-4 py-2.5 group-hover:border-[var(--almanac-parchment)]/20">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{col.label}</span>
                  <span className="tabular-nums text-[11px] text-[var(--almanac-gold)]">
                    {String(col.count).padStart(2, "0")} films
                  </span>
                </header>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="text-xs leading-relaxed text-[var(--almanac-ink-mid)] group-hover:text-[var(--almanac-parchment)]/80">
                    {col.longDescription}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-[var(--almanac-border)] pt-3 group-hover:border-[var(--almanac-parchment)]/20">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] group-hover:text-[var(--almanac-parchment)]/70">
                      {col.totalMins} min catalogued
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Open →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-5 font-[family-name:var(--font-almanac-script)] text-lg text-[var(--almanac-blue)]">
          {films.length} films total — filed across {collections.length} collections.
        </p>
      </main>

      <Footer />
    </div>
  )
}
