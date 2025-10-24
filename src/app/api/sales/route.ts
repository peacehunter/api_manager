import { NextResponse } from 'next/server';
import { z } from 'zod';

const sellItemSchema = z.object({
    itemId: z.string(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export async function GET(request: Request) {
    try {
      const apiRes = await fetch('http://localhost:3000/api/sales', {
        method: 'GET',
        headers: {
          'Authorization': request.headers.get('Authorization') || ''
        }
      });
      const apiData = await apiRes.json();
      return NextResponse.json(apiData, { status: apiRes.status });
    } catch (error) {
      console.error('Failed to get sales:', error);
      return NextResponse.json({ message: 'Failed to retrieve sales.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const validatedData = sellItemSchema.safeParse(json);
    
        if (!validatedData.success) {
          return NextResponse.json({ message: 'Invalid data provided.', errors: validatedData.error.flatten().fieldErrors }, { status: 400 });
        }
        // Proxy POST
        const apiRes = await fetch('http://localhost:3000/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify(validatedData.data)
        });
        const apiData = await apiRes.json();
        return NextResponse.json(apiData, { status: apiRes.status });

    } catch (error) {
        console.error('Failed to record sale:', error);
        return NextResponse.json({ message: 'Failed to record sale.' }, { status: 500 });
    }
}
