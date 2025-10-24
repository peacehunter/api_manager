'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import type { Item } from '@/lib/types';
import { ItemCard } from './item-card';
import { ItemForm } from './item-form';
import { SellItemDialog } from './sell-item-dialog';
import { PageHeader } from '../page-header';
import { useAuth } from '@/components/auth/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function InventoryClient({ items: initialItems }: { items: Item[] }) {
  const { user } = useAuth();
  const [items, setItems] = useState(initialItems);
  const [isAddFormOpen, setAddFormOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState<Item | null>(null);

  const refreshItems = async () => {
    try {
      console.log("User token:", (user as any).token);

      const res = await fetch(`${API_URL}/api/items`, {
        headers: user && user.id && user.token ? {
          'Authorization': `Bearer ${(user as any).token}`,
        } : undefined
      });
      console.log("Response status:", res.status);
      if (!res.ok) throw new Error('Failed to fetch items');
      const newItems = await res.json();
      setItems(newItems);
    } catch (error) {
      console.error('Error refreshing items:', error);
    }
  };

  return (
    <>
      <PageHeader
        title="Inventory Dashboard"
        description="Manage your items and track stock levels."
      >
        <Button onClick={() => setAddFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </PageHeader>
      <main className="flex-1 p-6 overflow-auto">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ItemCard item={item} onSell={setItemToSell} onActionSuccess={refreshItems} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg p-12">
            <h2 className="text-2xl font-semibold">Your inventory is empty!</h2>
            <p className="mt-2 text-muted-foreground">Get started by adding your first item.</p>
            <Button onClick={() => setAddFormOpen(true)} className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
            </Button>
          </div>
        )}
      </main>

      <ItemForm open={isAddFormOpen} onOpenChange={setAddFormOpen} onFormSuccess={refreshItems} />
      <SellItemDialog
        item={itemToSell}
        open={!!itemToSell}
        onOpenChange={(isOpen) => !isOpen && setItemToSell(null)}
        onSaleSuccess={refreshItems}
      />
    </>
  );
}
