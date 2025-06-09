import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email } = await request.json()

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({ message: "If an account exists, reset link has been sent" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

    // Save token to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    })

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken)
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError)
      return NextResponse.json({ message: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ message: "Reset link sent successfully" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
