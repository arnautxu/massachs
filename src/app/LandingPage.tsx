import { useProducts } from '@/hooks/useProducts'
import Hero from '@/app/sections/Hero'
import MaterialLab from '@/app/sections/MaterialLab'
import TechnicalWall from '@/app/sections/TechnicalWall'
import StoryGallery from '@/app/sections/StoryGallery'
import Contact from '@/app/sections/Contact'

export default function LandingPage() {
  const { products, loading } = useProducts()

  return (
    <main>
      <Hero />
      {!loading && products.length > 0 && (
        <>
          <MaterialLab products={products} />
          <TechnicalWall products={products} />
        </>
      )}
      <StoryGallery />
      <Contact />
    </main>
  )
}
