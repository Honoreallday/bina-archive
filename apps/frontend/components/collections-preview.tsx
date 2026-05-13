import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const collections = [
  {
    name: "Shorts",
    count: 12,
    description: "Brief explorations under 15 minutes",
    slug: "shorts",
  },
  {
    name: "Installations",
    count: 5,
    description: "Multi-channel and gallery works",
    slug: "installations",
  },
  {
    name: "Documentary",
    count: 8,
    description: "Non-fiction and observational pieces",
    slug: "documentary",
  },
  {
    name: "2020-2024",
    count: 15,
    description: "Recent works from the past four years",
    slug: "2020-2024",
  },
]

export function CollectionsPreview() {
  return (
    <section className="px-6 lg:px-8 py-24 border-t border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-accent text-sm tracking-widest uppercase mb-2">Browse By</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group p-6 border border-border hover:border-muted-foreground bg-background transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl font-light text-foreground group-hover:text-accent transition-colors">
                  {collection.name}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {collection.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {collection.count} films
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
