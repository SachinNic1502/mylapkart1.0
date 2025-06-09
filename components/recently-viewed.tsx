"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function RecentlyViewed() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentlyViewed()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch("/api/recently-viewed")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch recently viewed:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading || products.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Recently Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
