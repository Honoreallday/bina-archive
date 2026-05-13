import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedFilms } from "@/components/featured-films"
import { CollectionsPreview } from "@/components/collections-preview"
import { AboutPreview } from "@/components/about-preview"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <FeaturedFilms />
        <CollectionsPreview />
        <AboutPreview />
      </main>
      <Footer />
    </div>
  )
}
