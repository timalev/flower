import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sale } from '../../../../_models/sale';
import { Category } from '../../../../_models/category';
import { Product } from '../../../../_models/product';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { ProductService } from '../../../../_services/back/product.service';
import { SaleService } from '../../../../_services/back/sale.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'flower-valley-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  public saleGroup: FormGroup;
  public isLoading: boolean = false;
  public sale?: Sale;
  private saleId: number = 0;
  public categories: Category[] = [];
  private photo: File | undefined;
  public selectedCategory: Category | undefined;
  public selectedProduct: Product | undefined;
  private redirectTo: string = '';

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private productService: ProductService,
    private saleService: SaleService,
    private route: ActivatedRoute,
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
    route.params.subscribe((params) => {
      this.saleId = params['id'];
    });
    route.queryParams.subscribe((params) => {
      this.redirectTo = params['redirect'];
    });
  }

  private getData(): void {
    this.saleGroup.controls['categoryId'].valueChanges.subscribe((id) => {
      if (this.selectedProduct) {
        this.saleGroup.controls['productId'].reset();
        this.saleGroup.controls['currentPrice'].reset();
        this.selectedProduct = undefined;
      }
      if (id) {
        this.catalogService.getItemById<Category>(id).subscribe((category) => {
          this.selectedCategory = category;
        });
      }
    });
    this.saleGroup.controls['productId'].valueChanges.subscribe((id) => {
      if (id) {
        this.selectedProduct = this.selectedCategory?.products?.find(
          (product) => product.id === id,
        );
        if (this.selectedProduct) {
          this.saleGroup.controls['currentPrice'].setValue(this.selectedProduct.price);
        } else {
          this.productService.getItemById<Product>(id).subscribe((product) => {
            this.selectedProduct = product;
            this.saleGroup.controls['currentPrice'].setValue(this.selectedProduct.price);
          });
        }
      } else {
        this.selectedProduct = undefined;
      }
    });
  }

  public ngOnInit(): void {
    const requests = [
      this.saleService.getItemById<Sale>(this.saleId),
      this.catalogService.getItems(),
    ];
    forkJoin(requests).subscribe(([sale, catalog]) => {
      this.sale = sale as Sale;
      if (this.sale.discount === 0) {
        // @ts-ignore
        this.sale.discount = null;
      }
      this.sale.isActive = !!this.sale.isActive;
      this.sale.isVisible = !!this.sale.isVisible;
      this.categories = (catalog as Category[])
        .filter((item) => item.id !== 1)
        .filter((item) => item.parentId !== 1);
      this.getData();
      this.saleGroup.patchValue(this.sale);
    });
  }

  public editSale(): void {
    if (isFormInvalid(this.saleGroup)) return;
    this.isLoading = true;
    const sale = this.saleGroup.getRawValue();
    delete sale.currentPrice;
    if (!sale.productId) delete sale.productId;
    const formData = new FormData();
    Object.getOwnPropertyNames(sale).map((key) => {
      // @ts-ignore
      const value = sale[key];
      if (value || value === false) {
        formData.append(key, value);
      }
    });
    if (this.photo) {
      formData.append('img', this.photo);
    }
    // @ts-ignore
    this.saleService.updateItem<any>(formData, this.sale.id).subscribe(() => {
      this.isLoading = false;
      if (this.redirectTo) {
        this.router.navigate(['admin/edit/sale', this.redirectTo]);
      } else {
        this.router.navigate([''], { fragment: 'sales' });
      }
    });
  }

  public filesUploaded(photos: File[]): void {
    this.photo = photos[0];
  }
}
