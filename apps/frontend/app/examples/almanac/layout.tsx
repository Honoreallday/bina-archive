import type { ReactNode } from "react"
import Link from "next/link"
import { Space_Mono, Kalam } from "next/font/google"
import { CrtScreen } from "../_components/crt-screen"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-almanac-mono",
})
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-almanac-script",
})

const nav = [
  { href: "/examples/almanac", label: "Index" },
  { href: "/examples/almanac/films", label: "Documents" },
  { href: "/examples/almanac/about", label: "Colophon" },
]

export default function AlmanacLayout({ children }: { children: ReactNode }) {
  return (
    <CrtScreen>
      <div
        className={`${spaceMono.variable} ${kalam.variable} flex min-h-screen flex-col bg-[#efe9dd] font-[family-name:var(--font-almanac-mono)] text-[#211f1a] selection:bg-[#2f43c9] selection:text-[#efe9dd]`}
      >
        {/* Thin metadata strip — full bleed, edge to edge */}
        <div className="border-b border-[#211f1a] bg-[#211f1a] text-[#efe9dd]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5 text-[11px] uppercase tracking-[0.18em] md:px-10">
            <span>Vol. 04 — Moving Image Almanac</span>
            <span className="hidden sm:inline">08 documents · indexed 2024</span>
            <Link href="/examples" className="hover:text-[#e0b64a]">
              ← all themes
            </Link>
          </div>
        </div>

        {/* Masthead — reads like a normal website header, not a window */}
        <header className="border-b-2 border-[#211f1a]">
          <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#2f43c9]">
                  b / na field archive
                </p>
                <h1 className="mt-1 text-3xl font-bold leading-none tracking-tight md:text-4xl">
                  THE ALMANAC
                </h1>
              </div>
              <p className="font-[family-name:var(--font-almanac-script)] text-2xl text-[#d95b43] md:text-3xl">
                a catalogue of small films
              </p>
            </div>
          </div>

          {/* Ruled nav */}
          <nav className="border-t border-[#c9c2b2]">
            <div className="mx-auto flex max-w-6xl items-stretch px-6 md:px-10">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-r border-[#c9c2b2] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] first:border-l first:border-[#c9c2b2] hover:bg-[#211f1a] hover:text-[#efe9dd]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</div>
        </main>

        {/* Footer status line */}
        <footer className="border-t-2 border-[#211f1a]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[#6b6559] md:px-10">
            <span>Set in Space Mono &amp; Kalam</span>
            <span>08 records · 182 min total</span>
            <span className="font-[family-name:var(--font-almanac-script)] text-base normal-case tracking-normal text-[#2f43c9]">
              printed on paper that remembers
            </span>
          </div>
        </footer>
      </div>
    </CrtScreen>
  )
}
