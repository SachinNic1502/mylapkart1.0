import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/Order"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const sellerId = auth.userId

    // Get seller's products
    const products = await Product.find({ seller: sellerId })
    const productIds = products.map((p) => p._id)

    // Get recent orders containing seller's products
    const orders = await Order.find({
      "orderItems.product": { $in: productIds },
    })
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 })
      .limit(10)

    // Filter orders to only include seller's items
    // const filteredOrders = orders.map((order) => ({
    //   ...order.toObject(),
    //   orderItems: order.orderItems.filter((item: any) =>
    //     item.product && productIds.some((id) => id.toString() === item.product._id.toString()),
    //   ),
    // }))

    const filteredOrders = orders.map((order) => {
      const filteredItems = order.orderItems.filter((item: any) =>
        item.product && productIds.some((id) => id.toString() === item.product._id.toString())
      );
      // Debug: log order ID and filtered items
      console.log(`Order ${order._id}:`);
      filteredItems.forEach((item: any) => {
        console.log(`  Item: ${item._id}, Product: ${item.product?._id}, Name: ${item.product?.name}`);
      });
      return {
        ...order.toObject(),
        orderItems: filteredItems,
      };
    });
    console.log("Filtered orders:", filteredOrders);    

    return NextResponse.json(filteredOrders)
  } catch (error) {
    console.error("Seller orders fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}