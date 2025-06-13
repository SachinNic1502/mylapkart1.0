import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { generateOrderId } from "@/lib/generateOrderId"
import { Product } from "@/lib/models/Product"
import { User } from "@/lib/models/User"
import { Referral } from "@/lib/models/Referral"
import { CoinTransaction } from "@/lib/models/CoinTransaction"
import { Coupon } from "@/lib/models/Coupon"
import { sendOrderConfirmationEmail } from "@/lib/email"
import mongoose from "mongoose"

// Initialize Razorpay only if credentials are available
let razorpay: any = null
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    const Razorpay = require("razorpay")
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  } catch (error) {
    console.error("Failed to initialize Razorpay:", error)
  }
}

const ORDER_REWARD_RATE = 0.01 // 1% of order value as coins
const REFERRAL_ORDER_BONUS = 5000 // 5,000 coins for first order by referred user

// Fetch gift items (accessories) from Product collection by category
async function getRandomGiftItemForCategory(category: string) {
  // Try isGift: true for the given category
  let query = { category, isGift: true };
  let matchingGifts = await Product.find(query);

  // Fallback: if none found, give any accessory (isGift or not)
  if (matchingGifts.length === 0) {
    query = { category: 'accessories' }; // accessories as fallback
    matchingGifts = await Product.find(query);
  }

  if (matchingGifts.length === 0) return null;
  

  // Pick a random accessory/gift
  const gift = matchingGifts[Math.floor(Math.random() * matchingGifts.length)];
  console.log("Gift",gift)
  return {
    name: gift.name,
    description: gift.description,
    image: gift.images?.[0]?.url || "",
    value: gift.price,
    categories: [gift.category],
    _id: gift._id
  };
}

function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "GIFT"
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Determine product category from product details
function determineProductCategory(product: any): string | null {
  // Convert product name and description to lowercase for easier matching
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();

  // Only laptops and iPhones are eligible for gifts
  // Laptop check (stricter, no brand-only matches)
  if (
    name.includes('laptop') ||
    description.includes('laptop') ||
    name.includes('notebook') ||
    description.includes('notebook') ||
    name.includes('macbook') ||
    description.includes('macbook') ||
    name.includes('thinkpad') ||
    description.includes('thinkpad') ||
    name.includes('chromebook') ||
    description.includes('chromebook') ||
    name.includes('portable computer') ||
    description.includes('portable computer')
  ) {
    return 'laptop';
  }
  // iPhone check
  if (
    name.includes('iphone') ||
    description.includes('iphone') ||
    name.includes('i phone') ||
    description.includes('i phone') ||
    name.includes('apple phone') ||
    description.includes('apple phone')
  ) {
    return 'iphone';
  }
  // No other category is eligible for gifts
  return null;
}

async function createGiftCoupon(userId: string, orderId: string, productIdMap = {}) {
  try {
    const order = await Order.findById(orderId);
    if (!order || !order.orderItems || order.orderItems.length === 0) {
      return null;
    }

    // Check for eligible products
    let eligibleCategory = null;
    let mainProductName = '';
    let mainProductId = null;

    // Check order items first
    for (const item of order.orderItems) {
      if (!item.product) continue;
      
      try {
        const product = await Product.findById(item.product);
        if (!product) continue;
        
        const category = determineProductCategory(product);
        if (category) {
          eligibleCategory = category;
          mainProductName = product.name;
          mainProductId = product._id;
          break;
        }
      } catch (err) {
        console.error(`Error looking up product ${item.product}:`, err);
      }
    }

    // Fallback to productIdMap if needed
    if (!eligibleCategory && Object.keys(productIdMap).length > 0) {
      for (const productId of Object.keys(productIdMap)) {
        try {
          const product = await Product.findById(productId);
          if (!product) continue;
          
          const category = determineProductCategory(product);
          if (category) {
            eligibleCategory = category;
            mainProductName = product.name;
            mainProductId = product._id;
            break;
          }
        } catch (err) {
          console.error(`Error looking up product ${productId}:`, err);
        }
      }
    }

    if (!eligibleCategory || eligibleCategory === 'accessories') return null;

    // Get gift item - now we'll get the full product document
    const giftProduct = await getRandomGiftProductForCategory(eligibleCategory);
    if (!giftProduct) return null;

    // Create coupon
    const coupon = await Coupon.create({
      code: generateCouponCode(),
      type: "gift",
      giftItem: {
        name: giftProduct.name,
        description: giftProduct.description,
        image: giftProduct.images?.[0]?.url || "",
        value: giftProduct.price,
        categories: [giftProduct.category],
        productId: giftProduct._id // Ensure productId is set
      },
      giftProductId: giftProduct._id, // Store the actual product ID
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 1,
      assignedTo: userId,
      sourceOrder: orderId,
      isActive: true,
      metadata: {
        productCategory: eligibleCategory,
        productName: mainProductName,
        mainProductId: mainProductId
      }
    });

    return {
      coupon,
      giftProduct // Return the full product document
    };
  } catch (error) {
    console.error("Failed to create gift coupon:", error);
    return null;
  }
}

