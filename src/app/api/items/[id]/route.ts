import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required.' }, { status: 400 });
        }
        // Proxy DELETE request to central API
        const apiRes = await fetch(`http://localhost:3000/api/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': request.headers.get('Authorization') || ''
            }
        });
        const apiData = await apiRes.json();
        return NextResponse.json(apiData, { status: apiRes.status });
    } catch (error) {
        console.error('Failed to delete item:', error);
        return NextResponse.json({ message: 'Failed to delete item.' }, { status: 500 });
    }
}
