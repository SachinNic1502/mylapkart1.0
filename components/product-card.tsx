"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  _id: string
  name: string
  price: number
  images: Array<{ url: string; publicId: string; alt?: string }>
  category: string
  subcategory: string
  brand: string
  rating: number
  stock: number
  condition: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || "/placeholder.svg?height=200&width=300",
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }
  
  const handleBuyNow = () => {
    // Add item to cart first
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || "/placeholder.svg?height=200&width=300",
    })
    
    // Navigate to checkout page
    router.push('/checkout')
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800"
      case "like_new":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "fair":
        return "bg-orange-100 text-orange-800"
      case "refurbished":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCondition = (condition: string) => {
    return condition.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-48 bg-gray-100">
          <Image
            src={product.images[0]?.url || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className={getConditionColor(product.condition)}>{formatCondition(product.condition)}</Badge>
            {product.stock < 10 && product.stock > 0 && <Badge variant="destructive">Low Stock</Badge>}
            {product.stock === 0 && <Badge variant="secondary">Out of Stock</Badge>}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>
        <p className="text-2xl font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0} 
          className="flex-1" 
          variant="outline"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button 
          onClick={handleBuyNow} 
          disabled={product.stock === 0} 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
