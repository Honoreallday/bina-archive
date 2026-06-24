import Link from "next/link"
import { getFeaturedFilms } from "@/lib/films-data"

export default function PoeticHome() {
  const featured = getFeaturedFilms()

  return (
    <main className="px-6">
      {/* oversized SFPC-style statement -------------------------------- */}
      <section className="mx-auto max-w-6xl pt-4">
        <h1 className="crt-glow-text max-w-5xl text-balance text-3xl leading-[1.18] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          b/na is an experimental archive of films made in the margins of art, code, hardware and{" "}
          <span className="font-[family-name:var(--font-poetic-script)] text-[#ff5da2]">
            slow looking.
          </span>
        </h1>
      </section>

      {/* bordered "community event" card ------------------------------- */}
      <section className="relative mx-auto mt-12 max-w-6xl">
        <div className="crt-border rounded-[28px] border border-[#f4f1ea]/30 p-6 md:p-8">
          <p className="crt-dim text-xs lowercase tracking-[0.18em] text-[#f4f1ea]/65">
            community screening
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-poetic-script)] text-4xl md:text-5xl">
            Dissolving Boundaries
          </h2>
          <p className="crt-dim mt-3 max-w-2xl text-sm leading-relaxed text-[#f4f1ea]/75">
            June 20&ndash;21 &middot; 24 min &middot; A meditation on the threads between our physical
            bodies and the networks we keep dissolving into.
          </p>
          <Link
            href="/examples/poetic/films"
            className="crt-border mt-6 inline-block rounded-full border border-[#f4f1ea]/45 px-5 py-1.5 text-sm transition-colors hover:border-[#7cffb2] hover:text-[#7cffb2]"
          >
            tickets on sale now
          </Link>
        </div>

        {/* rotated pink sticker, like SFPC "Stay updated" */}
        <div className="pointer-events-none absolute -bottom-6 right-2 rotate-[-8deg] md:-bottom-7 md:right-8">
          <span className="font-[family-name:var(--font-poetic-script)] inline-block rounded-[50%] bg-[#ff5da2] px-7 py-4 text-xl text-[#080808] shadow-lg">
            stay updated
          </span>
        </div>
      </section>

      {/* film thumbnails ---------------------------------------------- */}
      <section className="mx-auto mt-24 max-w-6xl">
        <div className="flex items-baseline justify-between border-b border-[#f4f1ea]/15 pb-3 crt-border">
          <h2 className="crt-ink text-lg lowercase tracking-[0.18em]">selected films</h2>
          <Link href="/examples/poetic/films" className="text-sm text-[#ff5da2] hover:underline">
            all films &rarr;
          </Link>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {featured.map((film, i) => (
            <Link key={film.id} href="/examples/poetic/films" className="group block">
              <div className="crt-border overflow-hidden rounded-2xl border border-[#f4f1ea]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={film.image || "/placeholder.svg"}
                  alt={film.title}
                  crossOrigin="anonymous"
                  className="aspect-[4/3] w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span
                  className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-[#080808]"
                  style={{ backgroundColor: i % 2 === 0 ? "#ff5da2" : "#7cffb2" }}
                >
                  {film.year}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-poetic-script)] text-2xl leading-tight">
                    {film.title}
                  </h3>
                  <p className="crt-dim mt-1 text-xs leading-relaxed text-[#f4f1ea]/60">
                    {film.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* newsletter ---------------------------------------------------- */}
      <section className="mx-auto mt-24 max-w-6xl">
        <div className="crt-border rounded-[28px] border border-[#f4f1ea]/30 p-8 md:p-12">
          <h2 className="crt-glow-text text-balance text-2xl leading-snug md:text-3xl">
            a few emails a year. no tracking, no funnels, no{" "}
            <span className="font-[family-name:var(--font-poetic-script)] text-[#ff5da2]">
              optimization.
            </span>
          </h2>
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.here"
              className="crt-border flex-1 rounded-full border border-[#f4f1ea]/35 bg-transparent px-4 py-2 text-sm placeholder:text-[#f4f1ea]/40 focus:border-[#7cffb2] focus:outline-none"
            />
            <button
              type="button"
              className="rounded-full bg-[#ff5da2] px-5 py-2 text-sm font-bold text-[#080808]"
            >
              subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
