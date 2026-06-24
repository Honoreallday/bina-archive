import Link from "next/link"
import { getPublishedFilms } from "@/lib/films-data"

function tally(values: string[]) {
  const map = new Map<string, number>()
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1)
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

export default function ArchiveHome() {
  const films = getPublishedFilms()
  const categories = tally(films.map((f) => f.category))
  const collections = tally(films.flatMap((f) => f.collection))
  const years = tally(films.map((f) => String(f.year)))

  const columns = [
    { title: "Category", count: categories.length, rows: categories },
    { title: "Collection", count: collections.length, rows: collections },
    { title: "Year", count: years.length, rows: years },
  ]

  return (
    <div className="grid md:grid-cols-[200px_1fr]">
      {/* Sidebar */}
      <aside className="border-b border-[#b9b9b4] bg-[#f0f0ee] p-3 font-[family-name:var(--font-archive-mono)] text-xs md:border-b-0 md:border-r">
        <div className="flex items-center justify-between text-[#555]">
          <span>All Videos</span>
          <span className="font-semibold text-[#1a1a1a]">{films.length}</span>
        </div>
        <div className="mt-4 space-y-3">
          {["Personal Lists", "Featured Lists", "Local Volumes"].map((group) => (
            <div key={group}>
              <p className="font-semibold text-[#333]">{group}</p>
              <p className="mt-1 text-[#999]">no items</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded border border-[#b9b9b4] bg-[#1a1a1a] text-2xl font-bold text-[#f0f0ee]">
            ▲●▲
          </div>
          <p className="mt-2 text-[#555]">The Archive</p>
        </div>
      </aside>

      {/* Data columns */}
      <main className="p-0">
        <div className="grid grid-cols-1 border-b border-[#b9b9b4] sm:grid-cols-3">
          {columns.map((col) => (
            <section key={col.title} className="border-[#b9b9b4] sm:border-r sm:last:border-r-0">
              <header className="flex items-center justify-between border-b border-[#b9b9b4] bg-gradient-to-b from-[#f4f4f2] to-[#e2e2de] px-3 py-1 font-[family-name:var(--font-archive-mono)] text-[11px] font-semibold">
                <span>{col.title}</span>
                <span className="text-[#888]">{col.count}</span>
              </header>
              <ul className="font-[family-name:var(--font-archive-mono)] text-xs">
                {col.rows.map(([label, n], i) => (
                  <li
                    key={label}
                    className={`flex items-center justify-between px-3 py-1 ${
                      i % 2 === 0 ? "bg-[#f7f7f5]" : "bg-[#eeeeec]"
                    } hover:bg-[#b8cce4]`}
                  >
                    <span className="truncate">{label}</span>
                    <span className="text-[#888]">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Thumbnail grid */}
        <div className="bg-[#e8e8e6] p-4">
          <p className="mb-3 font-[family-name:var(--font-archive-mono)] text-[11px] text-[#555]">
            Showing {films.length} of {films.length} — sorted by date
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {films.map((film) => (
              <Link
                key={film.id}
                href="/examples/archive/films"
                className="group block rounded border border-[#c5c5c0] bg-[#f7f7f5] p-2 transition-colors hover:border-[#3b6ea5]"
              >
                <div className="overflow-hidden rounded-sm border border-[#d4d4cf] bg-[#1a1a1a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={film.image || "/placeholder.svg"}
                    alt={film.title}
                    className="aspect-video w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <p className="mt-2 truncate font-[family-name:var(--font-archive-mono)] text-[11px] font-semibold">
                  {film.title}
                </p>
                <p className="font-[family-name:var(--font-archive-mono)] text-[10px] text-[#777]">
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
