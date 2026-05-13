import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AboutPreview() {
  return (
    <section className="px-6 lg:px-8 py-24 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <p className="text-accent text-sm tracking-widest uppercase mb-4">About the Archive</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-6 text-balance">
              Preserving and sharing a body of work
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This archive serves as a digital repository for a collection of films spanning 
                over a decade of practice. Each work explores themes of memory, displacement, 
                and the constructed nature of image-making.
              </p>
              <p>
                The archive is intended for researchers, curators, and viewers interested in 
                engaging with the full scope of these moving image works. Many pieces are 
                available for streaming, while others require institutional access.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8 text-sm text-foreground hover:text-accent transition-colors"
            >
              Learn more about the artist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-2 border-accent pl-6">
              <p className="text-2xl md:text-3xl font-light text-foreground mb-2">38</p>
              <p className="text-sm text-muted-foreground">Films in the archive</p>
            </div>
            <div className="border-l-2 border-border pl-6">
              <p className="text-2xl md:text-3xl font-light text-foreground mb-2">2012 - 2024</p>
              <p className="text-sm text-muted-foreground">Span of works</p>
            </div>
            <div className="border-l-2 border-border pl-6">
              <p className="text-2xl md:text-3xl font-light text-foreground mb-2">24</p>
              <p className="text-sm text-muted-foreground">Available for streaming</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
