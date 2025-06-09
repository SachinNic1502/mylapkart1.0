import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demonstration (replace with DB in production)
const subscribers: Set<string> = new Set()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    // Simulate storing the email (replace with DB logic)
    subscribers.add(email)
    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
