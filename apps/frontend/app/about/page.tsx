import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPublishedFilms } from "@/lib/films-data"

export const metadata: Metadata = {
  title: "About | Dream Chambers Public Access",
  description: "Learn about Dream Chambers Public Access and the moving image archive.",
}

const press = [
  { quote: "Insert quote here", source: "[Publication]", year: "[Year]" },
  { quote: "Insert quote here", source: "[Publication]", year: "[Year]" },
  { quote: "Insert quote here", source: "[Publication]", year: "[Year]" },
]

export default function AboutPage() {
  const films = getPublishedFilms()

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10 pb-16 md:px-10">
        <div className="border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            About the Archive
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Dream Chambers Public Access
          </h1>
          <p className="mt-1 font-[family-name:var(--font-almanac-script)] text-xl text-[var(--almanac-red)]">
            a decade of moving image work
          </p>
        </div>

        {/* Founding */}
        <section className="grid gap-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Founding
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Dream Chambers Public Access was founded in 2019 in Minneapolis, Minnesota by a small
              group of artists, filmmakers, and organizers with a vision to reposition non-narrative
              moving image as an archival, historical, and liberatory medium that is accessible to
              all.
            </p>
            <p>
              DCPA runs on a multi-pillar model of community engagement through nomadic public
              screenings, a public television broadcast, workshop-style educational programs, and an
              independent/home video archive.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Mission
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Our mission is to solidify Minnesota as an environment where Black artists are
              supported, Black experimental film is critically engaged with, and our archives are
              well protected from erasure.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Values
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              DCPA&apos;s mission is to advocate for the visibility and recognition of Black video
              art, to effectively distribute this work, and to serve and support the producers of
              this unique art form. We consider our organization to be custodians of the works we
              distribute, and are committed to caring for and making them available for public
              presentation, acquisition, and research purposes over the long term. DCPA also
              supports the field of video art by collecting specialized research materials and
              making them available to the public, and by presenting public programming and
              publishing critical writing that increases the understanding and recognition of the
              form.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Archive at a glance
          </p>
          <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
            <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
              {[
                { n: String(films.length), label: "Films" },
                { n: "12", label: "Years" },
                { n: "4", label: "Collections" },
                { n: "24", label: "Streaming" },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col bg-[var(--almanac-parchment)] px-5 py-6">
                  <span className="text-4xl font-bold tabular-nums leading-none">{n}</span>
                  <span className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Press */}
        <section className="border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Selected press
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
              Press
            </header>
            {press.map((item, i) => (
              <div
                key={i}
                className={`grid gap-6 px-4 py-4 text-sm sm:grid-cols-[1fr_100px] ${
                  i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                }`}
              >
                <p className="leading-relaxed text-[var(--almanac-ink-mid)]">
                  <span className="text-[var(--almanac-border)]">&ldquo;</span>
                  {item.quote}
                  <span className="text-[var(--almanac-border)]">&rdquo;</span>
                </p>
                <div className="sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">{item.source}</p>
                  <p className="text-[11px] tabular-nums text-[var(--almanac-ink-light)]">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--almanac-border)] pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xl font-bold tracking-tight">Explore the collection</p>
              <p className="mt-1 text-sm text-[var(--almanac-ink-mid)]">
                Browse all films, or reach out for screening and licensing inquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/films"
                className="inline-block border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              >
                Browse films →
              </Link>
              <Link
                href="/contact"
                className="inline-block border border-[var(--almanac-border)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:border-[var(--almanac-ink)]"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
