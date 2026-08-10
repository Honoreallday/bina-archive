import Link from "next/link"
import { getPublishedFilms, getFeaturedFilms } from "@/lib/films-data"

function tally(values: string[]) {
  const map = new Map<string, number>()
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

export default function AlmanacIndex() {
  const films = getPublishedFilms()
  const featured = getFeaturedFilms()[0] ?? films[0]

  const columns = [
    { title: "By Subject", rows: tally(films.map((f) => f.category)) },
    { title: "By Collection", rows: tally(films.flatMap((f) => f.collection)) },
    { title: "By Year", rows: tally(films.map((f) => String(f.year))) },
  ]

  return (
    <div>
      {/* Poetic oversized statement */}
      <section className="border-b border-[#c9c2b2] pb-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#6b6559]">Entry no. 001 — preface</p>
        <h2 className="mt-4 max-w-4xl text-balance text-2xl font-bold leading-[1.3] tracking-tight sm:text-3xl md:text-4xl">
          An almanac of films kept in the margins of art, code and hardware — catalogued slowly, and
          read the way you&apos;d read the{" "}
          <span className="font-[family-name:var(--font-almanac-script)] font-normal text-[#2f43c9]">
            weather of a passing year.
          </span>
        </h2>
      </section>

      {/* Archive-style counted data columns, full width */}
      <section className="grid gap-px border border-[#211f1a] bg-[#211f1a] sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} className="bg-[#efe9dd]">
            <header className="flex items-center justify-between border-b border-[#211f1a] bg-[#211f1a] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#efe9dd]">
              <span>{col.title}</span>
              <span className="text-[#e0b64a]">{col.rows.length}</span>
            </header>
            <ul className="text-xs">
              {col.rows.map(([label, n], i) => (
                <li
                  key={label}
                  className={`flex items-center justify-between px-3 py-1.5 ${
                    i % 2 === 0 ? "bg-[#efe9dd]" : "bg-[#e6dfd0]"
                  } hover:bg-[#2f43c9] hover:text-[#efe9dd]`}
                >
                  <span className="truncate uppercase tracking-wide">{label}</span>
                  <span className="tabular-nums opacity-70">{String(n).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Featured document — poetic grayscale→color + script caption */}
      <section className="mt-12 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="overflow-hidden border-2 border-[#211f1a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured.image || "/placeholder.svg"}
            alt={featured.title}
            crossOrigin="anonymous"
            className="aspect-[4/3] w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
          />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#d95b43]">Plate of the month</p>
          <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight">{featured.title}</h3>
          <p className="mt-2 font-[family-name:var(--font-almanac-script)] text-2xl text-[#2f43c9]">
            {featured.year} · {featured.duration}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#3d382f]">
            {featured.synopsis ?? featured.description}
          </p>
          <Link
            href="/examples/almanac/films"
            className="mt-6 inline-block border-2 border-[#211f1a] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#211f1a] hover:text-[#efe9dd]"
          >
            open full index →
          </Link>
        </div>
      </section>
    </div>
  )
}
