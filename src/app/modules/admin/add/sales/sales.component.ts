import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { Product } from '../../../../_models/product';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { SaleService } from '../../../../_services/back/sale.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  public saleGroup: FormGroup;
  public isLoading: boolean = false;
  public categories: Category[] = [];
  private photo: File | undefined;
  public selectedCategory: Category | undefined;
  public selectedProduct: Product | undefined;
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private saleService: SaleService,
    private router: Router,
  ) {
    this.saleGroup = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: [null],
      productId: [null],
      currentPrice: [{ value: null, disabled: true }],
      discount: [null],
      isActive: [true, Validators.required],
      isVisible: [true, Validators.required],
    });
    this.saleGroup.controls['categoryId'].valueChanges.subscribe((id) => {
      this.saleGroup.controls['productId'].reset();
      this.saleGroup.controls['currentPrice'].reset();
      catalogService.getItemById<Category>(id).subscribe((category) => {
        this.selectedCategory = category;
      });
    });
    this.saleGroup.controls['productId'].valueChanges.subscribe((id) => {
      this.selectedProduct = this.selectedCategory?.products?.find((product) => product.id === id);
      if (this.selectedProduct) {
        this.saleGroup.controls['currentPrice'].setValue(this.selectedProduct.price);
      }
    });
  }

  public ngOnInit(): void {
    this.catalogService.getItems().subscribe((items) => {
      this.categories = items.filter((item) => item.id !== 1).filter((item) => item.parentId !== 1);
    });
  }

  public addSale(): void {
    if (isFormInvalid(this.saleGroup)) return;
    this.isLoading = true;
    const sale = this.saleGroup.getRawValue();
    const formData = new FormData();
    delete sale.currentPrice;
    if (!sale.productId) {
      delete sale.productId;
    }
    Object.getOwnPropertyNames(sale).map((key) => {
      // @ts-ignore
      const value = sale[key];
      if (value || value === false) {
        formData.append(key, value);
      }
    });
    if (!this.photo) return;
    formData.append('img', this.photo);
    this.saleService.addItem<any>(formData).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([''], { fragment: 'sales' });
    });
  }

  public filesUploaded(photos: File[]): void {
    this.photo = photos[0];
  }
}
