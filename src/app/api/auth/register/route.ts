import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }
    // TODO: Implement user registration logic using central API (not direct DB)
    // Example proxy to a central backend API (update URL and headers as appropriate):
    const apiRes = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    return NextResponse.json({ message: "Failed to register user." }, { status: 500 });
  }
}