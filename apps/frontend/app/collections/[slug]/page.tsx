import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getFilmsByCollection } from "@/lib/films-data"
import { ArrowLeft, ArrowRight, Clock, Play } from "lucide-react"

const collections: Record<string, { title: string; description: string; longDescription: string }> = {
  documentary: {
    title: "Documentary",
    description: "Observational and essay films exploring place, memory, and community.",
    longDescription: "This collection gathers documentary works that move between observation and meditation. These films prioritize duration and patience, allowing subjects to reveal themselves gradually. The work draws from traditions of direct cinema while incorporating essayistic elements—voiceover, archival material, and formal experimentation. Themes of displacement, labor, and the relationship between landscape and memory recur throughout.",
  },
  shorts: {
    title: "Shorts",
    description: "Brief works under 20 minutes, ranging from experimental sketches to condensed narratives.",
    longDescription: "The short-form works collected here represent some of the most experimental pieces in the archive. Many began as sketches or tests that evolved into standalone works. Others were created specifically for gallery contexts where looping and duration function differently than in theatrical presentation. These pieces often focus on texture, rhythm, and the materiality of the film medium itself.",
  },
  installations: {
    title: "Installations",
    description: "Multi-channel and site-specific works designed for gallery exhibition.",
    longDescription: "Installation works require physical presence and cannot be fully experienced through documentation alone. The pieces in this collection were created for specific architectural contexts and viewing conditions—multiple screens, spatial audio, and durational loops that unfold over hours. What you find here are excerpts, documentation, and single-channel adaptations that gesture toward the full experience.",
  },
  "2020-2024": {
    title: "2020 - 2024",
    description: "Recent works produced during and after the pandemic.",
    longDescription: "The works in this collection were produced during a period of profound disruption. Made under conditions of isolation and restriction, they reflect on distance, intimacy, and the mediated nature of human connection. Several pieces incorporate video call footage, screen recordings, and other artifacts of pandemic-era communication. Others turn inward, exploring domestic space with new intensity.",
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = collections[slug]

  if (!collection) {
    return { title: "Collection Not Found | Archive" }
  }

  return {
    title: `${collection.title} | Collections | Archive`,
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pt-32 pb-16">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              All Collections
            </Link>

            <p className="text-accent text-sm tracking-widest uppercase mb-6">
              Collection
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-8">
              {collection.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {collection.longDescription}
            </p>

            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <span>{films.length} films</span>
              <span className="text-border">|</span>
              <span>
                {films.reduce((acc, film) => {
                  const mins = parseInt(film.duration.replace(/\D/g, ""))
                  return acc + mins
                }, 0)} minutes total
              </span>
            </div>
          </div>
        </section>

        {/* Films Grid */}
        <section className="px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-7xl mx-auto">
            {films.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No films in this collection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {films.map((film) => (
                  <Link
                    key={film.id}
                    href={`/films/${film.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-secondary border border-border group-hover:border-muted-foreground transition-colors">
                      <Image
                        src={film.image}
                        alt={film.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center">
                          <Play className="h-5 w-5 text-background ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{film.category}</span>
                        <span className="text-border">|</span>
                        <span>{film.year}</span>
                        <span className="text-border">|</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {film.duration}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                        {film.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {film.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Other Collections */}
        <section className="px-6 lg:px-8 py-16 border-t border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-8">
              Other Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(collections)
                .filter(([key]) => key !== slug)
                .slice(0, 3)
                .map(([key, coll]) => (
                  <Link
                    key={key}
                    href={`/collections/${key}`}
                    className="group p-6 border border-border hover:border-muted-foreground transition-colors"
                  >
                    <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors mb-2">
                      {coll.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {coll.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-foreground">
                      <span>View collection</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
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
