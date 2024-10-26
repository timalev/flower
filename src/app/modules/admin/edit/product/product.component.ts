import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../../_models/product';
import { Category } from '../../../../_models/category';
import { Box } from '../../../../_models/box';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { ProductService } from '../../../../_services/back/product.service';
import { BoxService } from '../../../../_services/back/box.service';
import { BusinessPackConverterService } from '../../../../_services/back/business-pack-converter.service';
import { BusinessPackService } from '../../../../_services/back/business-paсk.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { GoodsBusinessPack } from '../../../../_models/business-pack/goods-base';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LoadingService } from '../../../../_services/front/loading.service';
import { slugify } from 'transliteration';
import { BannerPhotos } from '../../../../_models/main-banner';
import { SortOrderService } from '../../../../_services/front/sort-order.service';

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public isTulips: boolean = false;
  private deleteIds: number[] = [];
  public get isLoading(): boolean {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    if (value) {
      this.goods.disable();
      this.productGroup.disable();
    } else {
      this.goods.enable();
      this.productGroup.enable();
    }
    this._isLoading = value;
  }
  private _isLoading: boolean = false;
  public goods: FormGroup;
  public productGroup: FormGroup;
  private productId: number = 0;
  public product?: Product;
  public categories: Category[] = [];
  public options = [
    { name: '', value: null },
    { name: 'шт', value: '00~Pvjh0000F' },
  ];
  public boxes: Box[] = [];
  public photos: File[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private productService: ProductService,
    private sortOrder: SortOrderService<BannerPhotos>,
    private boxService: BoxService,
    private converter: BusinessPackConverterService,
    private bpService: BusinessPackService,
    private ls: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
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
    this.productGroup = fb.group({
      isPopular: [false],
      description: ['', Validators.required],
      categoryIds: [null, Validators.required],
      boxId: [null],
      prices: this.fb.array([]),
    });
    route.params.subscribe((params) => {
      this.productId = params['id'];
    });
  }

  public ngOnInit(): void {
    const sub = this.productService
      .getItemById<Product>(this.productId)
      .pipe(take(1))
      .subscribe((product) => {
        this.product = product;
        this.getData(product);
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  private getData(product: Product): void {
    this.isTulips = product.categories.find((item) => item.isTulip)?.isTulip || false;
    this.goods.patchValue(this.converter.convertToBase(product));
    this.productGroup.patchValue(product);
    const catalogSub = this.catalogService.getItems().subscribe((items) => {
      this.categories = items;
      const categories = product.categories.map((category) => category.id);
      this.productGroup.controls['categoryIds'].setValue(categories);
      if (this.isTulips) {
        this.productGroup.controls['categoryIds'].disable();
        const category = product.categories.find((item) => item.isTulip);
        category?.steps?.map((step) => {
          const price = product.prices.find((item) => item.countFrom === step.countFrom);
          if (price) {
            this.addPriceRange({ price: price.price, countFrom: step.countFrom });
          } else {
            this.addPriceRange({ price: null, countFrom: step.countFrom });
          }
        });
      }
      this.ls.removeSubscription(catalogSub);
    });
    const boxSub = this.boxService.getItems().subscribe((boxes) => {
      this.boxes = boxes;
      this.ls.removeSubscription(boxSub);
    });
    this.ls.addSubscription(catalogSub);
    this.ls.addSubscription(boxSub);
  }

  public editProduct(): void {
    if (isFormInvalid(this.goods)) return;
    if (isFormInvalid(this.productGroup)) return;
    this.isLoading = true;
    const goods: GoodsBusinessPack = this.goods.getRawValue();
    const formData = new FormData();
    this.photos.map((photo) => {
      formData.append('photos[]', photo);
    });
    const productGroupValue = this.productGroup.getRawValue();
    productGroupValue.categoryIds.map((id: string) => {
      formData.append('categoryIds[]', id);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    this.bpService
      .updateGoods({
        ...goods,
        // @ts-ignore
        Object: this.product.id,
      })
      .subscribe((response) => {
        const id = response.Object;
        const product: any = {
          ...this.converter.convertToProduct(goods),
          description: productGroupValue.description,
          boxId: productGroupValue.boxId,
          isPopular: productGroupValue.isPopular,
          prices: productGroupValue.prices,
        };
        Object.getOwnPropertyNames(product).map((key) => {
          // @ts-ignore
          const value = product[key];
          if (key === 'prices') {
            value.map((price: any) => {
              formData.append(`${key}[]`, JSON.stringify(price));
            });
          } else if ((key.includes('note') && value !== null) || !key.includes('note'))
            formData.append(key, value);
        });
        this.productService.updateItem<any>(formData, id).subscribe(
          () => {
            this.isLoading = false;
            const categoryName = this.categories.find(
              (category) => category.id === productGroupValue.categoryIds[0],
            )?.name;
            this.router.navigate([
              'catalog',
              this.isTulips ? 'tulips' : slugify(categoryName || ''),
              this.productId,
            ]);
          },
          () => {
            this.isLoading = false;
            // console.log(error);
          },
        );
      });
  }

  public filesUploaded(photos: File[]): void {
    this.photos = photos;
  }
  public get prices(): FormArray {
    return this.productGroup.controls['prices'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(step: { price: number | null; countFrom: number }): void {
    const control = this.fb.group({
      price: [null, Validators.required],
      countFrom: [null, Validators.required],
    });
    control.patchValue(step);
    control.controls['countFrom'].disable();
    this.prices.push(control);
  }

  public get isFormArrayValid(): boolean {
    return this.prices.status === 'VALID';
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    // @ts-ignore
    const i = this.product.photos.findIndex((photo) => photo.id === id);
    // @ts-ignore
    this.product.photos.splice(i, 1);
  }

  public dragStart(draggedItem: BannerPhotos, i: number): void {
    // @ts-ignore
    this.sortOrder.dragStart(this.product.photos, draggedItem, i);
  }
  public dragEnd(): void {
    // @ts-ignore
    this.product.photos = this.sortOrder.dragEnd(this.product.photos);
  }
  public drop(): void {
    // @ts-ignore
    this.productService.setOrder(this.sortOrder.drop(this.product.photos)).subscribe();
  }
  public setPosition(index: number): void {
    // @ts-ignore
    this.product.photos = this.sortOrder.setPosition(this.product.photos, index);
  }
}
