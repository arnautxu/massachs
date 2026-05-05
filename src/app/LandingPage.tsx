import { useProducts } from '@/hooks/useProducts'
import Hero from '@/app/sections/Hero'
import MaterialLab from '@/app/sections/MaterialLab'
import TechnicalWall from '@/app/sections/TechnicalWall'
import StoryGallery from '@/app/sections/StoryGallery'
import Contact from '@/app/sections/Contact'
import ProgressBar from '@/components/ProgressBar'
import SectionNav from '@/components/SectionNav'
import { ScrollMarquee } from '@/components/Marquee'

export default function LandingPage() {
  const { products, loading } = useProducts()

  return (
    <>
      <ProgressBar />
      <SectionNav />
      <main>
        <Hero />

        {/* Scroll-driven marquee band: bridges Hero ↔ Material Lab */}
        <ScrollMarquee
          text="Paviments naturals"
          repeats={5}
          range={0.55}
          bgClass="section--light"
        />

        {!loading && products.length > 0 && (
          <>
            <MaterialLab products={products} />

            {/* Bridge band before tech */}
            <ScrollMarquee
              text="Dades · Comparativa"
              repeats={5}
              range={0.5}
              bgClass="section--light"
            />

            <TechnicalWall products={products} />
          </>
        )}

        <StoryGallery />
        <Contact />
      </main>
    </>
  )
}
