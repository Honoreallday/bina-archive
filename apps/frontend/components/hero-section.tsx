import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8">
      {/* Background film still - subtle overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-accent text-sm tracking-widest uppercase mb-6">
          Digital Film Archive
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 text-balance">
          A collection of moving images
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Exploring memory, time, and the spaces between through film. 
          An archive of works spanning documentary, experimental, and installation pieces.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/films"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Browse Films
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground text-sm font-medium hover:border-muted-foreground transition-colors"
          >
            About the Archive
          </Link>
        </div>
      </div>
    </section>
  )
}
