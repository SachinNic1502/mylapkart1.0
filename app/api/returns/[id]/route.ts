import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Return } from "@/lib/models/Return"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const returnRequest = await Return.findById(params.id)
      .populate("order", "orderItems totalPrice")
      .populate("user", "name email")
      .populate("returnItems.product", "name images")

    if (!returnRequest) {
      return NextResponse.json({ message: "Return request not found" }, { status: 404 })
    }

    // Check authorization
    if (auth.user.role === "customer" && returnRequest.user._id.toString() !== auth.userId) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 })
    }

    return NextResponse.json(returnRequest)
  } catch (error) {
    console.error("Return fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request, ["admin", "seller"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { status, adminNotes, refundAmount } = await request.json()

    const returnRequest = await Return.findByIdAndUpdate(
      params.id,
      {
        status,
        adminNotes,
        refundAmount,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note: adminNotes || `Status updated to ${status}`,
            updatedBy: auth.userId,
          },
        },
      },
      { new: true },
    )

    if (!returnRequest) {
      return NextResponse.json({ message: "Return request not found" }, { status: 404 })
    }

    return NextResponse.json(returnRequest)
  } catch (error) {
    console.error("Return update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
