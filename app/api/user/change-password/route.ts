import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()
    const { currentPassword, newPassword } = await request.json()

    const user = await User.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid current password" }, { status: 401 })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}