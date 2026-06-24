import type { ReactNode } from "react"
import Link from "next/link"
import { Space_Mono, Caveat } from "next/font/google"

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poetic-mono",
})
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poetic-script",
})

const nav = [
  { href: "/examples/poetic", label: "home" },
  { href: "/examples/poetic/films", label: "films" },
  { href: "/examples/poetic/about", label: "about" },
]

export default function PoeticLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${spaceMono.variable} ${caveat.variable} min-h-screen bg-[#0c0c0c] font-[family-name:var(--font-poetic-mono)] text-[#f4f1ea] selection:bg-[#ff5da2] selection:text-[#0c0c0c]`}
    >
      <header className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-[#f4f1ea]/70">
          An archive is an act of remembering against forgetting and the speed of the feed.
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#f4f1ea]/80 transition-colors hover:text-[#7cffb2]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/examples" className="text-[#ff5da2] hover:underline">
            exit
          </Link>
        </nav>
      </header>
      {children}
      <footer className="mt-24 border-t border-[#f4f1ea]/15 px-6 py-10">
        <div className="flex flex-col gap-2 text-xs text-[#f4f1ea]/50 md:flex-row md:items-center md:justify-between">
          <span>you are in liquid crystal mode.</span>
          <span className="font-[family-name:var(--font-poetic-script)] text-lg text-[#7cffb2]">
            made with care, not algorithms
          </span>
        </div>
      </footer>
    </div>
  )
}
