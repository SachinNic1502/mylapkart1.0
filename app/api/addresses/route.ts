import { NextRequest, NextResponse } from 'next/server';
import Address from '@/lib/models/Address';
import { connectDB } from '@/lib/mongodb';
import { authenticateUser } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  await connectDB();
  const auth = await authenticateUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const addresses = await Address.find({ user: auth.userId });
  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const auth = await authenticateUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // Defensive: Ensure userId is valid and not empty
  if (!auth.userId) {
    return NextResponse.json({ error: 'Invalid user session.' }, { status: 401 });
  }

  const data = await req.json();

  // Remove _id if present in data (should not be set by client)
  if ('_id' in data) delete data._id;

  try {
    const address = await Address.create({ ...data, user: auth.userId });
    return NextResponse.json({ address });
  } catch (err: any) {
    // Return validation errors from Mongoose
    return NextResponse.json(
      { error: 'Address validation failed', details: err.message || err },
      { status: 400 }
    );
  }
}