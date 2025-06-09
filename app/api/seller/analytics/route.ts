import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"
import { COLORS } from "@/lib/constants" // Declare COLORS variable

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "6months"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case "1month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "3months":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "6months":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    // Get seller's products
    const sellerProducts = await Product.find({ seller: auth.userId }).select("_id")
    const productIds = sellerProducts.map((p) => p._id)

    // Get orders containing seller's products
    const orders = await Order.find({
      "orderItems.product": { $in: productIds },
      createdAt: { $gte: startDate },
      status: { $ne: "cancelled" },
    }).populate("orderItems.product")

    // Filter order items to only include seller's products
    const sellerOrderItems = orders.flatMap((order) =>
      order.orderItems
        .filter((item: any) => productIds.some((id) => id.toString() === item.product._id.toString()))
        .map((item: any) => ({
          ...item,
          orderId: order._id,
          orderDate: order.createdAt,
          orderStatus: order.status,
        })),
    )

    // Calculate overview metrics
    const totalRevenue = sellerOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalOrders = new Set(sellerOrderItems.map((item) => item.orderId.toString())).size
    const totalProducts = sellerProducts.length
    const totalCustomers = new Set(orders.map((order) => order.user.toString())).size

    // Calculate growth (mock data for now)
    const revenueGrowth = Math.floor(Math.random() * 20) - 10 // -10% to +10%
    const orderGrowth = Math.floor(Math.random() * 15) - 5 // -5% to +10%

    // Generate sales data by month
    const salesData = []
    const months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        date: date,
      })
    }

    months.forEach(({ month, date }) => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthItems = sellerOrderItems.filter((item) => {
        const itemDate = new Date(item.orderDate)
        return itemDate >= monthStart && itemDate <= monthEnd
      })

      const monthRevenue = monthItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const monthOrders = new Set(monthItems.map((item) => item.orderId.toString())).size

      salesData.push({
        month,
        revenue: monthRevenue,
        orders: monthOrders,
      })
    })

    // Generate category data
    const categoryMap = new Map()
    sellerOrderItems.forEach((item) => {
      const category = item.product.category
      const revenue = item.price * item.quantity
      categoryMap.set(category, (categoryMap.get(category) || 0) + revenue)
    })

    const categoryData = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }))

    // Generate top products data
    const productMap = new Map()
    sellerOrderItems.forEach((item) => {
      const productId = item.product._id.toString()
      const existing = productMap.get(productId) || {
        name: item.product.name,
        sales: 0,
        revenue: 0,
      }
      existing.sales += item.quantity
      existing.revenue += item.price * item.quantity
      productMap.set(productId, existing)
    })

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    const analytics = {
      overview: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueGrowth,
        orderGrowth,
      },
      salesData,
      categoryData,
      topProducts,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
