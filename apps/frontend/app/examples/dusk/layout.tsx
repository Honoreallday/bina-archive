import type { ReactNode } from "react"
import Link from "next/link"
import { Space_Mono, Caveat } from "next/font/google"
import { CrtScreen } from "../_components/crt-screen"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dusk-mono",
})
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dusk-script",
})

const tabs = [
  { href: "/examples/dusk", label: "INDEX" },
  { href: "/examples/dusk/films", label: "CATALOG" },
  { href: "/examples/dusk/about", label: "COLOPHON" },
]

export default function DuskLayout({ children }: { children: ReactNode }) {
  return (
    <CrtScreen>
      <div
        className={`${spaceMono.variable} ${caveat.variable} min-h-screen bg-[#1b1916] font-[family-name:var(--font-dusk-mono)] text-[#e9e1d1] selection:bg-[#cf9089] selection:text-[#1b1916]`}
      >
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          {/* window chrome ------------------------------------------- */}
          <div className="overflow-hidden rounded-md border border-[#e9e1d1]/15 shadow-[0_2px_0_rgba(0,0,0,0.4)]">
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-[#e9e1d1]/15 bg-[#2a2620] px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#e9e1d1]/85">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full border border-[#cf9089]/60 bg-[#cf9089]/25" />
                  <span className="h-3 w-3 rounded-full border border-[#a7b98f]/60 bg-[#a7b98f]/25" />
                  <span className="h-3 w-3 rounded-full border border-[#e9e1d1]/35 bg-[#e9e1d1]/10" />
                </span>
                B/NA.READING-ROOM
              </div>
              <Link
                href="/examples"
                className="text-xs tracking-[0.18em] text-[#e9e1d1]/50 hover:text-[#cf9089]"
              >
                [ CLOSE ]
              </Link>
            </div>

            {/* tab strip */}
            <nav className="flex items-stretch border-b border-[#e9e1d1]/15 bg-[#231f1a] text-xs tracking-[0.18em]">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="border-r border-[#e9e1d1]/12 px-4 py-2 text-[#e9e1d1]/70 transition-colors hover:bg-[#2a2620] hover:text-[#a7b98f]"
                >
                  {tab.label}
                </Link>
              ))}
              <span className="ml-auto hidden items-center px-4 text-[#e9e1d1]/35 sm:flex">
                8 RECORDS / 182 MIN
              </span>
            </nav>

            {/* content area */}
            <div className="bg-[#1b1916]">{children}</div>

            {/* status bar */}
            <div className="flex items-center justify-between border-t border-[#e9e1d1]/15 bg-[#2a2620] px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#e9e1d1]/40">
              <span>READY.</span>
              <span>LAST INDEXED 2024-06-24</span>
            </div>
          </div>

          <p className="mt-4 px-1 font-[family-name:var(--font-dusk-script)] text-lg text-[#a7b98f]">
            read in low light. the archive keeps its voice down after dark.
          </p>
        </div>
      </div>
    </CrtScreen>
  )
}
