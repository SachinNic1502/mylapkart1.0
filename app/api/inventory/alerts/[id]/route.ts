import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { InventoryAlert } from "@/lib/models/InventoryAlert"
import { requireAuth } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { isRead, isResolved } = await request.json()

    const alert = await InventoryAlert.findById(params.id)
    if (!alert) {
      return NextResponse.json({ message: "Alert not found" }, { status: 404 })
    }

    // Check if user owns this alert (unless admin)
    if (auth.user.role !== "admin" && alert.seller.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    const updatedAlert = await InventoryAlert.findByIdAndUpdate(
      params.id,
      { isRead, isResolved },
      { new: true },
    ).populate("product", "name images stock")

    return NextResponse.json(updatedAlert)
  } catch (error) {
    console.error("Update inventory alert error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
