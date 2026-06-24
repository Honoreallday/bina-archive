"use client"

import { type ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/examples/poetic", label: "home" },
  { href: "/examples/poetic/films", label: "films" },
  { href: "/examples/poetic/about", label: "about" },
]

const crtCss = `
.crt-stage { position: relative; min-height: 100vh; transition: filter 0.4s ease; }

/* cathode ray mode -------------------------------------------------- */
.crt-on { color: #6dff9e; }
.crt-on .crt-ink { color: #6dff9e !important; }
.crt-on .crt-dim { color: rgba(109,255,158,0.6) !important; }
.crt-on .crt-border { border-color: rgba(109,255,158,0.45) !important; }
.crt-on .crt-glow-text { text-shadow: 0 0 1px #6dff9e, 0 0 8px rgba(109,255,158,0.55); }
.crt-on a:hover { color: #b6ffd0 !important; }

/* scanlines + screen tint */
.crt-on .crt-scanlines {
  position: fixed; inset: 0; z-index: 40; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0px,
    rgba(0,0,0,0) 2px,
    rgba(0,0,0,0.28) 3px,
    rgba(0,0,0,0.28) 4px
  );
  mix-blend-mode: multiply;
}
/* curvature vignette + green wash */
.crt-on .crt-vignette {
  position: fixed; inset: 0; z-index: 41; pointer-events: none;
  background:
    radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%),
    radial-gradient(100% 100% at 50% 0%, rgba(109,255,158,0.08), rgba(0,0,0,0) 60%);
  box-shadow: inset 0 0 140px rgba(0,0,0,0.7);
}
.crt-on .crt-flickerbar {
  position: fixed; inset: 0; z-index: 42; pointer-events: none;
  background: linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0) 40%);
  animation: crt-roll 7s linear infinite;
  opacity: 0.6;
}
.crt-on .crt-inner { animation: crt-flicker 0.12s infinite; }

@keyframes crt-flicker {
  0% { opacity: 1; }
  97% { opacity: 1; }
  98% { opacity: 0.92; }
  100% { opacity: 1; }
}
@keyframes crt-roll {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .crt-on .crt-inner { animation: none; }
  .crt-on .crt-flickerbar { animation: none; }
}
`

export function CrtShell({ children }: { children: ReactNode }) {
  const [crt, setCrt] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`crt-stage ${crt ? "crt-on" : ""} bg-[#080808]`}>
      <style>{crtCss}</style>

      {crt && (
        <>
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-vignette" aria-hidden />
          <div className="crt-flickerbar" aria-hidden />
        </>
      )}

      <div className="crt-inner">
        <header className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-start md:justify-between">
          <p className="crt-dim max-w-xs text-xs leading-relaxed text-[#f4f1ea]/70">
            An archive is an act of remembering against forgetting and the speed of the feed.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`crt-ink transition-colors hover:text-[#7cffb2] ${
                    active ? "text-[#ff5da2] underline underline-offset-4" : "text-[#f4f1ea]/85"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/examples" className="text-[#ff5da2] hover:underline">
              exit
            </Link>
          </nav>
          <p className="crt-glow-text select-none text-2xl lowercase leading-none tracking-tight">
            b/na
          </p>
        </header>

        {children}

        <footer className="mt-24 border-t border-[#f4f1ea]/15 px-6 py-8 crt-border">
          <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => setCrt((v) => !v)}
              className="crt-ink text-left text-[#f4f1ea]/55 transition-colors hover:text-[#7cffb2]"
            >
              {crt ? (
                <>
                  you are in <span className="text-[#7cffb2]">cathode ray mode</span>. switch to
                  liquid crystal mode.
                </>
              ) : (
                <>
                  you are in liquid crystal mode. switch to{" "}
                  <span className="text-[#ff5da2]">cathode ray mode</span>.
                </>
              )}
            </button>
            <span className="crt-glow-text font-[family-name:var(--font-poetic-script)] text-lg text-[#7cffb2]">
              made with care, not algorithms
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
