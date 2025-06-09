import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models/User"
import { Referral } from "@/lib/models/Referral"
import { CoinTransaction } from "@/lib/models/CoinTransaction"

const SIGNUP_REWARD = 10000 // 10,000 coins for successful referral signup

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, role, referralCode } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    let referrer = null
    if (referralCode) {
      referrer = await User.findOne({ referralCode })
      if (!referrer) {
        return NextResponse.json({ message: "Invalid referral code" }, { status: 400 })
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      referredBy: referrer?._id,
    })

    // Handle referral if exists
    if (referrer) {
      // Create referral record
      const referral = await Referral.create({
        referrer: referrer._id,
        referred: user._id,
        referralCode,
        signupReward: SIGNUP_REWARD,
        totalRewards: SIGNUP_REWARD,
        status: "completed",
      })

      // Award coins to referrer
      await User.findByIdAndUpdate(referrer._id, {
        $inc: {
          coins: SIGNUP_REWARD,
          totalEarned: SIGNUP_REWARD,
          "referralStats.totalReferrals": 1,
          "referralStats.successfulReferrals": 1,
          "referralStats.totalEarnings": SIGNUP_REWARD,
        },
      })

      // Create coin transaction record
      await CoinTransaction.create({
        user: referrer._id,
        type: "earned",
        amount: SIGNUP_REWARD,
        source: "referral_signup",
        description: `Referral signup bonus for ${user.name}`,
        referenceId: referral._id.toString(),
        referenceModel: "Referral",
        balanceAfter: referrer.coins + SIGNUP_REWARD,
        metadata: {
          referredUser: user._id,
          referredUserName: user.name,
          referredUserEmail: user.email,
        },
      })
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        referralBonus: referrer ? SIGNUP_REWARD : 0,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
