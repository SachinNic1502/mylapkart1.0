import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Shipment } from "@/lib/models/Shipment"
import { Order } from "@/lib/models/Order"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get("trackingNumber")

    if (!trackingNumber) {
      return NextResponse.json({ message: "Tracking number is required" }, { status: 400 })
    }

    const shipment = await Shipment.findOne({ trackingNumber }).populate("order", "orderItems totalPrice user").lean()

    if (!shipment) {
      return NextResponse.json({ message: "Shipment not found" }, { status: 404 })
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error("Shipment tracking error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { orderId, carrier, pickupAddress, deliveryAddress, dimensions, charges } = await request.json()

    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Generate tracking number
    const trackingNumber = `MLK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    const shipment = await Shipment.create({
      order: orderId,
      trackingNumber,
      carrier,
      pickupAddress,
      deliveryAddress,
      dimensions,
      charges,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      trackingEvents: [
        {
          status: "created",
          description: "Shipment created",
          location: pickupAddress.city,
          timestamp: new Date(),
          updatedBy: "system",
        },
      ],
    })

    // Update order with tracking number
    await Order.findByIdAndUpdate(orderId, {
      trackingNumber,
      status: "shipped",
      $push: {
        statusHistory: {
          status: "shipped",
          timestamp: new Date(),
          note: `Order shipped with tracking number: ${trackingNumber}`,
        },
      },
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error("Create shipment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
