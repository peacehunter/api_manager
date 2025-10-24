import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Sale } from '@/lib/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

export function SalesHistoryTable({ sales }: { sales: Sale[] }) {
    if (sales.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>A list of your most recent sales.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        No sales have been recorded yet.
                    </div>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>A list of your most recent sales.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sales.map((sale) => (
                    <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.itemName}</TableCell>
                    <TableCell className="text-right">{sale.quantity}</TableCell>
                    <TableCell className="text-right">${sale.pricePerItem.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant="secondary">${sale.totalPrice.toFixed(2)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{new Date(sale.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>

  );
}
