import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Sale, Item } from '@/lib/types';

type SalesSummaryProps = {
  sales: Sale[];
  items: Item[];
};

export function SalesSummary({ sales, items }: SalesSummaryProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  const itemSales = sales.reduce((acc, sale) => {
    acc[sale.itemId] = (acc[sale.itemId] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topSellingItem = Object.entries(itemSales).sort(([, a], [, b]) => b - a)[0];
  const topSellingItemName = topSellingItem ? items.find(i => i.id === topSellingItem[0])?.name : 'N/A';

  const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold).length;


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalSales}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Seller</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">{topSellingItemName}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
        </CardContent>
      </Card>
    </div>
  );
}
