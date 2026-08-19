import type { Metadata } from 'next'
import {
  Geist,
  Geist_Mono,
  Space_Mono,
  Kalam,
  IBM_Plex_Mono,
  Caveat,
  Fraunces,
  JetBrains_Mono,
  Instrument_Serif,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeSwitcher } from '@/components/theme-switcher'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Default (light) almanac typefaces
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
})

// Dark colorway experiment typefaces — each theme in globals.css aliases
// --font-almanac-mono / --font-almanac-script to one pair of these.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-mono",
})
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
})
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fraunces",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
})
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
})

const themeFontVariables = [
  spaceMono.variable,
  kalam.variable,
  ibmPlexMono.variable,
  caveat.variable,
  fraunces.variable,
  jetbrainsMono.variable,
  instrumentSerif.variable,
].join(" ")

export const metadata: Metadata = {
  title: 'Dream Chambers Public Access | Moving Image Archive',
  description: 'A public access moving image archive streaming midwest films.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png?v=2',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png?v=2',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png?v=2',
  },
}

const THEME_STORAGE_KEY = "bina_dark_theme_experiment"

// Applies the stored theme choice before first paint, so switching pages (or
// reloading) doesn't flash back to the light theme. Client-preview-branch-only
// concern — inline script is the standard way to avoid that flash.
const setThemeBeforePaint = `
(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeBeforePaint }} />
      </head>
      <body className={`${themeFontVariables} font-sans antialiased text-foreground`}>
        {children}
        <ThemeSwitcher storageKey={THEME_STORAGE_KEY} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
