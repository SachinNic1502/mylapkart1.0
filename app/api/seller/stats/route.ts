import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Order } from "@/lib/models/Order"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const sellerId = auth.userId

    // Get seller's products
    const products = await Product.find({ seller: sellerId })
    const productIds = products.map((p) => p._id)

    // Get orders containing seller's products
    const orders = await Order.find({
      "orderItems.product": { $in: productIds },
    }).populate("orderItems.product")

    // Calculate stats
    const totalProducts = products.length
    const totalOrders = orders.length

    // Calculate revenue from seller's products only
    let totalRevenue = 0
    const customerSet = new Set()

    orders.forEach((order) => {
      order.orderItems.forEach((item: any) => {
        if (productIds.some((id) => id.toString() === item.product._id.toString())) {
          totalRevenue += item.price * item.quantity
        }
      })
      customerSet.add(order.user.toString())
    })

    const totalCustomers = customerSet.size

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
    })
  } catch (error) {
    console.error("Seller stats fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
