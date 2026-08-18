import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Distribution | Dream Chambers Public Access",
  description: "DCPA's non-exclusive distribution model, services, and core markets.",
}

const services = [
  "Assistance determining the most appropriate long-term marketing and promotions approach",
  "Negotiating television broadcast licenses and purchase contracts",
  "Working through the “rights of use” associated with each license type",
  "Assistance with festival and show applications",
  "Marketing and promotional services",
]

export default function DistributionPage() {
  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10 pb-16 md:px-10">
        <div className="border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Distribution</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            On behalf of the artist, never in place of them
          </h1>
        </div>

        <section className="grid gap-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Our Model
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              DCPA is a non-exclusive distributor, and all rights for the works we represent are
              retained by the artists, including the right to self-distribution and promotion. We
              work collaboratively with our artists on an ongoing basis to determine the most
              effective distribution strategy for their work.
            </p>
            <p>
              We are mandated to secure fees for any public exhibition of the works in our
              collection. We fill orders, ship and track returning media, invoice clients and
              collect the distribution fees. Seventy-five percent of all rentals and sales of an
              artist&apos;s work are remitted to the artist; marketing and promotional costs are
              dependent on the project.
            </p>
            <p>
              Once the artist has signed a non-exclusive distribution contract with DCPA, they are
              required to provide inventory of each work.
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            As distributing members of DCPA, you can receive
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            {services.map((service, i) => (
              <div
                key={service}
                className={`flex items-start gap-3 px-4 py-3 text-sm leading-relaxed ${
                  i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                } ${i > 0 ? "border-t border-[var(--almanac-border)]" : ""}`}
              >
                <span className="mt-0.5 text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--almanac-ink-mid)]">{service}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Collaboration
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              DCPA collaborates with artists in the collection with regard to distribution
              approaches, encouraging on-going communication with staff around specific exhibition
              or acquisition objectives as they develop, on a case-by-case basis. The collaboration
              is furthered when artists direct interest in their video works to DCPA, list DCPA as
              a print source in festival and exhibition catalogues, and present DCPA as a source
              for their work throughout their web presence (email signature, website, social
              media, etc.).
            </p>
          </div>
        </section>

        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Core Markets
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              DCPA&apos;s core markets include film/video festivals, art galleries, museums,
              educational institutions, and community organizations. The DCPA distribution
              collection is known for video art, works that push form and content through
              experimental approaches, social and political issue-based documentaries, and works
              originating from underrepresented communities. Projects of a conventional nature, for
              example, dramatic shorts or calling card films, are generally not well-served by the
              focus of this collection.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
