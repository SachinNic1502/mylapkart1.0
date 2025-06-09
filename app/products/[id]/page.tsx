"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers"
import { useToast } from "@/hooks/use-toast"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, CreditCard } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers"
import { ProductSchema, BreadcrumbSchema } from "@/components/seo/structured-data"
import { generateProductTitle, generateProductDescription, generateKeywords } from "@/lib/seo-utils"
import Head from "next/head"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  subcategory: string
  brand: string
  model: string
  condition: string
  specifications: Array<{
    key: string
    value: string
  }>
  images: Array<{
    url: string
    publicId: string
    alt?: string
  }>
  stock: number
  rating: number
  numReviews: number
  reviews: Array<{
    user: string
    name: string
    rating: number
    comment: string
    createdAt: string
  }>
  seller: {
    name: string
  }
}

export default function ProductDetailPage() {
  // --- Wishlist State ---
  const [inWishlist, setInWishlist] = useState<boolean>(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // --- rest of hooks ---
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [reviewLoading, setReviewLoading] = useState(false)
  
  // Fetch wishlist status when product or user changes
  useEffect(() => {
    if (user && product?._id) {
      fetchWishlistStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, product?._id])

  const fetchWishlistStatus = async () => {
    try {
      const res = await fetch("/api/user/wishlist", { credentials: "include" })
      if (res.ok) {
        const wishlist = await res.json()
        setInWishlist(wishlist.some((item: Product) => item._id === product?._id))
      }
    } catch (error) {
      // Optionally handle error
    }
  }

  const handleWishlist = async () => {
    if (!user || !product) {
      toast({
        title: "Login required",
        description: "Please login to use the wishlist.",
        variant: "destructive",
      })
      return
    }
    setWishlistLoading(true)
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id }),
      })
      if (res.ok) {
        const data = await res.json()
        setInWishlist(data.inWishlist)
        toast({
          title: data.inWishlist ? "Added to Wishlist" : "Removed from Wishlist",
          description: data.message,
        })
      } else {
        throw new Error("Failed to update wishlist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setWishlistLoading(false)
    }
  }
  
  // SEO Data
  const breadcrumbItems = product
    ? [
        { name: "Home", url: "https://mylapkart.in" },
        { name: "Products", url: "https://mylapkart.in/products" },
        { name: product.category, url: `https://mylapkart.in/products?category=${product.category}` },
        { name: product.name, url: `https://mylapkart.in/products/${product._id}` },
      ]
    : []

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewLoading(true)

    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })

      if (response.ok) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        })
        setNewReview({ rating: 5, comment: "" })
        fetchProduct() // Refresh product data
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setReviewLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        toast({
          title: "Product not found",
          description: "The product you're looking for doesn't exist.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url || "/placeholder.svg?height=200&width=300",
    })

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }
  
  const handleBuyNow = () => {
    if (!product) return
    
    // Add item to cart first
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                <div className="bg-gray-200 h-10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Product Not Found | MyLapKart</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{generateProductTitle(product)}</title>
        <meta name="description" content={generateProductDescription(product)} />
        <meta name="keywords" content={generateKeywords(product)} />
        <link rel="canonical" href={`https://mylapkart.in/products/${product._id}`} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={generateProductTitle(product)} />
        <meta property="og:description" content={generateProductDescription(product)} />
        <meta property="og:image" content={product.images[0]?.url || "/og-image.jpg"} />
        <meta property="og:url" content={`https://mylapkart.in/products/${product._id}`} />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="INR" />
        <meta property="product:availability" content={product.stock > 0 ? "in_stock" : "out_of_stock"} />
        <meta property="product:brand" content={product.brand} />
        <meta property="product:category" content={product.category} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateProductTitle(product)} />
        <meta name="twitter:description" content={generateProductDescription(product)} />
        <meta name="twitter:image" content={product.images[0]?.url || "/og-image.jpg"} />
      </Head>

      <ProductSchema
        product={{
          name: product.name,
          description: product.description,
          price: product.price,
          currency: "INR",
          brand: product.brand,
          model: product.model,
          condition: product.condition,
          category: product.category,
          images: product.images.map((img) => img.url),
          rating: product.rating,
          reviewCount: product.numReviews,
          availability: product.stock > 0 ? "in_stock" : "out_of_stock",
          sku: product._id,
          seller: product.seller.name,
        }}
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]?.url || "/placeholder.svg?height=400&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">
                {product.brand} • {product.model}
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.subcategory.replace("_", " ")}</Badge>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.numReviews} reviews)
                </span>
              </div>

              <p className="text-2xl sm:text-4xl font-bold text-blue-600 mb-4">₹{product.price.toLocaleString()}</p>

              <p className="text-gray-700 mb-6">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <label className="font-medium">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded px-3 py-1 w-full sm:w-auto"
                    disabled={product.stock === 0}
                  >
                    {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </span>
                </div>

                {/* Product actions */}
                <div className="space-y-4">
                  {/* Wishlist button with working logic */}
                  <div className="flex justify-end mb-2">
                    <Button
                      variant={inWishlist ? "default" : "ghost"}
                      size="sm"
                      className={inWishlist ? "text-rose-600 bg-rose-50 hover:bg-rose-100" : "text-rose-500 hover:text-rose-600 hover:bg-rose-50"}
                      onClick={handleWishlist}
                      disabled={wishlistLoading}
                    >
                      <Heart className={`h-5 w-5 ${inWishlist ? "fill-rose-500" : ""}`} />
                      <span className="ml-2">{inWishlist ? "Wishlisted" : "Add to Wishlist"}</span>
                    </Button>
                  </div>
                  
                  {/* Cart and Buy buttons */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleAddToCart} 
                      disabled={product.stock === 0} 
                      variant="outline" 
                      size="lg"
                      className="w-full"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button 
                      onClick={handleBuyNow} 
                      disabled={product.stock === 0} 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      size="lg"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over ₹25,000</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-gray-600">1 Year Manufacturer</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Returns</p>
                <p className="text-xs text-gray-600">30 Day Return Policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{spec.key}:</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {index < product.reviews.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
