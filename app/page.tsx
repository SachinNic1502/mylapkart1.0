import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { ProductRecommendations } from "@/components/product-recommendations"
import { RecentlyViewed } from "@/components/recently-viewed"
import { Footer } from "@/components/footer"
import { Newsletter } from "@/components/newsletter"
import { CustomerReviews } from "@/components/customer-reviews"
import { ComparisonTool } from "@/components/comparison-tool"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ProductRecommendations type="trending" title="Trending Laptops" />
      {/* <CustomerReviews /> */}
      <ProductRecommendations type="personalized" title="Recommended for You" />
      {/* <ComparisonTool /> */}
      <RecentlyViewed />
      <Newsletter />
      <Footer />
    </div>
  )
}
