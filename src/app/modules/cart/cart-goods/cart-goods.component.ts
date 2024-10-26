import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../_services/front/cart.service';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { Box } from '../../../_models/box';
import { ProductItem } from '../../../_models/product-item';
import { CartVariables } from '../../../_models/static-data/variables';
import { Cart } from '../../../_models/static-data/cart';
import { MessageService } from 'primeng/api';
import { Observable, takeUntil } from 'rxjs';
import { TakeUntilDestroy } from '../../../_decorators/take-until-destroy.decorator';

@Component({
  selector: 'flower-valley-cart-goods',
  templateUrl: './cart-goods.component.html',
  styleUrls: ['./cart-goods.component.scss'],
})
@TakeUntilDestroy
export class CartGoodsComponent implements OnInit, OnDestroy {
  @Input()
  public cartVariables: CartVariables | undefined;
  @Input()
  public cartContent: Cart | undefined;
  public goods: ProductItem[] = [];
  public boxes: Box[] = [];
  public isLoading: boolean = false;
  public isBoxesAutoGen: boolean = false;
  public isBoxButtonClicked: boolean = false;

  // @ts-ignore
  private componentDestroy: () => Observable<unknown>;

  constructor(
    private cartService: CartService,
    private boxService: BoxGenerateService,
    private ms: MessageService,
  ) {}

  public ngOnInit(): void {
    this.cartService
      .cartUpdate()
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe((cart) => {
        this.goods = cart;
        this.genTulipBoxes();
        if (this.boxes.length && this.isBoxButtonClicked) this.genBoxes();
      });
    this.boxService
      .getBoxes()
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe((boxes) => {
        this.boxes = boxes;
        this.isLoading = false;
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  public ngOnDestroy(): void {}

  public get getSum(): number {
    let sum = 0;
    this.goods.map((item) => (sum += item.price * item.count));
    return sum;
  }

  public get getInitialSum(): number {
    let sum = 0;
    this.goods.map((item) => (sum += item.initialPrice * item.count));
    return sum;
  }

  public get getDifference(): number | null {
    const minOrderSum = this.cartVariables?.minOrderSum;
    if (minOrderSum) {
      const diff = minOrderSum - this.getSum;
      if (diff > 0) {
        return diff;
      }
      return 0;
    }
    return null;
  }

  public updateCount(item: ProductItem): void {
    this.cartService.updateCount(item);
  }

  public getStep(item: ProductItem): number {
    if (item.coefficient) {
      return Number(item.coefficient);
    } else {
      return 1;
    }
  }

  public changeCount(item: ProductItem, count: number): void {
    const step = this.getStep(item);
    if (count < step) {
      item.count = step;
    } else if (count / step !== 0) {
      item.count = Math.round(count / step) * step;
    }
    this.cartService.updateCount(item);
  }

  public removeItem(id: string): void {
    this.cartService.removeFromCart(id);
  }

  public genBoxes(goods?: ProductItem[]): void {
    if (!goods) this.isLoading = true;
    this.boxService.genBoxes(goods || this.goods);
  }

  public genTulipBoxes(): void {
    const tulips = this.goods.filter((item) => item.category?.id === 1);
    if (tulips.length) {
      let count = 0;
      tulips.map((item) => {
        count += item.count;
      });
      if (count >= 500) {
        if (!this.isBoxesAutoGen) {
          this.ms.add({
            severity: 'warn',
            summary: 'Коробки под тюльпан добавлены',
            detail: 'При заказе тюльпанов от 500 шт., коробки ОБЯЗАТЕЛЬНЫ',
            life: 10000,
          });
        }
        this.isBoxesAutoGen = true;
        this.genBoxes(tulips);
      } else {
        if (this.isBoxesAutoGen && !this.isBoxButtonClicked && this.boxes.length)
          this.removeBoxes();
        this.isBoxesAutoGen = false;
      }
    } else {
      this.isBoxesAutoGen = false;
    }
  }

  public removeBoxes(): void {
    this.boxService.removeBoxes();
    this.boxes = [];
    this.genTulipBoxes();
    this.isBoxButtonClicked = false;
  }
}
