"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { getToken, clearToken } from "@/lib/auth"

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/upload", label: "Upload" },
  { href: "/admin/films", label: "Films" },
  { href: "/admin/settings", label: "Settings" },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    clearToken()
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--almanac-ink-light)]">
          Verifying credentials…
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--almanac-ink)] font-[family-name:var(--font-almanac-mono)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[var(--almanac-ink)]/60 md:hidden"
        />
      )}

      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin menu"
        className="fixed left-3 top-3 z-30 border-2 border-[var(--almanac-parchment)] bg-[var(--almanac-ink)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-parchment)] md:hidden"
      >
        Menu ≡
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-52 shrink-0 flex-col border-r border-[var(--almanac-ink-mid)] bg-[var(--almanac-ink)] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--almanac-ink-mid)] px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Dream Chambers Public Access
            </p>
            <p className="mt-0.5 text-sm font-bold text-[var(--almanac-parchment)]">Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin menu"
            className="text-[var(--almanac-ink-light)] hover:text-[var(--almanac-parchment)] md:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 border-b border-[var(--almanac-ink-mid)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "bg-[var(--almanac-parchment)] text-[var(--almanac-ink)]"
                    : "text-[var(--almanac-border)] hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
                }`}
              >
                {isActive && <span className="text-[var(--almanac-blue)]">→</span>}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[var(--almanac-ink-mid)]">
          <Link
            href="/"
            className="flex items-center border-b border-[var(--almanac-ink-mid)] px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-parchment)]"
          >
            ← View site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-red)]"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content area */}
      <main className="min-w-0 flex-1 bg-[var(--almanac-parchment)] p-6 pt-16 text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)] md:pt-6">
        {children}
      </main>
    </div>
  )
}
