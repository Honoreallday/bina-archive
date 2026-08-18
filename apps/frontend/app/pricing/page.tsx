import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Pricing | Dream Chambers Public Access",
  description: "Rental, purchase, and media request rates for the DCPA collection.",
}

const screeningRates: [string, string][] = [
  ["Up to 5:00", "$70.00"],
  ["5:01 – 15:00", "$100.00"],
  ["15:01 – 30:00", "$150.00"],
  ["30:01 – 60:00", "$200.00"],
  ["60:01 or longer", "$250.00"],
]

const educationalRates: [string, string][] = [
  ["5-year streaming license", "$550"],
  ["3-year streaming license", "$375"],
  ["1-year streaming license", "$220"],
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10 pb-16 md:px-10">
        <div className="border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Pricing</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Rentals, purchases, and requests
          </h1>
        </div>

        <section className="grid gap-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Media Request
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Titles are available for preview online through our password-protected website, or
              onsite at our Research Station. If you wish to preview particular videos from the
              DCPA collection, please submit a Media Request to{" "}
              <a
                href="mailto:dreamchambers@proton.me"
                className="font-bold text-[var(--almanac-blue)] hover:underline"
              >
                dreamchambers@proton.me
              </a>
              .
            </p>
            <p>
              Curators and programmers, please contact{" "}
              <a
                href="mailto:dreamchambers@proton.me"
                className="font-bold text-[var(--almanac-blue)] hover:underline"
              >
                dreamchambers@proton.me
              </a>{" "}
              to receive a login and password to access DCPA titles online.
            </p>
          </div>
        </section>

        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Rental
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Videos are available as rentals for exhibition at festivals, art galleries and
              museums, and in educational settings. If you wish to rent specific videos from the
              collection, please submit a Media Request (see Media Request above). We will respond
              with appropriate rental information.
            </p>
            <p>
              Rates vary depending upon the number of screenings or the length of an exhibition.
              Details for different types of rentals, and minimum rental rates, are provided below.
              Prices may vary from video to video; for a quote on particular works, please inquire.
              Technical fees may apply in some cases, and will be disclosed prior to payment.
            </p>

            <div className="pt-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink)]">
                Standard Public Screening Rental Rates — Single Screening
              </p>
              <div className="overflow-x-auto border-2 border-[var(--almanac-ink)]">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--almanac-ink)] text-left text-[var(--almanac-parchment)]">
                      <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                        Title Length (minutes)
                      </th>
                      <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screeningRates.map(([length, rate], i) => (
                      <tr
                        key={length}
                        className={i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"}
                      >
                        <td className="border-r border-[var(--almanac-border)] px-3 py-2">{length}</td>
                        <td className="px-3 py-2 font-bold tabular-nums">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[var(--almanac-ink-light)]">
              This is a minimum fee schedule. Rates may vary for specific titles; please contact
              DCPA for a quote. Under most circumstances, second and additional screenings are
              priced at 50% of the base price (e.g., if a festival is screening a ten-minute work
              twice, the total screening fee will be $140 + $70 = $210).
            </p>

            <div className="pt-4">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink)]">
                Gallery and Museum Exhibition Rates
              </p>
              <p>
                Gallery and museum public exhibition rates vary according to the work, the
                duration of exhibition, and the level of funding of the presenter. Please contact
                DCPA at{" "}
                <a
                  href="mailto:dreamchambers@proton.me"
                  className="font-bold text-[var(--almanac-blue)] hover:underline"
                >
                  dreamchambers@proton.me
                </a>{" "}
                with exhibition details to obtain a quote.
              </p>
            </div>

            <div className="pt-4">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink)]">
                Library Screening Rates
              </p>
              <p>
                In a library screening, the video is played once for an audience and then remains
                with the client for a predetermined period of time for screening on request. For
                videos of all lengths, the library screening rate is generally double the
                single-screening Standard Rental Rate listed above.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-t border-[var(--almanac-border)] pt-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Purchase
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Educational institutions, art galleries, museums and other clients may purchase
              videos with public performance rights for permanent collections, or purchase
              long-term licenses for the use of particular videos in a specific institutional
              context. If you wish to purchase specific videos from the DCPA collection, please
              submit a Media Request (see Media Request above).
            </p>
            <p>
              Prices may vary from video to video; for a quote on particular works, please inquire.
              Technical fees may apply in some cases, and will be disclosed prior to payment.
            </p>

            <div className="pt-2">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink)]">
                Purchase Pricing
              </p>
              <p>
                Videos are available for purchase with public performance rights by institutions
                and libraries. Rates, terms and conditions of use may vary according to the type of
                client; please contact DCPA for a quote. Some videos are available for home use.
                Special purchase pricing for non-profit community groups is available for some
                videos.
              </p>
            </div>

            <div className="pt-2">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-ink)]">
                Standard Educational License Rates — Classroom / Library Circulation
              </p>
              <div className="overflow-x-auto border-2 border-[var(--almanac-ink)]">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--almanac-ink)] text-left text-[var(--almanac-parchment)]">
                      <th className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">
                        License Term
                      </th>
                      <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em]">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationalRates.map(([term, rate], i) => (
                      <tr
                        key={term}
                        className={i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"}
                      >
                        <td className="border-r border-[var(--almanac-border)] px-3 py-2">{term}</td>
                        <td className="px-3 py-2 font-bold tabular-nums">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--almanac-ink-light)]">
                Can include an optional DVD for library circulation at no additional cost apart
                from shipping. This is a minimum fee schedule — rates may vary for specific titles;
                please contact DCPA for a quote.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
