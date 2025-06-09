import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const products = await Product.find({ seller: auth.userId })
      .populate("seller", "name email")
      .sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Fetch seller products error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const productData = await request.json()
    console.log(productData);

    const product = await Product.create({
      ...productData,
      seller: auth.userId,
    })
 
    await product.populate("seller", "name email")

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
