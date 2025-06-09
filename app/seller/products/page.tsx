"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers"
import { SellerHeader } from "@/components/seller-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react"
import Link from "next/link"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
  condition: string
  images: Array<{ url: string }>
  createdAt: string
}

export default function SellerProductsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user?.role === "seller") {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/products")
      if (response.ok) {
        const data = await response.json()
        // Handle both response formats: array directly or nested in products property
        setProducts(Array.isArray(data) ? data : data.products || [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: "Product has been deleted successfully.",
        })
        fetchProducts()
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

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

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50">
        <SellerHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Button asChild>
            <Link href="/seller/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded h-16"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {searchTerm ? "No products match your search" : "No Products Yet"}
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm ? "Try a different search term" : "Add your first product to start selling"}
                </p>
                {!searchTerm && (
                  <Button asChild className="mt-4">
                    <Link href="/seller/products/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <div className="relative h-10 w-10">
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                <Package className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: {product._id.slice(-6)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-blue-600">₹{product.price.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getConditionColor(product.condition)}>
                            {product.condition.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'} ({product.stock})
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/products/${product._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/seller/products/edit/${product._id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
