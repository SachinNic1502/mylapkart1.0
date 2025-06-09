import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Referral } from "@/lib/models/Referral"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const user = await User.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get referral statistics
    const referrals = await Referral.find({ referrer: auth.userId })
      .populate("referred", "name email createdAt")
      .sort({ createdAt: -1 })

    const stats = {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter((r) => r.status === "completed").length,
      pendingReferrals: referrals.filter((r) => r.status === "pending").length,
      totalEarnings: referrals.reduce((sum, r) => sum + r.totalRewards, 0),
      currentCoins: user.coins,
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${user.referralCode}`,
      stats,
      referrals,
    })
  } catch (error) {
    console.error("Referrals fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { action, referralCode } = await request.json()

    if (action === "validate") {
      const referrer = await User.findOne({ referralCode })
      if (!referrer) {
        return NextResponse.json({ valid: false, message: "Invalid referral code" })
      }

      if (referrer._id.toString() === auth.userId) {
        return NextResponse.json({ valid: false, message: "Cannot use your own referral code" })
      }

      return NextResponse.json({
        valid: true,
        referrer: {
          name: referrer.name,
          referralCode: referrer.referralCode,
        },
      })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Referral action error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
