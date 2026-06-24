import type { ReactNode } from "react"
import Link from "next/link"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archive-mono",
})
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archive-sans",
})

const tabs = [
  { href: "/examples/archive", label: "Overview" },
  { href: "/examples/archive/films", label: "Videos" },
  { href: "/examples/archive/about", label: "Documents" },
]

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${plexMono.variable} ${plexSans.variable} min-h-screen bg-[#e8e8e6] font-[family-name:var(--font-archive-sans)] text-[#1a1a1a] selection:bg-[#b8cce4]`}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-[#b9b9b4] bg-gradient-to-b from-[#f4f4f2] to-[#dcdcd8] px-3 py-1.5">
        <div className="flex items-center gap-2 font-[family-name:var(--font-archive-mono)] text-xs font-semibold">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#c9c9c4]" />
            <span className="h-3 w-3 rounded-full bg-[#c9c9c4]" />
            <span className="h-3 w-3 rounded-full bg-[#c9c9c4]" />
          </span>
          ARCHIVE.OS — An index of moving images
        </div>
        <Link
          href="/examples"
          className="font-[family-name:var(--font-archive-mono)] text-xs text-[#555] hover:text-[#1a1a1a]"
        >
          quit
        </Link>
      </div>

      {/* Menu / tab bar */}
      <div className="flex items-center gap-1 border-b border-[#b9b9b4] bg-[#dededa] px-3 py-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="rounded-t border border-transparent px-3 py-1 font-[family-name:var(--font-archive-mono)] text-xs text-[#333] hover:border-[#b9b9b4] hover:bg-[#f4f4f2]"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}

      <div className="border-t border-[#b9b9b4] bg-[#dededa] px-3 py-1.5 font-[family-name:var(--font-archive-mono)] text-[11px] text-[#555]">
        8 records · 182 min total · last indexed 2024-06-24
      </div>
    </div>
  )
}
