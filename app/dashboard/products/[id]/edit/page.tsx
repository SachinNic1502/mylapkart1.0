"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  model: string
  stock: number
  specifications: {
    processor: string
    ram: string
    storage: string
    graphics: string
    display: string
    battery: string
    weight: string
    os: string
  }
  images: string[]
  status: string
}

export default function EditProductPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    model: "",
    stock: "",
    specifications: {
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      display: "",
      battery: "",
      weight: "",
      os: "",
    },
    images: [""],
    status: "active",
  })

  useEffect(() => {
    if (params.id && user) {
      fetchProduct()
    }
  }, [params.id, user])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const product: Product = await response.json()
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          brand: product.brand,
          model: product.model,
          stock: product.stock.toString(),
          specifications: product.specifications,
          images: product.images.length > 0 ? product.images : [""],
          status: product.status,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch product details.",
          variant: "destructive",
        })
        router.push("/dashboard/products")
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      toast({
        title: "Error",
        description: "Failed to fetch product details.",
        variant: "destructive",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value },
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))
  }

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        images: formData.images.filter((img) => img.trim() !== ""),
      }

      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: "Product updated successfully",
          description: "Your product has been updated.",
        })
        router.push("/dashboard/products")
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || (user.role !== "seller" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="bg-gray-200 h-8 rounded w-1/3"></div>
              <div className="bg-gray-200 h-64 rounded"></div>
              <div className="bg-gray-200 h-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="ultrabook">Ultrabook</SelectItem>
                        <SelectItem value="workstation">Workstation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="processor">Processor</Label>
                    <Input
                      id="processor"
                      value={formData.specifications.processor}
                      onChange={(e) => handleSpecificationChange("processor", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ram">RAM</Label>
                    <Input
                      id="ram"
                      value={formData.specifications.ram}
                      onChange={(e) => handleSpecificationChange("ram", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storage">Storage</Label>
                    <Input
                      id="storage"
                      value={formData.specifications.storage}
                      onChange={(e) => handleSpecificationChange("storage", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="graphics">Graphics</Label>
                    <Input
                      id="graphics"
                      value={formData.specifications.graphics}
                      onChange={(e) => handleSpecificationChange("graphics", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display">Display</Label>
                    <Input
                      id="display"
                      value={formData.specifications.display}
                      onChange={(e) => handleSpecificationChange("display", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="battery">Battery</Label>
                    <Input
                      id="battery"
                      value={formData.specifications.battery}
                      onChange={(e) => handleSpecificationChange("battery", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.specifications.weight}
                      onChange={(e) => handleSpecificationChange("weight", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="os">Operating System</Label>
                    <Input
                      id="os"
                      value={formData.specifications.os}
                      onChange={(e) => handleSpecificationChange("os", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Image URL"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => removeImageField(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addImageField}>
                  Add Another Image
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating Product..." : "Update Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
