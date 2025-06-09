import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Return } from "@/lib/models/Return"
import { Order } from "@/lib/models/Order"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    let query = {}
    if (auth.user.role === "customer") {
      query = { user: auth.userId }
    }

    const returns = await Return.find(query)
      .populate("order", "orderItems totalPrice")
      .populate("user", "name email")
      .populate("returnItems.product", "name images")
      .sort({ createdAt: -1 })

    return NextResponse.json(returns)
  } catch (error) {
    console.error("Returns fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { orderId, returnItems, returnReason, returnType, customerNotes, images } = await request.json()

    // Verify order belongs to user
    const order = await Order.findById(orderId)
    if (!order || order.user.toString() !== auth.userId) {
      return NextResponse.json({ message: "Order not found or unauthorized" }, { status: 404 })
    }

    // Check if order is eligible for return (within 30 days and delivered)
    const daysSinceDelivery = order.deliveredAt
      ? Math.floor((Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24))
      : null

    if (!order.isDelivered || !daysSinceDelivery || daysSinceDelivery > 30) {
      return NextResponse.json({ message: "Order is not eligible for return" }, { status: 400 })
    }

    // Calculate refund amount
    const refundAmount = returnItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0)

    const returnRequest = await Return.create({
      order: orderId,
      user: auth.userId,
      returnItems,
      returnReason,
      returnType,
      customerNotes,
      images: images || [],
      refundAmount,
      statusHistory: [
        {
          status: "requested",
          timestamp: new Date(),
          note: "Return request submitted by customer",
          updatedBy: auth.userId,
        },
      ],
    })

    return NextResponse.json(returnRequest, { status: 201 })
  } catch (error) {
    console.error("Return creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
