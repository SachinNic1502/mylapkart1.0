import mongoose from "mongoose"

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Ensure only one document per user
recentlyViewedSchema.index({ user: 1 }, { unique: true })

export const RecentlyViewed = mongoose.models.RecentlyViewed || mongoose.model("RecentlyViewed", recentlyViewedSchema)
