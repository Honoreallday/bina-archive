const principles = [
  {
    n: "01",
    title: "Slow looking",
    body: "We make work that asks for attention rather than clicks. A single film can hold more than a feed.",
  },
  {
    n: "02",
    title: "Care over scale",
    body: "The archive grows by hand, one film at a time, with notes, credits and context kept intact.",
  },
  {
    n: "03",
    title: "Resistance to the disposable",
    body: "Against the speed of forgetting, we keep, label, and re-screen. Memory is the medium.",
  },
]

export default function PoeticAbout() {
  return (
    <main className="px-6">
      <section className="mx-auto max-w-4xl pt-4">
        <h1 className="crt-glow-text text-balance text-3xl leading-[1.2] tracking-tight md:text-5xl">
          b/na is an experimental film practice supporting{" "}
          <span className="font-[family-name:var(--font-poetic-script)] text-[#ff5da2]">
            interdisciplinary study
          </span>{" "}
          in art, code, memory and critical theory.
        </h1>
        <p className="crt-dim mt-8 max-w-2xl text-base leading-relaxed text-[#f4f1ea]/75">
          It began as a folder of tapes and grew into something stranger: a place to keep moving
          images that resist easy categorisation. Documentary bleeds into experiment, the personal
          into the political, the analog into the digital. Everything here is made slowly and kept
          deliberately.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <p className="crt-ink text-xs lowercase tracking-[0.2em] text-[#7cffb2]">how we work</p>
        <div className="mt-6 space-y-4">
          {principles.map((p) => (
            <div
              key={p.n}
              className="crt-border flex gap-5 rounded-[24px] border border-[#f4f1ea]/20 p-5"
            >
              <span className="font-[family-name:var(--font-poetic-script)] text-3xl text-[#ff5da2]">
                {p.n}
              </span>
              <div>
                <h2 className="crt-ink text-lg font-bold">{p.title}</h2>
                <p className="crt-dim mt-1 text-sm leading-relaxed text-[#f4f1ea]/70">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="crt-border rounded-[24px] border border-[#f4f1ea]/30 p-8">
          <h2 className="font-[family-name:var(--font-poetic-script)] text-3xl text-[#7cffb2]">
            say hello
          </h2>
          <p className="crt-dim mt-2 max-w-md text-sm leading-relaxed text-[#f4f1ea]/75">
            For screenings, study sessions, or just to send a postcard from wherever you are
            watching.
          </p>
          <p className="crt-ink mt-4 text-sm font-bold">hello@b-na.example &middot; @b.na.archive</p>
        </div>
      </section>
    </main>
  )
}
