import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { InventoryAlert } from "@/lib/models/InventoryAlert"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    let query = {}
    if (auth.user.role === "seller") {
      query = { seller: auth.userId }
    }

    const alerts = await InventoryAlert.find(query)
      .populate("product", "name images stock")
      .populate("seller", "name")
      .sort({ createdAt: -1 })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Inventory alerts fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    // Check all products for low stock and create alerts
    const products = await Product.find({ stock: { $lte: 10 } }).populate("seller", "name email")

    const alerts = []
    for (const product of products) {
      // Check if alert already exists for this product
      const existingAlert = await InventoryAlert.findOne({
        product: product._id,
        isResolved: false,
      })

      if (!existingAlert) {
        let alertType = "low_stock"
        let message = `Product "${product.name}" is running low on stock (${product.stock} remaining)`

        if (product.stock === 0) {
          alertType = "out_of_stock"
          message = `Product "${product.name}" is out of stock`
        }

        const alert = await InventoryAlert.create({
          product: product._id,
          seller: product.seller._id,
          alertType,
          currentStock: product.stock,
          message,
        })

        alerts.push(alert)
      }
    }

    return NextResponse.json({ message: `Created ${alerts.length} new alerts`, alerts })
  } catch (error) {
    console.error("Create inventory alerts error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
