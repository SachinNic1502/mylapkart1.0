import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Shipment } from "@/lib/models/Shipment"
import { requireAuth } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { orderId, trackingNumber, carrier, status, location, note } = await request.json()

    const order = await Order.findById(orderId).populate("orderItems.product")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if seller owns any products in this order
    const sellerProducts = order.orderItems.filter((item: any) => item.product.seller.toString() === auth.userId)

    if (sellerProducts.length === 0 && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to ship this order" }, { status: 403 })
    }

    // Create shipment
    const shipment = await Shipment.create({
      order: orderId,
      trackingNumber,
      carrier,
      pickupAddress: {
        address: "Seller Warehouse",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
      deliveryAddress: order.shippingAddress,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      trackingEvents: [
        {
          status,
          description: note || `Package ${status.replace("_", " ")}`,
          location,
          timestamp: new Date(),
          updatedBy: auth.user.name,
        },
      ],
    })

    // Update order with tracking number and status
    order.trackingNumber = trackingNumber
    order.status = "shipped"
    order.statusHistory.push({
      status: "shipped",
      timestamp: new Date(),
      note: `Order shipped with tracking number: ${trackingNumber}`,
    })

    await order.save()

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error("Create shipment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
