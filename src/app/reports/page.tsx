"use client";

import { useEffect, useState } from "react";
import { ReportsClient } from "@/components/reports/reports-client";
import GuestLanding from "@/components/auth/GuestLanding";
import { useAuth } from "@/components/auth/AuthContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`${API_URL}/api/sales`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch sales");
        return res.json();
      }),
      fetch(`${API_URL}/api/items`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
    ])
      .then(([salesData, itemsData]) => {
        setSales(salesData);
        setItems(itemsData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <div>Checking authentication...</div>;
  if (!user) return <GuestLanding />;
  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error loading reports: {error}</div>;

  return (
    <div className="flex flex-col h-full">
      <ReportsClient sales={sales} items={items} />
    </div>
  );
}
