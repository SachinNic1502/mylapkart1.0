import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    flashDeal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashDeal",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { _id: false }
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save hook to calculate totals
cartSchema.pre("save", function (next) {
  const cart = this
  
  // Calculate total items and price
  let totalItems = 0
  let totalPrice = 0
  
  cart.items.forEach(item => {
    totalItems += item.quantity
    totalPrice += item.price * item.quantity
  })
  
  cart.totalItems = totalItems
  cart.totalPrice = totalPrice
  
  next()
})

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema)
