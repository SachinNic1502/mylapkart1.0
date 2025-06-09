import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { RecentlyViewed } from "@/lib/models/RecentlyViewed"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const recentlyViewed = await RecentlyViewed.findOne({ user: auth.userId })
      .populate({
        path: "products.product",
        select: "name price images category brand rating stock",
      })
      .lean()

    const products =
      recentlyViewed?.products
        ?.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        ?.slice(0, 10)
        ?.map((item) => item.product)
        ?.filter(Boolean) || []

    return NextResponse.json(products)
  } catch (error) {
    console.error("Recently viewed fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { productId } = await request.json()

    let recentlyViewed = await RecentlyViewed.findOne({ user: auth.userId })

    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({
        user: auth.userId,
        products: [{ product: productId, viewedAt: new Date() }],
      })
    } else {
      // Remove if already exists
      recentlyViewed.products = recentlyViewed.products.filter((item) => item.product.toString() !== productId)

      // Add to beginning
      recentlyViewed.products.unshift({
        product: productId,
        viewedAt: new Date(),
      })

      // Keep only last 20 items
      recentlyViewed.products = recentlyViewed.products.slice(0, 20)
    }

    await recentlyViewed.save()

    return NextResponse.json({ message: "Product added to recently viewed" })
  } catch (error) {
    console.error("Recently viewed update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
