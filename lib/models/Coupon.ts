import mongoose from "mongoose"

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["gift", "discount", "cashback"],
      default: "gift",
    },
    giftItem: {
      name: {
        type: String,
        required: function () {
          return this.type === "gift"
        },
      },
      description: String,
      image: String,
      value: Number, // Estimated value of the gift
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    discountValue: {
      type: Number,
      min: 0,
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      },
    ],
    sourceOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
)

export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema)
