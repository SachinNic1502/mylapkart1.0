import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/lib/models/Product"
import { requireAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const brand = searchParams.get("brand")

    // Build query
    const query: any = { status: "active" }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ]
    }

    if (featured === "true") {
      // Ensure we have a featured field in the database
      // If not enough products have featured=true, we'll select top-rated products
      query.$or = [
        { featured: true },
        { rating: { $gte: 4.5 } } // Include highly rated products as featured
      ]
      // Sort by featured first, then by rating
      const featuredCount = await Product.countDocuments({ featured: true, status: "active" })
      
      // Log for debugging
      console.log(`Found ${featuredCount} products with featured=true`)
      
      // If we don't have enough featured products, we'll just use the rating sort
      if (featuredCount < 4) {
        console.log("Not enough featured products, using rating-based selection")
        delete query.$or
        // We'll sort by rating instead (handled in the sort parameter below)
      }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.price.$lte = Number.parseInt(maxPrice)
    }

    if (brand) {
      query.brand = brand
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    
    // Determine sort order based on query parameters
    let sortOptions = {}
    
    if (featured === "true") {
      // For featured products, prioritize actual featured flag, then rating, then recency
      sortOptions = {
        featured: -1, // Featured products first (if field exists)
        rating: -1,   // Then by highest rating
        createdAt: -1 // Then by newest
      }
    } else {
      // Default sort by recency
      sortOptions = { createdAt: -1 }
    }
    
    const products = await Product.find(query)
      .populate("seller", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)

    const total = await Product.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ["seller", "admin"])
    if (auth instanceof NextResponse) return auth

    await connectDB()

    const productData = await request.json()

    const product = await Product.create({
      ...productData,
      seller: auth.userId,
      description: productData.description || '',
      isGift: typeof productData.isGift !== 'undefined' ? !!productData.isGift : false,
      giftCouponCode: productData.giftCouponCode || undefined,
      value: productData.value || undefined,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
