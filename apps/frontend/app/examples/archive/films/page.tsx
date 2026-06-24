import { getPublishedFilms } from "@/lib/films-data"

const headers = ["#", "Title", "Year", "Duration", "Category", "Collection", "Director"]

export default function ArchiveFilms() {
  const films = getPublishedFilms()

  return (
    <main className="p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 font-[family-name:var(--font-archive-mono)] text-[11px]">
        <span className="rounded border border-[#b9b9b4] bg-[#f4f4f2] px-2 py-1">View as List ▾</span>
        <span className="rounded border border-[#b9b9b4] bg-[#f4f4f2] px-2 py-1">Sort by Date ▾</span>
        <span className="ml-auto rounded border border-[#b9b9b4] bg-white px-2 py-1 text-[#888]">
          Find: All
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-[#b9b9b4] bg-[#f7f7f5]">
        <table className="w-full border-collapse font-[family-name:var(--font-archive-mono)] text-xs">
          <thead>
            <tr className="bg-gradient-to-b from-[#f4f4f2] to-[#e0e0dc] text-left">
              {headers.map((h) => (
                <th
                  key={h}
                  className="border-b border-r border-[#cfcfc9] px-3 py-1.5 font-semibold last:border-r-0"
                >
                  {h} <span className="text-[#aaa]">▾</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {films.map((film, i) => (
              <tr
                key={film.id}
                className={`${i % 2 === 0 ? "bg-[#f7f7f5]" : "bg-[#ededeb]"} hover:bg-[#b8cce4]`}
              >
                <td className="border-r border-[#e0e0dc] px-3 py-1.5 text-[#888]">
                  {String(i + 1).padStart(3, "0")}
                </td>
                <td className="border-r border-[#e0e0dc] px-3 py-1.5 font-semibold">{film.title}</td>
                <td className="border-r border-[#e0e0dc] px-3 py-1.5">{film.year}</td>
                <td className="border-r border-[#e0e0dc] px-3 py-1.5">{film.duration}</td>
                <td className="border-r border-[#e0e0dc] px-3 py-1.5">{film.category}</td>
                <td className="border-r border-[#e0e0dc] px-3 py-1.5 text-[#555]">
                  {film.collection.join(", ")}
                </td>
                <td className="px-3 py-1.5 text-[#555]">{film.credits.director}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail preview of first record */}
      <section className="mt-4 grid gap-4 rounded border border-[#b9b9b4] bg-[#f0f0ee] p-4 md:grid-cols-[240px_1fr]">
        <div className="overflow-hidden rounded border border-[#cfcfc9] bg-[#1a1a1a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={films[0].image || "/placeholder.svg"}
            alt={films[0].title}
            className="aspect-video w-full object-cover"
          />
        </div>
        <div className="font-[family-name:var(--font-archive-mono)] text-xs">
          <p className="text-sm font-semibold">{films[0].title}</p>
          <p className="mt-1 text-[#777]">
            Record 001 · {films[0].year} · {films[0].duration} · {films[0].category}
          </p>
          <p className="mt-3 max-w-2xl font-[family-name:var(--font-archive-sans)] text-[13px] leading-relaxed text-[#333]">
            {films[0].synopsis}
          </p>
        </div>
      </section>
    </main>
  )
}
