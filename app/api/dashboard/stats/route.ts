import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Order } from "@/lib/models/Order"
import { User } from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    let productQuery = {}
    let orderQuery = {}

    if (auth.user.role === "seller") {
      productQuery = { seller: auth.userId }

      // Get products by this seller to filter orders
      const sellerProducts = await Product.find({ seller: auth.userId }).select("_id")
      const productIds = sellerProducts.map((p) => p._id)
      orderQuery = { "orderItems.product": { $in: productIds } }
    }

    const [totalProducts, totalOrders, orders, totalCustomers] = await Promise.all([
      Product.countDocuments(productQuery),
      Order.countDocuments(orderQuery),
      Order.find(orderQuery).select("totalPrice"),
      auth.user.role === "admin" ? User.countDocuments({ role: "customer" }) : 0,
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
