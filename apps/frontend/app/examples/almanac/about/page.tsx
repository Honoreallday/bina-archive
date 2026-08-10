import { getPublishedFilms } from "@/lib/films-data"

export default function AlmanacColophon() {
  const films = getPublishedFilms()
  const totalMinutes = films.reduce((sum, f) => sum + (Number.parseInt(f.duration, 10) || 0), 0)

  const rows: [string, string][] = [
    ["Title", "The Almanac — Vol. 04"],
    ["Editor", "b/na field archive"],
    ["Records", `${films.length} documents`],
    ["Running time", `${totalMinutes} minutes catalogued`],
    ["Method", "Slow looking, hand indexing"],
    ["Typography", "Space Mono · Kalam"],
    ["Binding", "Screen-bound, no backend"],
    ["Revised", "2024, and whenever we notice"],
  ]

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
      {/* Poetic statement side */}
      <section>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b6559]">Section III</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Colophon</h2>
        <p className="mt-6 max-w-md text-balance text-xl font-bold leading-snug">
          An almanac is not a website that happens to hold films. It is a{" "}
          <span className="font-[family-name:var(--font-almanac-script)] font-normal text-[#2f43c9]">
            reading room
          </span>{" "}
          that happens to be a screen.
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#3d382f]">
          Every entry is measured, dated, and set into the register by hand. Nothing is recommended
          to you; you find your way through the columns the way you&apos;d thumb an old reference
          book.
        </p>
        <p className="mt-6 font-[family-name:var(--font-almanac-script)] text-2xl text-[#d95b43]">
          — kept by the archive
        </p>
      </section>

      {/* Archive-style ruled key/value register */}
      <section className="border-2 border-[#211f1a]">
        <header className="border-b border-[#211f1a] bg-[#211f1a] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#efe9dd]">
          Publication record
        </header>
        <dl>
          {rows.map(([label, value], i) => (
            <div
              key={label}
              className={`grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-xs ${
                i % 2 === 0 ? "bg-[#efe9dd]" : "bg-[#e6dfd0]"
              }`}
            >
              <dt className="uppercase tracking-[0.14em] text-[#6b6559]">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
