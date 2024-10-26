import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../../_services/back/discount.service';
import { Router } from '@angular/router';
import { Discount } from '../../../_models/discount';
import { CatalogService } from '../../../_services/back/catalog.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Category } from '../../../_models/category';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit {
  public discount: Discount[] = [];
  public catalog: Category[] = [];
  public selectedCategories: Category[] = [];
  private clonedDiscount: { [s: string]: Discount } = {};
  public isLoading = false;
  public requestProcessed = false;

  constructor(
    private discountService: DiscountService,
    private catalogService: CatalogService,
    private router: Router,
    private ms: MessageService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const requests = [this.catalogService.getItems(true), this.discountService.getItems()];
    forkJoin(requests).subscribe(([catalog, discount]) => {
      this.discount = (discount as Discount[]).sort((a, b) => a.sum - b.sum);
      this.catalog = catalog as Category[];
      this.selectedCategories = this.catalog.filter((category) => !category.hasNoDiscount);
      this.isLoading = false;
    });
  }

  public deleteItem(id: number): void {
    this.isLoading = true;
    this.discountService.deleteItem(id).subscribe(() => {
      const index = this.discount.findIndex((discount) => discount.id === id);
      this.discount.splice(index, 1);
      this.isLoading = false;
    });
  }

  public navigateToAddDiscount(): void {
    this.router.navigate(['admin/add/discount']);
  }

  public onRowEditInit(discount: Discount): void {
    this.clonedDiscount[discount.id] = { ...discount };
  }

  public onRowEditSave(discount: Discount) {
    this.isLoading = true;
    this.discountService.updateItem(discount).subscribe(() => {
      delete this.clonedDiscount[discount.id];
      this.isLoading = false;
    });
  }

  public onRowEditCancel(discount: Discount, index: number) {
    this.discount[index] = this.clonedDiscount[discount.id];
    delete this.clonedDiscount[discount.id];
  }

  public saveCategories(): void {
    this.requestProcessed = true;
    const subscribe = new BehaviorSubject(this.catalog.length);
    this.catalog.map((category) => {
      const formData = new FormData();
      category.hasNoDiscount = !this.selectedCategories.find(
        (selectedItem) => selectedItem.id === category.id,
      );
      formData.append('hasNoDiscount', category.hasNoDiscount.toString());
      this.catalogService.updateItem<any>(formData, category.id).subscribe(() => {
        subscribe.next(subscribe.value - 1);
      });
    });
    subscribe.subscribe((value) => {
      if (!value) {
        this.requestProcessed = false;
        this.ms.add({
          severity: 'success',
          summary: 'Данные обновлены',
          detail: 'Применение скидок распределено',
        });
      }
    });
  }

  public saveDiscount(discount: Discount): void {
    this.discountService.updateItem({ ...discount }).subscribe(() => {
      if (discount.addToPriceList) {
        this.ms.add({
          severity: 'success',
          summary: 'Скидка добавлена',
          detail: `Скидка в ${discount.discount}% добавлена к отображению в прайс-листе`,
        });
      } else {
        this.ms.add({
          severity: 'success',
          summary: 'Скидка отозвана',
          detail: `Скидка в ${discount.discount}% отозвана от отображения в прайс-листе`,
        });
      }
    });
  }

  public get isCheckBoxesDisabled(): boolean {
    return !(this.discount.filter((item) => item.addToPriceList).length < 2);
  }
}
