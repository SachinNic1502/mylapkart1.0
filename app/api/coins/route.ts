import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { CoinTransaction } from "@/lib/models/CoinTransaction"
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

    // Get recent transactions
    const transactions = await CoinTransaction.find({ user: auth.userId }).sort({ createdAt: -1 }).limit(50)

    const stats = {
      currentBalance: user.coins,
      totalEarned: user.totalEarned,
      totalRedeemed: user.totalRedeemed,
      conversionRate: 100000, // 100,000 coins = ₹1000
      maxDiscount: Math.floor(user.coins / 100000) * 1000,
    }

    return NextResponse.json({
      stats,
      transactions,
    })
  } catch (error) {
    console.error("Coins fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { action, amount, orderId } = await request.json()

    if (action === "calculate_discount") {
      const user = await User.findById(auth.userId)
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }

      const maxDiscount = Math.floor(user.coins / 100000) * 1000
      const requestedDiscount = Math.min(amount || 0, maxDiscount)
      const coinsRequired = Math.ceil(requestedDiscount / 1000) * 100000

      return NextResponse.json({
        maxDiscount,
        requestedDiscount,
        coinsRequired,
        availableCoins: user.coins,
        canApply: user.coins >= coinsRequired,
      })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Coins action error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
