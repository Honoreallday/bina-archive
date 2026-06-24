import Link from "next/link"
import { getPublishedFilms, getCategories } from "@/lib/films-data"

export default function EditorialFilms() {
  const films = getPublishedFilms()
  const categories = getCategories()

  return (
    <div>
      <header className="border-b-2 border-[#1a1a1a] pb-3">
        <h1 className="font-[family-name:var(--font-editorial-head)] text-3xl font-bold uppercase tracking-tight">
          Video Catalogue
        </h1>
        <p className="mt-1 text-sm text-[#444]">
          {films.length} titles in distribution · browse by category below
        </p>
      </header>

      {/* Filter row */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="bg-[#2e9e2a] px-3 py-1 font-[family-name:var(--font-editorial-head)] text-xs font-semibold uppercase tracking-wide text-white">
          All
        </span>
        {categories.map((cat) => (
          <span
            key={cat}
            className="border border-[#d4d4cf] px-3 py-1 font-[family-name:var(--font-editorial-head)] text-xs font-semibold uppercase tracking-wide text-[#444]"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Catalogue list */}
      <ul className="mt-6 divide-y divide-[#e2e2de] border-y border-[#e2e2de]">
        {films.map((film) => (
          <li key={film.id}>
            <Link
              href="/examples/editorial/films"
              className="group grid grid-cols-1 gap-4 py-4 sm:grid-cols-[160px_1fr_auto]"
            >
              <div className="overflow-hidden border border-[#e2e2de]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={film.image || "/placeholder.svg"}
                  alt={film.title}
                  className="aspect-video w-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-editorial-head)] text-xl font-bold leading-tight group-hover:text-[#2e9e2a]">
                  {film.title}
                </h2>
                <p className="text-xs uppercase tracking-wide text-[#888]">
                  {film.credits.director} · {film.category}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#444]">
                  {film.description}
                </p>
              </div>
              <div className="text-right font-[family-name:var(--font-editorial-head)] text-sm text-[#666]">
                <p className="text-lg font-bold text-[#1a1a1a]">{film.year}</p>
                <p>{film.duration}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
