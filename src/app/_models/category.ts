import { Product } from './product';
import { Step } from './step';

export interface Category {
  id: number;
  parentId?: number;
  name: string;
  img: string;
  products?: Product[];
  categoryOrder: number;
  sale?: number;
  steps?: Step[];
  isTulip: boolean;
  isSeedling: boolean;
  isBlocked: boolean;
  hasNoDiscount: boolean;
  categoryType?: number;
}
