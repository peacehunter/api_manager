'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { revalidateDashboard } from '@/lib/actions';
import { useAuth } from '@/components/auth/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const itemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price cannot be negative.'),
  sellingPrice: z.coerce.number().min(0, 'Selling price cannot be negative.'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative.'),
  lowStockThreshold: z.coerce.number().int().min(0, 'Threshold cannot be negative.'),
});

type ItemFormData = z.infer<typeof itemSchema>;

export function ItemForm({ open, onOpenChange, onFormSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onFormSuccess: () => void }) {
  const { toast } = useToast();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
  });

  const onSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          
        },
        body: JSON.stringify(data),
      });

      console.log('Request json:', JSON.stringify(data));

      if (!response.ok) {
        let errorMessage = 'Failed to add item.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {}
        if (response.status === 401 || /auth/i.test(errorMessage)) {
          toast({ variant: 'destructive', title: 'Authentication Error', description: errorMessage });
        } else {
          toast({ variant: 'destructive', title: 'Error', description: errorMessage });
        }
        throw new Error(errorMessage);
      }
      toast({
        title: 'Success!',
        description: 'New item has been added to your inventory.',
      });
      await revalidateDashboard();
      onFormSuccess();
      onOpenChange(false);
      reset();
    } catch (error: any) {
      console.error("Product add error:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not add the item.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} />
              {errors?.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <div className="col-span-3">
              <Textarea id="description" {...register('description')} />
              {errors?.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="purchasePrice" className="text-right">Purchase Price</Label>
              <Input id="purchasePrice" type="number" step="0.01" {...register('purchasePrice')} />
              {errors?.purchasePrice && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{errors.purchasePrice.message}</p>}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">Selling Price</Label>
              <Input id="sellingPrice" type="number" step="0.01" {...register('sellingPrice')} />
              {errors?.sellingPrice && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{errors.sellingPrice.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors?.quantity && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{errors.quantity.message}</p>}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Alert</Label>
              <Input id="lowStockThreshold" type="number" {...register('lowStockThreshold')} />
              {errors?.lowStockThreshold && <p className="text-destructive text-sm mt-1 col-span-2 text-right">{errors.lowStockThreshold.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
