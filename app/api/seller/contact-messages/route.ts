import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactMessage from '@/lib/models/contact-message'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact messages' }, { status: 500 })
  }
}
