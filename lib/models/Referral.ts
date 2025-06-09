import mongoose from "mongoose"

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    signupReward: {
      type: Number,
      default: 0,
    },
    orderReward: {
      type: Number,
      default: 0,
    },
    firstOrderCompleted: {
      type: Boolean,
      default: false,
    },
    firstOrderDate: Date,
    totalRewards: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

export const Referral = mongoose.models.Referral || mongoose.model("Referral", referralSchema)
