import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { requireAuth } from "@/lib/middleware"
import { User } from "@/lib/models/User"
import cloudinary, { uploadBase64Image } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
    try {
        const auth = await requireAuth(request, ["seller", "admin"])
        if (auth instanceof NextResponse) return auth

        await connectDB()

        const user = await User.findById(auth.userId).select("-password")
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Fetch seller profile error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
export async function PUT(request: NextRequest) {
    try {
        const auth = await requireAuth(request, ["seller", "admin"])
        if (auth instanceof NextResponse) return auth

        await connectDB()

        const user = await User.findById(auth.userId).select("-password")
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, email, phone, address, avatar } = body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        if (address) {
            user.address = {
                ...user.address?.toObject?.(),
                ...address,
            };
        }

        // Avatar upload logic
        if (avatar && typeof avatar === "string") {
            if (avatar.startsWith("data:")) {
                // Upload to Cloudinary
                const { url } = await uploadBase64Image(avatar, "Laptop House/avatars", user._id.toString());
                user.avatar = url;
            } else if (avatar.startsWith("http")) {
                user.avatar = avatar;
            }
        }

        await user.save();

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Update seller profile error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
