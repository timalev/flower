import { Product } from './product';
import { Category } from './category';

export interface ProductItem extends Product {
  count: number;
  category?: Category;
  categoryId?: number;
  categoryName?: string;
  initialPrice: number;
}
