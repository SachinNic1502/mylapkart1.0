import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { reason } = await request.json()

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if user owns this order
    if (order.user.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    // Check if order can be cancelled
    if (!["placed", "processing"].includes(order.status)) {
      return NextResponse.json({ message: "Order cannot be cancelled at this stage" }, { status: 400 })
    }

    // Update order status
    order.status = "cancelled"
    order.statusHistory.push({
      status: "cancelled",
      timestamp: new Date(),
      note: `Order cancelled by customer. Reason: ${reason}`,
    })

    await order.save()

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      })
    }

    return NextResponse.json({ message: "Order cancelled successfully" })
  } catch (error) {
    console.error("Order cancellation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
