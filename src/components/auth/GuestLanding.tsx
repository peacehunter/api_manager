"use client";

import React from "react";
import Link from "next/link";

export default function GuestLanding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow text-center">
        <div className="text-3xl font-bold text-gray-800 mb-4">You are not logged in</div>
        <div className="text-gray-700 mb-6">Please login or register to access the Inventory Management System.</div>
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <span className="px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-primary/80 focus:outline focus:ring transition">Login</span>
          </Link>
          <Link href="/register">
            <span className="px-6 py-2 bg-secondary text-primary rounded font-semibold border border-primary hover:bg-secondary/80 focus:outline focus:ring transition">Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
