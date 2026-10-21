import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getFilmsByCollection } from "@/lib/films-data"

const collections: Record<string, { title: string; description: string; longDescription: string }> = {
  documentary: {
    title: "Documentary",
    description: "Observational and essay films exploring place, memory, and community.",
    longDescription:
      "This collection gathers documentary works that move between observation and meditation. These films prioritize duration and patience, allowing subjects to reveal themselves gradually. The work draws from traditions of direct cinema while incorporating essayistic elements — voiceover, archival material, and formal experimentation. Themes of displacement, labor, and the relationship between landscape and memory recur throughout.",
  },
  shorts: {
    title: "Shorts",
    description: "Brief works under 20 minutes, ranging from experimental sketches to condensed narratives.",
    longDescription:
      "The short-form works collected here represent some of the most experimental pieces in the archive. Many began as sketches or tests that evolved into standalone works. Others were created specifically for gallery contexts where looping and duration function differently than in theatrical presentation.",
  },
  installations: {
    title: "Installations",
    description: "Multi-channel and site-specific works designed for gallery exhibition.",
    longDescription:
      "Installation works require physical presence and cannot be fully experienced through documentation alone. The pieces in this collection were created for specific architectural contexts and viewing conditions — multiple screens, spatial audio, and durational loops that unfold over hours.",
  },
  "2020-2024": {
    title: "2020 – 2024",
    description: "Recent works produced during and after the pandemic.",
    longDescription:
      "The works in this collection were produced during a period of profound disruption. Made under conditions of isolation and restriction, they reflect on distance, intimacy, and the mediated nature of human connection. Several pieces incorporate video call footage, screen recordings, and other artifacts of pandemic-era communication.",
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = collections[slug]

  if (!collection) {
    return { title: "Collection Not Found | Dream Chambers Public Access" }
  }

  return {
    title: `${collection.title} | Collections | Dream Chambers Public Access`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = collections[slug]

  if (!collection) {
    notFound()
  }

  const collectionKey = slug === "2020-2024" ? "2020-2024" : collection.title
  const films = getFilmsByCollection(collectionKey)
  const totalMins = films.reduce((acc, f) => acc + (Number.parseInt(f.duration, 10) || 0), 0)
  const others = Object.entries(collections).filter(([key]) => key !== slug)

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 pb-16 md:px-10">
        <Link
          href="/collections"
          className="mb-8 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
        >
          ← all collections
        </Link>

        <div className="mb-8 border-b border-[var(--almanac-border)] pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-red)]">Collection</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{collection.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            {collection.longDescription}
          </p>
          <div className="mt-4 flex gap-4 text-[11px] uppercase tracking-[0.16em] text-[var(--almanac-ink-light)]">
            <span>{films.length} films</span>
            <span>·</span>
            <span>{totalMins} min total</span>
          </div>
        </div>

        {films.length === 0 ? (
          <p className="text-sm text-[var(--almanac-ink-light)]">No films in this collection yet.</p>
        ) : (
          <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
              {films.map((film, i) => (
                <Link
                  key={film.id}
                  href={`/films/${film.slug}`}
                  className="group flex flex-col bg-[var(--almanac-parchment)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--almanac-ink)] bg-[var(--almanac-parchment-alt)]">
                    <Image
                      src={film.image}
                      alt={film.title}
                      fill
                      className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                        {String(i + 1).padStart(3, "0")}
                      </span>
                      <span className="border border-[var(--almanac-border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                        {film.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-tight tracking-tight">{film.title}</h3>
                    <p className="mt-1 font-[family-name:var(--font-almanac-script)] text-base text-[var(--almanac-blue)]">
                      {film.year} · {film.duration}
                    </p>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--almanac-ink-mid)]">
                      {film.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <section className="mt-12 border-t border-[var(--almanac-border)] pt-8">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Other collections
          </p>
          <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
            <div className="grid gap-px sm:grid-cols-3">
              {others.slice(0, 3).map(([key, col]) => (
                <Link
                  key={key}
                  href={`/collections/${key}`}
                  className="group bg-[var(--almanac-parchment)] p-4 hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
                >
                  <h3 className="text-sm font-bold">{col.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--almanac-ink-mid)] group-hover:text-[var(--almanac-parchment)]/80">
                    {col.description}
                  </p>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em]">Open →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
