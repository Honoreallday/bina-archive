import Link from "next/link"
import { getPublishedFilms, getCategories } from "@/lib/films-data"

export default function TerminalHome() {
  const films = getPublishedFilms()
  const categories = getCategories()

  return (
    <div>
      {/* oversized statement, poetic flavor ------------------------- */}
      <section className="border-b border-[#f4f1ea]/15 px-5 py-10 md:px-8 md:py-14">
        <p className="text-xs tracking-[0.25em] text-[#f4f1ea]/45">FILE: 00 — README</p>
        <h1 className="mt-5 max-w-3xl text-balance text-2xl leading-[1.3] tracking-tight sm:text-3xl md:text-4xl">
          b/na is an experimental archive of films made in the margins of art, code, hardware and{" "}
          <span className="font-[family-name:var(--font-terminal-script)] text-[#ff5da2]">
            slow looking.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#f4f1ea]/65">
          Everything here is catalogued by hand. No recommendations, no autoplay. Browse the index
          below, the way you would flip through a card catalog.
        </p>
      </section>

      {/* directory of categories ------------------------------------ */}
      <section className="border-b border-[#f4f1ea]/15 px-5 py-6 md:px-8">
        <p className="text-xs tracking-[0.25em] text-[#f4f1ea]/45">DIRECTORIES</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {categories.map((cat) => (
            <span key={cat} className="text-[#f4f1ea]/80">
              <span className="text-[#7cffb2]">/</span>
              {cat.toLowerCase()}
            </span>
          ))}
        </div>
      </section>

      {/* rigid index table ------------------------------------------ */}
      <section className="px-5 py-6 md:px-8">
        <div className="flex items-baseline justify-between">
          <p className="text-xs tracking-[0.25em] text-[#f4f1ea]/45">INDEX OF FILMS</p>
          <Link
            href="/examples/terminal/films"
            className="text-xs tracking-[0.18em] text-[#ff5da2] hover:underline"
          >
            OPEN CATALOG &rarr;
          </Link>
        </div>

        {/* header row */}
        <div className="mt-4 grid grid-cols-[2rem_1fr_4rem] gap-3 border-y border-[#f4f1ea]/25 py-2 text-[10px] tracking-[0.2em] text-[#f4f1ea]/45 sm:grid-cols-[2rem_1fr_8rem_5rem_4rem]">
          <span>#</span>
          <span>TITLE</span>
          <span className="hidden sm:block">CATEGORY</span>
          <span className="hidden sm:block">DURATION</span>
          <span className="text-right">YEAR</span>
        </div>

        {/* rows */}
        <ol>
          {films.map((film, i) => (
            <li key={film.id}>
              <Link
                href="/examples/terminal/films"
                className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 border-b border-[#f4f1ea]/12 py-3 text-sm transition-colors hover:bg-[#161616] sm:grid-cols-[2rem_1fr_8rem_5rem_4rem]"
              >
                <span className="text-[#f4f1ea]/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">
                  <span className="text-[#f4f1ea] group-hover:text-[#7cffb2]">{film.title}</span>
                  <span className="ml-2 text-xs text-[#f4f1ea]/45 sm:hidden">{film.year}</span>
                </span>
                <span className="hidden text-xs text-[#f4f1ea]/60 sm:block">{film.category}</span>
                <span className="hidden text-xs text-[#f4f1ea]/60 sm:block">{film.duration}</span>
                <span className="text-right text-xs text-[#ff5da2]">{film.year}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* signup, rigid box ------------------------------------------ */}
      <section className="border-t border-[#f4f1ea]/15 px-5 py-8 md:px-8">
        <div className="border border-[#f4f1ea]/25 p-5 md:p-6">
          <h2 className="text-base leading-snug md:text-lg">
            a few transmissions a year. no tracking, no funnels, no{" "}
            <span className="font-[family-name:var(--font-terminal-script)] text-[#ff5da2]">
              optimization.
            </span>
          </h2>
          <form className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.here"
              className="flex-1 border border-[#f4f1ea]/30 bg-transparent px-3 py-2 text-sm placeholder:text-[#f4f1ea]/35 focus:border-[#7cffb2] focus:outline-none"
            />
            <button
              type="button"
              className="bg-[#ff5da2] px-4 py-2 text-sm font-bold tracking-[0.1em] text-[#0c0c0c]"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
