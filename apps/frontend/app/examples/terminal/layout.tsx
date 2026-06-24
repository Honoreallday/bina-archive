import type { ReactNode } from "react"
import Link from "next/link"
import { Space_Mono, Caveat } from "next/font/google"
import { CrtScreen } from "../_components/crt-screen"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-terminal-mono",
})
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-terminal-script",
})

const tabs = [
  { href: "/examples/terminal", label: "INDEX" },
  { href: "/examples/terminal/films", label: "CATALOG" },
  { href: "/examples/terminal/about", label: "COLOPHON" },
]

export default function TerminalLayout({ children }: { children: ReactNode }) {
  return (
    <CrtScreen>
      <div
        className={`${spaceMono.variable} ${caveat.variable} min-h-screen bg-[#0c0c0c] font-[family-name:var(--font-terminal-mono)] text-[#f4f1ea] selection:bg-[#ff5da2] selection:text-[#0c0c0c]`}
      >
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          {/* window chrome ------------------------------------------- */}
          <div className="border border-[#f4f1ea]/25">
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-[#f4f1ea]/25 bg-[#141414] px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em]">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-3 w-3 rounded-full border border-[#ff5da2]/70 bg-[#ff5da2]/30" />
                  <span className="h-3 w-3 rounded-full border border-[#7cffb2]/70 bg-[#7cffb2]/30" />
                  <span className="h-3 w-3 rounded-full border border-[#f4f1ea]/40 bg-[#f4f1ea]/10" />
                </span>
                B/NA.INDEX
              </div>
              <Link
                href="/examples"
                className="text-xs tracking-[0.18em] text-[#f4f1ea]/55 hover:text-[#ff5da2]"
              >
                [ CLOSE ]
              </Link>
            </div>

            {/* tab strip */}
            <nav className="flex items-stretch border-b border-[#f4f1ea]/25 bg-[#101010] text-xs tracking-[0.18em]">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="border-r border-[#f4f1ea]/20 px-4 py-2 text-[#f4f1ea]/75 transition-colors hover:bg-[#1a1a1a] hover:text-[#7cffb2]"
                >
                  {tab.label}
                </Link>
              ))}
              <span className="ml-auto hidden items-center px-4 text-[#f4f1ea]/40 sm:flex">
                8 RECORDS / 182 MIN
              </span>
            </nav>

            {/* content area */}
            <div className="bg-[#0c0c0c]">{children}</div>

            {/* status bar */}
            <div className="flex items-center justify-between border-t border-[#f4f1ea]/25 bg-[#141414] px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#f4f1ea]/45">
              <span>READY.</span>
              <span>LAST INDEXED 2024-06-24</span>
            </div>
          </div>

          <p className="mt-4 px-1 font-[family-name:var(--font-terminal-script)] text-lg text-[#7cffb2]">
            an archive should feel like a place you can wander, not a feed you fall down.
          </p>
        </div>
      </div>
    </CrtScreen>
  )
}
