"use client";

import { useEffect, useState } from "react";
import { InventoryClient } from "@/components/inventory/inventory-client";
import React from "react";
import GuestLanding from "@/components/auth/GuestLanding";
import { useAuth } from "@/components/auth/AuthContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 201) {
        setMessage("Registration successful! You can now log in.");
        setEmail("");
        setPassword("");
      } else if (res.status === 409) {
        const data = await res.json();
        setMessage(data.message || "User already exists.");
      } else if (res.status === 400) {
        const data = await res.json();
        setMessage(
          data.errors?.email?.join(" ") || data.errors?.password?.join(" ") || data.message || "Invalid data."
        );
      } else {
        setMessage("Registration failed. Try again.");
      }
    } catch (err) {
      setMessage("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Register New User</h2>
      <div className="mb-2">
        <label className="block">Email</label>
        <input type="email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="block">Password (min 6 characters)</label>
        <input type="password" className="w-full border p-2 rounded" value={password} minLength={6} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">
        {isLoading ? "Registering..." : "Register"}
      </button>
      {message && (<div className="mt-2 text-sm text-center">{message}</div>)}
    </form>
  );
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    const router = require("next/navigation").useRouter();
    React.useEffect(() => {
      router.replace("/auth");
    }, [router]);
    return null;
  }
  console.log("User token:", token);
  useEffect(() => {
    if (!user || !token) return;
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/items`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!res.ok) throw new Error(`Failed to fetch items , error code: ${res.status}`);
        const items = await res.json();
        setItems(items);
      } catch (err) {
        setError(err.message );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user, token]);

  if (authLoading) return <div>Checking authentication...</div>;
  if (!user) return <GuestLanding />;
  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div>Error loading inventory: {error}</div>;

  return (
    <div className="flex flex-col h-full">
      <InventoryClient items={items} />
    </div>
  );
}
