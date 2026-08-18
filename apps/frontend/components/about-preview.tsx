import Link from "next/link"
import { getPublishedFilms } from "@/lib/films-data"

export function AboutPreview() {
  const films = getPublishedFilms()
  const totalMins = films.reduce((acc, f) => acc + (Number.parseInt(f.duration, 10) || 0), 0)

  return (
    <section className="mx-auto max-w-6xl border-t border-[var(--almanac-border)] px-6 py-14 md:px-10">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            About the archive
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">Dream Chambers Public Access</h2>
          <p className="mt-4 max-w-md text-balance text-lg font-bold leading-snug">
            Founded in Minneapolis in 2019 —{" "}
            <span className="font-[family-name:var(--font-almanac-script)] font-normal text-[var(--almanac-blue)]">
              built to support Black experimental film.
            </span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
            A vision to reposition non-narrative moving image as an archival, historical, and
            liberatory medium that is accessible to all.
          </p>
          <Link
            href="/about"
            className="mt-5 inline-block border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
          >
            Read more →
          </Link>
        </div>

        <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
          <div className="grid grid-cols-2 gap-px">
            {[
              { n: String(films.length), label: "Films" },
              { n: "12", label: "Years" },
              { n: "4", label: "Collections" },
              { n: `${Math.round(totalMins / 60)}h`, label: "Archived" },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col bg-[var(--almanac-parchment)] px-5 py-5">
                <span className="text-3xl font-bold tabular-nums leading-none">{n}</span>
                <span className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
