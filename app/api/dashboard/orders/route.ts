import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    let orderQuery = {}

    if (auth.user.role === "seller") {
      // Get products by this seller to filter orders
      const sellerProducts = await Product.find({ seller: auth.userId }).select("_id")
      const productIds = sellerProducts.map((p) => p._id)
      orderQuery = { "orderItems.product": { $in: productIds } }
    }

    const orders = await Order.find(orderQuery)
      .populate("user", "name email")
      .populate("orderItems.product", "name")
      .sort({ createdAt: -1 })
      .limit(10)

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Dashboard orders error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
