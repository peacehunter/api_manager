'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { revalidateDashboard } from '@/lib/actions';
import type { Item } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const sellItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
});

type SellItemFormData = z.infer<typeof sellItemSchema>;

export function SellItemDialog({
  item,
  open,
  onOpenChange,
  onSaleSuccess,
}: {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaleSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<SellItemFormData>({
    resolver: zodResolver(sellItemSchema),
  });

  useEffect(() => {
    if (open) {
      reset({ quantity: 1 }); // Reset form when dialog opens
    }
  }, [open, reset]);
  
  if (!item) return null;

  const onSubmit = async (data: SellItemFormData) => {
    setIsSubmitting(true);
    try {
        const response = await fetch(`${API_URL}/api/sales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.token ?? ''}`
            },
            body: JSON.stringify({ itemId: item.id, quantity: data.quantity }),
        });

        const result = await response.json();

        if (!response.ok) {
            setError('quantity', { type: 'server', message: result.message || 'Failed to record sale.' });
            throw new Error(result.message || 'Failed to record sale.');
        }

        toast({
            title: 'Sale Recorded!',
            description: `Sold ${data.quantity} of ${item.name}.`,
        });
        await revalidateDashboard();
        onSaleSuccess();
        onOpenChange(false);
    } catch (error: any) {
        console.error(error);
        if (!errors.quantity) { // Don't show generic toast if specific error is already set
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Could not record the sale.',
            });
        }
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell: {item.name}</DialogTitle>
          <DialogDescription>
            Enter the quantity to sell. Available: {item.quantity}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  type="number"
                  defaultValue="1"
                  min="1"
                  max={item.quantity}
                  {...register('quantity')}
                  className={cn(errors.quantity && 'border-destructive')}
                />
                 {errors.quantity && <p className="text-destructive text-sm mt-1">{errors.quantity.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording Sale...' : 'Confirm Sale'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
