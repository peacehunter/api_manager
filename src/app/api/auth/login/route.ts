import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const endpoint = `${apiUrl}/api/auth/login`;
  let reqId = Math.random().toString(36).substring(2, 10);
  try {
    const start = Date.now();
    const json = await request.json();
    const validatedData = loginSchema.safeParse(json);

    if (!validatedData.success) {
      console.warn(`[${reqId}] LOGIN_INVALID_DATA`, validatedData.error.flatten().fieldErrors);
      return NextResponse.json(
        { message: 'Invalid data provided.', errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;

    const apiRequestBody = { email, password };
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    };

    let apiRes;
    let apiResBody;
    try {
      apiRes = await fetch(endpoint, fetchOptions);
      const text = await apiRes.text();
      try {
        apiResBody = text ? JSON.parse(text) : {};
      } catch {
        console.warn(`[${reqId}] LOGIN_API_NONJSON_RESPONSE:`, text);
        return NextResponse.json({ message: 'Login service error.' }, { status: 502 });
      }
    } catch (err) {
      console.error(`[${reqId}] LOGIN_API_FETCH_FAIL:`, err);
      return NextResponse.json({ message: 'Unable to contact login service.' }, { status: 503 });
    }

    const elapsed = Date.now() - start;
    console.info(`[${reqId}] LOGIN_API_POST`, {
      elapsed_ms: elapsed,
      status: apiRes.status,
      user: email.replace(/(.)(.*)(@.*)/, '$1***$3')
    });

    if (!apiRes.ok) {
      console.warn(`[${reqId}] LOGIN_API_ERROR:`, apiRes.status, apiResBody);
      const message = apiResBody?.message || 'Login failed.';
      return NextResponse.json({ message }, { status: apiRes.status });
    }

    const { token, user } = apiResBody || {};
    if (!token || !user) {
      console.error(`[${reqId}] LOGIN_API_BAD_RESPONSE:`, apiResBody);
      return NextResponse.json({ message: 'Invalid response from login service.' }, { status: 500 });
    }

    return NextResponse.json({ token, user });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
  }
}
