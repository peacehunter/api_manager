export type Item = {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  imageUrl: string;
  imageHint: string;
  userId?: number;
};

export type Sale = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  pricePerItem: number;
  totalPrice: number;
  date: string;
};

export type User = {
  id: number;
  email: string;
};
