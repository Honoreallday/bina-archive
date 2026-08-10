import { getPublishedFilms } from "@/lib/films-data"

const headers = ["No.", "Title", "Year", "Runtime", "Subject", "Director"]

export default function AlmanacDocuments() {
  const films = getPublishedFilms()

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#c9c2b2] pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b6559]">Section II</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">The Documents</h2>
        </div>
        <p className="font-[family-name:var(--font-almanac-script)] text-xl text-[#d95b43]">
          every entry, in order
        </p>
      </div>

      {/* Ruled register */}
      <div className="overflow-x-auto border-2 border-[#211f1a]">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#211f1a] text-left text-[#efe9dd]">
              {headers.map((h) => (
                <th
                  key={h}
                  className="border-r border-[#4a463d] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] last:border-r-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {films.map((film, i) => (
              <tr
                key={film.id}
                className={`${
                  i % 2 === 0 ? "bg-[#efe9dd]" : "bg-[#e6dfd0]"
                } hover:bg-[#2f43c9] hover:text-[#efe9dd]`}
              >
                <td className="border-r border-[#c9c2b2] px-3 py-2 tabular-nums opacity-70">
                  {String(i + 1).padStart(3, "0")}
                </td>
                <td className="border-r border-[#c9c2b2] px-3 py-2 font-bold">{film.title}</td>
                <td className="border-r border-[#c9c2b2] px-3 py-2 tabular-nums">{film.year}</td>
                <td className="border-r border-[#c9c2b2] px-3 py-2">{film.duration}</td>
                <td className="border-r border-[#c9c2b2] px-3 py-2 uppercase tracking-wide">
                  {film.category}
                </td>
                <td className="px-3 py-2">{film.credits.director}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 font-[family-name:var(--font-almanac-script)] text-lg text-[#2f43c9]">
        {films.length} documents on file — margins left blank for your own notes.
      </p>
    </div>
  )
}
