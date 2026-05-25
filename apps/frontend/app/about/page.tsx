import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About | Archive",
  description: "Learn about the artist and the digital film archive.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pt-32 pb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-accent text-sm tracking-widest uppercase mb-6">
              About the Archive
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-8 text-balance">
              Preserving a decade of moving image work
            </h1>
          </div>
        </section>

        {/* Artist Statement */}
        <section className="px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                  Artist Statement
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-foreground leading-relaxed">
                <p>
                  My work exists at the intersection of documentary practice and experimental
                  form. Over the past twelve years, I have developed a body of work that
                  investigates how moving images shape our understanding of memory, place,
                  and collective experience.
                </p>
                <p>
                  Each film begins with observation—of light, of gesture, of the way spaces
                  hold the residue of those who have passed through them. I am interested in
                  what remains when we stop performing for the camera, in the silences between
                  words, in the peripheral moments that traditional documentary often discards.
                </p>
                <p>
                  This archive represents an attempt to gather these works in one place, to
                  make them accessible to researchers, students, curators, and anyone drawn
                  to the slow unfolding of cinematic time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="px-6 lg:px-8 py-16 border-t border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                  Biography
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-foreground leading-relaxed">
                <p>
                  The artist works across film, video installation, and photography. Their
                  work has been exhibited internationally at institutions including the
                  Museum of Contemporary Art Chicago, Walker Art Center, and the Rotterdam
                  International Film Festival.
                </p>
                <p>
                  They received an MFA from the School of the Art Institute of Chicago and
                  have been awarded fellowships from the Guggenheim Foundation, Creative
                  Capital, and the Jerome Foundation. Their work is held in the collections
                  of the Whitney Museum of American Art and the Walker Art Center.
                </p>
                <p>
                  Currently based in the Midwest, they continue to produce work that
                  examines the landscapes and communities of the American interior.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Archive Information */}
        <section className="px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                  About This Archive
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-foreground leading-relaxed">
                <p>
                  This digital archive was established in 2024 to preserve and provide
                  access to a growing body of film work. The archive includes completed
                  films, documentation of installations, and selected production materials.
                </p>
                <p>
                  Many works are available for streaming directly through this site. Some
                  pieces—particularly multi-channel installations—are documented here but
                  require in-person viewing. For institutional access, screening requests,
                  or licensing inquiries, please visit our contact page.
                </p>

                <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <p className="text-3xl font-light text-foreground">38</p>
                    <p className="text-sm text-muted-foreground mt-1">Films</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-foreground">12</p>
                    <p className="text-sm text-muted-foreground mt-1">Years</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-foreground">4</p>
                    <p className="text-sm text-muted-foreground mt-1">Collections</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-foreground">24</p>
                    <p className="text-sm text-muted-foreground mt-1">Streaming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Press */}
        <section className="px-6 lg:px-8 py-16 border-t border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                  Selected Press
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-8">
                {[
                  {
                    quote: "A body of work that refuses easy categorization, moving fluidly between documentary and abstraction.",
                    source: "Artforum",
                    year: "2023",
                  },
                  {
                    quote: "The patience of these films is itself a statement—a rejection of the accelerated rhythms of contemporary image culture.",
                    source: "Sight & Sound",
                    year: "2022",
                  },
                  {
                    quote: "Essential viewing for anyone interested in the future of documentary practice.",
                    source: "Film Comment",
                    year: "2021",
                  },
                ].map((item, index) => (
                  <blockquote key={index} className="border-l-2 border-accent pl-6">
                    <p className="text-foreground leading-relaxed italic">
                      {`"${item.quote}"`}
                    </p>
                    <footer className="mt-3 text-sm text-muted-foreground">
                      {item.source}, {item.year}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-8 py-24 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              Explore the collection
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Browse the full archive of films, or reach out for screening inquiries
              and institutional access.
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
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground text-sm font-medium hover:border-muted-foreground transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
