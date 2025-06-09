"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageUploaded: (imageData: { url: string; publicId: string }) => void
  onImageRemoved?: (publicId: string) => void
  existingImages?: Array<{ url: string; publicId: string; alt?: string }>
  maxImages?: number
  className?: string
}

export function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  existingImages = [],
  maxImages = 5,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Upload failed")
        }

        const result = await response.json()
        const newImage = { url: result.url, publicId: result.publicId }

        setImages((prev) => [...prev, newImage])
        onImageUploaded(newImage)
      }

      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) uploaded`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.publicId !== publicId))
    onImageRemoved?.(publicId)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label>Product Images</Label>
        <p className="text-sm text-gray-600 mb-2">
          Upload up to {maxImages} images. Supported formats: JPEG, PNG, WebP (max 5MB each)
        </p>
      </div>

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <span className="text-sm text-gray-600">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.publicId} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(image.publicId)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Main</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">Click "Upload Images" to add product photos</p>
        </div>
      )}
    </div>
  )
}
