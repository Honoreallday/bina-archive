import Link from "next/link"
import { getPublishedFilms, getCategories } from "@/lib/films-data"

export default function DuskHome() {
  const films = getPublishedFilms()
  const categories = getCategories()

  return (
    <div>
      {/* oversized statement, poetic flavor ------------------------- */}
      <section className="border-b border-[#e9e1d1]/12 px-5 py-10 md:px-8 md:py-14">
        <p className="text-xs tracking-[0.25em] text-[#e9e1d1]/40">FILE: 00 — README</p>
        <h1 className="mt-5 max-w-3xl text-balance text-2xl leading-[1.35] tracking-tight sm:text-3xl md:text-4xl">
          b/na is an experimental archive of films made in the margins of art, code, hardware and{" "}
          <span className="font-[family-name:var(--font-dusk-script)] text-[#cf9089]">
            slow looking.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#e9e1d1]/60">
          Everything here is catalogued by hand. No recommendations, no autoplay. Browse the index
          below, the way you would flip through a card catalog by lamplight.
        </p>
      </section>

      {/* directory of categories ------------------------------------ */}
      <section className="border-b border-[#e9e1d1]/12 px-5 py-6 md:px-8">
        <p className="text-xs tracking-[0.25em] text-[#e9e1d1]/40">DIRECTORIES</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {categories.map((cat) => (
            <span key={cat} className="text-[#e9e1d1]/75">
              <span className="text-[#a7b98f]">/</span>
              {cat.toLowerCase()}
            </span>
          ))}
        </div>
      </section>

      {/* rigid index table ------------------------------------------ */}
      <section className="px-5 py-6 md:px-8">
        <div className="flex items-baseline justify-between">
          <p className="text-xs tracking-[0.25em] text-[#e9e1d1]/40">INDEX OF FILMS</p>
          <Link
            href="/examples/dusk/films"
            className="text-xs tracking-[0.18em] text-[#cf9089] hover:underline"
          >
            OPEN CATALOG &rarr;
          </Link>
        </div>

        {/* header row */}
        <div className="mt-4 grid grid-cols-[2rem_1fr_4rem] gap-3 border-y border-[#e9e1d1]/20 py-2 text-[10px] tracking-[0.2em] text-[#e9e1d1]/40 sm:grid-cols-[2rem_1fr_8rem_5rem_4rem]">
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
                href="/examples/dusk/films"
                className="grid grid-cols-[2rem_1fr_4rem] items-center gap-3 border-b border-[#e9e1d1]/10 py-3 text-sm transition-colors hover:bg-[#221e19] sm:grid-cols-[2rem_1fr_8rem_5rem_4rem]"
              >
                <span className="text-[#e9e1d1]/35">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">
                  <span className="text-[#e9e1d1]">{film.title}</span>
                  <span className="ml-2 text-xs text-[#e9e1d1]/40 sm:hidden">{film.year}</span>
                </span>
                <span className="hidden text-xs text-[#e9e1d1]/55 sm:block">{film.category}</span>
                <span className="hidden text-xs text-[#e9e1d1]/55 sm:block">{film.duration}</span>
                <span className="text-right text-xs text-[#cf9089]">{film.year}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* signup, rigid box ------------------------------------------ */}
      <section className="border-t border-[#e9e1d1]/12 px-5 py-8 md:px-8">
        <div className="rounded-md border border-[#e9e1d1]/20 bg-[#211d18] p-5 md:p-6">
          <h2 className="text-base leading-snug md:text-lg">
            a few transmissions a year. no tracking, no funnels, no{" "}
            <span className="font-[family-name:var(--font-dusk-script)] text-[#cf9089]">
              optimization.
            </span>
          </h2>
          <form className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.here"
              className="flex-1 rounded border border-[#e9e1d1]/25 bg-transparent px-3 py-2 text-sm placeholder:text-[#e9e1d1]/30 focus:border-[#a7b98f] focus:outline-none"
            />
            <button
              type="button"
              className="rounded bg-[#cf9089] px-4 py-2 text-sm font-bold tracking-[0.1em] text-[#1b1916]"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
