import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Coupon } from "@/lib/models/Coupon"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    // Get user's coupons
    const coupons = await Coupon.find({
      assignedTo: userId,
      isActive: true,
      validUntil: { $gte: new Date() },
    }).sort({ createdAt: -1 })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Coupons fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    const { action, couponCode } = await request.json()

    if (action === "validate") {
      const coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
        validUntil: { $gte: new Date() },
        $or: [{ assignedTo: userId }, { assignedTo: null }],
      })

      if (!coupon) {
        return NextResponse.json({ message: "Invalid or expired coupon" }, { status: 400 })
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ message: "Coupon usage limit exceeded" }, { status: 400 })
      }

      return NextResponse.json({
        valid: true,
        coupon: {
          code: coupon.code,
          type: coupon.type,
          giftItem: coupon.giftItem,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minimumOrderValue: coupon.minimumOrderValue,
          maxDiscountAmount: coupon.maxDiscountAmount,
        },
      })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
