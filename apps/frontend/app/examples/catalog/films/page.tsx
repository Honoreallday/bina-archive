import { getPublishedFilms } from "@/lib/films-data"

const headers = ["#", "Title", "Category", "Collection", "Duration", "Year"]

export default function CatalogFilms() {
  const films = getPublishedFilms()

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#b3ae9f] bg-[#e9e3d5] px-3 py-2 text-[11px]">
        <span className="text-[#5a5648]">View:</span>
        <span className="rounded-sm border border-[#8a8578] bg-[#f2efe6] px-2 py-0.5 font-bold">
          List
        </span>
        <span className="rounded-sm border border-transparent px-2 py-0.5 text-[#7a7565]">Icon</span>
        <span className="rounded-sm border border-transparent px-2 py-0.5 text-[#7a7565]">
          Column
        </span>
        <span className="ml-auto text-[#7a7565]">{films.length} items</span>
      </div>

      {/* spreadsheet header */}
      <div className="grid grid-cols-[2rem_1fr_5rem_4rem] gap-2 border-b border-[#8a8578] bg-gradient-to-b from-[#efe8d6] to-[#ddd6c4] px-3 py-1 text-[10px] font-bold tracking-[0.12em] sm:grid-cols-[2rem_1fr_7rem_8rem_5rem_4rem]">
        {headers.map((h, i) => (
          <span
            key={h}
            className={
              i === 2 || i === 3
                ? "hidden sm:block"
                : i === 5
                  ? "text-right"
                  : ""
            }
          >
            {h}
          </span>
        ))}
      </div>

      {/* rows */}
      <ol className="text-xs">
        {films.map((film, i) => (
          <li
            key={film.id}
            className={`grid grid-cols-[2rem_1fr_5rem_4rem] items-center gap-2 border-b border-[#ddd6c4] px-3 py-2 sm:grid-cols-[2rem_1fr_7rem_8rem_5rem_4rem] ${
              i % 2 === 0 ? "bg-[#f6f3ea]" : "bg-[#ece6d8]"
            } hover:bg-[#ffd6e8]`}
          >
            <span className="text-[#8a8578]">{String(i + 1).padStart(2, "0")}</span>
            <span className="truncate font-bold text-[#1a1712]">{film.title}</span>
            <span className="hidden text-[#5a5648] sm:block">{film.category}</span>
            <span className="hidden truncate text-[#5a5648] sm:block">
              {film.collection[0] ?? "—"}
            </span>
            <span className="text-[#5a5648]">{film.duration}</span>
            <span className="text-right text-[#c2367a]">{film.year}</span>
          </li>
        ))}
      </ol>

      {/* footer note */}
      <div className="border-t border-[#b3ae9f] bg-[#e9e3d5] px-3 py-2">
        <p className="font-[family-name:var(--font-catalog-script)] text-sm text-[#c2367a]">
          double-click any row to screen the film — well, you would, if this were wired up.
        </p>
      </div>
    </div>
  )
}
