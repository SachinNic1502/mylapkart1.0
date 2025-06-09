"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/providers"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
  })

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

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: "Product added successfully",
          description: "Your product has been added to the store.",
        })
        router.push("/dashboard/products")
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
