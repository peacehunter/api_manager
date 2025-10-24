import { NextResponse } from 'next/server';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be non-negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be non-negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
  lowStockThreshold: z.coerce.number().int().min(0, 'Threshold must be a non-negative integer'),
});

function extractUserId(request: Request) {
  const userIdHeader = request.headers.get('x-user-id');
  return userIdHeader ? parseInt(userIdHeader) : undefined;
}

export async function GET(request: Request) {
  try {
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Not authorized or user not found.' }, { status: 401 });
    }
    // Proxy GET to API layer
    const apiRes = await fetch('http://localhost:3000/api/items', {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      },
    });
    const apiData = await apiRes.json();
    return NextResponse.json(apiData, { status: apiRes.status });
  } catch (error) {
    console.error('Failed to get items:', error);
    return NextResponse.json({ message: 'Failed to retrieve items.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Not authorized or user not found.' }, { status: 401 });
    }
    const json = await request.json();
    const validatedData = itemSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ message: 'Invalid data provided.', errors: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }
    // Proxy POST to API layer
    const apiRes = await fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': String(userId),
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify(validatedData.data)
    });
    const apiData = await apiRes.json();
    return NextResponse.json(apiData, { status: apiRes.status });
  } catch (error) {
    console.error('Failed to add item:', error);
    return NextResponse.json({ message: 'Failed to add item.' }, { status: 500 });
  }
}
