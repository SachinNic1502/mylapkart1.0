import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["laptop", "iphone", "desktop", "accessories"],
    },
    subcategory: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          const categorySubcategories: { [key: string]: string[] } = {
            laptop: ["new", "refurbished"],
            iphone: ["second", "refurbished", "open_box"],
            desktop: ["gaming", "office", "workstation", "all_in_one"],
            accessories: [
              "mouse",
              "keyboard",
              "headphones",
              "speakers",
              "webcam",
              "monitor",
              "cables",
              "storage",
              "cooling",
              "cleaning",
            ],
          }
          return categorySubcategories[this.category]?.includes(value)
        },
        message: "Invalid subcategory for the selected category",
      },
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair", "refurbished"],
      default: "new",
    },
    specifications: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        alt: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
    isGift: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
