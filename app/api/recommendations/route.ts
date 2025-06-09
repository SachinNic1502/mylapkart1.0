import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Order } from "@/lib/models/Order"
import { RecentlyViewed } from "@/lib/models/RecentlyViewed"
import { authenticateUser } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const type = searchParams.get("type") || "similar"
    const limit = Number.parseInt(searchParams.get("limit") || "8")

    let recommendations: any[] = []

    // Try to get user context
    const auth = await authenticateUser(request)
    const userId = auth.user?._id

    if (type === "similar" && productId) {
      // Get similar products based on category and brand
      const product = await Product.findById(productId)
      if (product) {
        recommendations = await Product.find({
          _id: { $ne: productId },
          $or: [{ category: product.category }, { brand: product.brand }],
          status: "active",
          stock: { $gt: 0 },
        })
          .limit(limit)
          .sort({ rating: -1, numReviews: -1 })
      }
    } else if (type === "trending") {
      // Get trending products based on recent orders
      const trendingProductIds = await Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        { $unwind: "$orderItems" },
        { $group: { _id: "$orderItems.product", count: { $sum: "$orderItems.quantity" } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ])

      const productIds = trendingProductIds.map((item) => item._id)
      recommendations = await Product.find({
        _id: { $in: productIds },
        status: "active",
        stock: { $gt: 0 },
      })
    } else if (type === "personalized" && userId) {
      // Get personalized recommendations based on user's order history and recently viewed
      const userOrders = await Order.find({ user: userId }).populate("orderItems.product")
      const recentlyViewed = await RecentlyViewed.findOne({ user: userId }).populate("products.product")

      const userCategories = new Set()
      const userBrands = new Set()

      // Extract preferences from order history
      userOrders.forEach((order) => {
        order.orderItems.forEach((item: any) => {
          if (item.product) {
            userCategories.add(item.product.category)
            userBrands.add(item.product.brand)
          }
        })
      })

      // Extract preferences from recently viewed
      if (recentlyViewed) {
        recentlyViewed.products.forEach((item: any) => {
          if (item.product) {
            userCategories.add(item.product.category)
            userBrands.add(item.product.brand)
          }
        })
      }

      // Get products based on user preferences
      recommendations = await Product.find({
        $or: [{ category: { $in: Array.from(userCategories) } }, { brand: { $in: Array.from(userBrands) } }],
        status: "active",
        stock: { $gt: 0 },
      })
        .limit(limit)
        .sort({ rating: -1, featured: -1 })
    } else {
      // Default: Get featured products
      recommendations = await Product.find({
        status: "active",
        stock: { $gt: 0 },
        featured: true,
      })
        .limit(limit)
        .sort({ rating: -1 })
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
