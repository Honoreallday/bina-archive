const fields = [
  ["Title", "The Archive"],
  ["Type", "Independent moving-image collection"],
  ["Established", "2017"],
  ["Records", "8 published, 0 draft"],
  ["Span", "2017 — 2024"],
  ["Formats", "16mm, HD video, single-channel installation"],
  ["Maintainer", "Archive Artist"],
  ["Access", "Public, non-commercial, by request"],
]

const documents = [
  { name: "mandate.txt", size: "4 KB", note: "Why this archive exists" },
  { name: "cataloguing-method.txt", size: "11 KB", note: "How records are described" },
  { name: "preservation-policy.txt", size: "7 KB", note: "Storage and migration plan" },
  { name: "credits-and-thanks.txt", size: "3 KB", note: "Collaborators and supporters" },
]

export default function ArchiveAbout() {
  return (
    <main className="grid gap-4 p-4 md:grid-cols-[1fr_320px]">
      {/* Get Info panel */}
      <section className="rounded border border-[#b9b9b4] bg-[#f7f7f5]">
        <header className="border-b border-[#b9b9b4] bg-gradient-to-b from-[#f4f4f2] to-[#e0e0dc] px-3 py-1.5 font-[family-name:var(--font-archive-mono)] text-[11px] font-semibold">
          Get Info — The Archive
        </header>
        <div className="p-4">
          <p className="font-[family-name:var(--font-archive-sans)] text-[14px] leading-relaxed text-[#333]">
            The Archive is a self-maintained index of moving images that resist clean categories.
            It treats each film as a record: described, dated, credited and kept. The interface is
            deliberately plain — closer to a filing system than a feed — so that the work, and not
            the chrome, is what you remember.
          </p>

          <table className="mt-5 w-full border-collapse font-[family-name:var(--font-archive-mono)] text-xs">
            <tbody>
              {fields.map(([k, v], i) => (
                <tr key={k} className={i % 2 === 0 ? "bg-[#f7f7f5]" : "bg-[#ededeb]"}>
                  <td className="w-32 border border-[#e0e0dc] px-3 py-1.5 text-[#777]">{k}</td>
                  <td className="border border-[#e0e0dc] px-3 py-1.5 font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents list */}
      <aside className="rounded border border-[#b9b9b4] bg-[#f0f0ee]">
        <header className="border-b border-[#b9b9b4] bg-gradient-to-b from-[#f4f4f2] to-[#e0e0dc] px-3 py-1.5 font-[family-name:var(--font-archive-mono)] text-[11px] font-semibold">
          Documents
        </header>
        <ul className="font-[family-name:var(--font-archive-mono)] text-xs">
          {documents.map((doc, i) => (
            <li
              key={doc.name}
              className={`flex items-center gap-2 px-3 py-2 ${
                i % 2 === 0 ? "bg-[#f7f7f5]" : "bg-[#eeeeec]"
              } hover:bg-[#b8cce4]`}
            >
              <span className="text-[#888]">▤</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{doc.name}</p>
                <p className="truncate text-[10px] text-[#888]">{doc.note}</p>
              </div>
              <span className="text-[10px] text-[#888]">{doc.size}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[#b9b9b4] px-3 py-2 font-[family-name:var(--font-archive-mono)] text-[10px] text-[#777]">
          contact: archive@thearchive.example
        </div>
      </aside>
    </main>
  )
}
