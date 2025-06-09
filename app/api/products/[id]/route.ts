import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id).populate("seller", "name").populate("reviews.user", "name")

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const updateData = await request.json()

    // Check if user owns this product (unless admin)
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    if (auth.user.role !== "admin" && product.seller.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized to update this product" }, { status: 403 })
    }

    const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("seller", "name")

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    if (auth.user.role !== "admin" && product.seller.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized to delete this product" }, { status: 403 })
    }

    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
