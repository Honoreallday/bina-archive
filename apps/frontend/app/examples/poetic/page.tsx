import Link from "next/link"
import { getFeaturedFilms } from "@/lib/films-data"

export default function PoeticHome() {
  const featured = getFeaturedFilms()

  return (
    <main className="px-6">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-pretty text-4xl font-bold leading-[1.15] md:text-6xl">
          The Archive is an experimental record of films made in the margins of art, code, memory
          and{" "}
          <span className="font-[family-name:var(--font-poetic-script)] text-[#ff5da2]">
            slow looking.
          </span>
        </h1>

        <div className="mt-12 rounded-2xl border border-[#f4f1ea]/25 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7cffb2]">now showing</p>
          <h2 className="mt-3 font-[family-name:var(--font-poetic-script)] text-4xl md:text-5xl">
            Dissolving Boundaries
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#f4f1ea]/70">
            June screening &middot; 24 min &middot; A meditation on the threads between our physical
            bodies and the networks we keep dissolving into.
          </p>
          <Link
            href="/examples/poetic/films"
            className="mt-6 inline-block rounded-full border border-[#f4f1ea]/40 px-5 py-2 text-sm transition-colors hover:border-[#7cffb2] hover:text-[#7cffb2]"
          >
            see the program
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link href="/examples/poetic/films" className="text-sm text-[#ff5da2] hover:underline">
            all films &rarr;
          </Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {featured.map((film, i) => (
            <Link key={film.id} href="/examples/poetic/films" className="group block">
              <div className="overflow-hidden rounded-xl border border-[#f4f1ea]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={film.image || "/placeholder.svg"}
                  alt={film.title}
                  className="aspect-[4/3] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span
                  className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0c0c0c]"
                  style={{ backgroundColor: i % 2 === 0 ? "#ff5da2" : "#7cffb2" }}
                >
                  {film.year}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-poetic-script)] text-2xl leading-tight">
                    {film.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#f4f1ea]/60">
                    {film.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl rounded-2xl bg-[#ff5da2] p-8 text-[#0c0c0c] md:p-12">
        <h2 className="text-pretty text-3xl font-bold md:text-4xl">
          Stay updated, not optimized.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed">
          A few emails a year about new films, screenings and odd little experiments. No tracking,
          no funnels.
        </p>
        <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="your@email.here"
            className="flex-1 rounded-full border border-[#0c0c0c]/30 bg-transparent px-4 py-2 text-sm placeholder:text-[#0c0c0c]/50 focus:outline-none"
          />
          <button
            type="button"
            className="rounded-full bg-[#0c0c0c] px-5 py-2 text-sm font-bold text-[#f4f1ea]"
          >
            subscribe
          </button>
        </form>
      </section>
    </main>
  )
}
