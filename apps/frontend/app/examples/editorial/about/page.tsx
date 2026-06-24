const stats = [
  { value: "8", label: "Titles in distribution" },
  { value: "7", label: "Years of collecting" },
  { value: "16mm", label: "Oldest format preserved" },
  { value: "100%", label: "Artist-run, non-profit" },
]

const values = [
  {
    title: "Distribution for artists",
    body: "We represent moving-image artists, handling preview, licensing and screening so the work keeps circulating long after it is made.",
  },
  {
    title: "Preservation as practice",
    body: "Every title is catalogued, described and migrated across formats. Nothing in the collection is allowed to quietly disappear.",
  },
  {
    title: "Access and research",
    body: "The catalogue is open for study, class visits and curatorial research, supporting a living conversation around the work.",
  },
]

export default function EditorialAbout() {
  return (
    <div>
      <header className="border-b-2 border-[#1a1a1a] pb-3">
        <h1 className="font-[family-name:var(--font-editorial-head)] text-3xl font-bold uppercase tracking-tight">
          About The Archive
        </h1>
      </header>

      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#1a1a1a]">
        The Archive is a non-profit, artist-run distributor of moving-image art. We exist to keep
        independent film and video in circulation — preserved, catalogued and available to anyone
        who wants to look closely.
      </p>

      {/* Stats */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#e2e2de] bg-[#e2e2de] sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4">
            <dt className="font-[family-name:var(--font-editorial-head)] text-3xl font-bold text-[#2e9e2a]">
              {stat.value}
            </dt>
            <dd className="mt-1 text-xs uppercase tracking-wide text-[#666]">{stat.label}</dd>
          </div>
        ))}
      </dl>

      {/* Values */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <section key={v.title} className="border-t-2 border-[#2e9e2a] pt-3">
            <h2 className="font-[family-name:var(--font-editorial-head)] text-lg font-bold uppercase tracking-tight">
              {v.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#444]">{v.body}</p>
          </section>
        ))}
      </div>

      {/* Contact */}
      <section className="mt-10 border-y-2 border-[#2e9e2a] bg-[#f4faf3] px-5 py-6">
        <h2 className="font-[family-name:var(--font-editorial-head)] text-xl font-bold uppercase">
          Contact &amp; Hours
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#444]">
          401 Example Street, Suite 452 · Open Tuesday&ndash;Friday, 11&ndash;5
          <br />
          hello@thearchive.example · +1 (000) 000&ndash;0000
        </p>
      </section>
    </div>
  )
}
