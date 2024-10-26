import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoxItem } from '../../_models/box-item';
import { ProductItem } from '../../_models/product-item';
import { BoxService } from '../back/box.service';

@Injectable()
export class BoxGenerateService {
  private _boxesUpdate: BehaviorSubject<BoxItem[]> = new BehaviorSubject<BoxItem[]>([]);

  public get boxes(): BoxItem[] {
    return this._boxes;
  }

  private set boxes(value: BoxItem[]) {
    this._boxes = value;
    this._boxesUpdate.next(value);
  }
  private _boxes: BoxItem[] = [];

  constructor(private boxService: BoxService) {}

  public genBoxes(goods: ProductItem[]): void {
    const generatedBoxes: BoxItem[] = [];
    this.boxService.getItems().subscribe((boxes) => {
      boxes.map((box) => {
        let spaceLeft = box.volume;
        const currentProducts = goods.filter((product) => product.boxId === box.id);
        currentProducts?.map((product) => {
          const currentBox = generatedBoxes.find((genBox) => genBox.id === box.id);
          if (product.count / box.volume < 1) {
            if (currentBox) {
              if (spaceLeft) {
                const spaceCount = product.count - spaceLeft;
                if (spaceCount < 0) {
                  spaceLeft = box.volume - Math.abs(spaceCount);
                } else if (spaceCount > 0) {
                  const flooredCount = Math.ceil(spaceCount / currentBox.volume);
                  currentBox.count += flooredCount;
                  spaceLeft = flooredCount - spaceCount;
                }
              } else {
                currentBox.count++;
                spaceLeft = box.volume;
              }
            } else {
              generatedBoxes.push({
                ...box,
                count: 1,
              });
              spaceLeft = box.volume - product.count;
            }
          } else if (product.count / box.volume > 1) {
            if (currentBox) {
              if (spaceLeft) {
                product.count = product.count - spaceLeft;
                const flooredCount = Math.ceil(product.count / currentBox.volume);
                currentBox.count += flooredCount;
                spaceLeft = flooredCount * currentBox.volume - product.count;
              } else {
                const flooredCount = Math.ceil(product.count / currentBox.volume);
                currentBox.count += flooredCount;
                spaceLeft = flooredCount * currentBox.volume - product.count;
              }
            } else {
              const flooredCount = Math.ceil(product.count / box.volume);
              generatedBoxes.push({
                ...box,
                count: flooredCount,
              });
              spaceLeft = flooredCount * box.volume - product.count;
            }
          } else {
            if (currentBox) {
              currentBox.count++;
            } else {
              generatedBoxes.push({
                ...box,
                count: 1,
              });
            }
          }
        });
      });
      this.boxes = generatedBoxes;
    });
  }

  public removeBoxes(): void {
    this.boxes = [];
  }

  public getBoxes(): Observable<BoxItem[]> {
    return this._boxesUpdate.asObservable();
  }

  public getBoxesSum(): number {
    let sum = 0;
    this.boxes.map((item) => (sum += item.price * item.count));
    return sum;
  }
}
