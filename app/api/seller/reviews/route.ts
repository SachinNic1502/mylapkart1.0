import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { Order } from "@/lib/models/Order"
import { User } from "@/lib/models/User"
import { CoinTransaction } from "@/lib/models/CoinTransaction"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    // Get all products by this seller
    const products = await Product.find({ seller: auth.userId }).select("_id name reviews")

    // Flatten all reviews from seller's products
    const allReviews = []
    for (const product of products) {
      for (const review of product.reviews) {
        allReviews.push({
          ...review.toObject(),
          productId: product._id,
          productName: product.name,
        })
      }
    }

    // Sort by creation date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(allReviews)
  } catch (error) {
    console.error("Seller reviews fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const { productId, userId, rating, comment } = await request.json()

    // Verify the product belongs to this seller
    const product = await Product.findOne({ _id: productId, seller: auth.userId })
    if (!product) {
      return NextResponse.json({ message: "Product not found or not owned by seller" }, { status: 404 })
    }

    // Check if there's a delivered order for this product and user
    const deliveredOrder = await Order.findOne({
      user: userId,
      "orderItems.product": productId,
      isDelivered: true,
    })

    if (!deliveredOrder) {
      return NextResponse.json({ message: "Can only review delivered products" }, { status: 403 })
    }

    // Check if seller already reviewed this user's purchase
    const existingSellerReview = product.sellerReviews?.find(
      (review: any) => review.user.toString() === userId && review.seller.toString() === auth.userId,
    )

    if (existingSellerReview) {
      return NextResponse.json({ message: "You have already reviewed this customer's purchase" }, { status: 400 })
    }

    // Add seller review
    if (!product.sellerReviews) {
      product.sellerReviews = []
    }

    const sellerReview = {
      user: userId,
      seller: auth.userId,
      sellerName: auth.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    }

    product.sellerReviews.push(sellerReview)
    await product.save()

    // Award 50 coins to seller for reviewing customer
    const sellerReviewBonus = 50
    await User.findByIdAndUpdate(auth.userId, {
      $inc: {
        coins: sellerReviewBonus,
        totalEarned: sellerReviewBonus,
      },
    })

    // Create coin transaction for seller review bonus
    await CoinTransaction.create({
      user: auth.userId,
      type: "earned",
      amount: sellerReviewBonus,
      source: "seller_review",
      description: `Seller review bonus for customer feedback`,
      referenceId: product._id.toString(),
      referenceModel: "Product",
      balanceAfter: auth.user.coins + sellerReviewBonus,
      metadata: {
        productId: product._id,
        productName: product.name,
        customerId: userId,
        rating: rating,
      },
    })

    return NextResponse.json(
      {
        message: "Seller review added successfully",
        coinsEarned: sellerReviewBonus,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Seller review submission error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
