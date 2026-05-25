"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

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
      }, 1000) // Fade out duration
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8 overflow-hidden">
      {/* Cycling background images */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex && !isTransitioning ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dark overlay - makes images faded/translucent showing black behind */}
      <div className="absolute inset-0 bg-background/55" />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/30" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-accent text-sm tracking-widest uppercase mb-6">
          Digital Film Archive
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-8 text-balance">
          A collection of moving images
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Exploring memory, time, and the spaces between through film.
          An archive of works spanning documentary, experimental, and installation pieces.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/films"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Browse Films
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border text-foreground text-sm font-medium hover:border-muted-foreground transition-colors"
          >
            About the Archive
          </Link>
        </div>
      </div>

      {/* Subtle indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 500)
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-accent w-4"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
