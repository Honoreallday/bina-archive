import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Mono, Kalam } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const almanacMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-almanac-mono",
})
const almanacScript = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-almanac-script",
})

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${almanacMono.variable} ${almanacScript.variable} font-sans antialiased text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
