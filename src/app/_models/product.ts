import { BusinessPackModel } from './business-pack/business-pack-model';
import { Category } from './category';
import { Price } from './price';
import { BannerPhotos } from './main-banner';

export interface Product extends BusinessPackModel {
  photos: BannerPhotos[];
  description: string;
  categories: Category[];
  categoryName?: string;
  categoryId?: number;
  discountCategoryId?: string;
  boxId: number;
  prices: Price[];
  sale?: number;
  productCategoryId: number;
}

export interface ProductCategory extends Product {
  category: {
    id: number;
    name: string;
  };
}
