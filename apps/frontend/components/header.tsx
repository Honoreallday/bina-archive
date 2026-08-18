"use client"

import Link from "next/link"
import { useState } from "react"

const nav = [
  { href: "/films", label: "Films" },
  { href: "/collections", label: "Collections" },
  { href: "/distribution", label: "Distribution" },
  { href: "/submissions", label: "Submissions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      {/* Thin metadata strip — full bleed, edge to edge */}
      <div className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5 text-[11px] uppercase tracking-[0.18em] md:px-10">
          <span>Dream Chambers Public Access — Moving Image Archive</span>
          <a
            href="mailto:dreamchambers@proton.me"
            className="hidden hover:text-[var(--almanac-gold)] sm:inline"
          >
            dreamchambers@proton.me
          </a>
        </div>
      </div>

      {/* Masthead */}
      <header className="border-b-2 border-[var(--almanac-ink)]">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Link href="/" className="hover:opacity-80">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--almanac-blue)]">
                Minneapolis, MN · Est. 2019
              </p>
              <h1 className="mt-1 text-3xl font-bold leading-none tracking-tight md:text-4xl">
                Dream Chambers Public Access
              </h1>
            </Link>
            <p className="hidden font-[family-name:var(--font-almanac-script)] text-2xl text-[var(--almanac-red)] sm:block md:text-3xl">
              a public access moving image archive
            </p>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="border-2 border-[var(--almanac-ink)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] md:hidden"
            >
              {menuOpen ? "Close ×" : "Menu ≡"}
            </button>
          </div>
        </div>

        {/* Ruled nav — desktop */}
        <nav className="hidden border-t border-[var(--almanac-border)] md:block">
          <div className="mx-auto flex max-w-6xl flex-wrap items-stretch px-6 md:px-10">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-r border-[var(--almanac-border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] first:border-l first:border-[var(--almanac-border)] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] lg:px-4 lg:py-2.5 lg:text-[11px] lg:tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Stacked nav — mobile */}
        {menuOpen && (
          <nav className="border-t border-[var(--almanac-border)] md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-[var(--almanac-border)] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </div>
  )
}
