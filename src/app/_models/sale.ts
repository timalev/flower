export interface Sale {
  id: number;
  category: {
    id: number;
    name: string;
    categoryOrder: number;
  };
  categoryId?: number;
  discount: number;
  productId?: string;
  currentPrice?: number;
  order: number;
  img: string;
  title: string;
  isActive: boolean;
  isVisible: boolean;
}

export interface SaleOrder {
  order: number;
  id: number;
}
