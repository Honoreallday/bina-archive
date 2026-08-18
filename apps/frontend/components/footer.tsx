import Link from "next/link"

const nav = [
  { href: "/films", label: "Films" },
  { href: "/collections", label: "Collections" },
  { href: "/distribution", label: "Distribution" },
  { href: "/submissions", label: "Submissions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)] md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          {nav.map((item, i) => (
            <span key={item.href} className="flex items-center gap-2">
              <Link href={item.href} className="hover:text-[var(--almanac-ink)]">
                {item.label}
              </Link>
              {i < nav.length - 1 && <span className="text-[var(--almanac-border)]">·</span>}
            </span>
          ))}
        </div>
        <a
          href="mailto:dreamchambers@proton.me"
          className="font-[family-name:var(--font-almanac-script)] text-base normal-case tracking-normal text-[var(--almanac-blue)] hover:text-[var(--almanac-red)]"
        >
          dreamchambers@proton.me
        </a>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-[var(--almanac-border)] px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)] md:px-10">
        <span>All works displayed are copyrighted and may not be reproduced without permission.</span>
        <span>© {new Date().getFullYear()} Dream Chambers Public Access</span>
      </div>
    </footer>
  )
}
