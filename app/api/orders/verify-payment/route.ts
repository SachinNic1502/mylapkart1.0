import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { sendOrderConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json()

    // Verify signature
    const receivedSignature = razorpaySignature.trim()
    console.log("Verifying payment for order:", orderId)

    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex")
      .trim()

    console.log("Expected signature:", expectedSignature)
    console.log("Received signature:", receivedSignature)

    if (expectedSignature !== receivedSignature) {
      console.error("Signature mismatch")
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: razorpayPaymentId,
          status: "completed",
          update_time: new Date().toISOString(),
        },
        $push: {
          statusHistory: {
            status: "processing",
            timestamp: new Date(),
            note: "Payment received, order is being processed",
          },
        },
      },
      { new: true },
    ).populate("user", "name email")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order)
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
    }

    return NextResponse.json({ message: "Payment verified successfully", order })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