// New function to get full product document
async function getRandomGiftProductForCategory(category: string) {
  if (category === 'laptop') {
    // Only mouse, keyboard, or cleaner under 200 Rs
    const allowedKeywords = ['mouse', 'keyboard', 'cleaner'];
    let gifts = await Product.find({
      isGift: true,
      price: { $lte: 400 }
    });
    gifts = gifts.filter(gift => {
      const name = (gift.name || '').toLowerCase();
      const desc = (gift.description || '').toLowerCase();
      return allowedKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
    });
    if (gifts.length === 0) return null;
    return gifts[Math.floor(Math.random() * gifts.length)];
  }
  if (category === 'iphone') {
    // Only tempered glass or back cover under 250 Rs
    const allowedKeywords = ['tempered glass', 'tappan glass', 'back cover'];
    let gifts = await Product.find({
      isGift: true,
      price: { $lte: 400 }
    });
    gifts = gifts.filter(gift => {
      const name = (gift.name || '').toLowerCase();
      const desc = (gift.description || '').toLowerCase();
      return allowedKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
    });
    if (gifts.length === 0) return null;
    return gifts[Math.floor(Math.random() * gifts.length)];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      coinDiscount = 0,
      coinsUsed = 0,
    } = await request.json()

    // Validate required fields
    if (!orderItems || !shippingAddress || !paymentMethod || !itemsPrice || !taxPrice || !totalPrice) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Validate coin usage
    if (coinsUsed > 0) {
      if (user.coins < coinsUsed) {
        return NextResponse.json({ message: "Insufficient coins" }, { status: 400 })
      }

      const maxDiscount = Math.floor(user.coins / 100000) * 1000
      if (coinDiscount > maxDiscount) {
        return NextResponse.json({ message: "Invalid coin discount amount" }, { status: 400 })
      }
    }

    // Validate stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.id)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${item.name}` }, { status: 400 })
      }
    }

    const finalAmount = totalPrice - coinDiscount

    let razorpayOrderId = null

    if (paymentMethod === "razorpay") {
      if (!razorpay) {
        return NextResponse.json({ message: "Payment gateway not configured" }, { status: 500 })
      }

      try {
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
          amount: finalAmount * 100, // Amount in paise
          currency: "INR",
          receipt: `order_${Date.now()}`,
        })
        razorpayOrderId = razorpayOrder.id
      } catch (razorpayError: any) {
        console.error("Razorpay order creation failed:", razorpayError);
        const errorDescription = razorpayError?.error?.description || razorpayError?.message || "Unknown Razorpay error";
        const errorReason = razorpayError?.error?.reason ? ` Reason: ${razorpayError.error.reason}` : "";
        const errorField = razorpayError?.error?.field ? ` (Field: ${razorpayError.error.field})` : "";
        const detailedMessage = `Failed to create payment order: ${errorDescription}${errorReason}${errorField}`;
        return NextResponse.json({
          message: detailedMessage,
          // Optionally include the full error in development for more context
          razorpayFullError: process.env.NODE_ENV === 'development' ? razorpayError : undefined
        }, { status: 500 });
      }
    }
    const orderId = generateOrderId()

    // First create the order without gift items
    const order = await Order.create({
      orderId: orderId, 
      user: userId,
      orderItems: orderItems.map((item: any) => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice: 0,
      totalPrice,
      coinDiscount,
      coinsUsed,
      finalAmount,
      razorpayOrderId,
      statusHistory: [
        {
          status: "placed",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
    })
    console.log("order",order)

    
    // Store product IDs before creating gift coupon
    const productIdMap = {};
    orderItems.forEach(item => {
      if (item.id) {
        productIdMap[item.id] = item.name;
      }
    });
    
    // Create gift coupon with actual order ID and product ID mapping
    const giftResult = await createGiftCoupon(userId, order._id.toString(), productIdMap);
    const giftCoupon = giftResult?.coupon;
    const giftProduct = giftResult?.giftProduct;

    // Add gift item to order if coupon was created
    if (giftCoupon && giftProduct) {
      const giftOrderItem = {
        product: giftProduct._id, // Use the actual product ID from the full product document
        name: giftProduct.name,
        description: giftProduct.description,
        quantity: 1,
        price: 0,
        image: giftProduct.images?.[0]?.url || "",
        isGift: true,
        giftCouponCode: giftCoupon.code,
        value: giftProduct.price,
        _id: new mongoose.Types.ObjectId() // Generate a new ID for the order item
      };

      // Update order with gift item
      await Order.findByIdAndUpdate(
        order._id,
        {
          $push: {
            orderItems: giftOrderItem
          }
        },
        { new: true }
      );
    }

    // Deduct coins if used
    if (coinsUsed > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          coins: -coinsUsed,
          totalRedeemed: coinsUsed,
        },
      })

      // Create coin transaction for redemption
      await CoinTransaction.create({
        user: userId,
        type: "redeemed",
        amount: coinsUsed,
        source: "order_discount",
        description: `Coins redeemed for order discount - ₹${coinDiscount}`,
        referenceId: order._id.toString(),
        referenceModel: "Order",
        balanceAfter: user.coins - coinsUsed,
        metadata: {
          orderId: order._id,
          discountAmount: coinDiscount,
        },
      })
    }

    // Award coins for order (1% of order value)
    const orderRewardCoins = Math.floor(finalAmount * ORDER_REWARD_RATE)
    if (orderRewardCoins > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: {
          coins: orderRewardCoins,
          totalEarned: orderRewardCoins,
        },
      })

      // Create coin transaction for order reward
      await CoinTransaction.create({
        user: userId,
        type: "earned",
        amount: orderRewardCoins,
        source: "order_purchase",
        description: `Order purchase reward - ${ORDER_REWARD_RATE * 100}% of order value`,
        referenceId: order._id.toString(),
        referenceModel: "Order",
        balanceAfter: user.coins - coinsUsed + orderRewardCoins,
        metadata: {
          orderId: order._id,
          orderValue: finalAmount,
          rewardRate: ORDER_REWARD_RATE,
        },
      })
    }

    // Handle referral bonus for first order
    if (user.referredBy) {
      const existingReferral = await Referral.findOne({
        referrer: user.referredBy,
        referred: userId,
      })

      if (existingReferral && !existingReferral.firstOrderCompleted) {
        // Award bonus to referrer for first order
        await User.findByIdAndUpdate(user.referredBy, {
          $inc: {
            coins: REFERRAL_ORDER_BONUS,
            totalEarned: REFERRAL_ORDER_BONUS,
            "referralStats.totalEarnings": REFERRAL_ORDER_BONUS,
          },
        })

        // Update referral record
        await Referral.findByIdAndUpdate(existingReferral._id, {
          firstOrderCompleted: true,
          firstOrderDate: new Date(),
          orderReward: REFERRAL_ORDER_BONUS,
          $inc: { totalRewards: REFERRAL_ORDER_BONUS },
        })

        // Create coin transaction for referral order bonus
        const referrer = await User.findById(user.referredBy)
        await CoinTransaction.create({
          user: user.referredBy,
          type: "earned",
          amount: REFERRAL_ORDER_BONUS,
          source: "referral_order",
          description: `First order bonus for referred user ${user.name}`,
          referenceId: existingReferral._id.toString(),
          referenceModel: "Referral",
          balanceAfter: referrer.coins + REFERRAL_ORDER_BONUS,
          metadata: {
            referredUser: userId,
            referredUserName: user.name,
            orderId: order._id,
          },
        })
      }
    }

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } })
    }

    // Send order confirmation email
    try {
      const populatedOrder = await Order.findById(order._id).populate("user")
      await sendOrderConfirmationEmail(populatedOrder)
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
    }

    return NextResponse.json(
      {
        ...order.toObject(),
        razorpayOrderId,
        coinsEarned: orderRewardCoins,
        giftCoupon: giftCoupon
          ? {
              code: giftCoupon.code,
              giftItem: giftCoupon.giftItem,
              validUntil: giftCoupon.validUntil,
              productId: giftProduct?._id 
            }
          : null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// GET /api/orders/gifts - fetch all gift/accessory products
export async function GET_GIFTS(request: NextRequest) {
  try {
    await connectDB();
    const gifts = await Product.find({ $or: [ { isGift: true }, { category: 'accessories' } ] });
    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Failed to fetch gift products:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    const orders = await Order.find({ user: userId }).populate("orderItems.product", "name").sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
