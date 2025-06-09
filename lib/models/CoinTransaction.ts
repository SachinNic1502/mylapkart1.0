import mongoose from "mongoose"

const coinTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["earned", "redeemed", "bonus", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["referral_signup", "referral_order", "order_purchase", "admin_bonus", "order_discount", "refund", "order_delivered", "product_review"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String, // Order ID, Referral ID, etc.
    },
    referenceModel: {
      type: String,
      enum: ["Order", "Referral", "User", "Product"],
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

export const CoinTransaction =
  mongoose.models.CoinTransaction || mongoose.model("CoinTransaction", coinTransactionSchema)
