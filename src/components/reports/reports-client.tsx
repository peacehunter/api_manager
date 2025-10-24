'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesSummary } from './sales-summary';
import { SalesHistoryTable } from './sales-history-table';
import { TrendsAnalysis } from './trends-analysis';
import type { Item, Sale } from '@/lib/types';
import { PageHeader } from '../page-header';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ReportsClient({ sales: initialSales, items: initialItems }: { sales: Sale[], items: Item[] }) {
  const [sales, setSales] = useState(initialSales);
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    // This is a simple way to keep data fresh. In a real app, you might use websockets or more advanced state management.
    const interval = setInterval(async () => {
      try {
        const salesRes = await fetch(`${API_URL}/api/sales`);
        const itemsRes = await fetch(`${API_URL}/api/items`);
        if (salesRes.ok && itemsRes.ok) {
          const newSales = await salesRes.json();
          const newItems = await itemsRes.json();
          setSales(newSales);
          setItems(newItems);
        }
      } catch (error) {
        console.error('Failed to refresh report data:', error);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
        <PageHeader 
            title="Reports & Trends" 
            description="Analyze your sales data and get AI-powered insights." 
        />
        <main className="flex-1 p-6">
            <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Sales Overview</TabsTrigger>
                <TabsTrigger value="trends">AI Trends Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
                <SalesSummary sales={sales} items={items} />
                <SalesHistoryTable sales={sales} />
            </TabsContent>
            <TabsContent value="trends" className="mt-4">
                <TrendsAnalysis />
            </TabsContent>
            </Tabs>
        </main>
    </>
  );
}
