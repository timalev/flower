import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductItem } from '../../_models/product-item';
import { DiscountService } from '../back/discount.service';
import { Discount } from '../../_models/discount';
import { StaticDataService } from '../back/static-data.service';
import { categoriesKey } from '../../_utils/constants';
import { Category } from '../../_models/category';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private discount: Discount[] = [];
  private minSum: number | undefined;
  private _discountSum: number = 0;

  public get discountSum(): number {
    return this._discountSum;
  }

  private set discountSum(value) {
    this._discountSum = value;
  }

  private get categories(): Category[] {
    const storage = sessionStorage.getItem(categoriesKey);
    if (storage) return JSON.parse(storage);
    return [];
  }

  constructor(private discountService: DiscountService, private staticData: StaticDataService) {
    discountService.getItems().subscribe((discount) => {
      this.discount = discount.sort((a, b) => a.sum - b.sum);
    });
    staticData.getCartVariables().subscribe((vars) => {
      this.minSum = vars.minOrderSum;
      this.checkMinSum(CartService.getCart());
    });
  }

  private readonly _cartUpdate: BehaviorSubject<ProductItem[]> = new BehaviorSubject<ProductItem[]>(
    CartService.getCart(),
  );

  private _isMinSumReached: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isMinSumReached(): Observable<boolean> {
    return this._isMinSumReached.asObservable();
  }

  public cartUpdate(): Observable<ProductItem[]> {
    return this._cartUpdate.asObservable();
  }

  private static getCart(): ProductItem[] {
    const cart = sessionStorage.getItem('cart');
    if (cart) return JSON.parse(cart);
    return [];
  }

  public inCart(item: ProductItem): boolean {
    return !!CartService.getCart().find((product) => product.id === item.id);
  }

  public addToCart(item: ProductItem): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count += item.count;
        product.price = this.checkPrice(product);
      } else {
        cartUpdated.push(item);
      }
      cartUpdated.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      cartUpdated = this.checkCart(cartUpdated);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    } else {
      const newCart = this.checkCart([item]);
      sessionStorage.setItem('cart', JSON.stringify(newCart));
      this._cartUpdate.next([item]);
    }
  }

  private checkCart(cart: ProductItem[]): ProductItem[] {
    cart = this.updateTulipPrices(cart);
    cart = this.checkDiscount(cart);
    this.checkMinSum(cart);
    cart = this.sortCatalog(cart);
    return cart;
  }

  public removeFromCart(id: string): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const index = cartUpdated.findIndex((cartItem) => id === cartItem.id);
      cartUpdated.splice(index, 1);
      cartUpdated = this.updateTulipPrices(cartUpdated);
      cartUpdated = this.checkDiscount(cartUpdated);
      this.checkMinSum(cartUpdated);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  public clearCart(): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      sessionStorage.removeItem('cart');
      this._cartUpdate.next([]);
    }
  }

  public updateCount(item: ProductItem): void {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      let cartUpdated: ProductItem[] = JSON.parse(cart);
      const product = cartUpdated.find((cartItem) => item.id === cartItem.id);
      if (product) {
        product.count = item.count;
        if (product.categoryId === 1 || product.category?.id === 1) {
          product.price = this.checkPrice(product);
        }
      }
      cartUpdated = this.updateTulipPrices(cartUpdated);
      cartUpdated = this.checkDiscount(cartUpdated);
      this.checkMinSum(cartUpdated);
      sessionStorage.setItem('cart', JSON.stringify(cartUpdated));
      this._cartUpdate.next(cartUpdated);
    }
  }

  private checkPrice(product: ProductItem, sum?: number): number {
    if (product) product.price = product.initialPrice;
    product.prices.map((price) => {
      if (sum) {
        if (product && sum >= price.countFrom) product.price = price.price;
      } else {
        if (product && product.count >= price.countFrom) product.price = price.price;
      }
    });
    return product.price;
  }

  public get isTulipsInclude(): boolean {
    return !!CartService.getCart().find((item) => item.categoryId === 1 || item.category?.id === 1);
  }

  private updateTulipPrices(cart: ProductItem[]): ProductItem[] {
    const tulips = cart.filter((item) => item.category?.id === 1);
    let sum = 0;
    tulips.map((item) => {
      sum += item.count;
    });
    tulips.map((item) => {
      item.price = this.checkPrice(item, sum);
      const index = cart.findIndex((cartItem) => cartItem.id === item.id);
      cart[index] = item;
    });
    return cart;
  }

  private checkDiscount(products: ProductItem[]): ProductItem[] {
    const discountProducts = products.filter((product) => !product.category?.hasNoDiscount);
    let currentDiscount: Discount | null = null;
    for (let i = 0; i < this.discount.length; i++) {
      const discount = this.discount[i];
      let productsSum = 0;
      discountProducts.map((item) => {
        productsSum += item.initialPrice * item.count;
      });
      if (productsSum >= discount.sum) {
        currentDiscount = discount;
      }
    }
    if (currentDiscount) {
      discountProducts.map((item) => {
        item.price = +(
          // @ts-ignore
          (item.initialPrice - item.initialPrice * (currentDiscount.discount / 100)).toFixed(2)
        );
      });
    } else {
      discountProducts.map((product) => {
        product.price = product.initialPrice;
      });
    }
    return products;
  }

  private checkMinSum(products: ProductItem[]): void {
    let sum = 0;
    let discount = 0;
    products.map((product) => {
      if (product.price < product.initialPrice) {
        discount += (product.initialPrice - product.price) * product.count;
      }
      sum += product.price * product.count;
    });
    if (discount) {
      this.discountSum = discount;
    }
    if (this.minSum && this.minSum <= sum) {
      this._isMinSumReached.next(true);
    } else {
      this._isMinSumReached.next(false);
    }
  }

  private sortCatalog(cart: ProductItem[]): ProductItem[] {
    cart.map((product) => this.setCategory(product));
    // @ts-ignore
    return cart.sort((a, b) => a.category.id - b.category.id).sort((a, b) => a.name - b.name);
  }

  private setCategory(product: ProductItem): ProductItem {
    if (product.category) {
      const parentId = product.category.parentId;
      if (parentId) {
        product.category = this.categories.find((category) => category.id === parentId);
      }
    } else if (product.categoryId) {
      product.category = this.categories.find((category) => category.id === product.categoryId);
      return this.setCategory(product);
    }
    return product;
  }
}
