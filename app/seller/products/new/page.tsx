"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/providers"
import { SellerHeader } from "@/components/seller-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

const categorySubcategories = {
  laptop: [
    { value: "new", label: "New" },
    { value: "refurbished", label: "Refurbished" },
  ],
  iphone: [
    { value: "second", label: "Second Hand" },
    { value: "refurbished", label: "Refurbished" },
    { value: "open_box", label: "Open Box" },
  ],
  desktop: [
    { value: "gaming", label: "Gaming" },
    { value: "office", label: "Office" },
    { value: "workstation", label: "Workstation" },
    { value: "all_in_one", label: "All-in-One" },
  ],
  accessories: [
    { value: "mouse", label: "Mouse" },
    { value: "keyboard", label: "Keyboard" },
    { value: "headphones", label: "Headphones" },
    { value: "speakers", label: "Speakers" },
    { value: "webcam", label: "Webcam" },
    { value: "monitor", label: "Monitor" },
    { value: "cables", label: "Cables" },
    { value: "storage", label: "Storage" },
    { value: "cooling", label: "Cooling" },
    { value: "cleaning", label: "Cleaning" },
    { value: "others", label: "Others" },
  ],
}

export default function AddProductPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showJsonImport, setShowJsonImport] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    condition: "new",
    stock: "",
    specifications: [{ key: "", value: "" }],
    images: [] as Array<{ url: string; publicId: string }>,
    isGift: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "", // Reset subcategory when category changes
    }))
  }

  const handleSpecificationChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index][field] = value
    setFormData((prev) => ({ ...prev, specifications: newSpecs }))
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }))
  }

  const removeSpecification = (index: number) => {
    if (formData.specifications.length > 1) {
      const newSpecs = formData.specifications.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, specifications: newSpecs }))
    }
  }

  const handleImageUploaded = (imageData: { url: string; publicId: string }) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageData],
    }))
  }

  const handleImageRemoved = (publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.publicId !== publicId),
    }))
  }

  const handleJsonImport = () => {
    try {
      const importedData = JSON.parse(jsonInput)

      // Validate and map the imported data to your form structure
      const mappedData = {
        name: importedData.name || "",
        description: importedData.description || "",
        price: importedData.price?.toString() || "",
        category: importedData.category || "",
        subcategory: importedData.subcategory || "",
        brand: importedData.brand || "",
        model: importedData.model || "",
        condition: importedData.condition || "new",
        stock: importedData.stock?.toString() || "",
        specifications: importedData.specifications?.length
          ? importedData.specifications
          : [{ key: "", value: "" }],
        images: importedData.images || [],
        isGift: importedData.isGift || false,
      }

      setFormData(mappedData)
      setShowJsonImport(false)
      setJsonInput("")
      toast({
        title: "Success",
        description: "Product data imported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format. Please check your input.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      })
      return
    }

    // Validate specifications
    const validSpecs = formData.specifications.filter((spec) => spec.key.trim() && spec.value.trim())
    if (validSpecs.length === 0) {
      toast({
        title: "Specifications required",
        description: "Please add at least one specification.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        specifications: validSpecs,
      }

      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: "Product added successfully",
          description: "Your product has been added to the store.",
        })
        router.push("/seller/products")
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

  const availableSubcategories = formData.category
    ? categorySubcategories[formData.category as keyof typeof categorySubcategories] || []
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Basic Information</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={() => setShowJsonImport(true)}
                      variant="outline"
                      size="sm"
                    >
                      Import JSON
                    </Button>
                  </div>
                </div>
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
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="refurbished">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="iphone">iPhone</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => handleInputChange("subcategory", value)}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </SelectItem>
                        ))}
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
                <div className="flex justify-between items-center">
                  <CardTitle>Specifications</CardTitle>
                  <Button type="button" onClick={addSpecification} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specification
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Specification name (e.g., Processor)"
                        value={spec.key}
                        onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Specification value (e.g., Intel Core i7)"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      />
                    </div>
                    {formData.specifications.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                  existingImages={formData.images}
                  maxImages={5}
                />
              </CardContent>
            </Card>

            {/* Gift/Accessory Checkbox - only for accessories */}
            {formData.category === "accessories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gift/Accessory Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <input
                      id="isGift"
                      type="checkbox"
                      checked={formData.isGift}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isGift: e.target.checked }))}
                    />
                    <Label htmlFor="isGift">Is Gift/Accessory Product?</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>

          {/* JSON Import Modal */}
          {showJsonImport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Import Product Data (JSON)</h2>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`Paste your product data in JSON format. Example:\n\n{\n  "name": "Product Name",\n  "description": "Product description",\n  "price": 999,\n  "category": "laptop",\n  "subcategory": "new",\n  "brand": "Brand Name",\n  "model": "Model Number",\n  "condition": "new",\n  "stock": 10,\n  "specifications": [\n    { "key": "Processor", "value": "Intel Core i7" },\n    { "key": "RAM", "value": "16GB" }\n  ],\n  "images": [],\n  "isGift": false\n}`}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const exampleJson = `{
  "name": "Product Name",
  "description": "Product description",
  "price": 999,
  "category": "laptop",
  "subcategory": "new",
  "brand": "Brand Name",
  "model": "Model Number",
  "condition": "new",
  "stock": 10,
  "specifications": [
    { "key": "Processor", "value": "Intel Core i7" },
    { "key": "RAM", "value": "16GB" }
  ],
  "images": [],
  "isGift": false
}`;
                      navigator.clipboard.writeText(exampleJson);
                      toast({
                        title: "JSON Example Copied",
                        description: "Example JSON format has been copied to your clipboard",
                      });
                    }}
                  >
                    Copy Example
                  </Button>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowJsonImport(false)
                        setJsonInput("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleJsonImport}
                    >
                      Import
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}