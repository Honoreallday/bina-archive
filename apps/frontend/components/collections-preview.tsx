import Link from "next/link"
import { getFilmsByCollection } from "@/lib/films-data"

const collectionsMeta = [
  {
    slug: "documentary",
    key: "Documentary",
    label: "Documentary",
    desc: "Observational and essay films exploring place, memory, and community.",
  },
  {
    slug: "shorts",
    key: "Shorts",
    label: "Shorts",
    desc: "Brief works under 20 minutes, ranging from experimental sketches to condensed narratives.",
  },
  {
    slug: "installations",
    key: "Installations",
    label: "Installations",
    desc: "Multi-channel and site-specific works designed for gallery exhibition.",
  },
  {
    slug: "2020-2024",
    key: "2020-2024",
    label: "2020 – 2024",
    desc: "Recent works produced during and after the pandemic.",
  },
]

export function CollectionsPreview() {
  const collections = collectionsMeta.map((c) => ({
    ...c,
    count: getFilmsByCollection(c.key).length,
  }))

  return (
    <section className="mx-auto max-w-6xl border-t border-[var(--almanac-border)] px-6 py-14 md:px-10">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Filed under</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight">Collections</h2>
      </div>

      <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
        <div className="grid gap-px sm:grid-cols-2">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group flex flex-col justify-between gap-4 bg-[var(--almanac-parchment)] p-5 hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold tracking-tight">{col.label}</h3>
                  <span className="text-[11px] tabular-nums text-[var(--almanac-gold)] opacity-0 group-hover:opacity-100">
                    {String(col.count).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--almanac-ink-mid)] group-hover:text-[var(--almanac-parchment)]/80">
                  {col.desc}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--almanac-border)] pt-3 group-hover:border-[var(--almanac-parchment)]/20">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] group-hover:text-[var(--almanac-parchment)]/70">
                  {col.count} films
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
