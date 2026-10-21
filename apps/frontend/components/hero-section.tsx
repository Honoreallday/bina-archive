"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const heroImages = [
  "/images/hero/chicago-skyline.jpg",
  "/images/hero/portrait-1.jpg",
  "/images/hero/detroit-skyline.jpg",
  "/images/hero/portrait-2.jpg",
  "/images/hero/minneapolis-skyline.jpg",
  "/images/hero/portrait-3.jpg",
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length)
        setIsTransitioning(false)
      }, 1000)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden border-b-2 border-[var(--almanac-ink)] px-6 py-20 md:px-10 md:py-24">
      {/* Cycling background images */}
      {heroImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          className="object-cover grayscale transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex && !isTransitioning ? 0.7 : 0 }}
        />
      ))}
      {/* Parchment wash so text stays legible over the photo */}
      <div className="absolute inset-0 bg-[var(--almanac-parchment)]/70" />

      {/* Indicator dots */}
      <div className="absolute bottom-4 right-6 z-10 flex gap-2 md:right-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 500)
            }}
            aria-label={`Go to image ${index + 1}`}
            className={`h-1.5 transition-all duration-300 ${
              index === currentIndex
                ? "w-5 bg-[var(--almanac-blue)]"
                : "w-1.5 bg-[var(--almanac-ink-light)]/50 hover:bg-[var(--almanac-ink-light)]"
            }`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl">
        <h1 className="max-w-3xl text-balance text-3xl font-bold leading-[1.2] tracking-tight md:text-5xl">
          An archive of Black Minnesotan and Midwestern film.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/films"
            className="inline-block border-2 border-[var(--almanac-ink)] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
          >
            Browse the catalogue →
          </Link>
        </div>
      </div>
    </section>
  )
}
