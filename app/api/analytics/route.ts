import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Product } from "@/lib/models/Product"
import { User } from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["admin", "seller"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days
    const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

    const orderQuery: any = { createdAt: { $gte: startDate } }
    const productQuery: any = {}

    if (auth.user.role === "seller") {
      // Get seller's products first
      const sellerProducts = await Product.find({ seller: auth.userId }).select("_id")
      const productIds = sellerProducts.map((p) => p._id)
      orderQuery["orderItems.product"] = { $in: productIds }
      productQuery.seller = auth.userId
    }

    // Sales Analytics
    const salesData = await Order.aggregate([
      { $match: orderQuery },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ])

    // Product Performance
    const productPerformance = await Order.aggregate([
      { $match: orderQuery },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ])

    // Category Performance
    const categoryPerformance = await Order.aggregate([
      { $match: orderQuery },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ])

    // Customer Analytics (Admin only)
    let customerAnalytics = null
    if (auth.user.role === "admin") {
      customerAnalytics = await User.aggregate([
        { $match: { role: "customer", createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            newCustomers: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ])
    }

    // Summary Stats
    const totalOrders = await Order.countDocuments(orderQuery)
    const totalRevenue = await Order.aggregate([
      { $match: orderQuery },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ])

    const totalProducts = await Product.countDocuments(productQuery)
    const lowStockProducts = await Product.countDocuments({
      ...productQuery,
      stock: { $lte: 10 },
    })

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        lowStockProducts,
        avgOrderValue: totalRevenue[0]?.total / totalOrders || 0,
      },
      salesData,
      productPerformance,
      categoryPerformance,
      customerAnalytics,
      period: Number.parseInt(period),
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
