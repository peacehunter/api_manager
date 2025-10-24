import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
  ];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect all other API routes under /api/
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication token is required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // The `jwtVerify` function will throw an error if the token is invalid or expired.
      await jwtVerify(token, JWT_SECRET);
      
      // If verification is successful, allow the request to proceed.
      return NextResponse.next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or expired token.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // For any other request not under /api/, just let it pass.
  return NextResponse.next();
}

export const config = {
  // This matcher will apply the middleware to all routes under /api/,
  // and we handle public exceptions inside the middleware function.
  matcher: ['/api/:path*'],
};
