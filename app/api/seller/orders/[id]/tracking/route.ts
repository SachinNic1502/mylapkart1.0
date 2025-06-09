import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { requireAuth } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { carrier, externalTrackingId, estimatedDelivery, notes } = await request.json()

    const order = await Order.findById(params.id).populate("orderItems.product")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if seller owns any products in this order
    const sellerProducts = order.orderItems.filter((item: any) => item.product.seller.toString() === auth.userId)

    if (sellerProducts.length === 0 && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to update this order" }, { status: 403 })
    }

    // Update order with tracking information
    order.carrier = carrier
    order.externalTrackingId = externalTrackingId
    order.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : undefined
    order.status = "shipped"

    order.statusHistory.push({
      status: "shipped",
      timestamp: new Date(),
      note: `Order shipped via ${carrier}. Tracking ID: ${externalTrackingId}${notes ? `. Notes: ${notes}` : ""}`,
    })

    await order.save()

    return NextResponse.json({ message: "Tracking information added successfully" })
  } catch (error) {
    console.error("Add tracking error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
