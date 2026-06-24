import type { ReactNode } from "react"
import { Space_Mono, Caveat } from "next/font/google"
import { CrtShell } from "./crt-shell"

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

export default function PoeticLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${spaceMono.variable} ${caveat.variable} min-h-screen bg-[#080808] font-[family-name:var(--font-poetic-mono)] text-[#f4f1ea] selection:bg-[#ff5da2] selection:text-[#080808]`}
    >
      <CrtShell>{children}</CrtShell>
    </div>
  )
}
