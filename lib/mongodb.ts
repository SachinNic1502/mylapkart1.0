import mongoose from "mongoose"

// Import models to ensure they are registered with Mongoose
import "@/lib/models/Product";
import "@/lib/models/Order";
import "@/lib/models/User";
import "@/lib/models/CoinTransaction";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mylapkart"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Extend the global object to include mongoose
declare global {
  var myMongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = global.myMongoose

if (!cached) {
  cached = global.myMongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((myMongoose) => {
      console.log("Connected to MongoDB")
      return myMongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}
