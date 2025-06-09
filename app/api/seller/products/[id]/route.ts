import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"
import mongoose from "mongoose"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()
    
    // Await params before using its properties
    const { id } = await params
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format: ${id}`)
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 })
    }

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if seller owns this product
    if (product.seller.toString() !== auth.userId && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to delete this product" }, { status: 403 })
    }

    await Product.findByIdAndDelete(id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()
    
    // Await params before using its properties
    const { id } = await params
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format: ${id}`)
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 })
    }

    // Try to find the product
    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if seller owns this product
    if (product.seller.toString() !== auth.userId && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to view this product" }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()
    
    // Await params before using its properties
    const { id } = await params
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId format: ${id}`)
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 })
    }

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if seller owns this product
    if (product.seller.toString() !== auth.userId && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to update this product" }, { status: 403 })
    }

    const updateData = await request.json()
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "seller",
      "name email",
    )

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
