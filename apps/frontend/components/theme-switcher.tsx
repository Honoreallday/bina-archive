"use client"

import { useEffect, useState } from "react"

interface ThemeOption {
  value: string | null
  label: string
}

const THEMES: ThemeOption[] = [
  { value: null, label: "Light" },
  { value: "terminal-noir", label: "Terminal Noir" },
  { value: "midnight-ledger", label: "Midnight Ledger" },
  { value: "electric-dusk", label: "Electric Dusk" },
]

interface ThemeSwitcherProps {
  storageKey: string
}

export function ThemeSwitcher({ storageKey }: ThemeSwitcherProps) {
  const [active, setActive] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setActive(localStorage.getItem(storageKey))
  }, [storageKey])

  const applyTheme = (value: string | null) => {
    if (value) {
      document.documentElement.setAttribute("data-theme", value)
      localStorage.setItem(storageKey, value)
    } else {
      document.documentElement.removeAttribute("data-theme")
      localStorage.removeItem(storageKey)
    }
    setActive(value)
    setOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-[family-name:var(--font-almanac-mono)] text-[11px]">
      {open && (
        <div className="mb-2 border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)]">
          {THEMES.map((theme) => (
            <button
              key={theme.label}
              type="button"
              onClick={() => applyTheme(theme.value)}
              className={`block w-full whitespace-nowrap border-b border-[var(--almanac-border)] px-4 py-2 text-left font-bold uppercase tracking-[0.14em] last:border-b-0 ${
                active === theme.value
                  ? "bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                  : "text-[var(--almanac-ink)] hover:bg-[var(--almanac-parchment-alt)]"
              }`}
            >
              {active === theme.value ? "✓ " : ""}
              {theme.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Switch color theme"
        className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-4 py-2 font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink)] shadow-[2px_2px_0_var(--almanac-ink)] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
      >
        {open ? "Close ×" : `Theme: ${THEMES.find((t) => t.value === active)?.label ?? "Light"}`}
      </button>
    </div>
  )
}
