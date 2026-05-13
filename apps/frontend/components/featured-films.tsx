import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"

const featuredFilms = [
  {
    id: 1,
    title: "Dissolving Boundaries",
    year: 2023,
    duration: "24 min",
    category: "Documentary",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    slug: "dissolving-boundaries",
  },
  {
    id: 2,
    title: "The Weight of Light",
    year: 2022,
    duration: "12 min",
    category: "Experimental",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    slug: "weight-of-light",
  },
  {
    id: 3,
    title: "Echoes in the Frame",
    year: 2021,
    duration: "18 min",
    category: "Short",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    slug: "echoes-in-the-frame",
  },
]

export function FeaturedFilms() {
  return (
    <section className="px-6 lg:px-8 py-24 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-accent text-sm tracking-widest uppercase mb-2">Now Streaming</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
              Featured Works
            </h2>
          </div>
          <Link 
            href="/films" 
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all films
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFilms.map((film) => (
            <Link
              key={film.id}
              href={`/films/${film.slug}`}
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden bg-secondary mb-4">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-foreground/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-background ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{film.category}</span>
                  <span className="text-border">|</span>
                  <span>{film.duration}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                  {film.title}
                </h3>
                <p className="text-sm text-muted-foreground">{film.year}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link 
            href="/films" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all films
          </Link>
        </div>
      </div>
    </section>
  )
}
