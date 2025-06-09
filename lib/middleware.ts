import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return { error: "No token provided", status: 401 }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    await connectDB()
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return { error: "User not found", status: 404 }
    }

    return { user, userId: user._id.toString() }
  } catch (error) {
    return { error: "Invalid token", status: 401 }
  }
}

export async function requireAuth(request: NextRequest, allowedRoles?: string[]) {
  const auth = await authenticateUser(request)

  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status })
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
  }

  return { user: auth.user, userId: auth.userId }
}
