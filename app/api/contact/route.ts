import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { sendContactEmail } from "@/lib/email"
import ContactMessage from "@/lib/models/contact-message"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Store the message in the database
    await ContactMessage.create({ name, email, phone, subject, message })

    // Send email notification
    try {
      await sendContactEmail({ name, email, subject, message })
    } catch (emailError) {
      console.error("Failed to send contact email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
