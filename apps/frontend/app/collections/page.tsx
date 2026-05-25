import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Collections | Archive",
  description: "Browse the archive by collection — documentary, shorts, installations, and recent works.",
}

const collections = [
  {
    slug: "documentary",
    title: "Documentary",
    description: "Observational and essay films exploring place, memory, and community.",
    longDescription: "Non-fiction and essayistic works that prioritize duration and patience. Drawing from traditions of direct cinema while incorporating formal experimentation.",
    count: 8,
  },
  {
    slug: "shorts",
    title: "Shorts",
    description: "Brief works under 20 minutes, ranging from experimental sketches to condensed narratives.",
    longDescription: "Some of the most experimental pieces in the archive. Created for gallery contexts, theatrical presentation, and everything in between.",
    count: 12,
  },
  {
    slug: "installations",
    title: "Installations",
    description: "Multi-channel and site-specific works designed for gallery exhibition.",
    longDescription: "Works requiring physical presence and specific architectural contexts. What you find here are excerpts, documentation, and single-channel adaptations.",
    count: 5,
  },
  {
    slug: "2020-2024",
    title: "2020 – 2024",
    description: "Recent works produced during and after the pandemic.",
    longDescription: "Made under conditions of isolation and restriction, reflecting on distance, intimacy, and the mediated nature of human connection.",
    count: 15,
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pt-32 pb-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent text-sm tracking-widest uppercase mb-6">
              Browse By
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-8 text-balance">
              Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              The archive is organized into four collections, each representing a distinct
              mode of working or a particular period of production.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="group p-8 border border-border hover:border-muted-foreground bg-background transition-colors"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-light text-foreground group-hover:text-accent transition-colors">
                      {collection.title}
                    </h2>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {collection.longDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                    <span>{collection.count} films</span>
                    <span className="text-border">|</span>
                    <span className="text-foreground group-hover:text-accent transition-colors">
                      View collection
                    </span>
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
