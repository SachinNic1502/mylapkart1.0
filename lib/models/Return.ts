import mongoose from "mongoose"

const returnSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    returnItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: Number,
        reason: {
          type: String,
          required: true,
        },
        condition: {
          type: String,
          enum: ["unopened", "opened", "damaged", "defective"],
          required: true,
        },
      },
    ],
    returnReason: {
      type: String,
      required: true,
    },
    returnType: {
      type: String,
      enum: ["refund", "exchange", "store_credit"],
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "processing", "completed"],
      default: "requested",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    adminNotes: String,
    customerNotes: String,
    images: [String],
    trackingNumber: String,
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Return = mongoose.models.Return || mongoose.model("Return", returnSchema)
