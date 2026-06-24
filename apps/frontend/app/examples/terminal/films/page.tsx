import { getPublishedFilms } from "@/lib/films-data"

export default function TerminalCatalog() {
  const films = getPublishedFilms()

  return (
    <div>
      <section className="border-b border-[#f4f1ea]/15 px-5 py-8 md:px-8">
        <p className="text-xs tracking-[0.25em] text-[#f4f1ea]/45">FILE: 01 — CATALOG</p>
        <h1 className="mt-4 text-2xl tracking-tight md:text-3xl">
          the full{" "}
          <span className="font-[family-name:var(--font-terminal-script)] text-[#ff5da2]">
            holdings
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#f4f1ea]/65">
          {films.length} records, listed in order of accession. Each entry pairs a still with its
          catalog data.
        </p>
      </section>

      {/* column header */}
      <div className="grid grid-cols-[2rem_5rem_1fr] gap-3 border-b border-[#f4f1ea]/25 px-5 py-2 text-[10px] tracking-[0.2em] text-[#f4f1ea]/45 md:px-8">
        <span>#</span>
        <span>STILL</span>
        <span>RECORD</span>
      </div>

      <ol>
        {films.map((film, i) => (
          <li
            key={film.id}
            className="grid grid-cols-[2rem_5rem_1fr] items-start gap-3 border-b border-[#f4f1ea]/12 px-5 py-4 transition-colors hover:bg-[#161616] md:px-8"
          >
            <span className="pt-1 text-xs text-[#f4f1ea]/40">{String(i + 1).padStart(2, "0")}</span>
            <div className="overflow-hidden border border-[#f4f1ea]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={film.image || "/placeholder.svg"}
                alt={film.title}
                crossOrigin="anonymous"
                className="aspect-square w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-base text-[#f4f1ea]">{film.title}</h2>
                <span className="text-xs text-[#ff5da2]">{film.year}</span>
                <span className="text-xs text-[#f4f1ea]/45">
                  {film.category} &middot; {film.duration}
                </span>
              </div>
              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#f4f1ea]/65">
                {film.description}
              </p>
              <p className="mt-2 text-[10px] tracking-[0.15em] text-[#f4f1ea]/40">
                DIR. {film.credits.director.toUpperCase()}
                {film.collection.length > 0 && (
                  <span className="text-[#7cffb2]"> / {film.collection.join(" / ")}</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
