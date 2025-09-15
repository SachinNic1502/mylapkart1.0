import { type NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"
import { requireAuth } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "File size too large. Maximum 5MB allowed." }, { status: 400 })
    }

    const result = await uploadImage(file, "Laptop House/products")

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 })
  }
}
