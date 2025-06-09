import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { CoinTransaction } from "@/lib/models/CoinTransaction";
import { requireAuth } from "@/lib/middleware";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await params to resolve the dynamic route parameters
    const { id } = await context.params;

    // Debug log
    console.log('Review API: extracted product id =', id);

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { rating, comment } = await request.json();

    // Defensive check for valid ObjectId
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
    }

    // Check if user has purchased this product and it's delivered
    const userOrders = await Order.find({
      user: auth.userId,
      "orderItems.product": new mongoose.Types.ObjectId(id),
      isPaid: true,
      isDelivered: true,
    });

    if (userOrders.length === 0) {
      return NextResponse.json(
        { message: "You can only review products you have purchased and received" },
        { status: 403 },
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find((review: any) => review.user.toString() === auth.userId);

    if (existingReview) {
      return NextResponse.json({ message: "You have already reviewed this product" }, { status: 400 });
    }

    // Add review
    const review = {
      user: auth.userId,
      name: auth.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    // Award 100 coins for review
    const reviewBonus = 100;
    await User.findByIdAndUpdate(auth.userId, {
      $inc: {
        coins: reviewBonus,
        totalEarned: reviewBonus,
      },
    });

    // Fetch updated user to get the correct coin balance
    const updatedUser = await User.findById(auth.userId);
    const updatedCoins = updatedUser?.coins ?? (auth.user.coins + reviewBonus);

    // Create coin transaction for review bonus
    await CoinTransaction.create({
      user: auth.userId,
      type: "earned",
      amount: reviewBonus,
      source: "product_review",
      description: `Product review bonus for ${product.name}`,
      referenceId: product._id.toString(),
      referenceModel: "Product",
      balanceAfter: updatedCoins,
      metadata: {
        productId: product._id,
        productName: product.name,
        rating: rating,
      },
    });

    return NextResponse.json(
      {
        message: "Review added successfully",
        coinsEarned: reviewBonus,
        newCoinBalance: updatedCoins,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}