import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Banner } from '../../../../../_models/banner';
import { BannerSettingsService } from '../../../../../_services/back/banner-settings.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { Router } from '@angular/router';
import { SaleService } from '../../../../../_services/back/sale.service';
import { Sale, SaleOrder } from '../../../../../_models/sale';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'flower-valley-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public settingsGroup: FormGroup;
  public settings?: Banner;
  public isLoading: boolean = false;
  public isSaving: boolean = false;
  public sales: Sale[] = [];
  constructor(
    private fb: FormBuilder,
    private bannerSettingsService: BannerSettingsService,
    private saleService: SaleService,
    private cs: ConfirmationService,
    private router: Router,
  ) {
    this.settingsGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    const data = sessionStorage.getItem('saleSettings');
    if (data) this.settings = JSON.parse(data);
    if (this.settings) {
      this.settingsGroup.patchValue(this.settings);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.saleService.getItems().subscribe((sales) => {
      this.sales = sales
        .map((sale) => {
          sale.isVisible = !!sale.isVisible;
          sale.isActive = !!sale.isActive;
          return sale;
        })
        .sort((a, b) => a.order - b.order);
      this.isLoading = false;
    });
  }

  public saveSettings(): void {
    if (isFormInvalid(this.settingsGroup)) return;
    this.isSaving = true;
    const settings = this.settingsGroup.getRawValue();
    this.bannerSettingsService.addItem(settings).subscribe(() => {
      sessionStorage.removeItem('saleSettings');
      this.isSaving = false;
      this.router.navigate([''], { fragment: 'sales' });
    });
  }

  public onRowReorder(): void {
    const saleOrder: SaleOrder[] = [];
    for (let i = 0; i < this.sales.length; i++) {
      saleOrder.push({
        order: i + 1,
        id: this.sales[i].id,
      });
    }
    this.saleService.sort(saleOrder).subscribe();
  }

  public isActiveChanged(value: boolean, item: Sale): void {
    item.isActive = value;
    const sale = new FormData();
    if (!value) {
      item.isVisible = false;
      sale.append('isVisible', item.isVisible.toString());
    }
    sale.append('isActive', value.toString());
    this.saleService.updateItem<any>(sale, item.id).subscribe();
  }

  public isVisibleChanged(value: boolean, item: Sale): void {
    item.isVisible = value;
    const sale = new FormData();
    sale.append('isVisible', item.isVisible.toString());
    this.saleService.updateItem<any>(sale, item.id).subscribe();
  }

  public deleteSale(id: number, index: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление',
      message: 'Вы действительно хотите удалить акцию из системы?',
      accept: () => {
        this.saleService.deleteItem(id).subscribe(() => {
          this.sales.splice(index, 1);
        });
      },
    });
  }
}
