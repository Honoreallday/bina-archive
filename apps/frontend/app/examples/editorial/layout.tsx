import type { ReactNode } from "react"
import Link from "next/link"
import { Oswald, Inter } from "next/font/google"
import { CrtScreen } from "../_components/crt-screen"

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial-head",
})
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-editorial-body",
})

const sideNav = [
  {
    group: "Video Catalogue",
    items: [
      { label: "All Films", href: "/examples/editorial/films" },
      { label: "Artist Index", href: "/examples/editorial/films" },
      { label: "Recent Acquisitions", href: "/examples/editorial/films" },
    ],
  },
  {
    group: "What's On",
    items: [
      { label: "Current & Upcoming", href: "/examples/editorial" },
      { label: "Past Events Archive", href: "/examples/editorial" },
    ],
  },
  {
    group: "Organization",
    items: [
      { label: "About The Archive", href: "/examples/editorial/about" },
      { label: "Mandate & Values", href: "/examples/editorial/about" },
      { label: "Contact & Hours", href: "/examples/editorial/about" },
    ],
  },
]

export default function EditorialLayout({ children }: { children: ReactNode }) {
  return (
    <CrtScreen>
      <div
        className={`${oswald.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-editorial-body)] text-[#1a1a1a] selection:bg-[#2e9e2a] selection:text-white`}
      >
        {/* Masthead */}
      <header className="bg-[#2e9e2a]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/examples/editorial" className="flex items-baseline gap-3 text-white">
            <span className="font-[family-name:var(--font-editorial-head)] text-3xl font-bold uppercase tracking-tight">
              The Archive
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-white/85">
              The source for artists&apos; film
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="search catalogue"
              className="rounded-sm border-0 bg-white px-3 py-1.5 text-sm text-[#1a1a1a] placeholder:text-[#888] focus:outline-none"
            />
            <Link href="/examples" className="text-xs text-white/85 underline-offset-2 hover:underline">
              exit
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row">
        {/* Left category nav */}
        <nav className="w-full shrink-0 md:w-52">
          {sideNav.map((section) => (
            <div key={section.group} className="mb-6">
              <h2 className="font-[family-name:var(--font-editorial-head)] text-sm font-semibold uppercase tracking-wide text-[#1a1a1a]">
                {section.group}
              </h2>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#444] transition-colors hover:text-[#2e9e2a]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      <footer className="bg-[#2e9e2a] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span className="font-[family-name:var(--font-editorial-head)] text-lg font-bold uppercase">
            The Archive
          </span>
          <span className="text-white/85">
            401 Example Street · Non-profit, artist-run · hello@thearchive.example
          </span>
        </div>
        </footer>
      </div>
    </CrtScreen>
  )
}
