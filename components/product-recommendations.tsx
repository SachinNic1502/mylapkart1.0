"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  brand: string
  rating: number
  stock: number
}

interface ProductRecommendationsProps {
  productId?: string
  type?: "similar" | "trending" | "personalized"
  title?: string
  limit?: number
}

export function ProductRecommendations({
  productId,
  type = "trending",
  title,
  limit = 8,
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [productId, type, limit])

  const fetchRecommendations = async () => {
    try {
      const params = new URLSearchParams({
        type,
        limit: limit.toString(),
        ...(productId && { productId }),
      })

      const response = await fetch(`/api/recommendations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) {
    return null
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case "similar":
        return "Similar Products"
      case "trending":
        return "Trending Now"
      case "personalized":
        return "Recommended for You"
      default:
        return "You May Also Like"
    }
  }

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with icon */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mr-4">
            <Sparkles className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
            {getTitle()}
          </h2>
        </div>

        {/* Products grid with animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
