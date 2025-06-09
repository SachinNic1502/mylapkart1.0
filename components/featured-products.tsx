"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Award } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
  rating: number
  stock: number
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      // Use a higher limit to ensure we get enough products
      const response = await fetch("/api/products?featured=true&limit=12")
      
      if (response.ok) {
        const data = await response.json()
        console.log('Featured products data:', data)
        
        if (data.products && Array.isArray(data.products)) {
          // We have products in the expected format
          if (data.products.length > 0) {
            setProducts(data.products)
          } else {
            // No featured products found, fetch regular products instead
            const regularResponse = await fetch("/api/products?limit=8")
            if (regularResponse.ok) {
              const regularData = await regularResponse.json()
              setProducts(regularData.products || [])
            }
          }
        } else {
          console.error('Unexpected data format:', data)
          // Just set empty products array
          setProducts([])
        }
      } else {
        console.error('API response not OK:', response.status)
        setProducts([])
      }
    } catch (error) {
      console.error("Failed to fetch featured products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // No animation variants needed with CSS animations

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section header with icon */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mr-4">
              <Award className="h-7 w-7 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
              Featured Products
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200/60 animate-pulse rounded-xl h-80 shadow-sm"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-300/10 rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with icon */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mr-4">
            <Award className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
            Featured Products
          </h2>
        </div>

        {/* Products grid with CSS animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product._id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
