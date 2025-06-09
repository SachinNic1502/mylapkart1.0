import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const order = await Order.findById(params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price seller")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if user owns this order or is admin/seller
    if (auth.user.role !== "admin" && auth.user.role !== "seller" && order.user._id.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized to view this order" }, { status: 403 })
    }

    // Handle missing product references and prepare order data for frontend
    const preparedOrder = order.toObject()
    
    // Replace null product references with placeholder data
    preparedOrder.orderItems = preparedOrder.orderItems.map((item: any) => {
      if (!item.product) {
        return {
          ...item,
          product: item.product || item._id, // Use item ID if product is missing
          name: item.name || 'Product no longer available',
          image: item.image || '/placeholder.svg'
        }
      }
      return item
    })
    
    return NextResponse.json(preparedOrder)
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { status, note } = await request.json()

    // First get the order to check for invalid product references
    const existingOrder = await Order.findById(params.id)
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }
    
    // Check for invalid product references
    const validOrderItems = existingOrder.orderItems.filter((item: any) => item.product)
    if (validOrderItems.length !== existingOrder.orderItems.length) {
      console.log(`Removed ${existingOrder.orderItems.length - validOrderItems.length} invalid order items with missing product references`)
      existingOrder.orderItems = validOrderItems
      await existingOrder.save()
    }
    
    // Now update the order
    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note: note || `Order status updated to ${status}`,
          },
        },
        ...(status === "delivered" && { isDelivered: true, deliveredAt: new Date() }),
      },
      { new: true },
    )

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
