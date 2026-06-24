const meta = [
  { key: "NAME", value: "b/na — borderless / network archive" },
  { key: "EST.", value: "2019, on a salvaged tower in a back room" },
  { key: "HOLDINGS", value: "8 films · 182 minutes · growing slowly" },
  { key: "FORMAT", value: "16mm, MiniDV, screen captures, found footage" },
  { key: "INDEXED BY", value: "two humans and a label printer" },
  { key: "HOSTING", value: "one small server, kept deliberately quiet" },
]

const principles = [
  "We catalog by hand. Every record is read, watched, and described by a person.",
  "We do not recommend. There is no algorithm deciding what you should see next.",
  "We keep it slow. The archive rewards wandering, not scrolling.",
  "We keep it legible. Plain type, plain rows, nothing hidden behind a gesture.",
]

export default function TerminalColophon() {
  return (
    <div>
      <section className="border-b border-[#f4f1ea]/15 px-5 py-8 md:px-8">
        <p className="text-xs tracking-[0.25em] text-[#f4f1ea]/45">FILE: 02 — COLOPHON</p>
        <h1 className="mt-4 max-w-2xl text-balance text-2xl leading-snug tracking-tight md:text-3xl">
          a small archive run by{" "}
          <span className="font-[family-name:var(--font-terminal-script)] text-[#ff5da2]">
            people who like to look closely.
          </span>
        </h1>
      </section>

      {/* metadata table */}
      <section className="border-b border-[#f4f1ea]/15 px-5 py-6 md:px-8">
        <p className="mb-4 text-xs tracking-[0.25em] text-[#f4f1ea]/45">RECORD METADATA</p>
        <dl>
          {meta.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[7rem_1fr] gap-3 border-b border-[#f4f1ea]/12 py-2.5 text-sm sm:grid-cols-[10rem_1fr]"
            >
              <dt className="text-xs tracking-[0.15em] text-[#7cffb2]">{row.key}</dt>
              <dd className="text-[#f4f1ea]/80">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* principles */}
      <section className="px-5 py-6 md:px-8">
        <p className="mb-4 text-xs tracking-[0.25em] text-[#f4f1ea]/45">OPERATING PRINCIPLES</p>
        <ol className="space-y-3">
          {principles.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-[#f4f1ea]/80">
              <span className="text-[#ff5da2]">{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-[#f4f1ea]/15 px-5 py-8 md:px-8">
        <p className="font-[family-name:var(--font-terminal-script)] text-xl text-[#7cffb2]">
          if you found this, you are exactly the kind of person it was made for.
        </p>
      </section>
    </div>
  )
}
