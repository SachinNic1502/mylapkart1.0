import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const user = await User.findById(auth.userId).select("-password")
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

import { uploadBase64Image } from "@/lib/cloudinary"

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const updateData = await request.json()

    // Remove email from update data as it shouldn't be changed
    delete updateData.email

    // Handle avatar upload (base64 or url)
    if (updateData.avatar && typeof updateData.avatar === "string") {
      if (updateData.avatar.startsWith("data:")) {
        // upload base64 image to Cloudinary
        const { url } = await uploadBase64Image(updateData.avatar, "Laptop House/avatars", auth.userId.toString())
        updateData.avatar = url
      } else if (updateData.avatar.startsWith("http")) {
        // direct url
        // keep as is
      } else {
        // invalid avatar, remove
        delete updateData.avatar
      }
    }

    const user = await User.findByIdAndUpdate(auth.userId, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
