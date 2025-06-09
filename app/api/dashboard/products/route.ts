import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    let query = {}
    if (auth.user.role === "seller") {
      query = { seller: auth.userId }
    }

    const products = await Product.find(query).populate("seller", "name").sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Dashboard products fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
