import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductItem } from '../../../../../_models/product-item';
import { OrderBox, OrderProduct } from '../../../../../_models/order';
import { BoxGenerateService } from '../../../../../_services/front/box-generate.service';

@Component({
  selector: 'flower-valley-boxes-order',
  templateUrl: './boxes-order.component.html',
  styleUrls: ['./boxes-order.component.scss'],
  providers: [BoxGenerateService],
})
export class BoxesOrderComponent {
  public _orderBoxes: OrderBox[] = [];
  @Input()
  public get orderBoxes(): OrderBox[] {
    return this._orderBoxes;
  }
  public set orderBoxes(value: OrderBox[]) {
    this._orderBoxes = value;
    this.orderBoxesChange.emit(this.orderBoxes);
  }
  @Output()
  public orderBoxesChange: EventEmitter<OrderBox[]> = new EventEmitter<OrderBox[]>();
  @Input()
  public products: OrderProduct[] = [];
  private clonedBoxes: { [s: string]: OrderBox } = {};

  constructor(private boxService: BoxGenerateService) {}

  public regenerateBoxes(): void {
    const boxesProducts: ProductItem[] | undefined = this.products.map((item) => {
      return <ProductItem>{
        ...item.product,
        count: item.count,
        initialPrice: item.price,
      };
    });
    if (boxesProducts) {
      this.boxService.genBoxes(boxesProducts);
      this.boxService.getBoxes().subscribe((boxes) => {
        // @ts-ignore
        this.orderBoxes = boxes.map((item) => {
          return {
            id: item.id,
            count: item.count,
            price: item.price,
            box: item,
          };
        });
      });
    }
  }

  public onRowEditInit(box: OrderBox): void {
    this.clonedBoxes[box.id] = { ...box };
  }

  public onRowEditSave(box: OrderBox, index: number) {
    this.orderBoxes[index] = box;
    delete this.clonedBoxes[box.id];
  }

  public onRowEditCancel(box: OrderBox, index: number) {
    this.orderBoxes[index] = this.clonedBoxes[box.id];
    delete this.clonedBoxes[box.id];
  }
}
