"use client"

import { type ReactNode, useState } from "react"

const crtCss = `
.crt-screen { position: relative; min-height: 100vh; }
.crt-content { transition: filter 0.4s ease; }

/* cathode ray mode: convert ANY theme's colors to monochrome phosphor green */
.crt-screen.crt-on { background: #050805; }
.crt-screen.crt-on .crt-content {
  filter: grayscale(1) brightness(1.08) sepia(1) hue-rotate(75deg) saturate(4) contrast(0.92);
  animation: crt-flicker 0.12s infinite;
}

.crt-scanlines {
  position: fixed; inset: 0; z-index: 9990; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,0) 0px,
    rgba(0,0,0,0) 2px,
    rgba(0,0,0,0.30) 3px,
    rgba(0,0,0,0.30) 4px
  );
}
.crt-vignette {
  position: fixed; inset: 0; z-index: 9991; pointer-events: none;
  background:
    radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.7) 100%),
    radial-gradient(100% 100% at 50% 0%, rgba(120,255,170,0.10), rgba(0,0,0,0) 60%);
  box-shadow: inset 0 0 160px rgba(0,0,0,0.75);
}
.crt-flickerbar {
  position: fixed; inset: 0; z-index: 9992; pointer-events: none;
  background: linear-gradient(to bottom, rgba(180,255,200,0.05), rgba(255,255,255,0) 40%);
  animation: crt-roll 7s linear infinite;
  opacity: 0.7;
}

.crt-toggle {
  position: fixed; right: 14px; bottom: 14px; z-index: 9999;
  font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
  font-size: 11px; line-height: 1; letter-spacing: 0.02em;
  padding: 8px 12px; border-radius: 9999px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(8,8,8,0.78); color: #f4f1ea;
  backdrop-filter: blur(6px);
  transition: color 0.2s ease, border-color 0.2s ease;
}
.crt-toggle:hover { color: #7cffb2; border-color: rgba(124,255,178,0.6); }
.crt-screen.crt-on .crt-toggle { color: #7cffb2; border-color: rgba(124,255,178,0.55); }

@keyframes crt-flicker {
  0% { opacity: 1; } 97% { opacity: 1; } 98% { opacity: 0.93; } 100% { opacity: 1; }
}
@keyframes crt-roll {
  0% { transform: translateY(-100%); } 100% { transform: translateY(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .crt-screen.crt-on .crt-content { animation: none; }
  .crt-flickerbar { animation: none; }
}
`

export function CrtScreen({ children }: { children: ReactNode }) {
  const [crt, setCrt] = useState(false)

  return (
    <div className={`crt-screen ${crt ? "crt-on" : ""}`}>
      <style>{crtCss}</style>

      <div className="crt-content">{children}</div>

      {crt && (
        <>
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-vignette" aria-hidden />
          <div className="crt-flickerbar" aria-hidden />
        </>
      )}

      <button type="button" className="crt-toggle" onClick={() => setCrt((v) => !v)}>
        {crt ? "▣ cathode ray mode — switch to liquid crystal" : "▢ switch to cathode ray mode"}
      </button>
    </div>
  )
}
