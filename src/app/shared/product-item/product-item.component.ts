import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { ProductItem } from '../../_models/product-item';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductService } from '../../_services/back/product.service';
import { ConfirmationService } from 'primeng/api';
import { Category } from '../../_models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  providers: [DialogService],
})
export class ProductItemComponent {
  @Input()
  public isAdmin: boolean = false;
  public get product(): ProductItem {
    return this._product;
  }
  @Input()
  public set product(value: ProductItem) {
    this._product = value;
    this.product.initialPrice = this.product.price;
    if (this.product.prices?.length) {
      const minPrice = this.product.prices.sort((price) => -price.price)[0];
      this.product.prices = this.product.prices.sort((price) => -price.countFrom);
      this.product.price = minPrice.price;
      this.product.count = minPrice.countFrom;
    }
  }
  private _product: any;
  public get category(): Category {
    return this._category;
  }
  @Input()
  public set category(value: Category | undefined) {
    this._category = value;
  }
  private _category: any;
  public isInCartShow: boolean = false;

  @Output()
  public openProductCard: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private productDeleted: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private cartService: CartService,
    private ds: DialogService,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {}

  public addToCart(): void {
    let price = this.product.price;
    let initialPrice = this.product.initialPrice;
    if (this.category) this.product.category = this.category;
    if (this.product.sale) {
      price = this.product.sale;
      initialPrice = this.product.sale;
    }
    this.cartService.addToCart({ ...this.product, price: price, initialPrice: initialPrice });
    this.isInCartShow = true;
    setTimeout(() => {
      this.isInCartShow = false;
    }, 3000);
  }

  public get step(): number {
    if (this.product.coefficient) {
      return Number(this.product.coefficient);
    } else {
      return 1;
    }
  }

  public setCorrectCount(): void {
    if (this.product.count < this.step) {
      this.product.count = this.step;
    } else if (this.product.count / this.step !== 0) {
      this.product.count = Math.round(this.product.count / this.step) * this.step;
    }
  }

  public checkPrice(): void {
    if (this.product) this.product.price = this.product.initialPrice;
    this.product?.prices?.map((price) => {
      if (this.product && this.product.count >= price.countFrom) this.product.price = price.price;
    });
  }

  public editProduct(id: string): void {
    this.router.navigate(['admin/edit/product', id]);
  }

  public deleteProduct(): void {
    this.confirmationService.confirm({
      header: 'Подтвердите удаление товара',
      message: `Вы действительно хотите удалить товар ${this.product.name}`,
      accept: () => {
        if (this.product.id) {
          this.productService.deleteItem(this.product.id).subscribe(() => {
            this.productDeleted.emit();
          });
        }
      },
    });
  }

  public get percentDiscount(): number | null {
    if (this.category && this.category.sale) {
      if (this.product && this.product.sale) {
        return 100 - Math.ceil((this.product.sale / this.product.price) * 100);
      }
      return this.category.sale;
    }
    if (this.product && this.product.sale) {
      return 100 - Math.ceil((this.product.sale / this.product.price) * 100);
    }
    return null;
  }
}
