import type { ReactNode } from "react"
import Link from "next/link"
import { Space_Mono, Caveat } from "next/font/google"
import { CrtScreen } from "../_components/crt-screen"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-catalog-mono",
})
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-catalog-script",
})

const tabs = [
  { href: "/examples/catalog", label: "Desktop" },
  { href: "/examples/catalog/films", label: "Catalog" },
  { href: "/examples/catalog/about", label: "Get Info" },
]

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <CrtScreen>
      <div
        className={`${spaceMono.variable} ${caveat.variable} min-h-screen bg-[#d9d6cc] p-3 font-[family-name:var(--font-catalog-mono)] text-[#1a1712] selection:bg-[#ff5da2] selection:text-[#fbf9f2] md:p-6`}
      >
        <div className="mx-auto max-w-5xl border border-[#8a8578] bg-[#f2efe6] shadow-[6px_6px_0_0_rgba(26,23,18,0.35)]">
          {/* title bar */}
          <div className="flex items-center justify-between border-b border-[#8a8578] bg-gradient-to-b from-[#efe8d6] to-[#ddd6c4] px-3 py-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em]">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-sm border border-[#8a8578] bg-[#ff5da2]" />
                <span className="h-3 w-3 rounded-sm border border-[#8a8578] bg-[#7cffb2]" />
                <span className="h-3 w-3 rounded-sm border border-[#8a8578] bg-[#f2efe6]" />
              </span>
              b_na_archive.db
            </div>
            <Link
              href="/examples"
              className="text-[11px] tracking-[0.14em] text-[#5a5648] hover:text-[#c2367a]"
            >
              [ x ]
            </Link>
          </div>

          {/* menu / tab strip */}
          <nav className="flex items-stretch border-b border-[#8a8578] bg-[#e7e1d3] text-xs">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="border-r border-[#b3ae9f] px-4 py-1.5 text-[#3a362c] transition-colors hover:bg-[#f2efe6] hover:text-[#c2367a]"
              >
                {tab.label}
              </Link>
            ))}
            <span className="ml-auto hidden items-center px-4 text-[10px] tracking-[0.16em] text-[#7a7565] sm:flex">
              8 ITEMS / 182 MIN
            </span>
          </nav>

          {/* content */}
          <div>{children}</div>

          {/* status bar */}
          <div className="flex items-center justify-between border-t border-[#8a8578] bg-gradient-to-b from-[#e7e1d3] to-[#d7d0be] px-3 py-1 text-[10px] tracking-[0.14em] text-[#5a5648]">
            <span className="font-[family-name:var(--font-catalog-script)] text-sm text-[#c2367a]">
              catalogued by hand, one card at a time
            </span>
            <span>last indexed 2024-06-24</span>
          </div>
        </div>
      </div>
    </CrtScreen>
  )
}
