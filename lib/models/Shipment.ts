import mongoose from "mongoose"

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      enum: ["delhivery", "bluedart", "fedex", "dtdc", "ecom"],
      required: true,
    },
    carrierTrackingId: String,
    status: {
      type: String,
      enum: ["created", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"],
      default: "created",
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    pickupAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    deliveryAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    trackingEvents: [
      {
        status: String,
        description: String,
        location: String,
        timestamp: Date,
        updatedBy: String,
      },
    ],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
    },
    charges: {
      shipping: Number,
      cod: Number,
      insurance: Number,
      total: Number,
    },
  },
  {
    timestamps: true,
  },
)

export const Shipment = mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema)
