'use client';

import Image from 'next/image';
import { AlertTriangle, DollarSign, MoreVertical, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { revalidateDashboard } from '@/lib/actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ItemCardProps = {
  item: Item;
  onSell: (item: Item) => void;
  onActionSuccess: () => void;
};

export function ItemCard({ item, onSell, onActionSuccess }: ItemCardProps) {
  const { toast } = useToast();
  const isLowStock = item.quantity <= item.lowStockThreshold;

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/items/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      toast({
        title: 'Item Deleted',
        description: `${item.name} has been removed from your inventory.`,
      });
      await revalidateDashboard();
      onActionSuccess();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the item.',
      });
    }
  };

  return (
    <Card className={cn('flex flex-col transition-all hover:shadow-lg', isLowStock && 'border-destructive/50 ring-2 ring-destructive/20')}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                item and all associated sales data.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                                Continue
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden mb-4">
            <Image 
                src={item.imageUrl} 
                alt={item.name} 
                fill 
                className="object-cover" 
                data-ai-hint={item.imageHint}
            />
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Selling at ${item.sellingPrice}</span>
            </div>
            <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>{item.quantity} in stock</span>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        {isLowStock && (
            <Badge variant="destructive" className="justify-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Low Stock
            </Badge>
        )}
        <Button onClick={() => onSell(item)} disabled={item.quantity === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sell Item
        </Button>
      </CardFooter>
    </Card>
  );
}
