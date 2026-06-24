import { getPublishedFilms } from "@/lib/films-data"

const blobColors = ["#ff5da2", "#7cffb2", "#f4f1ea"]

export default function PoeticFilms() {
  const films = getPublishedFilms()

  return (
    <main className="px-6">
      <section className="mx-auto max-w-6xl pt-4">
        <h1 className="crt-glow-text text-balance text-3xl leading-[1.18] tracking-tight md:text-5xl">
          the whole program,{" "}
          <span className="font-[family-name:var(--font-poetic-script)] text-[#7cffb2]">
            scrolling slowly.
          </span>
        </h1>
        <p className="crt-dim mt-4 max-w-xl text-sm leading-relaxed text-[#f4f1ea]/70">
          {films.length} films, made between {Math.min(...films.map((f) => f.year))} and{" "}
          {Math.max(...films.map((f) => f.year))}. hover to bring them back to colour.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl space-y-6">
        {films.map((film, i) => (
          <article
            key={film.id}
            className="crt-border group grid gap-6 rounded-[24px] border border-[#f4f1ea]/20 p-4 transition-colors hover:border-[#f4f1ea]/55 md:grid-cols-[300px_1fr] md:p-6"
          >
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={film.image || "/placeholder.svg"}
                alt={film.title}
                crossOrigin="anonymous"
                className="aspect-video w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 md:aspect-[4/3]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase">
                <span
                  className="rounded-full px-2 py-0.5 text-[#080808]"
                  style={{ backgroundColor: blobColors[i % blobColors.length] }}
                >
                  {film.category}
                </span>
                <span className="crt-dim text-[#f4f1ea]/50">
                  {film.year} &middot; {film.duration}
                </span>
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-poetic-script)] text-3xl leading-tight md:text-4xl">
                {film.title}
              </h2>
              <p className="crt-dim mt-3 max-w-2xl text-sm leading-relaxed text-[#f4f1ea]/75">
                {film.synopsis}
              </p>
              <p className="crt-dim mt-4 text-xs text-[#f4f1ea]/50">
                dir. {film.credits.director}
                {film.credits.cinematography ? ` · dop. ${film.credits.cinematography}` : ""}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
