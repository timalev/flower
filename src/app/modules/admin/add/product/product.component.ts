import { Component } from '@angular/core';
import { GoodsBusinessPack } from '../../../../_models/business-pack/goods-base';
import { Category } from '../../../../_models/category';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Box } from '../../../../_models/box';
import { BusinessPackService } from '../../../../_services/back/business-paсk.service';
import { BusinessPackConverterService } from '../../../../_services/back/business-pack-converter.service';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { ProductService } from '../../../../_services/back/product.service';
import { BoxService } from '../../../../_services/back/box.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { slugify } from 'transliteration';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  public isTulips: boolean = false;
  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    if (value) {
      this.goods.disable();
      this.product.disable();
    } else {
      this.goods.enable();
      this.product.enable();
    }
    this._isLoading = value;
  }
  private _isLoading: boolean = false;
  public businessPackResults: GoodsBusinessPack[] = [];
  public selectedProduct: GoodsBusinessPack | undefined;
  public productControl: FormControl;
  public categories: Category[] = [];
  private categoryName: string = '';
  public isImport: boolean = false;
  public goods: FormGroup;
  public product: FormGroup;
  public photos: File[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  public boxes: Box[] = [];
  constructor(
    private fb: FormBuilder,
    private bpService: BusinessPackService,
    private bpConverter: BusinessPackConverterService,
    private catalogService: CatalogService,
    private productService: ProductService,
    private boxService: BoxService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.productControl = fb.control('', Validators.required);
    this.goods = fb.group({
      Name: ['', Validators.required],
      Price: ['', Validators.required],
      NDS: [0, Validators.required],
      NDSMode: [0, Validators.required],
      Volume: ['00~Pvjh0000F', Validators.required],
      Note1: [''],
      Note2: [''],
      Pack: ['00~Pvjh0000F', Validators.required],
      Coefficient: ['', Validators.required],
    });
    this.product = fb.group({
      isPopular: [false],
      description: ['', Validators.required],
      categoryIds: [null, Validators.required],
      boxId: [null],
      prices: this.fb.array([]),
    });
    route.queryParams.subscribe((params) => {
      this.isImport = params['isImport'] === 'true';
      const categoryId = params['category'];
      if (categoryId) {
        catalogService
          .getItemById<Category>(categoryId)
          .pipe(take(1))
          .subscribe((category) => {
            this.getData(category);
          });
      } else {
        this.getData();
      }
    });
  }

  private getData(category?: Category): void {
    if (category) {
      this.isTulips = category.isTulip;
      this.categoryName = category.name;
    }
    this.catalogService.getItems().subscribe((items) => {
      const parentId = category?.parentId;
      if (parentId) {
        this.categories = items.filter((item) => item.parentId === parentId);
      } else {
        this.categories = items.filter((item) => !item.parentId);
      }
      if (category) {
        this.product.controls['categoryIds'].setValue([category.id]);
      }
      if (this.isTulips && category) {
        this.product.controls['categoryIds'].disable();
        this.catalogService.getItemById<Category>(category.id).subscribe(({ steps }) => {
          if (steps)
            steps.map((step) => {
              this.addPriceRange(step.countFrom);
            });
        });
      } else if (this.isTulips) {
        const index = this.categories.findIndex((item) => item.isTulip);
        this.categories.splice(index, 1);
      }
    });
    this.boxService.getItems().subscribe((boxes) => {
      this.boxes = boxes;
    });
    this.productControl.valueChanges.subscribe((value) => {
      if (!value) this.selectedProduct = undefined;
    });
  }

  public addProduct(): void {
    if (this.isImport && this.productControl.invalid) {
      this.productControl.markAsDirty();
    }
    if (isFormInvalid(this.goods)) return;
    if (isFormInvalid(this.product)) return;
    this.isLoading = true;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
    });

    const productGroupValue = this.product.getRawValue();
    productGroupValue.categoryIds.map((id: string) => {
      formData.append('categoryIds[]', id);
    });
    if (this.isImport) {
      const updateGoods = {
        ...this.selectedProduct,
        ...goods,
      };
      this.bpService.updateGoods(updateGoods).subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.bpConverter.convertToProduct(updateGoods),
          id: id,
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        this.saveProduct(product, formData);
      });
    } else {
      this.bpService.createGoods(goods).subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.bpConverter.convertToProduct(goods),
          id: id,
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        this.saveProduct(product, formData);
      });
    }
  }

  private saveProduct(product: any, formData: FormData): void {
    Object.getOwnPropertyNames(product).map((key) => {
      // @ts-ignore
      const value = product[key];
      if (key === 'prices') {
        value.map((price: any) => {
          formData.append(`${key}[]`, JSON.stringify(price));
        });
      } else formData.append(key, value);
    });
    if (!this.categoryName) {
      const category = this.product.controls['categoryIds'].value;
      if (category) this.categoryName = category[0];
    }
    this.productService.addItem<any>(formData).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate([
          'catalog',
          this.isTulips ? 'tulips' : slugify(this.categoryName),
          product.id,
        ]);
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  public searchItems(searchString: string): void {
    this.bpService.searchGoods(searchString).subscribe(({ items }) => {
      this.businessPackResults = items;
    });
  }

  public patchValue(selectedProduct: GoodsBusinessPack): void {
    this.selectedProduct = selectedProduct;
    if (this.selectedProduct && this.selectedProduct.Object) {
      this.productService.getItemById(this.selectedProduct.Object).subscribe((product) => {
        if (product) {
          this.messageService.add({
            severity: 'error',
            summary: 'Дублирование товара',
            detail: 'Данный товар уже добавлен в систему',
          });
          this.selectedProduct = undefined;
        } else {
          // @ts-ignore
          this.goods.patchValue(this.selectedProduct);
          this.goods.disable();
        }
      });
    } else {
      this.goods.reset({ Volume: '00~Pvjh0000F', Pack: '00~Pvjh0000F' });
      this.goods.enable();
    }
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }

  public get prices(): FormArray {
    return this.product.controls['prices'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(countFrom: number): void {
    const control = this.fb.group({
      price: [null, Validators.required],
      countFrom: [countFrom, Validators.required],
    });
    control.controls['countFrom'].disable();
    this.prices.push(control);
  }

  public get isFormArrayValid(): boolean {
    return this.prices.status === 'VALID';
  }
}
