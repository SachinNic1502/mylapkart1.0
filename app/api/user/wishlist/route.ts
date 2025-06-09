import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const user = await User.findById(auth.userId).populate({
      path: "wishlist",
      populate: { path: "seller", select: "name" },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.wishlist || [])
  } catch (error) {
    console.error("Wishlist fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { productId } = await request.json()

    const user = await User.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    if (!user.wishlist) {
      user.wishlist = []
    }

    const isInWishlist = user.wishlist.includes(productId)

    if (isInWishlist) {
      user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId)
      await user.save()
      return NextResponse.json({ message: "Removed from wishlist", inWishlist: false })
    } else {
      user.wishlist.push(productId)
      await user.save()
      return NextResponse.json({ message: "Added to wishlist", inWishlist: true })
    }
  } catch (error) {
    console.error("Wishlist update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
