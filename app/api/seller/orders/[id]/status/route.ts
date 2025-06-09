import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { User } from "@/lib/models/User"
import { Product } from "@/lib/models/Product"
import { CoinTransaction } from "@/lib/models/CoinTransaction"
import { requireAuth } from "@/lib/middleware"
import { sendOrderStatusEmail } from "@/lib/email"
import mongoose from "mongoose" // Import mongoose to access .models

export async function PUT(request: NextRequest, context: any) {
  // Await params if necessary (for Next.js edge/serverless environments)
  const params = context.params && typeof context.params.then === 'function' ? await context.params : context.params;
  const id = params.id;
  try {
    console.log("Mongoose models BEFORE connectDB:", Object.keys(mongoose.models)); // Diagnostic log
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()
    console.log("Mongoose models AFTER connectDB:", Object.keys(mongoose.models)); // Diagnostic log

    const { status, trackingNumber, carrier, estimatedDelivery, notes } = await request.json()

    // Use the 'id' variable defined at the top of the PUT function
    const order = await Order.findById(id).populate("orderItems.product").populate("user")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if seller owns any products in this order
    const sellerProducts = order.orderItems.filter((item: any) => item.product && item.product.seller && item.product.seller.toString() === auth.userId)

    if (sellerProducts.length === 0 && auth.user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized to update this order" }, { status: 403 })
    }
    
    // Remove any order items with missing product references to avoid validation errors
    const validOrderItems = order.orderItems.filter((item: any) => item.product)
    if (validOrderItems.length !== order.orderItems.length) {
      console.log(`Removed ${order.orderItems.length - validOrderItems.length} invalid order items with missing product references`)
      order.orderItems = validOrderItems
    }

    // Update order status
    order.status = status
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: notes || `Status updated by seller: ${auth.user.name}`,
    })

    // Handle specific status updates
    if (status === "shipped" && trackingNumber) {
      order.trackingNumber = trackingNumber
      order.carrier = carrier
      order.estimatedDelivery = estimatedDelivery ? new Date(estimatedDelivery) : null
    }

    // Handle delivery completion
    if (status === "delivered") {
      order.isDelivered = true
      order.deliveredAt = new Date()

      // If COD, mark as paid when delivered
      if (order.paymentMethod === "cod" && !order.isPaid) {
        order.isPaid = true
        order.paidAt = new Date()
      }

      // Award delivery completion coins to customer (500 coins)
      const deliveryBonus = 500
      await User.findByIdAndUpdate(order.user._id, {
        $inc: {
          coins: deliveryBonus,
          totalEarned: deliveryBonus,
        },
      })

      // Create coin transaction for delivery bonus
      await CoinTransaction.create({
        user: order.user._id,
        type: "earned",
        amount: deliveryBonus,
        source: "order_delivered",
        description: `Order delivery completion bonus`,
        referenceId: order._id.toString(),
        referenceModel: "Order",
        balanceAfter: order.user.coins + deliveryBonus,
        metadata: {
          orderId: order._id,
          orderNumber: order._id.toString().slice(-8),
        },
      })
    }

    await order.save()

    // Send status update email
    try {
      await sendOrderStatusEmail(order, status)
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError)
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        status: order.status,
        isPaid: order.isPaid,
        isDelivered: order.isDelivered,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery,
      },
    })
  } catch (error) {
    console.error("Order status update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
