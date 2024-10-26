import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../_models/category';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { StorageService } from '../../../../_services/front/storage.service';
import { categoriesKey } from '../../../../_utils/constants';
import { slugify } from 'transliteration';
import { LoadingService } from '../../../../_services/front/loading.service';
import { Observable, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public category?: Category;
  private initialName: string = '';
  public id: number = 0;
  public categoryGroup: FormGroup;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private ms: MessageService,
    private ls: LoadingService,
  ) {
    this.categoryGroup = fb.group({
      name: ['', Validators.required, [this.nameAsyncValidator.bind(this)]],
      img: [''],
      parentId: [null],
      isSeedling: [false],
      isBlocked: [false],
      hasNoDiscount: [false],
      steps: fb.array([]),
    });
    route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  public ngOnInit(): void {
    const sub = this.catalogService
      .getItemById<Category>(this.id)
      .pipe(take(1))
      .subscribe((category) => {
        this.category = category;
        this.getData(category);
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  private getData(category: Category): void {
    const itemsSub = this.catalogService.getItems().subscribe((items) => {
      if (category.isTulip) {
        const itemSub = this.catalogService
          .getItemById<Category>(category.id)
          .subscribe((categoryItem) => {
            category.steps = categoryItem.steps;
            category.steps
              ?.sort((item) => item.countFrom)
              .map((step) => {
                this.addPriceRange(step);
              });
            this.ls.removeSubscription(itemSub);
          });
        this.ls.addSubscription(itemSub);
      }
      this.categories = items;
      this.initialName = category.name;
      category.hasNoDiscount = !Boolean(category.hasNoDiscount);
      if (category.parentId) {
        this.categoryGroup.controls['hasNoDiscount'].disable();
      }
      this.categoryGroup.patchValue(category);
      if (category.isBlocked) {
        this.categoryGroup.controls['isBlocked'].setValue(true);
      } else {
        this.categoryGroup.controls['isBlocked'].setValue(false);
      }
      if (!category.parentId) {
        this.categoryGroup.get('parentId')?.setValue(null);
      }
      this.ls.removeSubscription(itemsSub);
    });
    this.ls.addSubscription(itemsSub);
  }

  public editCategory(): void {
    if (this.categoryGroup.invalid) return;
    const category = this.categoryGroup.getRawValue();
    if (!category.parentId) category.parentId = 0;
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('parentId', category.parentId.toString());
    formData.append('img', category.img);
    formData.append('isSeedling', (!!category.isSeedling).toString());
    formData.append('isBlocked', (!!category.isBlocked).toString());
    formData.append('hasNoDiscount', (!category.hasNoDiscount).toString());
    if (this.category?.id === 1) {
      formData.append('isTulip', 'true');
    }
    const updateSub = this.catalogService
      // @ts-ignore
      .updateItem<any>(formData, this.category.id)
      .subscribe(() => {
        const getSub = this.catalogService
          // @ts-ignore
          .getItemById<Category>(this.category?.id)
          .subscribe((categoryItem) => {
            this.storageService.editItem<Category>(categoriesKey, categoryItem);
            this.ls.removeSubscription(getSub);
            if (categoryItem.isTulip) {
              this.catalogService
                .setSteps(categoryItem.id, { steps: category.steps || [] })
                .subscribe();
              this.router.navigate(['catalog/tulips']);
            } else {
              this.router.navigate(['catalog', slugify(categoryItem.name)]);
            }
          });
        this.ls.addSubscription(getSub);
        this.ls.removeSubscription(updateSub);
      });
    this.ls.addSubscription(updateSub);
  }

  public photoUploaded(photos: File[]): void {
    this.categoryGroup.get('img')?.setValue(photos[0]);
  }

  public get steps(): FormArray {
    return this.categoryGroup.controls['steps'] as FormArray;
  }

  public getFormGroup(item: AbstractControl): FormGroup {
    return item as FormGroup;
  }

  public addPriceRange(step?: { id: number; countFrom: number }): void {
    const control = this.fb.group({
      countFrom: [null, Validators.required],
    });
    if (step) control.patchValue(step);
    this.steps.push(control);
  }

  public deletePriceRange(index: number): void {
    this.steps.removeAt(index);
  }

  public get isFormArrayValid(): boolean {
    return this.steps.status === 'VALID';
  }

  public nameAsyncValidator(control: FormControl): Observable<ValidationErrors | null> {
    if (control.value.toLowerCase() === this.initialName.toLowerCase()) return of(null);
    return this.catalogService.validateName(control.value).pipe(
      tap((value) => {
        if (value && control.dirty) {
          this.ms.add({
            severity: 'error',
            summary: 'Совпадение названия',
            detail: 'Категория с таким именем уже существует',
          });
        }
      }),
    );
  }
}
