import { getPublishedFilms } from "@/lib/films-data"

export default function CatalogAbout() {
  const films = getPublishedFilms()
  const totalMin = films.reduce((sum, f) => {
    const n = Number.parseInt(f.duration, 10)
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0)

  const info: [string, string][] = [
    ["Kind", "Hand-catalogued film archive"],
    ["Where", "Made in the margins of art, code & hardware"],
    ["Items", `${films.length} films`],
    ["Size", `${totalMin} minutes on disk`],
    ["Created", "2019"],
    ["Modified", "2024-06-24"],
    ["Format", "Slow looking, no autoplay"],
    ["Shared with", "Anyone who wanders in"],
  ]

  return (
    <div className="grid gap-0 md:grid-cols-[190px_1fr]">
      {/* left: icon panel */}
      <aside className="flex flex-col items-center border-b border-[#b3ae9f] bg-[#e9e3d5] p-5 text-center md:border-b-0 md:border-r">
        <div className="flex h-20 w-20 items-center justify-center rounded border border-[#8a8578] bg-[#1a1712] text-xl font-bold text-[#7cffb2]">
          b/na
        </div>
        <p className="mt-3 text-xs font-bold">b_na_archive.db</p>
        <p className="mt-1 text-[10px] text-[#7a7565]">locked · read only</p>
        <p className="mt-6 font-[family-name:var(--font-catalog-script)] text-base text-[#c2367a]">
          a small room, not a firehose
        </p>
      </aside>

      {/* right: info rows */}
      <main className="p-0">
        <header className="border-b border-[#8a8578] bg-gradient-to-b from-[#efe8d6] to-[#ddd6c4] px-4 py-1.5 text-[11px] font-bold tracking-[0.12em]">
          General Information
        </header>
        <dl>
          {info.map(([k, v], i) => (
            <div
              key={k}
              className={`grid grid-cols-[8rem_1fr] gap-3 border-b border-[#ddd6c4] px-4 py-2 text-xs ${
                i % 2 === 0 ? "bg-[#f6f3ea]" : "bg-[#ece6d8]"
              }`}
            >
              <dt className="text-right font-bold text-[#5a5648]">{k}:</dt>
              <dd className="text-[#1a1712]">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="border-b border-[#8a8578] bg-gradient-to-b from-[#efe8d6] to-[#ddd6c4] px-4 py-1.5 text-[11px] font-bold tracking-[0.12em]">
          Comments
        </div>
        <div className="bg-[#f6f3ea] px-4 py-4">
          <p className="max-w-xl text-xs leading-relaxed text-[#3a362c]">
            b/na keeps films the way a librarian keeps index cards: by hand, in order, with a note in
            the margin. Nothing here is optimized for engagement. Open a drawer, pull a card, and sit
            with what you find.
          </p>
          <p className="mt-4 font-[family-name:var(--font-catalog-script)] text-lg text-[#c2367a]">
            — the archivists
          </p>
        </div>
      </main>
    </div>
  )
}
