import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product, ProductCategory } from '../../../../../_models/product';
import { OrderProduct } from '../../../../../_models/order';
import { ProductService } from '../../../../../_services/back/product.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'flower-valley-products-order',
  templateUrl: './products-order.component.html',
  styleUrls: ['./products-order.component.scss'],
})
export class ProductsOrderComponent implements OnChanges {
  public _orderProducts: OrderProduct[] = [];
  @Input()
  public isNewOrder: boolean = false;
  @Input()
  public get orderProducts(): OrderProduct[] {
    return this._orderProducts;
  }
  public set orderProducts(value: OrderProduct[]) {
    this._orderProducts = value;
    this.orderProductsChange.emit(this.orderProducts);
  }
  @Output()
  public orderProductsChange: EventEmitter<OrderProduct[]> = new EventEmitter<OrderProduct[]>();
  private clonedProducts: { [s: string]: OrderProduct } = {};
  public products: Product[] = [];
  private hiddedProducts: Product[] = [];
  public isProductsLoading: boolean = false;
  public showProductSelect: boolean = false;
  constructor(
    private productService: ProductService,
    private cs: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const orderProducts: OrderProduct[] = changes['orderProducts'].currentValue;
    if (orderProducts) {
      this.getProducts(orderProducts, false);
    }
  }

  public showProductsDropdown(): void {
    if (this.products.length) {
      this.showProductSelect = true;
    } else {
      this.getProducts(this.orderProducts, true);
    }
  }

  private getProducts(orderProducts: OrderProduct[], showSelect: boolean): void {
    this.isProductsLoading = true;
    this.productService.getItems().subscribe((products) => {
      orderProducts.map((orderProduct) => {
        const index = products.findIndex((item) => item.id === orderProduct.product.id);
        const product: Product = products[index];
        this.hiddedProducts.push(product);
        products.splice(index, 1);
        if (this.isNewOrder) orderProduct.price = product.price;
        if (product.categoryId && product.categoryName) {
          orderProduct.product.category = {
            id: product.categoryId,
            name: product.categoryName,
          };
        }
      });
      this.products = products;
      this.isProductsLoading = false;
      if (showSelect) {
        this.showProductSelect = true;
      }
    });
  }

  public addProduct(product: ProductCategory): void {
    this.orderProducts.push({
      // @ts-ignore
      id: product.id,
      count: Number(product.coefficient),
      price: product.price,
      product: product,
    });
    this.showProductSelect = false;
    const index = this.products.findIndex((item) => item.id === product.id);
    this.products.splice(index, 1);
    this.hiddedProducts.push(product);
  }

  public onRowEditInit(product: OrderProduct): void {
    this.clonedProducts[product.id] = { ...product };
  }

  public onRowEditSave(product: OrderProduct, index: number) {
    this.orderProducts[index] = product;
    delete this.clonedProducts[product.id];
  }

  public onRowEditCancel(product: OrderProduct, index: number) {
    this.orderProducts[index] = this.clonedProducts[product.id];
    delete this.clonedProducts[product.id];
  }

  public deleteProduct(product: OrderProduct, index: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление товара',
      message: 'Вы действительно хотите удалить товар из заказа?',
      accept: () => {
        this.orderProducts.splice(index, 1);
        const rollBackProduct = this.hiddedProducts.find((item) => item.id === product.product.id);
        if (rollBackProduct) {
          this.products.push(rollBackProduct);
          this.cdr.detectChanges();
        }
      },
    });
  }
}
