import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Submissions | Dream Chambers Public Access",
  description: "Eligibility and criteria for submitting work to the DCPA collection.",
}

const eligibility: [string, string][] = [
  ["Identify as", "Black American"],
  ["Reside in", "Minnesota — greater Midwest region accepted solely by invitation"],
]

const criteria = [
  "Is original (for artist films)",
  "Under 45 minutes",
  "Is not represented and stored by larger entities or represented by other MN distributors (The Walker, larger archives, etc.)",
  "People depicted are Black American",
  "Artist work challenges, questions, and is intentionally made",
]

export default function SubmissionsPage() {
  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10 pb-16 md:px-10">
        <div className="border-b border-[var(--almanac-border)] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Submissions</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Held to the same light as everything else in the collection
          </h1>
        </div>

        <section className="grid gap-10 md:grid-cols-[180px_1fr]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Before You Submit
          </p>
          <div className="space-y-4 text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            <p>
              Once an artist&apos;s work has been accepted for distribution at DCPA, new works are
              acquired for the catalogue as they are produced, and needn&apos;t go through the same
              submission process.
            </p>
            <p>
              As a reminder: the DCPA distribution collection is known for video art, works that
              push form and content through experimental approaches, social and political
              issue-based documentaries, and works originating from underrepresented communities.
              Projects of a conventional nature, for example, dramatic shorts or calling card
              films, are generally not well-served by the focus of this collection.
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Artist or submitter must
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            <dl>
              {eligibility.map(([label, value], i) => (
                <div
                  key={label}
                  className={`grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-xs ${
                    i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                  }`}
                >
                  <dt className="uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">{label}</dt>
                  <dd className="font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            DCPA will consider works that meet all criteria below
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            {criteria.map((item, i) => (
              <div
                key={item}
                className={`flex items-start gap-3 px-4 py-3 text-sm leading-relaxed ${
                  i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                } ${i > 0 ? "border-t border-[var(--almanac-border)]" : ""}`}
              >
                <span className="mt-0.5 text-[11px] tabular-nums text-[var(--almanac-ink-light)] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--almanac-ink-mid)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--almanac-border)] pt-8">
          <p className="text-xl font-bold tracking-tight">Ready to submit?</p>
          <p className="mt-2 text-sm text-[var(--almanac-ink-mid)]">
            Please contact{" "}
            <a
              href="mailto:dreamchambers@proton.me"
              className="font-bold text-[var(--almanac-blue)] hover:underline"
            >
              dreamchambers@proton.me
            </a>{" "}
            with submission inquiries.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
