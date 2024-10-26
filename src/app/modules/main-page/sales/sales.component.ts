import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MainBanner } from '../../../_models/main-banner';
import { Sale } from '../../../_models/sale';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { slugify } from 'transliteration';
import { SaleService } from '../../../_services/back/sale.service';
import { ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../_services/back/product.service';

@Component({
  selector: 'flower-valley-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  providers: [DialogService],
})
export class SalesComponent {
  @Input()
  public sales!: MainBanner<Sale[]>;
  @Input()
  public isAdmin: boolean = false;
  @Output()
  public saleEdited: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ds: DialogService,
    private router: Router,
    private saleService: SaleService,
    private productService: ProductService,
    private cs: ConfirmationService,
  ) {}

  public editSale(saleId: number): void {
    this.router.navigate(['admin/edit/sale', saleId]);
  }

  public deleteSale(id: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление акции',
      message: 'Вы действительно хотите удалить акцию?',
      accept: () => {
        this.saleService.deleteItem(id).subscribe(() => {
          if (this.sales.items && this.sales.items.length) {
            const index = this.sales.items?.findIndex((item) => item.id === id);
            this.sales.items.splice(index, 1);
            if (!this.sales.items.length) {
              delete this.sales.items;
            }
          }
        });
      },
    });
  }

  public navigateTo(categoryName?: string, productId?: string): void {
    if (categoryName) {
      if (productId) {
        this.router.navigate(['catalog', slugify(categoryName), productId]);
      } else {
        this.router.navigate(['catalog', slugify(categoryName)]);
      }
    } else {
      this.router.navigate(['catalog']);
    }
  }
}
