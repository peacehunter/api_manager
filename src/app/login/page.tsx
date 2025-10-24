import React from "react";
import Link from "next/link";

// Show a helpful message and direct to the actual login/register page
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white/90 backdrop-blur space-y-6 border border-gray-200 text-center">
        <div className="text-2xl font-semibold mb-4">Login/Register</div>
        <div className="mb-8 text-gray-700">Login and registration are available at our main authentication page.</div>
        <div className="flex flex-col gap-4">
          <Link href="/auth" className="w-full">
            <button className="w-full py-2 px-4 bg-primary text-white font-semibold rounded shadow transition-all hover:bg-primary/90 focus:outline focus:ring-2 focus:ring-primary/50">Go to Login / Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}