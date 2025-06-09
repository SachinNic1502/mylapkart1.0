import { NextRequest, NextResponse } from 'next/server';
import Address from '@/lib/models/Address';
import { connectDB } from '@/lib/mongodb';
import { authenticateUser } from '@/lib/middleware';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const auth = await authenticateUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const data = await req.json();
  const address = await Address.findOneAndUpdate(
    { _id: params.id, user: auth.userId },
    data,
    { new: true }
  );
  if (!address) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ address });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const auth = await authenticateUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const address = await Address.findOneAndDelete({ _id: params.id, user: auth.userId });
  if (!address) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
