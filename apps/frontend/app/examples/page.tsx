import Link from "next/link"

const themes = [
  {
    slug: "poetic",
    name: "Poetic",
    inspiration: "Inspired by sfpc.study",
    description:
      "Black canvas, rounded monospace, oversized poetic type and playful sticker accents. An experimental, zine-like voice.",
    swatches: ["#0c0c0c", "#f4f1ea", "#ff5da2", "#7cffb2"],
  },
  {
    slug: "archive",
    name: "Archive OS",
    inspiration: "Inspired by 858.ma",
    description:
      "A database masquerading as software. Dense metadata columns, counts, and a thumbnail grid wrapped in desktop chrome.",
    swatches: ["#e8e8e6", "#f7f7f5", "#1a1a1a", "#3b6ea5"],
  },
  {
    slug: "editorial",
    name: "Editorial",
    inspiration: "Inspired by vtape.org",
    description:
      "Institutional and editorial. A bold colored masthead, left category navigation, and a large feature-led front page.",
    swatches: ["#ffffff", "#1a1a1a", "#2e9e2a", "#f0f0ee"],
  },
  {
    slug: "terminal",
    name: "Terminal Index",
    inspiration: "Poetic × Archive OS",
    description:
      "The black canvas, mono type and pink/mint accents of Poetic, organized with the rigid window chrome, ruled tables and numbered rows of Archive OS.",
    swatches: ["#0c0c0c", "#f4f1ea", "#ff5da2", "#7cffb2"],
  },
]

export default function ExamplesIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Redesign Sandbox
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-balance md:text-5xl">
            Theme explorations
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Three front-end-only directions for the archive, each shipping with its own landing,
            films, and about page. No backend wired up — they all read the same sample film data so
            you can compare styling head to head.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {themes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/examples/${theme.slug}`}
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <div className="flex gap-1.5">
                {theme.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                ))}
              </div>
              <h2 className="mt-6 text-2xl font-semibold">{theme.name}</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent">
                {theme.inspiration}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {theme.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                View theme
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Looking for the current live design?{" "}
          <Link href="/" className="text-accent underline underline-offset-4">
            Back to the main site
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
