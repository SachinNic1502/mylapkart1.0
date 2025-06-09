import mongoose from "mongoose"

const inventoryAlertSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    alertType: {
      type: String,
      enum: ["low_stock", "out_of_stock", "restock_needed"],
      required: true,
    },
    threshold: {
      type: Number,
      default: 10,
    },
    currentStock: {
      type: Number,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const InventoryAlert = mongoose.models.InventoryAlert || mongoose.model("InventoryAlert", inventoryAlertSchema)
