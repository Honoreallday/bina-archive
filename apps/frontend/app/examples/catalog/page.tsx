import Link from "next/link"
import { getPublishedFilms } from "@/lib/films-data"

function tally(values: string[]) {
  const map = new Map<string, number>()
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

export default function CatalogDesktop() {
  const films = getPublishedFilms()
  const categories = tally(films.map((f) => f.category))
  const collections = tally(films.flatMap((f) => f.collection))
  const years = tally(films.map((f) => String(f.year)))

  const columns = [
    { title: "Category", rows: categories },
    { title: "Collection", rows: collections },
    { title: "Year", rows: years },
  ]

  return (
    <div className="grid md:grid-cols-[190px_1fr]">
      {/* sidebar ---------------------------------------------------- */}
      <aside className="border-b border-[#b3ae9f] bg-[#e9e3d5] p-3 text-xs md:border-b-0 md:border-r">
        <div className="flex items-center justify-between text-[#5a5648]">
          <span>All Films</span>
          <span className="font-bold text-[#1a1712]">{films.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {["Personal Lists", "Featured Lists", "Local Volumes"].map((group) => (
            <div key={group}>
              <p className="font-bold text-[#3a362c]">{group}</p>
              <p className="mt-1 text-[#9a9482]">empty</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border border-[#b3ae9f] bg-[#f2efe6] p-3">
          <p className="font-[family-name:var(--font-catalog-script)] text-base text-[#c2367a]">
            drag a film onto a shelf to keep it
          </p>
        </div>
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded border border-[#8a8578] bg-[#1a1712] text-lg font-bold text-[#7cffb2]">
            b/na
          </div>
          <p className="mt-2 text-[#5a5648]">The Archive</p>
        </div>
      </aside>

      {/* main ------------------------------------------------------- */}
      <main>
        {/* data columns */}
        <div className="grid grid-cols-1 border-b border-[#b3ae9f] sm:grid-cols-3">
          {columns.map((col) => (
            <section key={col.title} className="border-[#b3ae9f] sm:border-r sm:last:border-r-0">
              <header className="flex items-center justify-between border-b border-[#b3ae9f] bg-gradient-to-b from-[#efe8d6] to-[#ddd6c4] px-3 py-1 text-[11px] font-bold">
                <span>{col.title}</span>
                <span className="text-[#8a8578]">{col.rows.length}</span>
              </header>
              <ul className="text-xs">
                {col.rows.map(([label, n], i) => (
                  <li
                    key={label}
                    className={`flex items-center justify-between px-3 py-1 ${
                      i % 2 === 0 ? "bg-[#f6f3ea]" : "bg-[#ece6d8]"
                    } hover:bg-[#ffd6e8]`}
                  >
                    <span className="truncate">{label}</span>
                    <span className="text-[#8a8578]">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* thumbnail grid */}
        <div className="bg-[#e4ddcd] p-4">
          <p className="mb-3 text-[11px] text-[#5a5648]">
            Showing {films.length} of {films.length} — sorted by date
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {films.map((film) => (
              <Link
                key={film.id}
                href="/examples/catalog/films"
                className="group block rounded border border-[#b3ae9f] bg-[#f6f3ea] p-2 transition-colors hover:border-[#c2367a]"
              >
                <div className="overflow-hidden rounded-sm border border-[#c9c3b3] bg-[#1a1712]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={film.image || "/placeholder.svg"}
                    alt={film.title}
                    crossOrigin="anonymous"
                    className="aspect-video w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <p className="mt-2 truncate text-[11px] font-bold">{film.title}</p>
                <p className="text-[10px] text-[#7a7565]">
                  {film.year}-{String(film.id).padStart(2, "0")} · {film.duration}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
