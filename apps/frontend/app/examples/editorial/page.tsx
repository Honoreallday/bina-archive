import Link from "next/link"
import { getFeaturedFilms } from "@/lib/films-data"

export default function EditorialHome() {
  const [feature, ...rest] = getFeaturedFilms()

  return (
    <div>
      {/* Film of the month */}
      <article>
        <div className="overflow-hidden border border-[#e2e2de]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={feature.image || "/placeholder.svg"}
            alt={feature.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div className="border border-t-0 border-[#e2e2de] p-5">
          <p className="font-[family-name:var(--font-editorial-head)] text-xs font-semibold uppercase tracking-widest text-[#2e9e2a]">
            Film of the Month
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-editorial-head)] text-3xl font-bold leading-tight md:text-4xl">
            {feature.title}, by {feature.credits.director}
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#2e9e2a]">{feature.description}</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#444]">{feature.synopsis}</p>
          <Link
            href="/examples/editorial/films"
            className="mt-4 inline-block bg-[#2e9e2a] px-4 py-2 font-[family-name:var(--font-editorial-head)] text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Preview &amp; Watch
          </Link>
        </div>
      </article>

      {/* Secondary features */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {rest.map((film, i) => (
          <article key={film.id} className="border border-[#e2e2de]">
            <div className="relative overflow-hidden">
              <span className="absolute left-0 top-0 z-10 bg-[#2e9e2a] px-2 py-1 font-[family-name:var(--font-editorial-head)] text-[10px] font-semibold uppercase tracking-wide text-white">
                {i === 0 ? "Events" : "Acquisitions"}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={film.image || "/placeholder.svg"}
                alt={film.title}
                className="aspect-video w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-[family-name:var(--font-editorial-head)] text-xl font-bold leading-tight">
                {film.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#444]">{film.description}</p>
              <Link
                href="/examples/editorial/films"
                className="mt-3 inline-block text-sm font-medium text-[#2e9e2a] hover:underline"
              >
                Read more +
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Mission banner */}
      <section className="mt-10 border-y-2 border-[#2e9e2a] bg-[#f4faf3] px-5 py-6">
        <p className="leading-relaxed text-[#1a1a1a]">
          The Archive is an artist-run, non-profit distributor of moving-image art. Representing
          work from the beginnings of video to the present, our collection spans documentary,
          experimental and installation forms — all preserved, catalogued, and available to study.
        </p>
      </section>
    </div>
  )
}
